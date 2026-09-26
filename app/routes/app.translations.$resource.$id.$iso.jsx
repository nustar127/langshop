import { authenticate } from "../shopify.server";
import { useLoaderData, useSubmit, useActionData } from "react-router";
import {
  getTranslatableById,
  RegistrTranslation,
} from "../models/translation.server";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import LanguageSelector from "../components/languageSelector";
import db from "../db.server";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);

  const upperFirstLetterResource = params.resource.charAt(0).toUpperCase() + params.resource.slice(1);
    params.resource.charAt(0).toUpperCase() + params.resource.slice(1);
  const gid = `gid://shopify/${upperFirstLetterResource}/${params.id}`;
  const iso = params.iso;
  const resourceType = params.resource;

  const translatables = await getTranslatableById(admin.graphql, gid, iso);

  return {
    translatables: translatables.node.translatableContent,
    translated: translatables.node.translations,
    iso,
    resourceType,
    id: params.id,
    upperFirstLetterResource
  };
}

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const data = Object.fromEntries(await request.formData());

  const translations = JSON.parse(data.translations);

  const response = await RegistrTranslation(
    admin.graphql,
    data.gid,
    translations,
  );
  if (response.userErrors.length === 0) {
    const status =
      translations.length === 4 ? "TRANSLATED" : "PARTIALLY_TRANSLATED";
    await db.resourceTranslation.upsert({
      where: {
        resourceId_locale: {
          resourceId: data.gid,
          locale: JSON.parse(data.translations)[0].locale,
        },
      },
      update: {
        status: status,
      },
      create: {
        resourceId: data.gid,
        locale: JSON.parse(data.translations)[0].locale,
        resourceType: "PRODUCT",
        status: status,
      },
    });
  }
  return response;
}

