/**
 * Normalize DB env vars for Vercel (Neon + Prisma Postgres).
 * Neon often sets DATABASE_URL_UNPOOLED; Prisma Postgres sets DIRECT_URL.
 * Prisma schema requires DIRECT_URL for migrate deploy.
 */
const { spawnSync } = require("child_process");

const env = { ...process.env };

const databaseUrl = env.DATABASE_URL || env.POSTGRES_PRISMA_URL || env.POSTGRES_URL;
if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL. Connect Neon or Prisma Postgres to this Vercel project, then redeploy.",
  );
  process.exit(1);
}

if (/127\.0\.0\.1|localhost/.test(databaseUrl)) {
  console.error(
    "DATABASE_URL still points at localhost. In Vercel → Settings → Environment Variables, replace it with your Neon/Prisma cloud URL (not 127.0.0.1).",
  );
  process.exit(1);
}

env.DATABASE_URL = databaseUrl;

const directUrl =
  env.DIRECT_URL ||
  env.DATABASE_URL_UNPOOLED ||
  env.POSTGRES_URL_NON_POOLING ||
  databaseUrl;

env.DIRECT_URL = directUrl;
env.DATABASE_URL_UNPOOLED = env.DATABASE_URL_UNPOOLED || directUrl;

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["next", "build"]);
