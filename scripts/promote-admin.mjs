import process from 'node:process'
import pg from 'pg'

const databaseUrl = process.env.DATABASE_URL
const adminEmail = process.env.ADMIN_EMAIL

if (!databaseUrl || !adminEmail) {
  console.error('DATABASE_URL and ADMIN_EMAIL are required to promote an admin user.')
  process.exit(1)
}

const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  const result = await client.query(
    'update public.profiles set role = $1 where email = $2 returning id, email, role',
    ['admin', adminEmail]
  )

  if (result.rowCount === 0) {
    console.error(`No profile found for ${adminEmail}. Create the user first, then run this script again.`)
    process.exitCode = 1
  } else {
    console.log('Admin role granted:', result.rows[0])
  }
} catch (error) {
  console.error('Failed to promote admin user.')
  console.error(error)
  process.exitCode = 1
} finally {
  await client.end()
}
