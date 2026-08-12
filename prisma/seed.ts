/**
 * Prisma seed: admin user, WHO/IAP LMS references, sample patients + visits.
 *
 * Password hashing uses Node crypto.scrypt (no bcrypt dependency).
 * Run: npm run db:seed
 */
import { createHash, randomBytes, scryptSync } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import {
  PrismaClient,
  type GrowthIndicator,
  type ReferenceSource,
  type Sex,
} from "@prisma/client";
import { calculateAge } from "../src/lib/growth/age";
import { assessGrowth, computeBmi } from "../src/lib/growth/calculator";
import { getReferenceLoader } from "../src/lib/growth/reference-loader";
import { mapAssessmentToMeasurement } from "../src/lib/services/growth";
import { generatePatientId } from "../src/lib/services/patient-id";

const prisma = new PrismaClient();

const DATA_ROOT = path.join(process.cwd(), "data", "growth-references");

type LmsFilePayload = {
  source: ReferenceSource;
  version: string;
  indicator: GrowthIndicator;
  sex: Sex;
  points: Array<{
    xValue: number;
    L: number;
    M: number;
    S: number;
    p3?: number;
    p15?: number;
    p50?: number;
    p85?: number;
    p97?: number;
  }>;
};

type Manifest = {
  source: ReferenceSource;
  version: string;
  name: string;
  description?: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  files: Partial<Record<GrowthIndicator, string>>;
};

/** Demo hash format: scrypt$N$r$p$saltHex$hashHex */
function hashPassword(password: string): string {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

async function importReferenceFolder(folder: string): Promise<void> {
  const dir = path.join(DATA_ROOT, folder);
  const manifestRaw = await fs.readFile(path.join(dir, "manifest.json"), "utf8");
  const manifest = JSON.parse(manifestRaw) as Manifest;

  const version = await prisma.growthReferenceVersion.upsert({
    where: {
      source_version: {
        source: manifest.source,
        version: manifest.version,
      },
    },
    create: {
      source: manifest.source,
      version: manifest.version,
      name: manifest.name,
      description: manifest.description ?? null,
      ageMinMonths: manifest.ageMinMonths,
      ageMaxMonths: manifest.ageMaxMonths,
      isActive: true,
      publishedAt: new Date(),
    },
    update: {
      name: manifest.name,
      ageMinMonths: manifest.ageMinMonths,
      ageMaxMonths: manifest.ageMaxMonths,
      isActive: true,
    },
  });

  // Clear existing points for re-seed idempotency
  await prisma.lmsDataPoint.deleteMany({ where: { versionId: version.id } });

  for (const [indicator, fileName] of Object.entries(manifest.files)) {
    if (!fileName) continue;
    const raw = await fs.readFile(path.join(dir, fileName), "utf8");
    const payloads = JSON.parse(raw) as LmsFilePayload[];
    const rows = payloads.flatMap((payload) =>
      payload.points.map((pt) => ({
        versionId: version.id,
        indicator: payload.indicator,
        sex: payload.sex,
        xValue: pt.xValue,
        L: pt.L,
        M: pt.M,
        S: pt.S,
        p3: pt.p3 ?? null,
        p15: pt.p15 ?? null,
        p50: pt.p50 ?? null,
        p85: pt.p85 ?? null,
        p97: pt.p97 ?? null,
      })),
    );

    // Batch insert
    const chunk = 500;
    for (let i = 0; i < rows.length; i += chunk) {
      await prisma.lmsDataPoint.createMany({
        data: rows.slice(i, i + chunk),
        skipDuplicates: true,
      });
    }

    console.log(
      `  Imported ${indicator} (${rows.length} points) for ${manifest.version}`,
    );
  }
}

async function seedAdmin(): Promise<void> {
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = hashPassword(password);

  await prisma.user.upsert({
    where: { email: "admin@growth.local" },
    create: {
      email: "admin@growth.local",
      name: "Clinic Admin",
      passwordHash,
      role: "ADMIN",
    },
    update: {
      passwordHash,
      role: "ADMIN",
    },
  });

  // Fingerprint for logs (not a secret)
  const fp = createHash("sha256").update(passwordHash).digest("hex").slice(0, 8);
  console.log(`Admin user ready (admin@growth.local), hash fingerprint ${fp}`);
  console.log(
    "Note: /api/auth/admin validates ADMIN_PASSWORD env directly; DB hash is for future staff auth.",
  );
}

async function createSamplePatient(opts: {
  name: string;
  sex: Sex;
  dateOfBirth: Date;
  birthWeightKg: number;
  parentName: string;
  mobileNumber: string;
  visits: Array<{
    visitDate: Date;
    weightKg: number;
    heightCm: number;
    headCircumferenceCm?: number;
    notes?: string;
    doctorAdvice?: string;
    nextVisitDue?: Date;
  }>;
}): Promise<string> {
  const provider = getReferenceLoader({ preferDatabase: false });
  const patientId = await generatePatientId();

  const patient = await prisma.patient.create({
    data: {
      patientId,
      name: opts.name,
      dateOfBirth: opts.dateOfBirth,
      sex: opts.sex,
      birthWeightKg: opts.birthWeightKg,
      parentName: opts.parentName,
      mobileNumber: opts.mobileNumber,
      email: null,
      address: "Hyderabad, Telangana",
    },
  });

  let previous: {
    visitDate: Date;
    ageMonths: number;
    weightKg: number;
    heightCm: number;
    weightForAgeZ: number | null;
  } | null = null;

  for (const v of opts.visits) {
    const age = calculateAge(opts.dateOfBirth, v.visitDate);
    const bmi = computeBmi(v.weightKg, v.heightCm);
    const assessment = await assessGrowth(provider, {
      sex: opts.sex,
      ageMonths: age.ageMonthsExact,
      weightKg: v.weightKg,
      heightCm: v.heightCm,
      headCm: v.headCircumferenceCm,
      previousVisit: previous,
    });
    const measurementData = mapAssessmentToMeasurement(assessment);

    const visit = await prisma.visit.create({
      data: {
        patientId: patient.id,
        visitDate: v.visitDate,
        ageYears: age.years,
        ageMonths: age.months,
        ageDays: age.days,
        ageTotalMonths: age.ageMonthsExact,
        weightKg: v.weightKg,
        heightCm: v.heightCm,
        headCircumferenceCm: v.headCircumferenceCm ?? null,
        bmi,
        notes: v.notes ?? null,
        doctorAdvice: v.doctorAdvice ?? null,
        vaccinationStatus: "Age-appropriate / as per NIS",
        nextVisitDue: v.nextVisitDue ?? null,
      },
    });

    await prisma.growthMeasurement.create({
      data: {
        patientId: patient.id,
        visitId: visit.id,
        ...measurementData,
      },
    });

    previous = {
      visitDate: v.visitDate,
      ageMonths: age.ageMonthsExact,
      weightKg: v.weightKg,
      heightCm: v.heightCm,
      weightForAgeZ: measurementData.weightForAgeZ,
    };
  }

  return patientId;
}

function monthsAgo(months: number, dayOffset = 0): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() - months);
  d.setDate(d.getDate() + dayOffset);
  return d;
}

