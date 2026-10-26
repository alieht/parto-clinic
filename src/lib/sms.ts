// SMS.ir API integration
const SMS_API_URL = "https://api.sms.ir/v1/send/verify";

export const SMS_TEMPLATES = {
  OTP: 960161,
  PHONE_CONFIRM: 641611,
  VIDEO_CONFIRM: 802837,
  INPERSON_CONFIRM: 117618,
  DOCTOR_VIDEO: 175916,
  PATIENT_VIDEO: 852026,
  PASSWORD_RECOVERY: 583457,
} as const;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Normalize an Iranian mobile number to the 09xxxxxxxxx form SMS.ir expects. */
export function normalizeMobile(input: string): string | null {
  if (!input) return null;
  let digits = String(input)
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/\D/g, "");

  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98") && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  if (digits.length !== 10 || !digits.startsWith("9")) return null;
  return "0" + digits;
}

interface SmsParameter {
  name: string;
  value: string;
}

interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendSms(
  mobile: string,
  templateId: number,
  parameters: SmsParameter[]
): Promise<SmsResult> {
  const apiKey = process.env.SMSIR_API_KEY;
  if (!apiKey) {
    console.error("SMSIR_API_KEY not set");
    return { success: false, error: "SMS API key not configured" };
  }

  const normalizedMobile = normalizeMobile(mobile);
  if (!normalizedMobile) {
    return { success: false, error: "شماره موبایل نامعتبر است" };
  }

  try {
    const res = await fetch(SMS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        mobile: normalizedMobile,
        templateId,
        parameters,
      }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok) {
      return { success: true, messageId: data?.messageId || data?.MessageId };
    }
    return { success: false, error: data?.message || `HTTP ${res.status}` };
  } catch (err: any) {
    console.error("SMS send error:", err);
    return { success: false, error: err?.message || "Network error" };
  }
}

// Convenience functions
export async function sendOtp(mobile: string, code: string) {
  return sendSms(mobile, SMS_TEMPLATES.OTP, [
    { name: "VERIFICATIONCODE", value: code },
  ]);
}

export async function sendPhoneConfirm(mobile: string, name: string, time: string) {
  return sendSms(mobile, SMS_TEMPLATES.PHONE_CONFIRM, [
    { name: "NAME", value: name },
    { name: "TIME", value: time },
  ]);
}

export async function sendVideoConfirm(mobile: string, name: string, time: string) {
  return sendSms(mobile, SMS_TEMPLATES.VIDEO_CONFIRM, [
    { name: "NAME", value: name },
    { name: "TIME", value: time },
  ]);
}

export async function sendInPersonConfirm(mobile: string, name: string, time: string) {
  return sendSms(mobile, SMS_TEMPLATES.INPERSON_CONFIRM, [
    { name: "NAME", value: name },
    { name: "TIME", value: time },
  ]);
}

export async function sendDoctorVideoLink(mobile: string, name: string, time: string, code: string) {
  return sendSms(mobile, SMS_TEMPLATES.DOCTOR_VIDEO, [
    { name: "NAME", value: name },
    { name: "TIME", value: time },
    { name: "CODE", value: code },
  ]);
}

export async function sendPatientVideoLink(mobile: string, name: string, time: string, code: string) {
  return sendSms(mobile, SMS_TEMPLATES.PATIENT_VIDEO, [
    { name: "NAME", value: name },
    { name: "TIME", value: time },
    { name: "CODE", value: code },
  ]);
}

export async function sendPasswordRecovery(mobile: string, code: string) {
  return sendSms(mobile, SMS_TEMPLATES.PASSWORD_RECOVERY, [
    { name: "CODE", value: code },
  ]);
}
