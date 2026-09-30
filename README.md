# Portfolio

Barebones minimalist personal portfolio website.

## Features
- Theme background: `#002B36` (Solarized Dark)
- Upward cycling alias animation (updates every 10 seconds)
- Minimalist typography and layout (zero emoji)
- Live Ko-fi donation tracker & quick support button (`ko-fi.com/vaporwave`)
- Vercel Serverless Functions (`/api/funds` and `/api/kofi-webhook`)
- Ready for immediate static and serverless deployment on Vercel

## Ko-fi Live Funds Tracker Setup

### 1. Ko-fi Webhook Configuration
1. Go to your [Ko-fi Webhooks Settings](https://ko-fi.com/manage/webhooks).
2. Set the **Webhook URL** to `https://your-portfolio-domain.vercel.app/api/kofi-webhook`.
3. Copy your **Verification Token**.

### 2. Vercel Environment Variables
Add the following in your Vercel Project Settings (`Settings` -> `Environment Variables`):

| Variable | Description | Default |
|---|---|---|
| `KOFI_VERIFICATION_TOKEN` | Verification token from your Ko-fi webhook settings | Required |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL (free key-value store) | Optional (local fallback) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API Token | Optional (local fallback) |
| `GOAL_AMOUNT` | Your funding target amount (e.g. `100`) | `100` |
| `CURRENCY_SYMBOL` | Currency symbol displayed in UI | `$` |

