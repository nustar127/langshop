export async function getThemes(graphql) {
  const response = await graphql(`
    #graphql
    query {
      themes(first: 10) {
        nodes {
          name
          id
          role
        }
      }
    }
  `);
  const json = await response.json();

  return json.data.themes.nodes;
}

export async function upsertSwitcherMetaobject(graphql, themeId, visibility) {
  const response = await graphql(
    `#graphql
  mutation UpsertMetaobject($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
    metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
      metaobject {
        handle
        visibility: field(key: "visibility") {
          value
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }`,
    {
      variables: {
        handle: {
          type: "$app:switcher",
          handle: themeId,
        },
        metaobject: {
          fields: [
            {
              key: "visibility",
              value: visibility,
            },
          ],
        },
      },
    },
  );

  const json = await response.json();

  return json.data.metaobjectUpsert;
}