export default function ProductByISO() {
  const { translatables, translated, iso, id, resourceType, upperFirstLetterResource } = useLoaderData();
  const editorRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [translations, setTranslation] = useState([]);
  const data = useActionData();
  const submit = useSubmit();

  useEffect(() => {
    setIsMounted(true);
    let futureTranslations = [];
    for (const translatable of translatables) {
      futureTranslations.push({
        locale: iso,
        key: translatable.key,
        value:
          translated.find((translatee) => translatee.key === translatable.key)
            ?.value || "",
        translatableContentDigest: translatable.digest,
      });
    }
    console.log(futureTranslations);
    setTranslation(futureTranslations);
  }, [iso, translatables, translated]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const getTranslatableField = (key) => {
    return (
      translatables.find((translatable) => translatable.key === key)?.value ??
      ""
    );
  };

  const getTranslatedField = (key) => {
    return (
      translations.find((translatable) => translatable.key === key)?.value ?? ""
    );
  };

  const setTranslatedField = (key, newValue) => {
    setTranslation((prevState) =>
      prevState.map((item) =>
        item.key === key ? { ...item, value: newValue } : item,
      ),
    );
  };

  const onSubmitProduct = (e) => {
    e.preventDefault();

    const finalTranslations =
      translations.filter((translation) => translation.value !== "") || [];

    console.log("finalTranslations");
    console.log(finalTranslations);

    submit(
      {
        gid: `gid://shopify/${upperFirstLetterResource}/${id}`,
        translations: JSON.stringify(finalTranslations),
      },
      { method: "post" },
    );
  };


  return (
    <s-page>
      <s-stack
        direction="inline"
        alignItems="center"
        justifyContent="space-between"
      >
        <s-stack
          direction="inline"
          gap="base"
          alignItems="center"
          paddingBlockEnd="small"
        >
          <s-button
            icon="arrow-left"
            href={`/app/translations/${resourceType}/${iso}`}
            variant="tertiary"
          ></s-button>
          <s-heading>{upperFirstLetterResource}</s-heading>
        </s-stack>
        <s-button variant="primary">Translate</s-button>
      </s-stack>
      <LanguageSelector url={`/app/translations/product/${id}`} iso={iso} />
      <s-section>
        <form
          data-save-bar
          data-discard-confirmation
          onSubmit={onSubmitProduct}
        >
          <s-stack direction="block" gap="small">
            <s-grid
              gridTemplateColumns="1fr auto 1fr"
              alignItems="center"
              gap="small"
            >
              <s-grid-item>
                <s-text-field
                  readOnly
                  label="Title"
                  value={getTranslatableField("title")}
                  placeholder="title"
                ></s-text-field>
              </s-grid-item>
              <s-grid-item>
                <s-button
                  icon="arrow-right"
                  onClick={() =>
                    setTranslatedField("title", getTranslatableField("title"))
                  }
                ></s-button>
              </s-grid-item>
              <s-grid-item>
                <s-text-field
                  label="Title"
                  value={getTranslatedField("title")}
                  placeholder="title"
                  onChange={(e) => setTranslatedField("title", e.target.value)}
                ></s-text-field>
              </s-grid-item>
            </s-grid>
            {translations.find((t) => t.key === "body_html") && (isMounted ? (
              <s-grid
                gridTemplateColumns="1fr auto 1fr"
                alignItems="center"
                gap="small"
              >
                <s-grid-item>
                  <s-text>Description</s-text>
                  <Editor
                    disabled={true}
                    tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js"
                    initialValue={getTranslatableField("body_html")}
                    init={{
                      height: 500,
                      menubar: false,
                      branding: false,
                      promotion: false,
                      toolbar: false,
                      statusbar: false,
                      contextmenu: false,
                      content_style:
                        'body { font-family: -apple-system, BlinkMacSystemFont, "San Francisco", Roboto, "Segoe UI", sans-serif; font-size: 14px; color: #202223; line-height: 1.5; }',
                    }}
                  />
                </s-grid-item>
                <s-button
                  icon="arrow-right"
                  onClick={() =>
                    setTranslatedField(
                      "body_html",
                      getTranslatableField("body_html"),
                    )
                  }
                ></s-button>
                <s-grid-item>
                  <s-text>Description</s-text>
                  <Editor
                    tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js"
                    onInit={(_, editor) => {
                      editorRef.current = editor;
                    }}
                    initialValue={getTranslatedField("body_html")}
                    onEditorChange={(newValue) => {
                      setTranslatedField("body_html", newValue);
                    }}
                    init={EDITOR_INIT_CONFIG}
                  />
                </s-grid-item>
              </s-grid>
            ) : (
              <s-text>Loading editor...</s-text>
            ))}
            <s-grid
              gridTemplateColumns="1fr auto 1fr"
              alignItems="center"
              gap="small"
            >
              <s-grid-item>
                <s-text-field
                  readOnly
                  label="URL handle"
                  value={getTranslatableField("handle")}
                  placeholder="url handle"
                ></s-text-field>
              </s-grid-item>
              <s-grid-item>
                <s-button
                  icon="arrow-right"
                  onClick={() =>
                    setTranslatedField("handle", getTranslatableField("handle"))
                  }
                ></s-button>
              </s-grid-item>
              <s-grid-item>
                <s-text-field
                  label="URL handle"
                  value={getTranslatedField("handle")}
                  placeholder="url handle"
                  onChange={(e) => setTranslatedField("handle", e.target.value)}
                ></s-text-field>
              </s-grid-item>
            </s-grid>
            {translations.find((t) => t.key === "product_type") && (<s-grid
              gridTemplateColumns="1fr auto 1fr"
              alignItems="center"
              gap="small"
            >
              <s-grid-item>
                <s-text-field
                  readOnly
                  label="Product type"
                  value={getTranslatableField("product_type")}
                  placeholder="product type"
                ></s-text-field>
              </s-grid-item>
              <s-grid-item>
                <s-button
                  icon="arrow-right"
                  onClick={() =>
                    setTranslatedField(
                      "product_type",
                      getTranslatableField("product_type"),
                    )
                  }
                ></s-button>
              </s-grid-item>
              <s-grid-item>
                <s-text-field
                  label="Product type"
                  value={getTranslatedField("product_type")}
                  placeholder="product type"
                  onChange={(e) =>
                    setTranslatedField("product_type", e.target.value)
                  }
                ></s-text-field>
              </s-grid-item>
            </s-grid>)}
          </s-stack>
        </form>
      </s-section>
    </s-page>
  );
}

const EDITOR_INIT_CONFIG = {
  height: 500,
  menubar: false,
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "help",
    "wordcount",
  ],
  toolbar:
    "undo redo | blocks | bold italic underline | " +
    "alignleft aligncenter alignright alignjustify | " +
    "bullist numlist outdent indent | table link code | removeformat",
  branding: false,
  promotion: false,
  statusbar: true,
  content_style:
    'body { font-family: -apple-system, BlinkMacSystemFont, "San Francisco", Roboto, "Segoe UI", sans-serif; font-size: 14px; color: #202223; line-height: 1.5; }',
};
