import { config } from 'dotenv'
import { type Config } from "drizzle-kit";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  config({ path: '.env.development', override: true })
} else if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test', override: true })
} else if (process.env.NODE_ENV === 'production') {
  config({ path: '.env.production', override: true })
}

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config;
