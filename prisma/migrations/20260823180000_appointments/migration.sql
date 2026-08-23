-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AppointmentVisitType" AS ENUM ('CONSULTATION', 'FOLLOW_UP', 'VACCINATION', 'NEWBORN', 'GROWTH');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "confirmationCode" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "visitType" "AppointmentVisitType" NOT NULL DEFAULT 'CONSULTATION',
    "appointmentDate" DATE NOT NULL,
    "slotStart" TEXT NOT NULL,
    "slotLabel" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "parentMobile" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "childAgeNote" TEXT,
    "reason" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "paidAt" TIMESTAMP(3),
    "paymentExpiresAt" TIMESTAMP(3),
    "confirmationSentAt" TIMESTAMP(3),
    "parentReminderSentAt" TIMESTAMP(3),
    "doctorReminderSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_confirmationCode_key" ON "Appointment"("confirmationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_razorpayOrderId_key" ON "Appointment"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_slotStart_status_idx" ON "Appointment"("appointmentDate", "slotStart", "status");

-- CreateIndex
CREATE INDEX "Appointment_status_appointmentDate_idx" ON "Appointment"("status", "appointmentDate");

-- CreateIndex
CREATE INDEX "Appointment_parentMobile_idx" ON "Appointment"("parentMobile");

-- CreateIndex
CREATE INDEX "Appointment_parentEmail_idx" ON "Appointment"("parentEmail");

-- CreateIndex
CREATE INDEX "Appointment_paymentExpiresAt_idx" ON "Appointment"("paymentExpiresAt");
