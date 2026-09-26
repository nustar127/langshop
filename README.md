# LangShop

LangShop is a Shopify app that makes store translation easier. Instead of digging through Shopify's default settings, you get the full picture at a glance: which languages are already translated, which aren't, how much is left, and a quick switcher to preview your store in different languages.

## What It Does

- Shows which languages are translated and which aren't
- Displays how much content is still left to translate
- Language switcher for quickly previewing the store in different languages
- A cleaner interface compared to Shopify's built-in settings

## Features

- Overview of translation status across all languages
- Translation progress — done, in progress, empty
- Quick switching between languages to preview the result
- Auth and data access via the Shopify Admin API
- Webhook handling to keep data up to date

## Tech Stack

- React Router
- TypeScript
- Vite
- Prisma
- Shopify App Bridge / Polaris
- GraphQL

## Project Structure

```
app/                  # routes and server logic
extensions/           # Shopify extensions
prisma/               # Prisma schema and migrations
public/               # static assets
shopify.app.toml      # app configuration
shopify.web.toml      # web configuration
vite.config.js        # Vite configuration
Dockerfile            # container build
```

## Getting Started

### Prerequisites

- Node.js and a package manager (npm / yarn / pnpm)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)

### Install & Run

```bash
npm install
shopify app dev
```
