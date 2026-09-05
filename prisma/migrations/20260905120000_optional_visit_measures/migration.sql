-- Allow partial anthropometry on visits (interpret whatever is filled).
ALTER TABLE "Visit" ALTER COLUMN "weightKg" DROP NOT NULL;
ALTER TABLE "Visit" ALTER COLUMN "heightCm" DROP NOT NULL;
ALTER TABLE "Visit" ALTER COLUMN "bmi" DROP NOT NULL;
