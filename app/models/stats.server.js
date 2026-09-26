import db from "../db.server";

export async function upsertStats(graphql, locale, resourceType) {
  const itemCount = await countTranslatableResources(graphql, resourceType);
  const translatedCount = await countTranslatedResourcesForLocale(graphql, {
    resourceType,
    locale,
  });

  await db.stats.upsert({
    where: {
      resourceType_locale: {
        resourceType,
        locale,
      },
    },
    update: {
      lastUpdated: new Date(),
      itemCount,
      translatedCount,
    },
    create: {
      resourceType,
      locale,
      lastUpdated: new Date(),
      itemCount,
      translatedCount,
      status: "UNTRANSLATED",
    },
  });

  return { success: true };
}

export async function getStats(locale) {
  return await db.stats.findMany({
    where: { locale },
  });
}

async function countTranslatableResources(graphql, resourceType) {
  let total = 0;
  let after = null;
  let hasNextPage = true;
  const pageSize = 100;
  const query = `
    #graphql
    query TranslatableResourcesCountPage(
      $first: Int!
      $after: String
      $resourceType: TranslatableResourceType!
    ) {
      translatableResources(first: $first, after: $after, resourceType: $resourceType) {
        edges {
          cursor
          node {
            resourceId
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

  while (hasNextPage) {
    const response = await graphql(query, {
      variables: {
        first: pageSize,
        after,
        resourceType,
      },
    });
    const json = await response.json();
    const connection = json.data.translatableResources;
    const edges = connection.edges || [];

    total += edges.length;

    hasNextPage = connection.pageInfo.hasNextPage;
    after = hasNextPage ? edges[edges.length - 1].cursor : null;
  }

  return total;
}

async function countTranslatedResourcesForLocale(
  graphql,
  { resourceType, locale, pageSize = 100 },
) {
  let translatedCount = 0;
  let after = null;
  let hasNextPage = true;

  const query = `
    query TranslatedTranslatableResourcesPage(
      $first: Int!
      $after: String
      $resourceType: TranslatableResourceType!
      $locale: String!
    ) {
      translatableResources(first: $first, after: $after, resourceType: $resourceType) {
        edges {
          cursor
          node {
            resourceId
            translations(locale: $locale) {
              key
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

  while (hasNextPage) {
    const response = await graphql(query, {
      variables: {
        first: pageSize,
        after,
        resourceType,
        locale,
      },
    });
    const json = await response.json();
    const connection = json.data.translatableResources;
    const edges = connection.edges || [];

    for (const edge of edges) {
      const translations = edge.node.translations || [];
      if (translations.length > 0) {
        translatedCount += 1;
      }
    }

    hasNextPage = connection.pageInfo.hasNextPage;
    after = hasNextPage ? edges[edges.length - 1].cursor : null;
  }

  return translatedCount;
}
