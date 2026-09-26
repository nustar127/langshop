import { useState, useEffect } from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData, useSubmit, useActionData } from "react-router";
import {
  shopLocaleEnable,
  UpdateLocales,
  shopLocaleDisable,
  getShopLocales,
} from "../models/languages.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const shopLocales = await getShopLocales(admin.graphql);

  const responseAvailableLocales = await admin.graphql(
    `#graphql
    query {
    availableLocales {
      isoCode
      name
    }
  }`,
  );
  const availableLocalesJson = await responseAvailableLocales.json();

  return {
    shopLocales,
    availableLocales: availableLocalesJson.data.availableLocales,
  };
};

const Action = {
  ADD: "add",
  PUBLISH: "publish",
  UNPUBLISH: "unpublish",
  DELETE: "delete",
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const data = Object.fromEntries(await request.formData());

  if (data.action === Action.ADD) {
    const response = await shopLocaleEnable(admin.graphql, data.locale);
    if (response.shopLocale) {
      return { action: "add", success: true };
    }
    return {
      action: "add",
      error: true,
      message: response.userErrors.map((error) => error.message).join(", "),
    };
  }

  let response;
  switch (data.action) {
    case Action.PUBLISH:
      response = await UpdateLocales(
        admin.graphql,
        JSON.parse(data.locales),
        true,
      );
      break;
    case Action.UNPUBLISH:
      response = await UpdateLocales(
        admin.graphql,
        JSON.parse(data.locales),
        false,
      );
      break;
    case Action.DELETE:
      response = await shopLocaleDisable(
        admin.graphql,
        JSON.parse(data.locales),
      );
      break;
    default:
      response.results = { success: false };
      break;
  }

  return response.results;
}

export default function SettingsLanguages() {
  const { shopLocales, availableLocales } = useLoaderData();
  const submit = useSubmit();
  const data = useActionData();
  const [selectedLocales, setSelectedLocales] = useState([]);
  console.log(data);

  const handleSelect = (locale) => {
    setSelectedLocales((prev) =>
      prev.includes(locale)
        ? prev.filter((item) => item !== locale)
        : [...prev, locale],
    );
  };

  const addLanguageSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log(formData.get("locale"));

    submit(
      { action: Action.ADD, locale: formData.get("locale") },
      { method: "post" },
    );
  };

  const selectAction = (action) => {
    submit(
      { action: action, locales: JSON.stringify(selectedLocales) },
      { method: "post" },
    );
  };

  const originalLanguage = shopLocales.find(
    (locale) => locale.primary === true,
  );
  const translatedLanguages = shopLocales.filter(
    (locale) => locale.primary !== true,
  );

  useEffect(() => {
    if (data?.action && data.action === "add" && data.success) {
      shopify.modal.hide("language-modal");
      shopify.toast.show("Language added!");
    }
  }, [data]);

  return (
    <s-page heading="Languages page">
      <s-stack
        direction="inline"
        justifyContent="space-between"
        alignItems="center"
        paddingBlockEnd="base"
      >
        <s-stack direction="inline" gap="base" alignItems="center">
          <s-button
            icon="arrow-left"
            href="/app/settings"
            variant="tertiary"
          ></s-button>
          <s-heading>Settings</s-heading>
        </s-stack>
        <s-button
          variant="primary"
          onClick={() => shopify.modal.show("language-modal")}
        >
          Add language
        </s-button>
      </s-stack>
      <s-section heading="Original language">
        <s-stack direction="inline" justifyContent="space-between" gap="small">
          <s-heading>{originalLanguage.name}</s-heading>
          <s-badge tone="success">Published</s-badge>
        </s-stack>
      </s-section>
      <s-section heading="Translated languages">
        <s-stack
          direction="inline"
          alignItems="center"
          justifyContent="space-between"
        >
          <s-heading>Showing {translatedLanguages.length} language</s-heading>
          <s-stack
            direction="inline"
            alignItems="center"
            gap="small"
            paddingBlockEnd="small"
          >
            <s-button commandFor="product-options-popover" icon="chevron-down">
              Actions
            </s-button>
            <s-popover id="product-options-popover">
              <s-stack direction="block">
                <s-button
                  variant="tertiary"
                  onClick={() => selectAction(Action.PUBLISH)}
                >
                  Publish
                </s-button>
                <s-button
                  variant="tertiary"
                  onClick={() => selectAction(Action.UNPUBLISH)}
                >
                  Unpublish
                </s-button>
                <s-button
                  tone="critical"
                  onClick={() => selectAction(Action.DELETE)}
                >
                  Delete
                </s-button>
              </s-stack>
            </s-popover>
          </s-stack>
        </s-stack>
        <s-divider color="strong"></s-divider>
        {translatedLanguages.map((language) => (
          <s-stack
            key={language.locale}
            direction="inline"
            justifyContent="space-between"
            alignItems="center"
          >
            <s-checkbox
              label={language.name}
              onChange={() => {
                handleSelect(language.locale);
                console.log(selectedLocales);
              }}
            ></s-checkbox>
            <s-badge tone={language.published ? "success" : "caution"}>
              {language.published ? "Published" : "Unpublished"}
            </s-badge>
          </s-stack>
        ))}
      </s-section>
      <s-modal id="language-modal">
        <form onSubmit={addLanguageSubmit}>
          <s-select label="Language" name="locale" multiple>
            {availableLocales.map((locale) => (
              <s-option key={locale.isoCode} value={locale.isoCode}>
                {locale.name}
              </s-option>
            ))}
          </s-select>
          {data?.action === Action.ADD && data?.error && (
            <s-text>{data.message}</s-text>
          )}
          <s-button variant="primary" type="submit">
            Add language
          </s-button>
        </form>
      </s-modal>
    </s-page>
  );
}
