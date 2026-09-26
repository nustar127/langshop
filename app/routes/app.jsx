import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import { getShopLocales } from "../models/languages.server";
import pricingStyles from "../styles/pricing.css?url";

export const links = () => [{ rel: "stylesheet", href: pricingStyles }];

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const shopLocales = await getShopLocales(admin.graphql);
  const firstIso = shopLocales.find(
    (shopLocale) => shopLocale.primary !== true,
  ).locale;

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "", shopLocales, firstIso };
};

export default function App() {
  const { apiKey, firstIso } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href={`/app/translations/${firstIso}`}>Translations</s-link>
        <s-link href="/app/settings">Settings</s-link>
        <s-link href="/app/pricing">Pricing</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
