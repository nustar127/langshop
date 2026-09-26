import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { useState } from "react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const [isCustomizationVisible, setIsCustomizationVisible] = useState(true);
  const supportChanels = [
    {
      icon: "chat",
      heading: "Open live chat",
      paragraph:
        "Connect with our 24/7 support for instant replies and assistance",
      button: "Chat now",
    },
    {
      icon: "phone",
      heading: "Book a demo call",
      paragraph:
        "Book a session with our experts who will guide you through the essential settings",
      button: "Book call",
    },
    {
      icon: "search-list",
      heading: "Explore help center",
      paragraph:
        "Read the detailed user guides to learn about all the features and how to use them effectively",
      button: "Explore now",
    },
  ];

  return (
    <s-page heading="LangShop">
      <s-section heading="Quick setup guide"></s-section>
      <s-section>
        <s-stack direction="inline" gap="small" justifyContent="space-between">
          <s-stack direction="block" gap="small">
            <s-heading>Translate your store</s-heading>
            <s-stack
              justifyContent="space-between"
              direction="block"
              blockSize="100%"
            >
              <s-paragraph>
                Click to set up translation conditions and translate your store
                immediately
              </s-paragraph>
              <s-button variant="primary">Translate</s-button>
            </s-stack>
          </s-stack>
          <img
            src="images/translate-your-app.png"
            alt="Indoor plant"
            width="160"
          />
        </s-stack>
      </s-section>
      <s-section heading="App status">
        <s-paragraph>
          Your app is currently active. Click below to manage settings.
        </s-paragraph>
        <s-stack direction="inline" gap="small">
          <s-button variant="primary">Deactivate</s-button>
          <s-button>See how</s-button>
        </s-stack>
      </s-section>
      <s-box>
        <s-grid
          paddingBlockEnd="base"
          gridTemplateColumns="repeat(2, 1fr)"
          gap="base"
          justifyContent="center"
        >
          <s-grid-item
            padding="base"
            background="base"
            borderRadius="base"
            borderWidth="base"
            borderColor="base"
          >
            <s-stack
              direction="inline"
              gap="small"
              justifyContent="space-between"
            >
              <s-heading>Your plan: Free</s-heading>
              <s-button>Upgrade</s-button>
            </s-stack>
            <s-paragraph>Products:</s-paragraph>
            <s-avatar
              src="/customers/profile-123.jpg"
              initials="MR"
              alt="Maria Rodriguez"
              size="large"
            ></s-avatar>
          </s-grid-item>
          <s-grid-item
            padding="base"
            background="base"
            borderRadius="base"
            borderWidth="base"
            borderColor="base"
          >
            <s-paragraph>
              No translation tasks are running right now.
            </s-paragraph>
            <s-stack direction="inline" gap="small">
              <s-button>Check details</s-button>
              <s-link>History</s-link>
            </s-stack>
          </s-grid-item>
          <s-grid-item
            padding="base"
            background="base"
            borderRadius="base"
            borderWidth="base"
            borderColor="base"
          >
            <s-stack
              direction="inline"
              gap="small"
              justifyContent="space-between"
            >
              <s-stack direction="block" gap="small" inlineSize="60%">
                <s-heading>Professional translation</s-heading>
                <s-paragraph>
                  Get high-quality translations from native speakers and expert
                  translators with TextMaster, a professional SaaS translation
                  platform.
                </s-paragraph>
              </s-stack>
              <s-image
                src="images/professional-trans.png"
                alt="Indoor plant"
                inlineSize="auto"
              />
            </s-stack>
            <s-button>Translate</s-button>
          </s-grid-item>
          <s-grid-item
            padding="base"
            background="base"
            borderRadius="base"
            borderWidth="base"
            borderColor="base"
          >
            <s-stack
              direction="inline"
              gap="small"
              justifyContent="space-between"
            >
              <s-stack direction="block" gap="small" inlineSize="60%">
                <s-heading>Tutorials</s-heading>
                <s-paragraph>
                  Get step-by-step instructions on the basic settings required
                  to launch your multilingual website.
                </s-paragraph>
              </s-stack>
              <s-image
                src="images/tutors.png"
                alt="Indoor plant"
                inlineSize="auto"
              />
            </s-stack>
            <s-button>Explore</s-button>
          </s-grid-item>
        </s-grid>
      </s-box>
      <s-section heading="Support channels">
        <s-grid
          gridTemplateColumns="
    repeat(auto-fit, minmax(260px, 1fr))
  "
          gap="base"
        >
          {supportChanels.map((chanel, index) => (
            <s-grid-item
              key={index}
              padding="base"
              background="base"
              borderRadius="base"
              borderWidth="base"
              borderColor="base"
              direction="block"
              justifyContent="space-between"
            >
              <s-box>
                <s-stack direction="inline">
                  <s-box
                    background="subdued"
                    padding="small"
                    borderRadius="large-200"
                  >
                    <s-icon type={chanel.icon} size="lagrge-200"></s-icon>
                  </s-box>
                </s-stack>
                <s-heading>{chanel.heading}</s-heading>
                <s-paragraph>{chanel.paragraph}</s-paragraph>
              </s-box>
              <s-button>{chanel.button}</s-button>
            </s-grid-item>
          ))}
        </s-grid>
      </s-section>
      {isCustomizationVisible && (
        <s-section heading="">
          <s-stack justifyContent="space-between" direction="inline">
            <s-heading>Shopify Store Development/Customization</s-heading>
            <s-button
              icon="x"
              variant="tertiary"
              accessibilityLabel="Preview product"
              onClick={() => setIsCustomizationVisible(false)}
            ></s-button>
          </s-stack>
          <s-paragraph>
            Your business is unique — and so are your international customers.
            While our translation app helps you localize content for multiple
            markets, we understand that real global success often requires more
            than just words.
          </s-paragraph>
          <s-paragraph>
            Thats why we offer Shopify Store Custom Development designed to help
            you:
          </s-paragraph>
          <s-box paddingInlineStart="large-400">
            <s-unordered-list>
              <s-list-item>
                Custom App Development to provide functionality you need
              </s-list-item>
              <s-list-item>
                Custom Theme Development to ensure the look and feel of your
                store will match your international audiences
              </s-list-item>
              <s-list-item>
                Custom Integration Services to support your growing business
              </s-list-item>
            </s-unordered-list>
          </s-box>
          <s-stack justifyContent="end" direction="inline" inlineSize="100%">
            <s-button variant="primary">Translate</s-button>
          </s-stack>
        </s-section>
      )}
      <s-section heading="">
        <s-stack justifyContent="space-between" direction="inline">
          <s-stack gap="base" direction="inline" alignItems="center">
            <s-heading>Notifications</s-heading>
            <s-link>Configure</s-link>
          </s-stack>
          <s-button
            icon="arrow-down"
            variant="tertiary"
            accessibilityLabel="Preview product"
            onClick={() => setIsCustomizationVisible(false)}
          ></s-button>
        </s-stack>
        <s-paragraph>
          Check your actions and changes over the last 30 days
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
