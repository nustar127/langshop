import { RESOURCE_TYPE_ARRAY } from "../resources";
import { upsertStats } from "./stats.server";

export async function getShopLocales(graphql) {
  const responseShopLocales = await graphql(`
    #graphql
    query {
      shopLocales {
        name
        locale
        primary
        published
      }
    }
  `);
  const shopLocalesJson = await responseShopLocales.json();
  return shopLocalesJson.data.shopLocales;
}

export async function UpdateLocales(graphql, locales, isToPublish) {
  const results = [];

  for (const locale of locales) {
    const response = await graphql(
      `
        #graphql
        mutation updateLocale($locale: String!, $shopLocale: ShopLocaleInput!) {
          shopLocaleUpdate(locale: $locale, shopLocale: $shopLocale) {
            userErrors {
              message
              field
            }
            shopLocale {
              name
              locale
              primary
              published
            }
          }
        }
      `,
      {
        variables: {
          locale: locale,
          shopLocale: { published: isToPublish },
        },
      },
    );
    const json = await response.json();
    results.push(json.data.shopLocaleUpdate);
  }

  return { results };
}

export async function shopLocaleEnable(graphql, locale) {
  const response = await graphql(
    `
      #graphql
      mutation enableLocale($locale: String!) {
        shopLocaleEnable(locale: $locale) {
          userErrors {
            message
            field
          }
          shopLocale {
            locale
            name
            primary
            published
          }
        }
      }
    `,
    {
      variables: {
        locale: locale,
      },
    },
  );
  const json = await response.json();

  if (json.data.shopLocaleEnable.userErrors.length === 0) {
    const locale = json.data.shopLocaleEnable.shopLocale.locale;
    for (const resourceType of RESOURCE_TYPE_ARRAY) {
      await upsertStats(graphql, locale, resourceType);
    }
  }

  return json.data.shopLocaleEnable;
}

export async function shopLocaleDisable(graphql, locales) {
  const results = [];

  for (const locale of locales) {
    const response = await graphql(
      `
        #graphql
        mutation disableLocale($locale: String!) {
          shopLocaleDisable(locale: $locale) {
            userErrors {
              message
              field
            }
            locale
          }
        }
      `,
      {
        variables: {
          locale: locale,
        },
      },
    );
    const json = await response.json();
    results.push(json.data.shopLocaleDisable);
  }

  return { results };
}
