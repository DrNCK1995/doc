/**
 * Vercel build with Neon / Prisma Postgres.
 * Prefers cloud connection strings over leftover localhost DATABASE_URL.
 * Prefer Neon, then Prisma Postgres marketplace vars, then DATABASE_URL.
 */
const { spawnSync } = require("child_process");

const env = { ...process.env };

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

function firstCloud(urls) {
  return urls.filter(Boolean).find((u) => !isLocalUrl(u));
}

const present = [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "DIRECT_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "POSTGRES_URL_NO_SSL",
  "NEON_DATABASE_URL",
  "PRISMA_DATABASE_URL",
].filter((k) => Boolean(env[k]));

console.log("DB-related env keys present:", present.length ? present.join(", ") : "(none)");

// Prefer pooled cloud URLs for the app
const pooled = firstCloud([
  env.POSTGRES_PRISMA_URL, // Neon Prisma-optimized
  env.POSTGRES_URL,
  env.DATABASE_URL,
]);

// Prefer direct/unpooled for migrations
const direct = firstCloud([
  env.DATABASE_URL_UNPOOLED,
  env.POSTGRES_URL_NON_POOLING,
  env.DIRECT_URL,
  env.POSTGRES_PRISMA_URL,
  env.POSTGRES_URL,
  env.DATABASE_URL,
]);

if (!pooled && !direct) {
  console.error(
    [
      "No cloud DATABASE_URL found on this Vercel build.",
      "Open: https://vercel.com/dr-nck/doc/settings/environment-variables",
      "1) DELETE DATABASE_URL if it contains 127.0.0.1 or localhost",
      "2) Storage → keep ONE of Neon or Prisma Postgres → Connect to project doc (Production)",
      "3) Redeploy",
    ].join("\n"),
  );
  process.exit(1);
}

if (!pooled || isLocalUrl(pooled)) {
  console.error(
    [
      "DATABASE_URL is still localhost. Marketplace DBs cannot override a manual localhost value.",
      "Delete the localhost DATABASE_URL in Vercel Environment Variables, then reconnect Storage.",
      "Host seen:",
      hostOf(env.DATABASE_URL) || "(empty)",
    ].join("\n"),
  );
  process.exit(1);
}

env.DATABASE_URL = pooled;
const migrateUrl = direct && !isLocalUrl(direct) ? direct : pooled;

console.log("App DATABASE_URL host:", hostOf(pooled));
console.log("Migrate host:", hostOf(migrateUrl));

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: { ...env, ...extraEnv },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);
// Migrations need a direct connection when using poolers
run("npx", ["prisma", "migrate", "deploy"], { DATABASE_URL: migrateUrl });
run("npx", ["next", "build"]);
