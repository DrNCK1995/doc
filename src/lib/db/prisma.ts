import { PrismaClient } from "@prisma/client";

function resolveDatabaseUrl(): string | undefined {
  const env = process.env;
  const prefer: string[] = [];

  const push = (value?: string) => {
    if (value) prefer.push(value);
  };

  push(env.POSTGRES_PRISMA_URL);
  push(env.POSTGRES_URL);
  push(env.DATABASE_URL);
  push(env.PRISMA_DATABASE_URL);

  for (const [key, value] of Object.entries(env)) {
    if (!value) continue;
    if (
      key.endsWith("_POSTGRES_PRISMA_URL") ||
      key.endsWith("_POSTGRES_URL") ||
      key.endsWith("_DATABASE_URL") ||
      key.endsWith("_PRISMA_DATABASE_URL")
    ) {
      prefer.push(value);
    }
  }

  const cloud = prefer.find((u) => !/127\.0\.0\.1|localhost/.test(u));
  return cloud ?? prefer[0];
}

const databaseUrl = resolveDatabaseUrl();
if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
