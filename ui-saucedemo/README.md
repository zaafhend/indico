# Sauce Demo – Playwright (TypeScript) Tests

Automated tests for [saucedemo.com](https://www.saucedemo.com) using Playwright, TypeScript and the Page Object Model (POM).
QA Test Submission by Zaaf Hend

## Test Cases

| File | Scenario |
|------|----------|
| `tests/login.spec.ts` | Login with valid credentials |
| `tests/checkout.e2e.spec.ts` | E2E checkout of "Sauce Labs Onesie" (add to cart, cart, checkout, complete, back home with empty cart) |


## Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- npm (comes with Node.js)
- Internet access (tests run against https://www.saucedemo.com)

Check your versions:

```bash
node -v
npm -v
```

## Installation

1. Unzip the project and open a terminal in the `saucedemo-playwright` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Install the Playwright browser:

   ```bash
   npx playwright install chromium
   ```

   On Linux you may also need system dependencies:

   ```bash
   npx playwright install --with-deps chromium
   ```

## Running the Tests

Run all tests (headless):

```bash
npx playwright test
```

Run in headed mode (watch the browser):

```bash
npx playwright test --headed
```

Run a single file:

```bash
npx playwright test tests/testLogin.spec.ts
npx playwright test tests/testCheckout.spec.ts
```

Run with the interactive UI mode:

```bash
npx playwright test --ui
```

Shortcuts defined in `package.json`:

```bash
npm test
npm run test:headed
```

## Viewing the Report

After a run, open the HTML report:

```bash
npx playwright show-report
```

## Test Data

| Item | Value |
|------|-------|
| Username | `standard_user` |
| Password | `secret_sauce` |
| Checkout info | Zaaf / Hend / 16113 |

## Troubleshooting

- **Browser not found:** run `npx playwright install chromium` again.
- **Timeouts or navigation errors:** check your internet connection and that https://www.saucedemo.com is reachable.
- **Debug a failing test:** run `npx playwright test --debug`.
