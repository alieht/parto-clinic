# استقرار روی لیارا — راهنمای کامل

## چرا لیارا

| ملاک | وضعیت |
|------|-------|
| Node.js 20 (نه ۲۴) | ✅ مستندات رسمی تأیید می‌کند نسخه‌های ۲۰، ۲۲، ۲۴ موجودند |
| Cron هر ۱ دقیقه | ✅ بومی، بدون GitHub Actions |
| دیتابیس | همان Supabase می‌ماند — **مهاجرت داده لازم نیست** |
| پرداخت | ✅ کارت ایرانی، بدون مسئله تحریم |
| SSL و دامنه | ✅ خودکار |

---

## تغییراتی که برای لیارا لازم شد (انجام شده)

### ۱. `output: "standalone"` مشکل‌ساز بود
`next start` وقتی `output: "standalone"` باشد **بلافاصله با خطا خارج می‌شود**:

```
"next start" does not work with "output: standalone" configuration.
```

و لیارا برنامه را با `npm start` (یعنی `next start`) اجرا می‌کند. پس standalone را **اختیاری** کردم:

```ts
output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined
```

- لیارا → standalone خاموش، `next start` کار می‌کند ✅
- Docker → `ENV BUILD_STANDALONE=1` در `Dockerfile` → هنوز کار می‌کند ✅

تست شد: `npm start` روی پورت ۳۱۱۱ بالا آمد و صفحات سرو شدند.

### ۲. نسخه Node
`liara.json`:
```json
{ "next": { "nodeVersion": "20" } }
```

### ۳. آپلود فایل‌ها
Netlify فایل‌سیستم موقت دارد. لیارا **دیسک پایدار** می‌دهد. کد را طوری تغییر دادم که با `UPLOAD_DIR` کار کند و فایل‌ها از `/api/files/...` سرو شوند — بدون از دست رفتن عکس‌ها در هر deploy.

---

## قدم ۱ — ساخت برنامه در لیارا

