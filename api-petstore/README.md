# Petstore API Automation (Playwright + TypeScript)

API tests for the [Swagger Petstore](https://petstore.swagger.io/) covering:

- `POST /pet`
- `GET /pet/{petId}`
- `DELETE /pet/{petId}`

Each endpoint has positive, negative and empty/null test cases.

QA Test Submission by Zaaf Hend
Featuring my cat Mochi in a pajama

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (check with `node -v`)
- npm (comes with Node.js)

## Install dependencies

From the project folder:

```bash
npm install
```

API tests do not open a browser, so `npx playwright install` is not required.

## Run the tests

Run everything:

```bash
npm test
```

Run by endpoint:

```bash
npm run test:create    # POST /pet
npm run test:find      # GET /pet/findByStatus
npm run test:delete    # DELETE /pet/{petId}
```

Run by category:

```bash
npm run test:positive  # positive cases only
npm run test:negative  # negative cases only (@negative)
npm run test:empty     # empty/null cases only (@empty)
```

Run a single test by name:

```bash
npx playwright test -g "P01 creates a pet with the full body"
```

## View the report

After a run, open the HTML report:

```bash
npm run report
```
