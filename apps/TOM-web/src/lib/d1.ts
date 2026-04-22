import { getCloudflareContext } from '@opennextjs/cloudflare'

type TomCloudflareEnv = CloudflareEnv & {
  TOM_DB?: D1Database
}

export function getTomDb() {
  const { env } = getCloudflareContext() as { env: TomCloudflareEnv }

  if (!env.TOM_DB) {
    throw new Error(
      'Cloudflare D1 binding TOM_DB is not available in plain Next dev mode. Start TOM-web with `npm exec nx run @org/web:preview` for D1-backed APIs, or use `npm exec nx run @org/web:dev` only for UI work without Cloudflare bindings.'
    )
  }

  return env.TOM_DB
}
