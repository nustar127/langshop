export async function getProducts(graphql, variables) {
  const response = await graphql(
    `
      #graphql
      query ($first: Int, $last: Int, $after: String, $before: String) {
        products(first: $first, last: $last, after: $after, before: $before) {
          nodes {
            id
            featuredMedia {
              preview {
                image {
                  url
                }
              }
            }
            title
            productType
            totalInventory
            vendor
            status
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    `,
    {
      variables: variables,
    },
  );
  const json = await response.json();
  return json.data.products;
}

export async function getCollections(graphql, variables) {
  const response = await graphql(
    `
      #graphql
      query ($first: Int, $last: Int, $after: String, $before: String) {
        collections(
          first: $first
          last: $last
          after: $after
          before: $before
        ) {
          nodes {
            id
            title
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    `,
    {
      variables: variables,
    },
  );
  const json = await response.json();
  return json.data.collections;
}

export async function getBlogs(graphql, variables) {
  const response = await graphql(
    `
      #graphql
      query BlogList ($first: Int, $last: Int, $after: String, $before: String) {
        blogs(first: $first, last: $last, after: $after, before: $before) {
          nodes {
            id
            title
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    `,
    {
      variables: variables,
    },
  );
  const json = await response.json();
  return json.data.blogs;
}
