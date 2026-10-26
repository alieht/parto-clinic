# استقرار روی پارس‌پک — قدم به قدم

## چه چیزی عوض شد که این بار کار می‌کند

خطای قبلی پارس‌پک این بود:

```
Prisma engines postinstall ECONNRESET — cannot download binaries
```

**علت واقعی:** این مشکل Node 24 نبود. پکیج `@prisma/engines` در مرحله `postinstall` تلاش می‌کند باینری‌های Prisma را از `binaries.prisma.sh` دانلود کند و این دامنه از ایران بسته/کند است → `ECONNRESET`.

**راه‌حل:** اصلاً به آن باینری‌ها نیازی نداریم:

1. کلاینت Prisma از قبل تولید و **در ریپو کامیت شده** (`src/generated/prisma`، ۱۷ فایل)
2. Prisma 7 با `@prisma/adapter-pg` از درایور معمولی `pg` استفاده می‌کند، نه موتور Rust

پس یک فایل `.npmrc` در ریشه پروژه اضافه شد:

```ini
ignore-scripts=true
```

**تست واقعی انجام شد:** کلون تازه از گیت‌هاب + `npm install` معمولی + `next build` → ✅ موفق، بدون هیچ باینری Prisma.

---

## قدم ۱ — ساخت اپلیکیشن

1. وارد پنل پارس‌پک → **PaaS** → **ایجاد اپلیکیشن**
2. مسیر: **استقرار از سورس کد** (نه Docker)
3. زبان/فریم‌ورک: **Next.js**
4. نام اپ: `parto-clinic`
5. منطقه: **ایران** (برای سرعت) یا اروپا
6. منبع کد: **GitHub** → ریپوی `alieht/parto-clinic` → برنچ `main`

> ریپو عمومی است، پس نیازی به توکن گیت‌هاب نیست.

---

## قدم ۲ — دستورات Build و Start

| فیلد | مقدار |
|------|-------|
| **Build command** | `npm install --no-audit --no-fund && npm run build` |
| **Start command** | `npm start` |
| **Port** | `3000` |
| **Node.js** | اگر انتخاب نسخه دیدید → **20** · اگر ندید، مشکلی نیست |

### چرا `npm start` درست کار می‌کند
`next.config.ts` را طوری تغییر دادم که `output: "standalone"` فقط وقتی فعال شود که `BUILD_STANDALONE=1` باشد. بدون آن، `next start` که پارس‌پک اجرا می‌کند بی‌مشکل بالا می‌آید (تست شد).

### اگر Node 24 بود هم اشکالی ندارد
`.npmrc` جلوی دانلود باینری را می‌گیرد، که علت اصلی خطا بود. Next.js 16 روی Node 24 اجرا می‌شود.

> اگر همچنان خطای `npm install` دیدید، به Build command این را اضافه کنید:
> `npm install --ignore-scripts --no-audit --no-fund && npm run build`

---

## قدم ۳ — متغیرهای محیطی

بخش **متغیرها / Environment** — این‌ها را از Netlify کپی کنید و این دو را هم اضافه کنید:

```
DATABASE_URL          ← از Netlify، دست نزنید
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

INPROCESS_CRON = 1
UPLOAD_DIR     = /data/uploads
```

### دو متغیر مهم

**`INPROCESS_CRON=1`** — پارس‌پک کرون‌جاب ندارد، پس خود اپلیکیشن هر دقیقه یادآورهای ویدیویی را اجرا می‌کند (فایل `instrumentation.ts`). تست شد: هر ۵ ثانیه tick می‌زد و هیچ‌وقت سرور را crash نمی‌کرد.

**`UPLOAD_DIR=/data/uploads`** — فقط اگر دیسک ساختید (قدم ۴). اگر نساختید، این خط را نگذارید.

---

## قدم ۴ — دیسک برای آپلودها (اختیاری ولی توصیه‌شده)

1. در تنظیمات اپ → **دیسک‌ها** → **ایجاد دیسک**
2. نام: `uploads` · اندازه: **۱ گیگابایت**
3. مسیر اتصال (mount): `/data`

بدون دیسک، سایت کار می‌کند اما عکس‌های آپلودی با هر deploy جدید پاک می‌شوند.

---

## قدم ۵ — استقرار

دکمه **Deploy / ایجاد** را بزنید. اولین build حدود ۳ تا ۵ دقیقه طول می‌کشد.

بعد از پایان، پارس‌پک یک آدرس مثل `parto-clinic.parspack.net` می‌دهد. **قبل از دامنه، این را تست کنید.**

---

## قدم ۶ — تست (قبل از دامنه!)

