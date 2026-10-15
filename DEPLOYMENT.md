# راهنمای لانچ (Deployment Guide)

## گزینه ۱: Pars Pack PaaS (توصیه شده برای ایران)

### پیش‌نیازها
- ریپازیتوری GitHub: https://github.com/alieht/parto-clinic
- سرویس PaaS Next.js در پارس‌پک
- سرویس PostgreSQL مدیریت‌شده در پارس‌پک (برای پایداری داده‌ها)

### مراحل در پنل پارس‌پک

1. **ساخت اپ Next.js**
   - در پنل پارس‌پک → ایجاد سرویس جدید → نوع: Next.js
   - اتصال به Git: مخزن `alieht/parto-clinic`، برنچ `main`

2. **ساخت دیتابیس PostgreSQL**
   - در پنل پارس‌پک → ایجاد سرویس PostgreSQL (مدیریت‌شده)
   - نام DB: `parto`، کاربر: `parto`
   - کپی کردن `DATABASE_URL` (فرمت: `postgresql://user:pass@host:5432/parto?schema=public`)

3. **تنظیم متغیرهای محیطی** (در تنظیمات اپ):
   - `DATABASE_URL` = (از مرحله ۲)
   - `JWT_SECRET` = یک رشته تصادفی حداقل ۳۲ کاراکتری (مثلاً `openssl rand -base64 32`)
   - `ADMIN_PASSWORD` = رمز قوی برای ادمین (پیش‌فرض `admin123` — حتماً تغییر دهید)
   - `NODE_ENV` = `production`

4. **دستورات Build/Start** (در پنل پارس‌پک):
   - Build: `npm ci && npx prisma migrate deploy && npm run build`
   - Start: `npm start`
   > نکته: `prisma generate` به صورت خودکار در `postinstall` و `build` اجرا می‌شود.

5. **اجرای Seed** (یک‌بار، از طریق console/SSH پارس‌پک):
   ```bash
   ADMIN_PASSWORD=xxx npx tsx prisma/seed.ts
   ```
   این دستور ادمین، ۸ خدمت، ۶ مقاله، نظرات و تنظیمات را ایجاد می‌کند.

6. **فایل‌های آپلود شده**: پارس‌پک volume پایدار را به مسیر `/app/public/uploads` mount کنید تا تصاویر آپلود شده پاک نشوند.

7. **اتصال دامنه**: در پنل پارس‌پک، دامنه `parto.online` را به سرویس متصل کنید.

8. **SSL**: پارس‌پک SSL رایگان ارائه می‌دهد — فعال کنید.

9. **بررسی سلامت**: پس از لانچ، `https://parto.online/api/health` باید `{"status":"ok"}` برگرداند.

### نکات مهم
- Build قبل از migrate deploy اجرا نشود؛ ترتیب بالا را رعایت کنید.
- اگر کانتینر ephemeral است، بدون volume پایدار، فایل‌های آپلود پاک می‌شوند.
- برای بکاپ دیتابیس، از بکاپ خودکار PostgreSQL پارس‌پک استفاده کنید.

## گزینه ۲: سرور اختصاصی (VPS) با Docker

```bash
# روی سرور
git clone https://github.com/alieht/parto-clinic.git
cd parto-clinic
cp .env.example .env
# ویرایش .env (DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD)
docker compose up -d --build
# seed یک‌بار:
docker compose exec app npx tsx prisma/seed.ts
```

یا بدون Docker:
```bash
git clone https://github.com/alieht/parto-clinic.git
cd parto-clinic
npm ci
npx prisma migrate deploy
ADMIN_PASSWORD=xxx npx tsx prisma/seed.ts
npm run build
pm2 start npm --name "parto" -- start
```

## گزینه ۳: Vercel
- Vercel serverless → نیاز به PostgreSQL خارجی (Neon/Supabase) و Vercel Blob (فایل‌ها)
- Deploy با یک کلیک از GitHub

## چک‌لیست قبل از لانچ
- [ ] تغییر رمز ادمین (ADMIN_PASSWORD)
- [ ] تنظیم JWT_SECRET قوی
- [ ] اجرای migration روی دیتابیس production
- [ ] اجرای seed
- [ ] اتصال دامنه parto.online
- [ ] فعال‌سازی SSL
- [ ] تست /api/health
- [ ] تست تمام صفحات
- [ ] تست فلوی رزرو نوبت
- [ ] تست پنل مدیر
- [ ] تست روی موبایل
- [ ] Revoke توکن GitHub استفاده‌شده برای پوش
