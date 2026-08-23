/**
 * Vercel build with Neon / Prisma Postgres.
 * Supports prefixed marketplace vars (e.g. DRNCK1995_DATABASE_URL, DRCAREFORKIDS_DATABASE_URL).
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

/** Collect values for a suffix across plain + prefixed marketplace keys. */
function collectBySuffix(suffix) {
  const out = [];
  if (env[suffix]) out.push(env[suffix]);
  for (const key of Object.keys(env)) {
    if (key.endsWith(`_${suffix}`) || key.endsWith(suffix)) {
      out.push(env[key]);
    }
  }
  // Prefer neon/prisma-looking prefixed keys first when choosing later
  return out;
}

const present = Object.keys(env)
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

console.log(
  "DB-related env keys present:",
  present.length ? present.join(", ") : "(none)",
);

const pooled = firstCloud([
  ...collectBySuffix("POSTGRES_PRISMA_URL"),
  ...collectBySuffix("POSTGRES_URL"),
  ...collectBySuffix("DATABASE_URL"),
  ...collectBySuffix("PRISMA_DATABASE_URL"),
]);

const direct = firstCloud([
  ...collectBySuffix("DATABASE_URL_UNPOOLED"),
  ...collectBySuffix("POSTGRES_URL_NON_POOLING"),
  ...collectBySuffix("DIRECT_URL"),
  ...collectBySuffix("POSTGRES_PRISMA_URL"),
  ...collectBySuffix("POSTGRES_URL"),
  ...collectBySuffix("DATABASE_URL"),
]);

if (!pooled) {
  console.error(
    [
      "No cloud database URL found.",
      "Delete the old Sensitive DATABASE_URL if it is localhost,",
      "then either reconnect Neon without a custom prefix, or keep DRNCK1995_DATABASE_URL and redeploy this build.",
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
