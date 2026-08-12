-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "ReferenceSource" AS ENUM ('WHO', 'IAP');

-- CreateEnum
CREATE TYPE "GrowthIndicator" AS ENUM ('WEIGHT_FOR_AGE', 'HEIGHT_FOR_AGE', 'BMI_FOR_AGE', 'WEIGHT_FOR_HEIGHT', 'HEAD_CIRCUMFERENCE_FOR_AGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "sex" "Sex" NOT NULL,
    "birthWeightKg" DOUBLE PRECISION,
    "parentName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "visitDate" DATE NOT NULL,
    "ageYears" INTEGER NOT NULL,
    "ageMonths" INTEGER NOT NULL,
    "ageDays" INTEGER NOT NULL,
    "ageTotalMonths" DOUBLE PRECISION NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "headCircumferenceCm" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "doctorAdvice" TEXT,
    "vaccinationStatus" TEXT,
    "nextVisitDue" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthMeasurement" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "referenceSource" "ReferenceSource" NOT NULL,
    "referenceVersion" TEXT NOT NULL,
    "weightForAgeZ" DOUBLE PRECISION,
    "weightForAgePercentile" DOUBLE PRECISION,
    "heightForAgeZ" DOUBLE PRECISION,
    "heightForAgePercentile" DOUBLE PRECISION,
    "bmiForAgeZ" DOUBLE PRECISION,
    "bmiForAgePercentile" DOUBLE PRECISION,
    "weightForHeightZ" DOUBLE PRECISION,
    "weightForHeightPercentile" DOUBLE PRECISION,
    "hcForAgeZ" DOUBLE PRECISION,
    "hcForAgePercentile" DOUBLE PRECISION,
    "nutritionalStatus" TEXT NOT NULL,
    "clinicalFlags" TEXT[],
    "growthVelocityKgPerMonth" DOUBLE PRECISION,
    "expectedWeightKg" DOUBLE PRECISION,
    "expectedHeightCm" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthReferenceVersion" (
    "id" TEXT NOT NULL,
    "source" "ReferenceSource" NOT NULL,
    "version" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ageMinMonths" DOUBLE PRECISION NOT NULL,
    "ageMaxMonths" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthReferenceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LmsDataPoint" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "indicator" "GrowthIndicator" NOT NULL,
    "sex" "Sex" NOT NULL,
    "xValue" DOUBLE PRECISION NOT NULL,
    "L" DOUBLE PRECISION NOT NULL,
    "M" DOUBLE PRECISION NOT NULL,
    "S" DOUBLE PRECISION NOT NULL,
    "p3" DOUBLE PRECISION,
    "p15" DOUBLE PRECISION,
    "p50" DOUBLE PRECISION,
    "p85" DOUBLE PRECISION,
    "p97" DOUBLE PRECISION,

    CONSTRAINT "LmsDataPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaccinationRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "doseLabel" TEXT,
    "givenDate" DATE,
    "dueDate" DATE,
    "status" TEXT NOT NULL DEFAULT 'DUE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VaccinationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentalMilestone" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "milestoneName" TEXT NOT NULL,
    "expectedAgeMonths" INTEGER NOT NULL,
    "achievedAt" DATE,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevelopmentalMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientIdSequence" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "bucketKey" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientIdSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");

-- CreateIndex
CREATE INDEX "Patient_name_idx" ON "Patient"("name");

-- CreateIndex
CREATE INDEX "Patient_mobileNumber_idx" ON "Patient"("mobileNumber");

-- CreateIndex
CREATE INDEX "Patient_dateOfBirth_idx" ON "Patient"("dateOfBirth");

-- CreateIndex
CREATE INDEX "Patient_patientId_idx" ON "Patient"("patientId");

-- CreateIndex
CREATE INDEX "Visit_patientId_visitDate_idx" ON "Visit"("patientId", "visitDate");

-- CreateIndex
CREATE INDEX "Visit_nextVisitDue_idx" ON "Visit"("nextVisitDue");

-- CreateIndex
CREATE INDEX "GrowthMeasurement_patientId_idx" ON "GrowthMeasurement"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthMeasurement_visitId_key" ON "GrowthMeasurement"("visitId");

-- CreateIndex
CREATE INDEX "GrowthReferenceVersion_source_isActive_idx" ON "GrowthReferenceVersion"("source", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthReferenceVersion_source_version_key" ON "GrowthReferenceVersion"("source", "version");

-- CreateIndex
CREATE INDEX "LmsDataPoint_versionId_indicator_sex_idx" ON "LmsDataPoint"("versionId", "indicator", "sex");

-- CreateIndex
CREATE UNIQUE INDEX "LmsDataPoint_versionId_indicator_sex_xValue_key" ON "LmsDataPoint"("versionId", "indicator", "sex", "xValue");

-- CreateIndex
CREATE INDEX "VaccinationRecord_patientId_idx" ON "VaccinationRecord"("patientId");

-- CreateIndex
CREATE INDEX "DevelopmentalMilestone_patientId_idx" ON "DevelopmentalMilestone"("patientId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthMeasurement" ADD CONSTRAINT "GrowthMeasurement_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthMeasurement" ADD CONSTRAINT "GrowthMeasurement_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LmsDataPoint" ADD CONSTRAINT "LmsDataPoint_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "GrowthReferenceVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentalMilestone" ADD CONSTRAINT "DevelopmentalMilestone_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
