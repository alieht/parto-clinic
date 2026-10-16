# راهنمای لانچ (Deployment Guide)

## گزینه ۱: VPS + Docker (توصیه شده — کنترل کامل، IP ایران)

### پیش‌نیازها
- یک VPS (پارس‌پک، ایران‌سرور، یا Hetzner برای اروپا) با Ubuntu 22.04/24.04
- دامنه `parto.online` (DNS به IP سرور اشاره کند)
- دسترسی SSH به سرور

### مرحله ۱: نصب Docker روی VPS
```bash
# روی سرور (SSH)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# logout/login یا: newgrp docker
docker --version
docker compose version
```

### مرحله ۲: کلون پروژه
```bash
cd /opt
sudo git clone https://github.com/alieht/parto-clinic.git
sudo chown -R $USER:$USER parto-clinic
cd parto-clinic
```

### مرحله ۳: تنظیم متغیرهای محیطی
```bash
cp .env.example .env
nano .env   # یا vim .env
```
مقادیر را پر کنید:
```env
DB_PASSWORD=یک_رمز_قوی_برای_دیتابیس
JWT_SECRET=رشته_تصادفی_۳۲_کاراکتری
ADMIN_PASSWORD=رمز_مدیر
SECRETARY_PASSWORD=رمز_منشی
SETUP_TOKEN=یک_رشته_تصادفی_برای_setup
NODE_ENV=production
```
همچنین `Caddyfile` را ویرایش کنید و دامنه را تنظیم کنید (پیش‌فرض: `parto.online`).

### مرحله ۴: اجرای Docker Compose
```bash
docker compose up -d --build
```
این دستور:
- PostgreSQL را بالا می‌آورد (با volume پایدار)
- اپ Next.js را build و اجرا می‌کند
- Caddy را بالا می‌آورد (SSL خودکار برای دامنه)

### مرحله ۵: بررسی لاگ‌ها
```bash
docker compose logs -f app
```
باید `Ready on http://0.0.0.0:3000` یا مشابه ببینید.

### مرحله ۶: راه‌اندازی دیتابیس (یک‌بار)
پس از اینکه سایت بالا آمد (`https://parto.online`):
```bash
curl -X POST "https://parto.online/api/setup?token=YOUR_SETUP_TOKEN"
```
پاسخ باید `{"success": true, "log": [...]}` باشد.

### مرحله ۷: پس از موفقیت
- `SETUP_TOKEN` را از `.env` حذف کنید
- `docker compose restart app`
- (اختیاری) endpoint `/api/setup` را از کد حذف کنید

### بکاپ و نگهداری
```bash
# بکاپ دیتابیس
docker compose exec db pg_dump -U parto parto > backup_$(date +%F).sql

# بکاپ فایل‌های آپلود
tar czf uploads_$(date +%F).tar.gz /var/lib/docker/volumes/parto-clinic_uploads/_data

# بروزرسانی کد
cd /opt/parto-clinic
git pull
docker compose up -d --build
```

### عیب‌یابی
- **سایت بالا نمی‌آید:** `docker compose logs app` را چک کنید
- **SSL کار نمی‌کند:** DNS دامنه باید به IP سرور اشاره کند (A record). Caddy به صورت خودکار SSL می‌گیرد.
- **دیتابیس خطا می‌دهد:** `docker compose logs db` را چک کنید
- **پورت ۸۰/۴۴۳ بسته است:** فایروال را باز کنید:
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 22/tcp
  sudo ufw enable
  ```

---

## گزینه ۲: Pars Pack PaaS (در صورت تمایل)

پارس‌پک PaaS مشکلاتی با build environment دارد (mirror npm، اجرای prisma CLI). اگر می‌خواهید امتحان کنید:
- ریپو باید **Public** باشد
- متغیرهای محیطی را در Config/Secret ست کنید
- Build خودکار `npm install && npm run build` را اجرا می‌کند
- پس از deploy، `/api/setup` را یک‌بار فراخوانی کنید

---

## گزینه ۳: Vercel (در صورت دسترسی)

- Auto-deploy از GitHub
- Supabase برای DB
- Free tier کافی است
- محدودیت: نیاز به احراز هویت (از ایران ممکن است مشکل‌ساز باشد)

---

## چک‌لیست قبل از لانچ
- [ ] VPS تهیه شده و Docker نصب شده
- [ ] DNS دامنه `parto.online` به IP سرور اشاره می‌کند
- [ ] فایل `.env` پر شده
- [ ] `Caddyfile` دامنه صحیح را دارد
- [ ] `docker compose up -d --build` موفق بود
- [ ] `https://parto.online` کار می‌کند
- [ ] `/api/setup` یک‌بار اجرا شده
- [ ] `SETUP_TOKEN` حذف شده
- [ ] تست ورود ادمین (`admin@parto.online`)
- [ ] تست ورود منشی (`secretary@parto.online`)
- [ ] تست رزرو نوبت
- [ ] تست روی موبایل
