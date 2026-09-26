import { useRouteLoaderData } from "react-router";
import PropTypes from "prop-types";

LanguageSelector.propTypes = {
  url: PropTypes.string.isRequired,
  iso: PropTypes.string.isRequired,
};

export default function LanguageSelector({ url, iso }) {
  const { shopLocales } = useRouteLoaderData("routes/app");

  return (
    <s-stack direction="block" paddingBlock="small">
      <s-text>Language</s-text>
      <s-button
        commandFor="language-popover"
        variant="tertiary"
        icon="chevron-down"
      >
        {shopLocales.find((locale) => locale.locale === iso).name}
      </s-button>
      <s-popover id="language-popover">
        <s-stack direction="block">
          {shopLocales.map((locale) => (
            <s-button
              variant={locale.locale === iso ? "tertiary" : "secondary"}
              key={locale.locale}
              icon={locale.locale === iso && "check"}
              href={`${url}/${locale.locale}`}
            >
              {locale.name}
            </s-button>
          ))}
        </s-stack>
      </s-popover>
    </s-stack>
  );
}
