# راهنمای لانچ (Deployment Guide)

## گزینه ۱: Render.com (رایگان، بدون کارت، Auto-deploy از GitHub)

### پیش‌نیازها
- حساب GitHub (ریپو `alieht/parto-clinic`)
- حساب Render.com (ثبت‌نام با GitHub)
- Supabase برای دیتابیس (رایگان)

### مرحله ۱: ساخت دیتابیس در Supabase
1. به https://supabase.com بروید → New Project
2. نام: `parto-clinic`، رمز DB را ذخیره کنید
3. Region: نزدیک‌ترین به ایران (Frankfurt)
4. Plan: Free
5. Settings → Database → Connection string (URI) را کپی کنید
6. انتهای URL: `?schema=public` اضافه کنید

### مرحله ۲: Deploy در Render
1. به https://dashboard.render.com بروید → **New +** → **Web Service**
2. **Connect GitHub** → ریپو `alieht/parto-clinic` را انتخاب کنید
3. تنظیمات:
   - **Name:** `parto-clinic`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. **Environment Variables** را اضافه کنید:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | connection string Supabase |
   | `JWT_SECRET` | رشته تصادفی ۳۲+ کاراکتر |
   | `ADMIN_EMAIL` | `admin@parto.online` |
   | `ADMIN_PASSWORD` | رمز قوی مدیر |
   | `SECRETARY_EMAIL` | `secretary@parto.online` |
   | `SECRETARY_PASSWORD` | رمز قوی منشی |
   | `SETUP_TOKEN` | یک رشته تصادفی |
   | `NODE_ENV` | `production` |
5. **Create Web Service** → Render به صورت خودکار build و deploy می‌کند

### مرحله ۳: راه‌اندازی دیتابیس (یک‌بار)
پس از deploy موفق (`https://parto-clinic.onrender.com` یا دامنه شما):
```bash
curl -X POST "https://YOUR-URL/api/setup?token=YOUR_SETUP_TOKEN"
```

### مرحله ۴: دامنه سفارشی (اختیاری)
- در Render → Service → **Settings** → **Custom Domains**
- دامنه `parto.online` را اضافه کنید
- DNS: A record یا CNAME به Render

### محدودیت Free Tier
- **Cold start:** بعد از ۱۵ دقیقه بدون ترافیک، سرور می‌خوابد؛ اولین درخواست ۳۰-۶۰ ثانیه طول می‌کشد
- **750 ساعت/ماه** رایگان (کافی برای یک سرویس ۲۴/۷)
- برای رفع cold start: پلن Starter ($7/ماه) یا استفاده از یک cron job برای ping

### Auto-Deploy
- هر push به `main` به صورت خودکار deploy می‌شود
- در Render → Service → **Settings** → Auto-Deploy: فعال

---

## گزینه ۲: VPS + Docker (کنترل کامل، IP ایران)

(راهنمای کامل در نسخه قبلی موجود است — `Dockerfile`, `docker-compose.yml`, `Caddyfile` آماده‌اند)

### خلاصه
```bash
curl -fsSL https://get.docker.com | sh
cd /opt && git clone https://github.com/alieht/parto-clinic.git && cd parto-clinic
cp .env.example .env && nano .env
docker compose up -d --build
curl -X POST "https://parto.online/api/setup?token=YOUR_SETUP_TOKEN"
```

---

## گزینه ۳: Pars Pack PaaS (در صورت تمایل)

پارس‌پک PaaS مشکلاتی با build environment دارد. اگر می‌خواهید امتحان کنید:
- ریپو باید **Public** باشد
- متغیرهای محیطی را در Config/Secret ست کنید
- پس از deploy، `/api/setup` را یک‌بار فراخوانی کنید

---

## چک‌لیست قبل از لانچ
- [ ] Supabase پروژه ساخته شده و `DATABASE_URL` کپی شده
- [ ] Render Web Service ساخته شده (یا VPS آماده)
- [ ] متغیرهای محیطی ست شده
- [ ] Build موفق بود
- [ ] `/api/setup` یک‌بار اجرا شده
- [ ] `SETUP_TOKEN` حذف شده
- [ ] تست ورود ادمین (`admin@parto.online`)
- [ ] تست ورود منشی (`secretary@parto.online`)
- [ ] تست رزرو نوبت
- [ ] تست روی موبایل
