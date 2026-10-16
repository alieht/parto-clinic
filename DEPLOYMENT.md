# راهنمای لانچ (Deployment Guide)

## گزینه ۱: Netlify (رایگان، بدون کارت، Auto-deploy از GitHub)

### پیش‌نیازها
- حساب GitHub (ریپو `alieht/parto-clinic`)
- حساب Netlify (ثبت‌نام با GitHub)
- Supabase برای دیتابیس (رایگان)

### مرحله ۱: ساخت دیتابیس در Supabase
1. به https://supabase.com بروید → **New Project**
2. نام: `parto-clinic`، رمز DB را ذخیره کنید
3. Region: **Frankfurt** (نزدیک‌ترین به ایران)
4. Plan: **Free**
5. Settings → Database → **Connection string (URI)** را کپی کنید
6. انتهای URL: `?schema=public` اضافه کنید

### مرحله ۲: Deploy در Netlify
1. به https://app.netlify.com بروید → **Add new site** → **Import an existing project**
2. **Connect to Git provider** → GitHub → ریپو `alieht/parto-clinic` را انتخاب کنید
3. تنظیمات (Netlify به صورت خودکار از `netlify.toml` می‌خواند):
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `.next`
4. **Environment Variables** را اضافه کنید (Site settings → Environment variables):
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
5. **Deploy site** → Netlify به صورت خودکار build و deploy می‌کند

### مرحله ۳: راه‌اندازی دیتابیس (یک‌بار)
پس از deploy موفق (`https://parto-clinic.netlify.app` یا دامنه شما):
```bash
curl -X POST "https://YOUR-URL/api/setup?token=YOUR_SETUP_TOKEN"
```

### مرحله ۴: دامنه سفارشی (اختیاری)
- Netlify → Site settings → **Domain management** → **Add custom domain**
- دامنه `parto.online` را اضافه کنید
- DNS: CNAME یا A record به Netlify

### محدودیت Free Tier
- **100GB bandwidth/ماه** (کافی برای کلینیک)
- **300 build minutes/ماه** (کافی)
- **بدون cold start** (برخلاف Render)
- Serverless functions: 125K invocations/ماه (کافی)

### Auto-Deploy
- هر push به `main` به صورت خودکار deploy می‌شود
- Netlify → Site settings → **Build & deploy** → Auto-publish: فعال

---

## گزینه ۲: VPS + Docker (کنترل کامل، IP ایران)

(راهنمای کامل در DEPLOYMENT.md قبلی موجود است — `Dockerfile`, `docker-compose.yml`, `Caddyfile` آماده‌اند)

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
- [ ] Netlify Site ساخته شده (یا VPS آماده)
- [ ] متغیرهای محیطی ست شده
- [ ] Build موفق بود
- [ ] `/api/setup` یک‌بار اجرا شده
- [ ] `SETUP_TOKEN` حذف شده
- [ ] تست ورود ادمین (`admin@parto.online`)
- [ ] تست ورود منشی (`secretary@parto.online`)
- [ ] تست رزرو نوبت
- [ ] تست روی موبایل
