import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const dataDir = process.env.DATA_DIR?.trim()
const dbPath =
  process.env.SQLITE_PATH?.trim() ||
  (dataDir
    ? path.join(dataDir, 'socutesy.db')
    : path.join(__dirname, '..', 'data', 'socutesy.db'))

/** @type {import('sql.js').Database | null} */
let db = null

/**
 * @param {import('sql.js').Database} database
 * @param {string} table
 * @param {string} column
 * @param {string} typeSql e.g. "TEXT" or "TEXT DEFAULT 'draft'"
 */
function ensureColumn(database, table, column, typeSql) {
  const stmt = database.prepare(`PRAGMA table_info(${table})`)
  let found = false
  while (stmt.step()) {
    const row = stmt.getAsObject()
    if (row.name === column) {
      found = true
      break
    }
  }
  stmt.free()
  if (!found) {
    database.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeSql}`)
  }
}

export async function initDb() {
  const SQL = await initSqlJs()
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.run('PRAGMA foreign_keys = ON;')

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      checkout_source TEXT NOT NULL,
      slug TEXT,
      product_name TEXT NOT NULL,
      unit_price REAL NOT NULL,
      order_qty INTEGER NOT NULL,
      selection_summary TEXT,
      cart_snapshot_json TEXT,
      customer_json TEXT NOT NULL,
      include_delivery INTEGER NOT NULL,
      order_total REAL NOT NULL,
      advance_amount REAL NOT NULL,
      balance_on_delivery REAL NOT NULL
    );
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS order_uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      original_name TEXT NOT NULL,
      stored_filename TEXT NOT NULL,
      mime_type TEXT,
      size_bytes INTEGER
    );
  `)

  // Order submission status (not payment verification)
  ensureColumn(db, 'orders', 'status', "TEXT DEFAULT 'draft'")
  ensureColumn(db, 'orders', 'submitted_at', 'TEXT')
  ensureColumn(db, 'orders', 'payment_proof_filename', 'TEXT')
  ensureColumn(db, 'orders', 'payment_proof_original_name', 'TEXT')
  ensureColumn(db, 'orders', 'payment_proof_mime', 'TEXT')
  ensureColumn(db, 'orders', 'payment_proof_size', 'INTEGER')

  // Per–line-item photo metadata
  ensureColumn(db, 'order_uploads', 'line_item_id', 'TEXT')
  ensureColumn(db, 'order_uploads', 'product_id', 'TEXT')
  ensureColumn(db, 'order_uploads', 'product_slug', 'TEXT')
  ensureColumn(db, 'order_uploads', 'product_name', 'TEXT')
  ensureColumn(db, 'order_uploads', 'created_at', 'TEXT')

  db.run(
    `CREATE INDEX IF NOT EXISTS idx_order_uploads_order ON order_uploads(order_id);`,
  )
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_order_uploads_line ON order_uploads(order_id, line_item_id);`,
  )

  persist()
}

export function persist() {
  if (!db) return
  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
}

export function getDb() {
  if (!db) throw new Error('Database not initialized')
  return db
}

export function getDbPath() {
  return dbPath
}
