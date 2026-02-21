# Broken Pagination

A React app that demonstrates handling broken pagination from an unreliable API — one that returns fewer items than requested and overlapping items between pages.

## Project Structure

```
broken-pagination/
├── src/
│   ├── App.js                        # Main component with infinite scroll
│   └── service/
│       └── products.service.js       # API calls
├── mock-server/
│   ├── server.js                     # Express mock server with broken pagination
│   └── db.json                       # 100 product items
└── .env                              # Environment variables
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

The `.env` file at the project root should contain:

```
REACT_APP_BASE_API_URL=http://localhost:3001/
```

### 3. Run the mock server

```bash
npm run server
```

Starts the mock API at `http://localhost:3001`.

### 4. Run the React app

In a separate terminal:

```bash
npm start
```

Opens the app at `http://localhost:3000`.

## Mock Server API

### `GET /items?_page=<number>`

Returns a page of products. Page size is fixed at 10.

**Example response:**

```json
{
  "data": [
    { "id": 1, "name": "Product 1", "category": "Electronics", "price": 29.99 },
    ...
  ],
  "total": 100,
  "page": 1
}
```

### Intentional bugs

The server simulates a broken pagination API with two random bugs:

| Bug | Probability | Behaviour |
|-----|-------------|-----------|
| Fewer items | 40% | Returns 1–9 items instead of 10 |
| Overlapping items | 40% | Shifts the start index back by 1–3, causing items from the previous page to reappear |

## How the app handles it

- **Infinite scroll** — fetches the next page when the user scrolls to the bottom
- **Deduplication** — before appending new items, filters out any that share an `id` with an already-displayed item, keeping the first occurrence
