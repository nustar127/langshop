import { useState } from "react";

export default function PricingPage() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;

  const currentPlans = plans.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage,
  );

  return (
    <s-page heading="Pricing page">
      <s-stack direction="inline" gap="base" alignItems="center">
        <s-button icon="arrow-left" href="/app" variant="tertiary"></s-button>
        <s-heading>Pricing</s-heading>
      </s-stack>
      <s-box>
        <s-grid gridTemplateColumns="auto 1fr auto" gap="base">
          <s-stack direction="inline" alignItems="center">
            <s-button
              disabled={page === 0}
              icon="chevron-left"
              variant="primary"
              onClick={() => setPage(0)}
            ></s-button>
          </s-stack>
          <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="base">
            {currentPlans.map((plan, index) => (
              <s-grid-item
                key={index}
                padding="base"
                background="base"
                borderRadius="base"
                borderWidth="base"
                borderColor="base"
              >
                <s-stack direction="block" gap="large" blockSize="100%">
                  <s-stack direction="block" gap="small">
                    <h2 className="heading-xl">{plan.name}</h2>
                    <h3 className="pricing-heading">{plan.price}</h3>
                  </s-stack>
                  <s-button variant="secondary">Upgrade</s-button>
                  <s-unordered-list>
                    {plan.features.map((feature, index) => (
                      <s-list-item key={index}>
                        <s-stack
                          direction="inline"
                          justifyContent="space-between"
                        >
                          <s-text>{feature.label}</s-text>
                          <s-text>{feature.value}</s-text>
                        </s-stack>
                      </s-list-item>
                    ))}
                  </s-unordered-list>
                  <s-paragraph>{plan.plusText}</s-paragraph>
                  <s-unordered-list>
                    {plan.extras.map((extra, index) => (
                      <s-list-item key={index}>{extra}</s-list-item>
                    ))}
                  </s-unordered-list>
                  <s-text alignment="center" tone="subdued">
                    7 trial days
                  </s-text>
                </s-stack>
              </s-grid-item>
            ))}
          </s-grid>
          <s-stack direction="inline" alignItems="center">
            <s-button
              disabled={page === 1}
              icon="chevron-right"
              variant="primary"
              onClick={() => setPage(1)}
            ></s-button>
          </s-stack>
        </s-grid>
      </s-box>
    </s-page>
  );
}

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "$100/year",
    recommended: true,
    trial: "7 trial days",

    features: [
      {
        label: "AI Translation",
        value: "250 products",
      },
      {
        label: "Languages",
        value: "1",
      },
      {
        label: "Glossary",
        value: "5 rules",
      },
    ],

    plusText: "Everything in Free plan, plus:",

    extras: [
      "Unlimited translation editing",
      "Basic language and currency switcher",
      "No branding",
      "24/7 priority support",
    ],
  },

  {
    id: "standard",
    name: "Standard",
    price: "$400/year",
    recommended: false,
    trial: "7 trial days",

    features: [
      {
        label: "AI Translation",
        value: "2000 products",
      },
      {
        label: "Languages",
        value: "3",
      },
      {
        label: "Translation auto sync",
        value: "50/mo",
      },
      {
        label: "Glossary",
        value: "100 rules",
      },
    ],

    plusText: "Everything in Basic plan, plus:",

    extras: [
      "DeepL Pro, OpenAI, and Google Cloud integration",
      "Advanced language and currency switcher",
      "Third-party app translation",
    ],
  },

  {
    id: "advanced",
    name: "Advanced",
    price: "$750/year",
    recommended: false,
    trial: "7 trial days",

    features: [
      {
        label: "AI Translation",
        value: "5000 products",
      },
      {
        label: "Languages",
        value: "5",
      },
      {
        label: "Translation auto sync",
        value: "125/mo",
      },
      {
        label: "Glossary",
        value: "250 rules",
      },
      {
        label: "Exclusion rules",
        value: "10 rules",
      },
    ],

    plusText: "Everything in Standard plan, plus:",

    extras: ["Shopify Flow support"],
  },

  {
    id: "pro",
    name: "Pro",
    price: "$1200/year",
    recommended: false,
    trial: "7 trial days",

    features: [
      {
        label: "AI Translation",
        value: "10000 products",
      },
      {
        label: "Languages",
        value: "10",
      },
      {
        label: "Translation auto sync",
        value: "250/mo",
      },
      {
        label: "Glossary",
        value: "500 rules",
      },
      {
        label: "Exclusion rules",
        value: "50 rules",
      },
    ],

    plusText: "Everything in Advanced plan, plus:",

    extras: ["API access"],
  },

  {
    id: "enterprise",
    name: "Enterprise",
    price: "$2500/year",
    recommended: false,
    trial: "7 trial days",

    features: [
      {
        label: "AI Translation",
        value: "50000 products",
      },
      {
        label: "Languages",
        value: "20",
      },
      {
        label: "Translation auto sync",
        value: "1250/mo",
      },
      {
        label: "Glossary",
        value: "1000 rules",
      },
      {
        label: "Exclusion rules",
        value: "200 rules",
      },
    ],

    plusText: "Everything in Pro plan, plus:",

    extras: ["Customer success manager"],
  },

  {
    id: "unlimited",
    name: "Unlimited",
    price: "$5000/year",
    recommended: false,
    trial: "7 trial days",

    features: [
      {
        label: "AI Translation",
        value: "unlimited",
      },
      {
        label: "Languages",
        value: "20",
      },
      {
        label: "Translation auto sync",
        value: "unlimited",
      },
      {
        label: "Glossary",
        value: "unlimited",
      },
      {
        label: "Exclusion rules",
        value: "unlimited",
      },
    ],

    plusText: "Everything in Enterprise plan, plus:",

    extras: ["Unlimited translation editing"],
  },
];
