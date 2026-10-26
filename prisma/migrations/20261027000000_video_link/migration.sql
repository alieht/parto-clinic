-- Track when the Jitsi video link was SMS'd for a video appointment (idempotent)
ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "videoRoomCode" TEXT;
ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "videoLinkSentAt" TIMESTAMP(3);

-- Password recovery support
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetCodeHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetCodeExpiry" TIMESTAMP(3);
