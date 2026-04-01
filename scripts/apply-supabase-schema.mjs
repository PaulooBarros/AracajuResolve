import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import pg from 'pg'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL is required to apply the Supabase schema.')
  process.exit(1)
}

const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
const schema = fs.readFileSync(schemaPath, 'utf8')
const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  await client.query(schema)
  console.log('Supabase schema applied successfully.')
} catch (error) {
  console.error('Failed to apply Supabase schema.')
  console.error(error)
  process.exitCode = 1
} finally {
  await client.end()
}
