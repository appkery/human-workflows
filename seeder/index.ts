import { createClient } from '@vercel/postgres'
import { config } from 'dotenv'
import {
  drizzle as postgresJsDrizzle,
  type PostgresJsDatabase,
} from 'drizzle-orm/postgres-js'
import {
  drizzle as vercelDrizzle,
  type VercelPgDatabase,
} from 'drizzle-orm/vercel-postgres'
import postgres from 'postgres'

import * as schema from '~/server/db/schema'

export let db:
  | PostgresJsDatabase<typeof schema>
  | VercelPgDatabase<typeof schema>

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  config({ path: '.env.development' })

  const sql = postgres(process.env.POSTGRES_URL!)
  db = postgresJsDrizzle({ client: sql, schema })
} else if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })

  const sql = createClient({
    connectionString: process.env.POSTGRES_URL,
  })

  db = vercelDrizzle({ client: sql, schema })
} else if (process.env.NODE_ENV === 'production') {
  config({ path: '.env.production' })

  const sql = createClient({
    connectionString: process.env.POSTGRES_URL,
  })

  db = vercelDrizzle({ client: sql, schema })
}
