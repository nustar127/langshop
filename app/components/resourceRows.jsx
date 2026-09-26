import PropTypes from "prop-types";
import { toneForBadge, humanReadableStatus } from "../utils/statuses";

ProductBodyCells.propTypes = {
  product: PropTypes.object.isRequired,
  resourceType: PropTypes.string.isRequired,
  iso: PropTypes.string.isRequired,
};

CollectionBodyCells.propTypes = {
  collection: PropTypes.object.isRequired,
  resourceType: PropTypes.string.isRequired,
  iso: PropTypes.string.isRequired,
};

export function ProductHeaderCells() {
  return (
    <>
      <s-table-header listSlot="primary">Image</s-table-header>
      <s-table-header listSlot="primary">Title</s-table-header>
      <s-table-header listSlot="inline">Inventory</s-table-header>
      <s-table-header listSlot="inline">Type</s-table-header>
      <s-table-header listSlot="inline">Vendor</s-table-header>
      <s-table-header listSlot="inline">Status</s-table-header>
    </>
  );
}

export function CollectionHeaderCells() {
  return (
    <>
      <s-table-header listSlot="primary">Title</s-table-header>
      <s-table-header listSlot="inline">Status</s-table-header>
    </>
  );
}

export function ProductBodyCells({ product, resourceType, iso }) {
  return (
    <>
      <s-table-cell>
        <s-box inlineSize="50px">
          <s-image
            src={product.featuredMedia?.preview.image.url || ""}
            alt="Indoor plant"
            aspectRatio="1/1"
            objectFit="cover"
            borderRadius="base"
            inlineSize="fill"
          />
        </s-box>
      </s-table-cell>
      <s-table-cell>
        <s-link
          href={`/app/translations/${resourceType}/${product.id.split("/").pop()}/${iso}`}
        >
          {product.title}
        </s-link>
      </s-table-cell>
      <s-table-cell>{product.totalInventory}</s-table-cell>
      <s-table-cell>{product.productType}</s-table-cell>
      <s-table-cell>{product.vendor}</s-table-cell>
      <s-table-cell>
        <s-badge tone={toneForBadge(product.status)}>
          {humanReadableStatus(product.status)}
        </s-badge>
      </s-table-cell>
    </>
  );
}

export function CollectionBodyCells({ collection, resourceType, iso }) {
  return (
    <>
      <s-table-cell>
        <s-link
          href={`/app/translations/${resourceType}/${collection.id.split("/").pop()}/${iso}`}
        >
          {collection.title}
        </s-link>
      </s-table-cell>
      <s-table-cell>
        <s-badge tone={toneForBadge(collection.status)}>
          {humanReadableStatus(collection.status)}
        </s-badge>
      </s-table-cell>
    </>
  );
}
