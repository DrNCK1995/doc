/**
 * Shared DB URL resolution — keep in sync with scripts/resolve-database-url.cjs
 * (build script uses the .cjs copy; Next.js uses this module).
 */

function isLocalUrl(url: string | undefined | null): boolean {
  return /127\.0\.0\.1|localhost/.test(url || "");
}

export function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(String(url).replace(/^postgres(ql)?:/i, "https:")).hostname;
  } catch {
    return null;
  }
}

function collectBySuffix(
  env: NodeJS.ProcessEnv,
  suffix: string,
): string[] {
  const out: string[] = [];
  const plain = env[suffix];
  if (plain) out.push(plain);
  const prefixed = Object.keys(env)
    .filter((key) => key.endsWith(`_${suffix}`))
    .sort();
  for (const key of prefixed) {
    const value = env[key];
    if (value) out.push(value);
  }
  return out;
}

function firstCloud(urls: string[]): string | undefined {
  return urls.filter(Boolean).find((u) => !isLocalUrl(u));
}

export function resolveDatabaseUrls(env: NodeJS.ProcessEnv = process.env): {
  pooled: string | null;
  direct: string | null;
  host: string | null;
} {
  const pooled =
    firstCloud([
      ...collectBySuffix(env, "POSTGRES_PRISMA_URL"),
      ...collectBySuffix(env, "POSTGRES_URL"),
      ...collectBySuffix(env, "DATABASE_URL"),
      ...collectBySuffix(env, "PRISMA_DATABASE_URL"),
    ]) ?? null;

  const direct =
    firstCloud([
      ...collectBySuffix(env, "DATABASE_URL_UNPOOLED"),
      ...collectBySuffix(env, "POSTGRES_URL_NON_POOLING"),
      ...collectBySuffix(env, "DIRECT_URL"),
      ...collectBySuffix(env, "POSTGRES_PRISMA_URL"),
      ...collectBySuffix(env, "POSTGRES_URL"),
      ...collectBySuffix(env, "DATABASE_URL"),
      ...collectBySuffix(env, "PRISMA_DATABASE_URL"),
    ]) ?? pooled;

  return {
    pooled,
    direct,
    host: hostOf(pooled),
  };
}
