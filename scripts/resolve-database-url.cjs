/**
 * Shared DB URL resolution for Vercel build + Next.js runtime.
 * Must stay identical so migrate and the app hit the same database.
 *
 * Priority: Neon pooled URLs first (POSTGRES_PRISMA_URL), then Postgres URL,
 * then DATABASE_URL, then Prisma Postgres (PRISMA_DATABASE_URL).
 * Prefixed marketplace keys (DRNCK1995_*, DRCAREFORKIDS_*) are included.
 * Localhost / 127.0.0.1 values are skipped when any cloud URL exists.
 */

function isLocalUrl(url) {
  return /127\.0\.0\.1|localhost/.test(url || "");
}

function hostOf(url) {
  try {
    return new URL(String(url).replace(/^postgres(ql)?:/i, "https:")).hostname;
  } catch {
    return null;
  }
}

function collectBySuffix(env, suffix) {
  const out = [];
  if (env[suffix]) out.push(env[suffix]);
  const prefixed = Object.keys(env)
    .filter((key) => key.endsWith(`_${suffix}`))
    .sort();
  for (const key of prefixed) {
    if (env[key]) out.push(env[key]);
  }
  return out;
}

function firstCloud(urls) {
  return urls.filter(Boolean).find((u) => !isLocalUrl(u));
}

function resolveDatabaseUrls(env = process.env) {
  const pooled = firstCloud([
    ...collectBySuffix(env, "POSTGRES_PRISMA_URL"),
    ...collectBySuffix(env, "POSTGRES_URL"),
    ...collectBySuffix(env, "DATABASE_URL"),
    ...collectBySuffix(env, "PRISMA_DATABASE_URL"),
  ]);

  const direct = firstCloud([
    ...collectBySuffix(env, "DATABASE_URL_UNPOOLED"),
    ...collectBySuffix(env, "POSTGRES_URL_NON_POOLING"),
    ...collectBySuffix(env, "DIRECT_URL"),
    ...collectBySuffix(env, "POSTGRES_PRISMA_URL"),
    ...collectBySuffix(env, "POSTGRES_URL"),
    ...collectBySuffix(env, "DATABASE_URL"),
    ...collectBySuffix(env, "PRISMA_DATABASE_URL"),
  ]);

  return {
    pooled: pooled || null,
    direct: direct || pooled || null,
    host: hostOf(pooled),
  };
}

function listDbRelatedKeys(env = process.env) {
  return Object.keys(env)
    .filter(
      (k) =>
        k === "DATABASE_URL" ||
        k.includes("DATABASE_URL") ||
        k.includes("POSTGRES") ||
        k.includes("DIRECT_URL") ||
        k.includes("PGHOST") ||
        k.includes("PRISMA_DATABASE"),
    )
    .sort();
}

module.exports = {
  isLocalUrl,
  hostOf,
  resolveDatabaseUrls,
  listDbRelatedKeys,
};
