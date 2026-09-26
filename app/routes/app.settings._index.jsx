import { Outlet } from "react-router";

export default function SettingsPage() {
  return (
    <s-page heading="Settigs page">
      <s-stack direction="inline" gap="base" alignItems="center">
        <s-button icon="arrow-left" href="/app" variant="tertiary"></s-button>
        <s-heading>Settings</s-heading>
      </s-stack>
      <s-section>
        <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="base">
          {settings.map((setting, index) => (
            <s-grid-item
              key={index}
              background="base"
              borderRadius="base"
              borderWidth="base"
              borderColor="base"
            >
              <s-clickable
                href={setting.link}
                blockSize="100%"
                padding="base"
              >
                <s-grid gridTemplateColumns="auto 1fr" gap="base">
                  <s-grid-item>
                    <s-stack direction="inline">
                      <s-box
                        background="subdued"
                        padding="small"
                        borderRadius="large-200"
                      >
                        <s-icon type={setting.icon} size="lagrge"></s-icon>
                      </s-box>
                    </s-stack>
                  </s-grid-item>
                  <s-grid-item>
                    <s-heading>{setting.heading}</s-heading>
                    <s-paragraph>{setting.paragraph}</s-paragraph>
                  </s-grid-item>
                </s-grid>
              </s-clickable>
            </s-grid-item>
          ))}
        </s-grid>
      </s-section>
      <Outlet />
    </s-page>
  );
}

const settings = [
  {
    icon: "content",
    heading: "Switchers",
    paragraph:
      "Customize a language and currency switcher, and configure an automatic detection alert",
    link: "/app/settings/switcher",
  },
  {
    icon: "language-translate",
    heading: "Languages",
    paragraph: "Add more languages, publish them, and manage domains",
    link: "/app/settings/languages",
  },
  {
    icon: "currency-convert",
    heading: "Currencies",
    paragraph:
      "Add additional currencies, set exchange rates, and adjust currency display in your storet",
    link: "/app/settings/currencies",
  },
];
