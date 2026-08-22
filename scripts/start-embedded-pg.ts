/**
 * Starts an embedded PostgreSQL for local development (no Docker required).
 * Reuses `.embedded-pg` if already initialized.
 */
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import EmbeddedPostgres from "embedded-postgres";

const DATA_DIR = path.join(process.cwd(), ".embedded-pg");
const PORT = Number(process.env.PG_PORT || 54329);
const DATABASE = "growth_monitor";

async function main() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const alreadyInitialized = existsSync(path.join(DATA_DIR, "PG_VERSION"));

  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: "postgres",
    password: "postgres",
    port: PORT,
    persistent: true,
  });

  console.log(`Starting embedded PostgreSQL on port ${PORT}…`);
  if (!alreadyInitialized) {
    await pg.initialise();
  } else {
    console.log("Existing data directory detected — skipping initdb.");
  }
  await pg.start();

  try {
    await pg.createDatabase(DATABASE);
    console.log(`Created database ${DATABASE}`);
  } catch {
    console.log(`Database ${DATABASE} already exists`);
  }

  const url = `postgresql://postgres:postgres@127.0.0.1:${PORT}/${DATABASE}?schema=public`;
  writeFileSync(
    path.join(process.cwd(), ".env.local.db"),
    `DATABASE_URL="${url}"\n`,
  );
  console.log(`DATABASE_URL written to .env.local.db`);
  console.log(url);
  console.log("Embedded Postgres is running. Press Ctrl+C to stop.");

  const stop = async () => {
    console.log("\nStopping embedded PostgreSQL…");
    try {
      await pg.stop();
    } catch {
      /* ignore */
    }
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  await new Promise(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
