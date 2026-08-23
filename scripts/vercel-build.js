/**
 * Normalize DB env vars for Vercel (Neon + Prisma Postgres).
 * Prefer cloud URLs over any leftover local DATABASE_URL (127.0.0.1).
 */
const { spawnSync } = require("child_process");

const env = { ...process.env };

function isLocalUrl(url) {
  return /127\.0\.0\.1|localhost/.test(url || "");
}

const candidates = [
  env.POSTGRES_PRISMA_URL,
  env.POSTGRES_URL,
  env.DATABASE_URL,
  env.POSTGRES_URL_NON_POOLING,
  env.DATABASE_URL_UNPOOLED,
  env.DIRECT_URL,
].filter(Boolean);

const cloudUrl = candidates.find((u) => !isLocalUrl(u));
const databaseUrl = cloudUrl || env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL. In Vercel → Storage, connect Neon or Prisma Postgres to project doc, then redeploy.",
  );
  process.exit(1);
}

if (isLocalUrl(databaseUrl)) {
  console.error(
    [
      "DATABASE_URL still points at localhost (127.0.0.1).",
      "Fix: Vercel → Project doc → Settings → Environment Variables",
      "1) DELETE any DATABASE_URL / DIRECT_URL that contains 127.0.0.1 or localhost",
      "2) Keep only the Neon or Prisma Postgres URLs from Storage (host like neon.tech or prisma.io)",
      "3) Use ONE database only (Neon OR Prisma Postgres)",
      "4) Redeploy",
    ].join("\n"),
  );
  process.exit(1);
}

env.DATABASE_URL = databaseUrl;

const directCandidates = [
  env.DIRECT_URL,
  env.DATABASE_URL_UNPOOLED,
  env.POSTGRES_URL_NON_POOLING,
  databaseUrl,
].filter(Boolean);

env.DIRECT_URL = directCandidates.find((u) => !isLocalUrl(u)) || databaseUrl;
env.DATABASE_URL_UNPOOLED = env.DATABASE_URL_UNPOOLED || env.DIRECT_URL;

console.log(
  "Using cloud database host:",
  (() => {
    try {
      return new URL(databaseUrl.replace(/^postgres(ql)?:/, "https:")).hostname;
    } catch {
      return "(ok)";
    }
  })(),
);

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["next", "build"]);
