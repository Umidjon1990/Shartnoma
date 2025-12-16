# Zamonaviy Ta'lim - Online Shartnoma Tizimi

O'quv markazi uchun onlayn shartnoma tizimi.

## Railway orqali deploy qilish

### 1. GitHub Repository yaratish

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Railway-da yangi loyiha yaratish

1. [Railway.app](https://railway.app) saytiga kiring
2. "New Project" tugmasini bosing
3. "Deploy from GitHub repo" tanlang
4. Repositoriyangizni tanlang

### 3. PostgreSQL qo'shish

1. Railway dashboardda "New" tugmasini bosing
2. "Database" > "PostgreSQL" tanlang
3. Database avtomatik ravishda ulanadi

### 4. Environment Variables sozlash

Railway dashboardda "Variables" bo'limiga o'ting va quyidagilarni qo'shing:

| Variable | Qiymat |
|----------|--------|
| `DATABASE_URL` | *(PostgreSQL qo'shganda avtomatik o'rnatiladi)* |
| `TELEGRAM_BOT_TOKEN` | Telegram bot tokeningiz (ixtiyoriy) |
| `TELEGRAM_CHAT_ID` | Telegram chat ID (ixtiyoriy) |

### 5. Deploy

Railway avtomatik ravishda build va deploy qiladi.

## Lokal ishga tushirish

```bash
npm install
npm run db:push
npm run dev
```

## Texnologiyalar

- React + TypeScript
- Express.js
- PostgreSQL + Drizzle ORM
- Puppeteer (PDF generatsiya)
- Tailwind CSS
