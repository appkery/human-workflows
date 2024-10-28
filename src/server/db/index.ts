// import { createClient } from './neon'
import { sql } from '@vercel/postgres'
import {
  drizzle as postgresJsDrizzle,
  type PostgresJsDatabase,
} from 'drizzle-orm/postgres-js'
import {
  drizzle as vercelDrizzle,
  type VercelPgDatabase,
} from 'drizzle-orm/vercel-postgres'
import postgres from 'postgres'

import { env } from '~/env'

import * as schema from './schema'

// export const dynamic = 'force-dynamic'

// const sql = createClient({
//   connectionString: process.env.POSTGRES_URL,
// })

// export const db = vercelDrizzle({ client: sql, schema, logger: true })

export let db:
  | PostgresJsDatabase<typeof schema>
  | VercelPgDatabase<typeof schema>

if (env.NODE_ENV === 'development') {
  const sql = postgres(env.POSTGRES_URL!)
  db = postgresJsDrizzle({ client: sql, schema, logger: true })
} else if (env.NODE_ENV === 'test' || env.NODE_ENV === 'production') {
  db = vercelDrizzle({ client: sql, schema, logger: true })
}
