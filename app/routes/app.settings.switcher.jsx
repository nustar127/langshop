import { authenticate } from "../shopify.server";
import { getThemes, upsertSwitcherMetaobject } from "../models/shop.server";
import { useLoaderData, useActionData, useSubmit } from "react-router";
import { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const themes = await getThemes(admin.graphql);
  const shopDomain = session.shop;

  return {
    themes,
    shopDomain,
  };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const data = Object.fromEntries(await request.formData());

  const result = await upsertSwitcherMetaobject(admin.graphql, data.themeId, data.visibility);

  return { result };
};

export default function Switcher() {
  const { themes, shopDomain } = useLoaderData();
  const data = useActionData();
  const submit = useSubmit();
  const [selectedTheme, setSelectedTheme] = useState(
    themes.find((theme) => theme.role === "MAIN")?.id || null,
  );
  
  useEffect(() => {
    if (data?.result) {
      console.log(data?.result);
    }
  }, [data?.result]);

  const editSwitcher = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const visibility = formData.get("visibility");

    submit(
      { themeId: selectedTheme.split("/").pop(), visibility, action: "updateSwitcher" },
      { method: "post" },
    );
  };

  return (
    <s-page heading="Switcher">
      <s-section heading="Theme preview">
        <s-select
          label="Notification frequency"
          name="notification-frequency"
          onChange={(e) => setSelectedTheme(e.target.value)}
          value={selectedTheme}
        >
          {themes.map((theme) => (
            <s-option key={theme.id} value={theme.id}>
              {theme.name} {theme.role === "MAIN" ? "(live)" : ""}
            </s-option>
          ))}
        </s-select>
      </s-section>
      <s-banner heading="Enable language switcher" tone="info">
        <s-text>
          Enable the language switcher in your store to allow customers to
          select their preferred language. The switcher will automatically
          display in your storefront once enabled:
        </s-text>
        <s-link
          href={`https://admin.shopify.com/store/${shopDomain.split(".").shift()}/themes/${selectedTheme.split("/").pop()}/editor?context=apps`}
        >
          Here
        </s-link>
      </s-banner>
      <s-section heading="Language switcher">
        <form onSubmit={editSwitcher}>
          <s-choice-list label="Primary" name="visibility">
            <s-choice value="hidden" selected>
              Hidden
            </s-choice>
            <s-choice value="preview">Preview only</s-choice>
            <s-choice value="published">Published</s-choice>
          </s-choice-list>
          <s-button type="submit">Edit</s-button>
        </form>
      </s-section>
    </s-page>
  );
}