```bash
# ۱) سایت بالا آمده؟
curl -o /dev/null -w "%{http_code}\n" https://<آدرس-پارس‌پک>/

# ۲) دیتابیس وصل است؟  ← مهم‌ترین تست
curl https://<آدرس-پارس‌پک>/api/health

# ۳) کد جدید deploy شده؟
curl https://<آدرس-پارس‌پک>/api/version

# ۴) کرون درون‌برنامه‌ای
curl "https://<آدرس-پارس‌پک>/api/cron/video-calls?secret=<CRON_SECRET>"
```

انتظار:
- `/` → `200`
- `/api/health` → `200` و `{"status":"ok",...}`
- `/api/cron/video-calls` → `200` و `{"checked":0,"notified":0,...}`

### اگر `/api/health` داد `503`
یعنی به دیتابیس نمی‌رسد. دو احتمال:
1. `DATABASE_URL` غلط کپی شده
2. سرور پارس‌پک به `aws-1-eu-central-1.pooler.supabase.com:6543` دسترسی ندارد

در این حالت در **لاگ اپ** دنبال `P1001` یا `DatabaseNotReachable` بگردید. راه‌حل: دیتابیس را به PostgreSQL خود پارس‌پک منتقل کنیم (با `pg_dump` — بگویید تا انجام دهیم).

---

## قدم ۷ — ورود به پنل ادمین

```
https://<آدرس-پارس‌پک>/admin/login
```

- ایمیل: `mehrishakerinasab@yahoo.com`
- رمز: همان `ADMIN_PASSWORD` که در پارس‌پک گذاشتید

> ⚠️ اگر `ADMIN_PASSWORD` را عوض کردید، رمز فعلی هم عوض می‌شود. یا همان قبلی را بگذارید، یا بعد از deploy یک بار `/api/setup` را اجرا کنید.

---

## قدم ۸ — اتصال دامنه parto.online

1. در پارس‌پک: **دامنه‌ها** → **افزودن دامنه** → `parto.online`
2. پارس‌پک رکورد DNS نشان می‌دهد (معمولاً `A` به IP یا `CNAME`)
3. در پنل دامنه‌تان (جایی که `parto.online` را خریده‌اید) رکوردهای Netlify را با مقادیر پارس‌پک عوض کنید
4. SSL خودکار صادر می‌شود (تا ۳۰ دقیقه)

> ⚠️ **DNS را فقط بعد از موفقیت قدم ۶ عوض کنید.** تا آن موقع Netlify زنده بماند.

---

## قدم ۹ — تست نهایی زنجیره کامل

1. در سایت یک نوبت **ویزیت تصویری** برای ۲۰ دقیقه بعد ثبت کنید
2. پیامک تایید باید فوراً بیاید
3. در پنل ادمین → نوبت‌ها → نوبت را **تأیید** کنید
4. تا ۱۵ دقیقه قبل از نوبت، پیامک لینک باید بیاید (خودکار، توسط `INPROCESS_CRON`)
5. روی لینک بزنید → باید صفحه انتظار و بعد اتاق Jitsi باز شود

اگر لینک نیامد، در **لاگ اپ** دنبال خط `[cron]` بگردید:
```
[cron] in-process video reminders enabled (every 60s)
[cron] sent 1 video link(s): cm...
```

---

## بعد از موفقیت

- [ ] `parto.online` روی پارس‌پک جواب می‌دهد
- [ ] ورود ادمین کار می‌کند
- [ ] یک نوبت تستی کامل انجام شد
- [ ] در Netlify سایت را **غیرفعال** کنید (حذف نکنید، چند روز بماند)
- [ ] `SETUP_TOKEN` را پاک کنید — کارش تمام شد

---

## اگر جایی گیر کرد

| خطا | علت | راه‌حل |
|-----|-----|-------|
| `ECONNRESET` هنگام نصب | `.npmrc` خوانده نشده | Build command را به `npm install --ignore-scripts ...` تغییر دهید |
| `Cannot find module 'next'` | نصب ناقص | یک‌بار Redeploy بزنید |
| `next start` خطا می‌دهد | `BUILD_STANDALONE` ست شده | آن متغیر را حذف کنید |
| `/api/health` = 503 | دیتابیس در دسترس نیست | لاگ را ببینید؛ احتمالاً باید به PostgreSQL پارس‌پک مهاجرت کنیم |
| لینک ویدیو نمی‌آید | `INPROCESS_CRON` ست نشده | آن را `1` کنید و Redeploy |
| پیامک نمی‌آید | `SMSIR_API_KEY` یا `DOCTOR_PHONE` غلط | لاگ را ببینید؛ اعتبار پنل را چک کنید |
