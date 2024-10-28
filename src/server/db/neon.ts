import { neonConfig } from '@neondatabase/serverless';
import { env } from '~/env';
 
if (env.POSTGRES_URL === 'development') {
  neonConfig.wsProxy = (host) => `${host}:54330/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}
 
export * from '@vercel/postgres';