"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Phone,
  Video,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Upload,
  X,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";

const TIME_SLOTS = [
  "۰۸:۰۰", "۰۸:۳۰", "۰۹:۰۰", "۰۹:۳۰", "۱۰:۰۰", "۱۰:۳۰",
  "۱۱:۰۰", "۱۱:۳۰", "۱۲:۰۰", "۱۴:۰۰", "۱۴:۳۰", "۱۵:۰۰",
  "۱۵:۳۰", "۱۶:۰۰", "۱۶:۳۰", "۱۷:۰۰", "۱۷:۳۰", "۱۸:۰۰",
];

const METHODS = [
  { id: "phone", label: "تماس تلفنی", desc: "در زمان نوبت، مشاوره تلفنی با شما انجام می‌شود", icon: Phone },
  { id: "video", label: "تماس تصویری", desc: "ویزیت آنلاین تصویری از طریق لینک اختصاصی", icon: Video },
  { id: "inperson", label: "مراجعه حضوری", desc: "حضور در کلینیک برای معاینه و درمان", icon: MapPin },
];

function toPersianDigits(s: string) {
  return s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
}

export default function BookingPage() {
  const [step, setStep] = React.useState(1);
  const [method, setMethod] = React.useState("inperson");
  const [currentMonth, setCurrentMonth] = React.useState<Date | null>(null);
  React.useEffect(() => { setCurrentMonth(new Date()); }, []);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [services, setServices] = React.useState<any[]>([]);
  React.useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
  }, []);
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    notes: "",
  });
  const [files, setFiles] = React.useState<File[]>([]);
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = React.useState<any>(null);

  // Build calendar
  if (!currentMonth) return <div className="container mx-auto px-4 py-20 text-center">در حال بارگذاری...</div>;
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay(); // 0=Sun
  // Convert to Persian week (Saturday=0). JS getDay: 0=Sun. We want Sat=0.
  // Saturday is 6 in JS. So offset = (startWeekday + 1) % 7
  const offset = (startWeekday + 1) % 7;
  const daysInMonth = lastDay.getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
  ];
  // Use Gregorian month names in Persian? The original used "مهر ۱۴۰۵". Let's use Persian calendar-ish labels but Gregorian dates.
  // Simpler: use Gregorian month name in Persian transliteration.
  const gregMonthNames = [
    "ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن",
    "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    if (!selectedDate || !selectedTime) return;
    setStatus("loading");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("serviceType", form.service);
      formData.append("method", method);
      formData.append("date", selectedDate);
      formData.append("time", selectedTime);
      formData.append("notes", form.notes);
      files.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/appointments", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const canProceedStep2 = !!selectedDate && !!selectedTime;
  const canProceedStep3 = form.name.trim() && form.phone.trim();

  if (status === "success") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
        <div className="rounded-3xl bg-card border border-border p-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-black mb-2">نوبت شما با موفقیت ثبت شد!</h2>
          <p className="text-muted-foreground mb-6">
            اطلاعات نوبت شما ثبت شد. در صورت نیاز به راهنمایی، مستقیم تماس بگیرید.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:06152835992">
              <Button>تماس با کلینیک</Button>
            </a>
            <a href="https://wa.me/989991561688">
              <Button variant="outline">پیام در واتساپ</Button>
            </a>
          </div>
          <button
            onClick={() => { setStatus("idle"); setStep(1); setSelectedDate(null); setSelectedTime(null); }}
            className="mt-6 text-primary font-medium"
          >
            ثبت نوبت جدید
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <nav className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="mx-2">←</span>
        <span>رزرو نوبت</span>
      </nav>

      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          رزرو نوبت آنلاین
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mb-2">
          روش رزرو را انتخاب کنید
        </h1>
        <p className="text-muted-foreground">
          سپس روز و ساعت دلخواه خود را از تقویم برگزینید
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= s ? "gradient-bg text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-1 rounded ${step > s ? "gradient-bg" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Method */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold mb-6 text-center">گام ۱ — روش رزرو را انتخاب کنید</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-6 rounded-2xl border-2 text-center transition-all ${
                  method === m.id
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                  method === m.id ? "gradient-bg text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <m.icon className="h-6 w-6" />
                </div>
                <div className="font-bold mb-1">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button onClick={() => setStep(2)} icon={<ChevronLeft className="h-4 w-4" />}>
              ادامه
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold mb-6 text-center">گام ۲ — روز و ساعت را انتخاب کنید</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                  className="p-2 rounded-lg hover:bg-muted"
                  aria-label="ماه قبل"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="font-bold">
                  {gregMonthNames[month]} {toPersianDigits(String(year))}
                </div>
                <button
                  onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                  className="p-2 rounded-lg hover:bg-muted"
                  aria-label="ماه بعد"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
                {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (
                  <div key={d} className="py-1 font-medium">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: offset }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dateObj = new Date(year, month, day);
                  const isPast = dateObj < today;
                  const isFriday = dateObj.getDay() === 5; // Friday closed
                  const disabled = isPast || isFriday;
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={day}
                      disabled={disabled}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        disabled
                          ? "text-muted-foreground/40 cursor-not-allowed"
                          : isSelected
                          ? "gradient-bg text-white shadow-md"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {toPersianDigits(String(day))}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-muted inline-block" /> جمعه تعطیل
              </div>
            </div>

            {/* Time slots */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                ساعت‌های خالی
              </h3>
              {selectedDate ? (
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === t
                          ? "gradient-bg text-white shadow-md"
                          : "bg-muted hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  ابتدا یک روز را انتخاب کنید
                </div>
              )}
              {selectedDate && selectedTime && (
                <div className="mt-4 p-3 rounded-xl bg-primary/5 text-sm">
                  <div className="font-medium">انتخاب شما:</div>
                  <div className="text-muted-foreground">
                    {selectedDate} — {selectedTime}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(1)} icon={<ChevronRight className="h-4 w-4" />}>
              قبلی
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canProceedStep2} icon={<ChevronLeft className="h-4 w-4" />}>
              ادامه
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Form */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold mb-6 text-center">گام ۳ — تکمیل اطلاعات</h2>
          <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="نام و نام خانوادگی *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="شماره تماس *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                dir="ltr"
                required
              />
            </div>
            <Input
              label="ایمیل (اختیاری)"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              dir="ltr"
            />
            <Select
              label="نوع خدمت"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            >
              <option value="">انتخاب کنید...</option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
              <option value="سایر موارد">سایر موارد</option>
            </Select>

            {/* File upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                مدارک پزشکی (اختیاری ولی توصیه‌شده)
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    عکس رادیولوژی، MRI یا آزمایش را بارگذاری کنید
                  </span>
                  <span className="text-xs text-muted-foreground">
                    تا ۵ فایل، هر فایل حداکثر ۱۰ مگابایت
                  </span>
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2 text-sm">
                      <span className="truncate">{f.name}</span>
                      <button onClick={() => removeFile(i)} className="text-danger">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Textarea
              label="توضیحات (اختیاری)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="bg-muted/50 rounded-xl p-4 text-sm">
              <div className="font-medium mb-1">خلاصه نوبت:</div>
              <div className="text-muted-foreground">
                روش: {METHODS.find((m) => m.id === method)?.label} | تاریخ: {selectedDate} | ساعت: {selectedTime}
              </div>
              <div className="text-muted-foreground mt-1">
                💳 هزینه ویزیت: پس از ارزیابی مشخص می‌شود
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(2)} icon={<ChevronRight className="h-4 w-4" />}>
                قبلی
              </Button>
              <Button onClick={submit} disabled={!canProceedStep3 || status === "loading"} loading={status === "loading"}>
                تأیید و ثبت نهایی نوبت
              </Button>
            </div>
            {status === "error" && (
              <p className="text-danger text-sm text-center">خطا در ثبت نوبت. لطفاً دوباره تلاش کنید.</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
