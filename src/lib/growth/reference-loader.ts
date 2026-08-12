import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  GrowthIndicator,
  GrowthReferenceManifest,
  LmsFilePayload,
  LmsPoint,
  ReferenceDataProvider,
  ReferenceSource,
  Sex,
} from "./types";

type PrismaLmsClient = {
  growthReferenceVersion: {
    findUnique: (args: {
      where: { source_version: { source: ReferenceSource; version: string } };
      include?: { lmsPoints?: boolean | { where: Record<string, unknown> } };
    }) => Promise<{
      id: string;
      lmsPoints?: Array<{
        indicator: GrowthIndicator;
        sex: Sex;
        xValue: number;
        L: number;
        M: number;
        S: number;
        p3: number | null;
        p15: number | null;
        p50: number | null;
        p85: number | null;
        p97: number | null;
      }>;
    } | null>;
  };
  lmsDataPoint: {
    findMany: (args: {
      where: {
        versionId: string;
        indicator: GrowthIndicator;
        sex: Sex;
      };
      orderBy: { xValue: "asc" };
    }) => Promise<
      Array<{
        xValue: number;
        L: number;
        M: number;
        S: number;
        p3: number | null;
        p15: number | null;
        p50: number | null;
        p85: number | null;
        p97: number | null;
      }>
    >;
  };
};

export interface ReferenceLoaderOptions {
  /** Absolute or cwd-relative path to data/growth-references */
  dataRoot?: string;
  /** Optional Prisma client for DB-backed LMS points. */
  prisma?: PrismaLmsClient | null;
  /** Prefer DB when both DB and files are available. Default false (files first). */
  preferDatabase?: boolean;
}

const FOLDER_BY_VERSION: Record<string, string> = {
  "WHO-2006": "who-2006",
  "IAP-2015": "iap-2015",
};

function defaultDataRoot(): string {
  return path.join(process.cwd(), "data", "growth-references");
}

function cacheKey(
  source: ReferenceSource,
  version: string,
  indicator: GrowthIndicator,
  sex: Sex
): string {
  return `${source}|${version}|${indicator}|${sex}`;
}

/**
 * Loads versioned LMS JSON from `data/growth-references/{folder}/`
 * (manifest.json + indicator files). Results are cached in memory.
 * Optionally falls back to / prefers Prisma `GrowthReferenceVersion` + `LmsDataPoint`.
 */
export class FileReferenceLoader implements ReferenceDataProvider {
  private readonly dataRoot: string;
  private readonly prisma: PrismaLmsClient | null;
  private readonly preferDatabase: boolean;
  private readonly pointCache = new Map<string, LmsPoint[]>();
  private readonly manifestCache = new Map<string, GrowthReferenceManifest>();

  constructor(options: ReferenceLoaderOptions = {}) {
    this.dataRoot = options.dataRoot ?? defaultDataRoot();
    this.prisma = options.prisma ?? null;
    this.preferDatabase = options.preferDatabase ?? false;
  }

  clearCache(): void {
    this.pointCache.clear();
    this.manifestCache.clear();
  }

  async getManifest(
    source: ReferenceSource,
    version: string
  ): Promise<GrowthReferenceManifest> {
    const key = `${source}|${version}`;
    const cached = this.manifestCache.get(key);
    if (cached) return cached;

    const folder = FOLDER_BY_VERSION[version] ?? version.toLowerCase();
    const manifestPath = path.join(this.dataRoot, folder, "manifest.json");
    const raw = await fs.readFile(manifestPath, "utf8");
    const manifest = JSON.parse(raw) as GrowthReferenceManifest;
    this.manifestCache.set(key, manifest);
    return manifest;
  }

