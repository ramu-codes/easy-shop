# Easy Shop

Easy Shop is a browser-based shop management application for small retail businesses. It brings inventory, purchasing, sales, customer dues, expenses, employees, attendance, salary payments, and business summaries into one responsive React interface.

The current application is branded as **Verma Fancy Store** and is designed for local, offline-first use: operational data is stored in the browser's `localStorage`. There is no backend service, remote database, or API integration in this repository.

## Overview

Easy Shop helps a shop operator:

- Maintain products and stock levels.
- Record purchases from sellers and calculate estimated profit.
- Create sales invoices with cash, online, or due payment modes.
- Track customers, purchase history, outstanding dues, and received payments.
- Record shop expenditures and review monthly category totals.
- Manage employees, attendance, and salary payments.
- Track ad hoc revenue and expenditure by day, week, or month.
- Review sales, expenses, profit, customers, products, and low-stock information on a dashboard.

The public landing page includes a product overview, feature highlights, store gallery, FAQ, English/Hindi copy, and the shop login dialog. After login, the application provides the management dashboard and routed business modules.

## Key Features

### Dashboard and analytics

- Today's sales and expenses.
- Current-month sales, expenses, and profit.
- Total revenue, expenses, customer dues, investment, net profit, and salary paid.
- Product and customer quick counts.
- Top-selling and least-selling product charts.
- Top customers by visits and revenue.
- Expense category chart.
- Low-stock and out-of-stock alerts for products with five or fewer items.

### Products and inventory

- Search products and filter by category.
- View product details including MRP, buy price, sell price, stock, and estimated unit profit.
- Edit or delete products.
- Add product images from the device or camera; images are compressed in the browser before storage.
- Manage categories such as Garments, Accessories, Cosmetics, Footwear, Jewelry, Bags, Electronics, Home & Decor, Toys, Stationery, and Other.
- Stock is increased by purchases and decreased by sales. Deleting a purchase or sale restores the related stock.

Products are normally created through the **Buy / Sellers** purchase workflow. Existing product records can be edited from the Products page.

### Purchases and sellers

- Add and edit seller records with name, phone, and location.
- Record purchases with item, quantity, total purchase price, selling price, date, supplier due, and optional image.
- Reuse existing product names through item suggestions or create a new product from a purchase.
- View purchase history and per-seller totals, item counts, order counts, and dues.
- See estimated purchase profit.

### Sales and invoicing

- Create invoices for a customer and one or more products.
- Apply item discounts and choose Cash, Online, or Due payment.
- Automatically generate sequential invoice numbers such as `INV-0001`.
- Update stock after a sale and add due amounts to customers for due sales.
- View expandable sales history.
- Print invoices or share them through WhatsApp and email using browser-generated links.
- Delete sales and restore their stock and customer due amount.

### Customers and payments

- Add, edit, search, and delete customer records.
- View customer order history and current outstanding due.
- Record payments against customers with outstanding balances.
- Track total dues and payments received on the dashboard.

### Expenses and daily tracking

- Record expenses by category, amount, description, and date.
- Filter monthly expenses and view category totals.
- Record separate revenue or expenditure entries with a title, category, date, and time.
- Review daily, weekly, and monthly totals, net amount, and monthly category breakdown.

### Employees

- Add, edit, and delete employee records.
- Track monthly attendance using Present, Absent, and Half Day states.
- Review attendance summaries by employee and month.
- Record salary payments with month, date, amount, and optional note.

### User experience

- Responsive layout with a collapsible sidebar.
- Light and dark themes.
- English and Hindi UI translations for supported labels.
- Toast notifications for user actions.
- Accessible UI primitives based on Radix UI and shadcn/ui conventions.

## Screenshots

Screenshots are not currently included in the repository.

> **Screenshot placeholder:** Add a landing page screenshot here.
>
> **Screenshot placeholder:** Add a dashboard screenshot here.
>
> **Screenshot placeholder:** Add a sales/invoice screenshot here.

## Technology Stack

| Area | Technology |
| --- | --- |
| Application | React 18, TypeScript |
| Build and dev server | Vite 5 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3, PostCSS, CSS variables |
| UI components | Radix UI primitives, shadcn/ui-style components |
| Forms and validation packages | React Hook Form, Zod, `@hookform/resolvers` |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner and the local toast components |
| State persistence | React Context and browser `localStorage` |
| Testing | Vitest, Testing Library, jsdom |
| Code quality | ESLint, TypeScript |

## Architecture

The application is a single-page Vite application. `src/main.tsx` mounts `App`, which composes the global providers and routes:

1. `QueryClientProvider` provides the configured TanStack Query client.
2. `ThemeProvider` manages light/dark mode.
3. `LanguageProvider` manages English/Hindi labels.
4. `ShopProvider` owns shop records and persistence.
5. `BrowserRouter` selects the landing page or authenticated management routes.

`ShopContext` is the primary application store. It loads and saves customers, sellers, products, purchases, sales, expenses, payments, employees, attendance, salary payments, daily entries, login state, and shop name using browser `localStorage` keys. IDs are generated in the browser, and calculations such as stock changes, customer dues, invoice numbers, and dashboard totals are handled in the context or page components.

There is no server-side authentication. The login flow checks the password against the literal value `admin123`, then persists the logged-in flag locally. This is suitable for a local demonstration or prototype, not for protecting production business data.

## Repository Structure

