import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";
import {
  getProducts,
  getCollections,
  getBlogs,
} from "../models/resources.server";
import LanguageSelector from "../components/languageSelector";
import db from "../db.server";
import { useState } from "react";
import * as Rows from "../components/resourceRows";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const after = url.searchParams.get("after");
  const before = url.searchParams.get("before");
  const iso = params.iso;
  const resourceType = params.resource;

  const variables = before
    ? { last: 20, before }
    : { first: 20, after: after || undefined };

  let resourceData;

  switch (resourceType) {
    case "product":
      resourceData = await getProducts(admin.graphql, variables);
      break;
    case "collection":
      resourceData = await getCollections(admin.graphql, variables);
      break;
    case "blog":
      resourceData = await getBlogs(admin.graphql, variables);
      break;
    default:
      throw new Response("Resource not found", { status: 404 });
  }

  const translations = await db.resourceTranslation.findMany({
    where: {
      locale: iso,
      resourceType: resourceType.toUpperCase(),
    },
  });

  for (const resource of resourceData.nodes) {
    const translation = translations.find((t) => t.resourceId === resource.id);
    if (translation) {
      resource.status = translation.status;
    } else {
      resource.status = "UNTRANSLATED";
    }
  }

  return {
    iso: params.iso,
    resourceData: resourceData.nodes,
    pageInfo: resourceData.pageInfo,
    resourceType,
  };
}

export default function ResourcesByISO() {
  const { iso, resourceData, pageInfo, resourceType } = useLoaderData();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [filteredResources, setFilteredResources] = useState(resourceData);

  const changeStatus = (status) => {
    setSelectedStatus(status);
    const newFilteredResources = resourceData.filter((product) => {
      return status === "ALL" ? true : product.status === status;
    });
    setFilteredResources(newFilteredResources);
  };

  return (
    <s-page inlineSize="large">
      <s-stack
        direction="inline"
        gap="base"
        alignItems="center"
        paddingBlockEnd="small"
      >
        <s-button
          icon="arrow-left"
          href={"/app/translations/" + resourceType + "/" + iso}
          variant="tertiary"
        ></s-button>
        <s-heading>Translations</s-heading>
      </s-stack>
      <LanguageSelector url={`/app/translations/${resourceType}`} iso={iso} />
      <s-section padding="none">
        <s-stack direction="inline" gap="small" padding="small">
          <s-button
            variant={selectedStatus === "ALL" ? "primary" : "secondary"}
            onClick={() => changeStatus("ALL")}
          >
            All
          </s-button>
          <s-button
            variant={selectedStatus === "TRANSLATED" ? "primary" : "secondary"}
            onClick={() => changeStatus("TRANSLATED")}
          >
            Translated
          </s-button>
          <s-button
            variant={
              selectedStatus === "PARTIALLY_TRANSLATED"
                ? "primary"
                : "secondary"
            }
            onClick={() => changeStatus("PARTIALLY_TRANSLATED")}
          >
            Partially translated
          </s-button>
          <s-button
            variant={
              selectedStatus === "UNTRANSLATED" ? "primary" : "secondary"
            }
            onClick={() => changeStatus("UNTRANSLATED")}
          >
            Untranslated
          </s-button>
        </s-stack>
        <s-table
          paginate
          hasPreviousPage={pageInfo.hasPreviousPage}
          hasNextPage={pageInfo.hasNextPage}
          onPreviousPage={() => navigate(`?before=${pageInfo.startCursor}`)}
          onNextPage={() => navigate(`?after=${pageInfo.endCursor}`)}
        >
          <s-table-header-row>
            {resourceType === "product" && <Rows.ProductHeaderCells />}
            {(resourceType === "collection" || resourceType === "blog") && (
              <Rows.CollectionHeaderCells />
            )}
          </s-table-header-row>
          <s-table-body>
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <s-table-row key={resource.id}>
                  {resourceType === "product" && (
                    <Rows.ProductBodyCells
                      product={resource}
                      resourceType={resourceType}
                      iso={iso}
                    />
                  )}
                  {(resourceType === "collection" ||
                    resourceType === "blog") && (
                    <Rows.CollectionBodyCells
                      collection={resource}
                      resourceType={resourceType}
                      iso={iso}
                    />
                  )}
                </s-table-row>
              ))
            ) : (
              <s-table-row>
                <s-table-cell colSpan="6">
                  <s-stack
                    direction="inline"
                    gap="small"
                    alignItems="center"
                    justifyContent="center"
                    padding="large"
                  >
                    <s-icon name="box" size="large"></s-icon>
                    <s-text>No products found for this language</s-text>
                  </s-stack>
                </s-table-cell>
              </s-table-row>
            )}
          </s-table-body>
        </s-table>
      </s-section>
    </s-page>
  );
}