  async getLmsPoints(
    source: ReferenceSource,
    version: string,
    indicator: GrowthIndicator,
    sex: Sex
  ): Promise<LmsPoint[]> {
    const key = cacheKey(source, version, indicator, sex);
    const hit = this.pointCache.get(key);
    if (hit) return hit;

    if (this.preferDatabase && this.prisma) {
      const fromDb = await this.loadFromPrisma(source, version, indicator, sex);
      if (fromDb.length) {
        this.pointCache.set(key, fromDb);
        return fromDb;
      }
    }

    try {
      const fromFile = await this.loadFromFiles(source, version, indicator, sex);
      this.pointCache.set(key, fromFile);
      return fromFile;
    } catch (fileErr) {
      if (this.prisma) {
        const fromDb = await this.loadFromPrisma(
          source,
          version,
          indicator,
          sex
        );
        if (fromDb.length) {
          this.pointCache.set(key, fromDb);
          return fromDb;
        }
      }
      throw fileErr;
    }
  }

  private async loadFromFiles(
    source: ReferenceSource,
    version: string,
    indicator: GrowthIndicator,
    sex: Sex
  ): Promise<LmsPoint[]> {
    const manifest = await this.getManifest(source, version);
    const fileName = manifest.files[indicator];
    if (!fileName) {
      throw new Error(
        `Manifest for ${source}/${version} has no file for ${indicator}`
      );
    }

    const folder = FOLDER_BY_VERSION[version] ?? version.toLowerCase();
    const filePath = path.join(this.dataRoot, folder, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    const payload = JSON.parse(raw) as LmsFilePayload | LmsFilePayload[];

    const records = Array.isArray(payload) ? payload : [payload];
    const match = records.find(
      (r) =>
        r.indicator === indicator &&
        r.sex === sex &&
        (r.source === source || !r.source) &&
        (r.version === version || !r.version)
    );

    if (!match) {
      // Some generators store one file per indicator with both sexes inside
      const both = records.flatMap((r) =>
        r.sex === sex && r.indicator === indicator ? [r] : []
      );
      if (!both.length) {
        // Try sex-keyed object format: { MALE: { points }, FEMALE: { points } }
        const asMap = JSON.parse(raw) as Record<
          string,
          { points?: LmsPoint[]; L?: never } | LmsPoint[]
        >;
        const sexBlock = asMap[sex];
        if (Array.isArray(sexBlock)) return sortPoints(sexBlock);
        if (sexBlock && Array.isArray(sexBlock.points)) {
          return sortPoints(sexBlock.points);
        }
        throw new Error(
          `No LMS points for ${source}/${version}/${indicator}/${sex} in ${fileName}`
        );
      }
      return sortPoints(both[0]!.points);
    }

    return sortPoints(match.points);
  }

  private async loadFromPrisma(
    source: ReferenceSource,
    version: string,
    indicator: GrowthIndicator,
    sex: Sex
  ): Promise<LmsPoint[]> {
    if (!this.prisma) return [];

    const ver = await this.prisma.growthReferenceVersion.findUnique({
      where: { source_version: { source, version } },
    });
    if (!ver) return [];

    const rows = await this.prisma.lmsDataPoint.findMany({
      where: { versionId: ver.id, indicator, sex },
      orderBy: { xValue: "asc" },
    });

    return rows.map((r) => ({
      xValue: r.xValue,
      L: r.L,
      M: r.M,
      S: r.S,
      p3: r.p3 ?? undefined,
      p15: r.p15 ?? undefined,
      p50: r.p50 ?? undefined,
      p85: r.p85 ?? undefined,
      p97: r.p97 ?? undefined,
    }));
  }
}

function sortPoints(points: LmsPoint[]): LmsPoint[] {
  return [...points].sort((a, b) => a.xValue - b.xValue);
}

/** Singleton helper for app code. */
let defaultLoader: FileReferenceLoader | null = null;

export function getReferenceLoader(
  options?: ReferenceLoaderOptions
): FileReferenceLoader {
  if (options) return new FileReferenceLoader(options);
  if (!defaultLoader) defaultLoader = new FileReferenceLoader();
  return defaultLoader;
}
