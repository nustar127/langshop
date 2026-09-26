export async function getTranslatableById(graphql, gid, locale) {
  const response = await graphql(
    `
      #graphql
      query TranslatableResourcesByIds(
        $locale: String!
        $resourceIds: [ID!]!
        $first: Int = 10
      ) {
        translatableResourcesByIds(first: $first, resourceIds: $resourceIds) {
          edges {
            node {
              resourceId
              translatableContent {
                key
                value
                digest
                locale
              }
              translations(locale: $locale) {
                key
                value
                locale
                outdated
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        locale: locale,
        resourceIds: gid,
      },
    },
  );
  const json = await response.json();
  return json.data.translatableResourcesByIds.edges[0];
}

export async function RegistrTranslation(graphql, gid, translations) {
  const response = await graphql(
    `
      #graphql
      mutation translationsRegister(
        $resourceId: ID!
        $translations: [TranslationInput!]!
      ) {
        translationsRegister(
          resourceId: $resourceId
          translations: $translations
        ) {
          userErrors {
            message
            field
          }
          translations {
            key
            value
          }
        }
      }
    `,
    {
      variables: {
        resourceId: gid,
        translations: translations,
      },
    },
  );
  const json = await response.json();
  return json.data.translationsRegister;
}