async function seedSamplePatients(): Promise<void> {
  // Clear demo patients if re-seeding (keep LMS + admin)
  await prisma.patient.deleteMany({
    where: {
      mobileNumber: { in: ["9876543210", "9123456780"] },
    },
  });

  // Patient 1: healthy infant boy, 3 visits over ~6 months showing catch-up growth
  const boyDob = monthsAgo(9);
  const boyId = await createSamplePatient({
    name: "Aarav Sharma",
    sex: "MALE",
    dateOfBirth: boyDob,
    birthWeightKg: 2.9,
    parentName: "Priya Sharma",
    mobileNumber: "9876543210",
    visits: [
      {
        visitDate: monthsAgo(6),
        weightKg: 5.8,
        heightCm: 58,
        headCircumferenceCm: 40,
        notes: "First clinic visit — exclusive breastfeeding",
        doctorAdvice: "Continue EBF; vitamin D drops",
        nextVisitDue: monthsAgo(3),
      },
      {
        visitDate: monthsAgo(3),
        weightKg: 7.2,
        heightCm: 64,
        headCircumferenceCm: 42.5,
        notes: "Complementary feeds started",
        doctorAdvice: "Iron-rich complementary foods; follow-up in 3 months",
        nextVisitDue: monthsAgo(0),
      },
      {
        visitDate: monthsAgo(0),
        weightKg: 8.6,
        heightCm: 70,
        headCircumferenceCm: 44.5,
        notes: "Steady weight gain; milestones age-appropriate",
        doctorAdvice: "Continue balanced diet; next visit in 3 months",
        nextVisitDue: (() => {
          const d = new Date();
          d.setMonth(d.getMonth() + 3);
          return d;
        })(),
      },
    ],
  });

  // Patient 2: toddler girl with mild faltering then recovery (for alert demos)
  const girlDob = monthsAgo(24);
  const girlId = await createSamplePatient({
    name: "Ananya Reddy",
    sex: "FEMALE",
    dateOfBirth: girlDob,
    birthWeightKg: 3.1,
    parentName: "Suresh Reddy",
    mobileNumber: "9123456780",
    visits: [
      {
        visitDate: monthsAgo(6),
        weightKg: 10.8,
        heightCm: 82,
        headCircumferenceCm: 47,
        notes: "Baseline visit — active toddler",
        doctorAdvice: "Balanced diet; deworming as scheduled",
        nextVisitDue: monthsAgo(3),
      },
      {
        visitDate: monthsAgo(3),
        weightKg: 10.2,
        heightCm: 83.5,
        headCircumferenceCm: 47.2,
        notes: "Recent illness; reduced appetite",
        doctorAdvice: "Calorie-dense snacks; review in 4 weeks if no gain",
        nextVisitDue: monthsAgo(1),
      },
      {
        visitDate: monthsAgo(0),
        weightKg: 11.4,
        heightCm: 85.5,
        headCircumferenceCm: 47.5,
        notes: "Catch-up after illness resolved",
        doctorAdvice: "Continue high-protein diet; routine follow-up",
        nextVisitDue: (() => {
          const d = new Date();
          d.setMonth(d.getMonth() + 3);
          return d;
        })(),
      },
    ],
  });

  console.log(`Sample patients: ${boyId}, ${girlId}`);
}

async function main() {
  console.log("Seeding growth monitor database…");

  await seedAdmin();

  console.log("Importing LMS reference datasets…");
  await importReferenceFolder("who-2006");
  await importReferenceFolder("iap-2015");

  // Ensure sequence row exists
  await prisma.patientIdSequence.upsert({
    where: { id: "global" },
    create: { id: "global", bucketKey: "000000000000", sequence: 0 },
    update: {},
  });

  console.log("Creating sample patients…");
  await seedSamplePatients();

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
