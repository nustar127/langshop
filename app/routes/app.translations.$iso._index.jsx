import LanguageSelector from "../components/languageSelector";
import { authenticate } from "../shopify.server";
import { useLoaderData, useSubmit } from "react-router";
import { getStats, upsertStats } from "../models/stats.server";
import { RESOURCE_TYPES } from "../resources";
import { toneForBadge, humanReadableStatus } from "../utils/statuses";

export async function loader({ request, params }) {
  await authenticate.admin(request);
  const stats = await getStats(params.iso);
  return {
    iso: params.iso,
    stats,
  };
}

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const data = Object.fromEntries(await request.formData());

  const response = await upsertStats(
    admin.graphql,
    data.locale,
    data.resourceType,
  );

  return response;
}

export default function TranslationsPage() {
  const { iso, stats } = useLoaderData();
  const submit = useSubmit();
  const emptyStat = {
    itemCount: 0,
    translatedCount: 0,
    lastUpdated: new Date(0),
    status: "NOT_STARTED",
  };

  const updateStats = (resourceType) => {
    submit(
      {
        locale: iso,
        resourceType,
      },
      { method: "post" },
    );
  };
 

  return (
    <s-page heading="Translation page" inlineSize="large">
      <s-stack
        direction="inline"
        gap="base"
        alignItems="center"
        paddingBlockEnd="small"
      >
        <s-button icon="arrow-left" href="/app" variant="tertiary"></s-button>
        <s-heading>Translation</s-heading>
      </s-stack>
      <s-section padding="none">
        <s-box paddingInline="small">
          <LanguageSelector url={`/app/translations`} iso={iso} />
        </s-box>
        <s-table>
          <s-table-header-row>
            <s-table-header>Resource type</s-table-header>
            <s-table-header>Last sync with Shopify</s-table-header>
            <s-table-header>Items qty</s-table-header>
            <s-table-header>Translated</s-table-header>
            <s-table-header>Status</s-table-header>
            <s-table-header>Action</s-table-header>
            <s-table-header>Update statistic</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {Array.from(Object.values(RESOURCE_TYPES)).map((resourceType) => {
              let stat = stats.find((s) => s.resourceType === resourceType);
              if (!stat) {
                stat = { ...emptyStat, resourceType };
              }
              return (
                <s-table-row key={resourceType}>
                  <s-table-cell>
                    <s-link
                      href={`/app/translations/${resourceType.toLowerCase()}/${iso}`}
                    >
                      {resourceType.charAt(0) +
                        resourceType.slice(1).toLowerCase()}
                    </s-link>
                  </s-table-cell>
                  <s-table-cell>
                    {stat.lastUpdated.toLocaleString()}
                  </s-table-cell>
                  <s-table-cell>{stat.itemCount}</s-table-cell>
                  <s-table-cell>{stat.translatedCount}</s-table-cell>
                  <s-table-cell>
                    <s-badge tone={toneForBadge(stat.status)}>
                      {humanReadableStatus(stat.status)}
                    </s-badge>
                  </s-table-cell>
                  <s-table-cell>action</s-table-cell>
                  <s-table-cell>
                    <s-button onClick={() => updateStats(resourceType)}>
                      Update
                    </s-button>
                  </s-table-cell>
                </s-table-row>
              );
            })}
          </s-table-body>
        </s-table>
      </s-section>
    </s-page>
  );
}
