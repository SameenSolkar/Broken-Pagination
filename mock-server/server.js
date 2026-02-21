const express = require('express')
const { readFileSync } = require('fs')
const path = require('path')

const app = express()
const PORT = 3001
const PAGE_SIZE = 10

// Allow requests from the React dev server
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  next()
})

function getItems() {
  const db = JSON.parse(readFileSync(path.join(__dirname, 'db.json'), 'utf-8'))
  return db.items
}

// GET /items?_page=1
app.get('/items', (req, res) => {
  const page = Math.max(1, parseInt(req.query._page) || 1)
  const allItems = getItems()
  const totalItems = allItems.length

  const normalStart = (page - 1) * PAGE_SIZE

  // Stop if we've gone past the data
  if (normalStart >= totalItems) {
    return res.json({ data: [], total: totalItems, page })
  }

  // Bug 1: sometimes return fewer items than PAGE_SIZE (40% chance)
  const hasFewItems = Math.random() < 0.4
  const count = hasFewItems
    ? Math.floor(Math.random() * (PAGE_SIZE - 1)) + 1  // 1 to 9
    : PAGE_SIZE

  // Bug 2: sometimes overlap with the previous page (40% chance, not on page 1)
  const hasOverlap = page > 1 && Math.random() < 0.4
  const overlap = hasOverlap
    ? Math.floor(Math.random() * 3) + 1  // 1 to 3 items from previous page
    : 0

  const start = Math.max(0, normalStart - overlap)
  const data = allItems.slice(start, start + count)

  res.json({
    data,
    total: totalItems,
    page,
  })
})

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`)
  console.log(`  GET http://localhost:${PORT}/items?_page=1`)
})
