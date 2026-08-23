/**
 * Vercel build: resolve one cloud DB URL, migrate, then next build.
 */
const { spawnSync } = require("child_process");
const {
  resolveDatabaseUrls,
  listDbRelatedKeys,
  hostOf,
} = require("./resolve-database-url.cjs");

const env = { ...process.env };

const present = listDbRelatedKeys(env);
console.log(
  "DB-related env keys present:",
  present.length ? present.join(", ") : "(none)",
);

const { pooled, direct } = resolveDatabaseUrls(env);

if (!pooled) {
  console.error(
    [
      "No cloud database URL found.",
      "In Vercel → Settings → Environment Variables:",
      "1) Delete any DATABASE_URL that contains localhost / 127.0.0.1",
      "2) Keep Neon (DRNCK1995_*) OR Prisma Postgres (DRCAREFORKIDS_*), not conflicting plain localhost",
      "3) Redeploy",
    ].join("\n"),
  );
  process.exit(1);
}

env.DATABASE_URL = pooled;
const migrateUrl = direct || pooled;

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
run("npx", ["prisma", "migrate", "deploy"], { DATABASE_URL: migrateUrl });
run("npx", ["next", "build"]);