```text
.
├── index.html                 # Vite HTML entry point
├── package.json               # Scripts and dependencies
├── package-lock.json          # npm lockfile
├── bun.lock / bun.lockb       # Bun lockfiles
├── vite.config.ts             # Vite server, React plugin, and @ alias
├── vitest.config.ts           # Vitest and jsdom configuration
├── tailwind.config.ts         # Tailwind theme and content paths
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint flat configuration
├── components.json            # shadcn/ui configuration
├── public/                    # Static public assets
└── src/
    ├── App.tsx                # Providers and application routes
    ├── App.css                # App-level styles
    ├── index.css              # Global Tailwind and theme styles
    ├── main.tsx               # React entry point
    ├── assets/                # Store and product imagery
    ├── components/            # Layout, sidebar, navigation, and UI primitives
    ├── contexts/              # Shop data, language, and theme providers
    ├── hooks/                 # Reusable hooks
    ├── lib/                   # Shared utilities
    ├── pages/                 # Landing page and management screens
    ├── test/                  # Vitest setup and example test
    └── types/                 # Shop domain types
```

### Application routes

| Route | Screen |
| --- | --- |
| `/` | Dashboard |
| `/products` | Products and inventory |
| `/sellers` | Purchases and sellers |
| `/customers` | Customers, history, and payments |
| `/sales` | New invoices and sales history |
| `/employees` | Staff, attendance, and salary |
| `/daily-tracker` | Daily, weekly, and monthly revenue tracking |
| `/expenditure` | Monthly shop expenses |

Unauthenticated users see the landing page rather than the management routes. Unknown authenticated routes render the 404 page.

## Prerequisites

- Node.js with npm. Use a current LTS release compatible with Vite 5 and TypeScript 5.
- A modern browser with support for `localStorage`, browser file inputs, and `window.matchMedia`.
- Optional: a device camera if using the product or purchase image capture controls.

No external database, API key, service account, or environment variable is required.

## Local Installation

1. Clone the repository and enter it:

   ```bash
   git clone https://github.com/ramu-codes/easy-shop.git
   cd easy-shop
   ```

2. Install the dependencies using the repository's npm lockfile:

   ```bash
   npm ci
   ```

   `npm install` also works when regenerating dependencies. The repository additionally contains Bun lockfiles, but the documented commands use npm.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080). The Vite configuration binds to all interfaces and uses port `8080`.

5. Select **Login**, enter a shop name, and use the current demo password:

   ```text
   admin123
   ```

## Environment Variables and Configuration

There are no `.env` files, environment variable reads, API keys, or runtime configuration values in the current implementation.

The following behavior is configured in source:

- Vite development server: port `8080`, host `::`.
- Path alias: `@/*` resolves to `src/*`.
- Default shop name shown by the UI: `Verma Fancy Store`.
- Default login password: `admin123`.
- Product and shop data: browser `localStorage`.
- Images: browser data URLs stored with the related product or purchase record.

Because data is stored per browser origin, changing browsers, clearing site data, using private browsing, or deploying to a different origin can make existing local records unavailable. The application does not currently provide export, import, synchronization, encryption, or server backup.

## Available npm Scripts

The scripts below are defined in `package.json`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 8080. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run build:dev` | Create a development-mode Vite build. |
| `npm run lint` | Run ESLint across the repository. |
| `npm run preview` | Preview the built `dist/` output locally with Vite. |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |

## Development and Validation

Run the available checks before submitting changes:

```bash
npm run lint
npm test
npm run build
```

For interactive development, use:

```bash
npm run dev
```

The current test suite contains a basic Vitest example and uses `jsdom` with `src/test/setup.ts`. There are no end-to-end tests in the repository.

## Production Build and Deployment

Build the static application:

```bash
npm ci
npm run build
```

Deploy the generated `dist/` directory to any static hosting provider that supports single-page applications. Configure the host to:

1. Serve `dist/index.html` as the entry point.
2. Rewrite unknown application routes such as `/products` and `/sales` to `index.html`, so React Router can handle them.
3. Serve the files in `dist/` over HTTPS when using camera capture or production traffic.

To test the production build locally:

```bash
npm run preview
```

The repository does not include Docker, serverless, hosting-provider, or CI deployment configuration, so provider-specific deployment commands are intentionally not prescribed.

## Troubleshooting

### The app opens but previously entered data is missing

Data is stored only in the current browser's `localStorage`. Check that you are using the same origin and have not cleared site data or opened a private browsing session. There is no server-side backup or synchronization.

### A nested route returns a hosting-provider 404 after deployment

Configure an SPA fallback/rewrite from every application route to `dist/index.html`. This is required by the `BrowserRouter` setup.

### The camera capture control does not open

Camera capture depends on browser support, device permissions, and a secure context. Use HTTPS on a deployed site and allow camera access when prompted. You can always use the Browse control instead.

### The development server uses a different port

The repository configures Vite to use port `8080`. Check for another process using that port and review `vite.config.ts` if a local override is needed.

### Product images fail to save

Product and purchase images are converted to browser data URLs and kept in `localStorage`. Files larger than 10 MB are rejected before compression, and browser storage limits may still be reached when storing many large images.

### Login does not work

The current prototype accepts only `admin123` as the password. The shop name must not be blank. This is not production-grade authentication.

## Contributing

1. Create a focused branch for your change.
2. Keep changes aligned with the existing React, TypeScript, Tailwind CSS, and context-based architecture.
3. Update related tests or documentation when behavior changes.
4. Run `npm run lint`, `npm test`, and `npm run build`.
5. Open a pull request describing the user-visible change and validation performed.

Please do not commit secrets, generated `dist/` output, local environment files, or browser data.

## License

No license file or license declaration is present in this repository. Until the project owner adds one, the repository's reuse and distribution terms are unspecified.

## Author

No individual author is identified in the repository metadata or documentation. The initial commit is attributed to `gpt-engineer-app[bot]`; no human author attribution is added here.
