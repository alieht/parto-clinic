# راهنمای لانچ (Deployment Guide)

## گزینه ۱: Pars Pack PaaS (توصیه شده برای ایران)

### مراحل:
1. **خرید سرویس PaaS Next.js** از پارس‌پک (parspack.com/paas/nextjs)
2. **اتصال به Git**: در پنل پارس‌پک، مخزن Git پروژه را متصل کنید
3. **تنظیم متغیرهای محیطی** در پنل:
   - `DATABASE_URL` = `file:./prod.db`
   - `JWT_SECRET` = یک رشته تصادفی ۳۲ کاراکتری
   - `ADMIN_PASSWORD` = رمز قوی برای ادمین
   - `NODE_ENV` = `production`
4. **دستورات Build/Start** (در پنل پارس‌پک تنظیم کنید):
   - Build: `npm run build && npx prisma migrate deploy`
   - Start: `npm start`
5. **اجرای Seed** (یک‌بار، از طریق console یا SSH):
   ```bash
   ADMIN_PASSWORD=xxx npx tsx prisma/seed.ts
   ```
6. **اتصال دامنه**: در پنل پارس‌پک، دامنه `parto.online` را به سرویس متصل کنید
7. **SSL**: پارس‌پک SSL رایگان ارائه می‌دهد — فعال کنید

### نکات مهم:
- اگر کانتینر ephemeral است، SQLite و فایل‌های آپلود شده پاک می‌شوند → از **PostgreSQL مدیریت‌شده** پارس‌پک استفاده کنید
- برای فایل‌های آپلود، از **Object Storage** پارس‌پک یا Cloudinary استفاده کنید

## گزینه ۲: سرور اختصاصی (VPS)

### مراحل:
1. خرید VPS (پارس‌پک، ایران‌سرور، یا Hetzner برای اروپا)
2. نصب Node.js 20 + PM2
3. کلون پروژه + npm install + build
4. تنظیم Nginx به عنوان reverse proxy
5. تنظیم SSL با Let's Encrypt (certbot)
6. PM2 برای keep-alive

```bash
# روی سرور
git clone <repo>
cd parto-clinic
npm ci
npx prisma migrate deploy
ADMIN_PASSWORD=xxx npx tsx prisma/seed.ts
npm run build
pm2 start npm --name "parto" -- start
```

## گزینه ۳: Vercel (سریع‌ترین، اما نیاز به تغییرات)

- Vercel serverless است → SQLite کار نمی‌کند
- نیاز به: PostgreSQL (Vercel Postgres / Neon) + Vercel Blob (برای فایل‌ها)
- Deploy با یک کلیک از GitHub

## توصیه
برای کلینیک پرتو در بهبهان:
- **پارس‌پک PaaS Next.js** (لوکیشن ایران، پشتیبانی فارسی، پرداخت ریالی)
- **PostgreSQL مدیریت‌شده** پارس‌پک (برای پایداری داده‌ها)
- **Object Storage** پارس‌پک (برای فایل‌های آپلود شده)

## چک‌لیست قبل از لانچ
- [ ] تغییر رمز ادمین
- [ ] تنظیم JWT_SECRET قوی
- [ ] اجرای migration روی دیتابیس production
- [ ] اجرای seed
- [ ] اتصال دامنه parto.online
- [ ] فعال‌سازی SSL
- [ ] تست تمام صفحات
- [ ] تست فلوی رزرو نوبت
- [ ] تست پنل مدیر
- [ ] تست روی موبایل