1. وارد [کنسول لیارا](https://console.liara.ir) شوید
2. **Create PaaS** → پلتفرم **Next.js**
3. شناسه: `parto-clinic`
4. پلن: **زمین** (۰.۵۱۲GB RAM / ۰.۵ vCPU) — برای شروع کافی است
5. نسخه Node: **20** (از `liara.json` هم خوانده می‌شود)

---

## قدم ۲ — متغیرهای محیطی

بخش **متغیرها** → همه‌ی این‌ها را از Netlify کپی کنید:

```
DATABASE_URL
JWT_SECRET
VIDEO_LINK_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
SECRETARY_EMAIL
SECRETARY_PASSWORD
ADMIN_PHONE
SECRETARY_PHONE
SMSIR_API_KEY
CRON_SECRET
DOCTOR_PHONE
```

مخصوص لیارا:

```
UPLOAD_DIR = /data/uploads
```

> `DATABASE_URL` را **دست نزنید**. همان pooler Supabase می‌ماند. کد خودش پورت ۶۵۴۳ و `pgbouncer=true` را تنظیم می‌کند.

---

## قدم ۳ — دیسک برای آپلودها

1. **دیسک‌ها** → **ایجاد دیسک**
2. نام: `uploads`
3. اندازه: **۱ گیگابایت** کافی است
4. مسیر اتصال (mount): `/data`

پس `UPLOAD_DIR=/data/uploads`.

> اگر دیسک نسازید، سایت کار می‌کند ولی عکس‌های آپلودی با هر deploy پاک می‌شوند.

---

## قدم ۴ — استقرار

### روش الف: CLI
```bash
npm install -g @liara/cli
liara login
cd parto-clinic
liara deploy --platform nextjs
```

### روش ب: کنسول
**استقرار جدید** → تب **GitHub** → ریپوی `alieht/parto-clinic` را وصل کنید.

> ریپو عمومی است، پس دسترسی لازم نیست.

---

## قدم ۵ — تنظیم Cron

### روش الف: کنسول (توصیه‌شده)
**تنظیمات پلتفرم** → **Cron Job** → افزودن:

| فیلد | مقدار |
|------|-------|
| زمان‌بندی | `* * * * *` |
| دستور | `curl -fsS -m 55 "http://localhost:3000/api/cron/video-calls?secret=$CRON_SECRET"` |

### روش ب: CLI
در `liara.json`:
```json
{
  "next": { "nodeVersion": "20" },
  "cron": [
    {
      "schedule": "* * * * *",
      "command": "curl -fsS -m 55 \"http://localhost:3000/api/cron/video-calls?secret=$CRON_SECRET\""
    }
  ]
}
```

> اگر فرمت CLI خطا داد، از کنسول استفاده کنید — همان کار را می‌کند و مستندتر است.

**چرا هر دقیقه؟** چون پنجره ارسال لینک ۱۵ دقیقه است و رویداد idempotent است (`videoLinkSentAt`)، پس اجرای تکراری خطر پیامک دوباره ندارد.

---

## قدم ۶ — تست قبل از تغییر DNS

روی ساب‌دامین لیارا (مثل `parto-clinic.liara.run`):

```bash
# صفحه اصلی
curl -o /dev/null -w "%{http_code}\n" https://parto-clinic.liara.run/

# دیتابیس
curl https://parto-clinic.liara.run/api/health

# نسخه
curl https://parto-clinic.liara.run/api/version

# کرون
curl "https://parto-clinic.liara.run/api/cron/video-calls?secret=<CRON_SECRET>"
```

همه باید `200` بدهند. کرون باید `{"checked":0,...}` برگرداند.

**اگر `/api/health` داد `503`** → `DATABASE_URL` غلط است یا لیارا به Supabase دسترسی ندارد.

---

## قدم ۷ — اتصال دامنه

1. **دامنه** → **افزودن دامنه** → `parto.online`
2. لیارا یک رکورد DNS نشان می‌دهد (معمولاً `CNAME` یا `A`)
3. در پنل دامنه‌تان، رکوردهای فعلی Netlify را با مقادیر لیارا عوض کنید
4. صبر کنید تا SSL خودکار صادر شود (چند دقیقه)

> ⚠️ **DNS را فقط بعد از موفقیت قدم ۶ عوض کنید.** تا آن موقع Netlify فعال بماند.

---

## قدم ۸ — بعد از مهاجرت

- [ ] `parto.online` روی لیارا جواب می‌دهد
- [ ] ورود ادمین کار می‌کند
- [ ] یک نوبت تستی ثبت و پیامکش دریافت می‌شود
- [ ] کرون در لاگ لیارا دیده می‌شود
- [ ] در Netlify: سایت را **غیرفعال** کنید (نه حذف، تا چند روز بماند)
- [ ] `SETUP_TOKEN` را از متغیرها پاک کنید (کارش تمام شد)

---

## نکات مهم

### هزینه
پلن زمین ۷۵۰٬۰۰۰ تومان/ماه (ساعتی ۱٬۰۴۱ تومان). لیارا **پلن رایگان** هم برای شروع دارد — با آن تست کنید، اگر جواب داد ارتقا بدهید.

### اگر Node 20 اعمال نشد
در لاگ build نسخه Node را ببینید. اگر ۲۲ یا ۲۴ بود، در کنسول در **تنظیمات پلتفرم** نسخه را دستی روی 20 بگذارید.

### چرا این بار Prisma خطا نمی‌دهد
در پارس‌پک مشکل این بود که Node 24 باینری Prisma نداشت. اینجا:
1. نسخه Node قابل انتخاب است (۲۰)
2. کلاینت Prisma از قبل تولید و **در ریپو کامیت شده** (`src/generated/prisma`)، پس در build چیزی دانلود نمی‌شود
3. Prisma 7 با `@prisma/adapter-pg` از درایور `pg` استفاده می‌کند، نه engine باینری

### Supabase از ایران
اگر اتصال به `aws-1-eu-central-1.pooler.supabase.com` کند بود، می‌توانید دیتابیس را به **لیارا PostgreSQL** منتقل کنید (مهاجرت با `pg_dump`). فعلاً لازم نیست.
