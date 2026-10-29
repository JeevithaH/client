# AVIVEKY — E-Commerce Platform

A full-stack Next.js 14 e-commerce store for AVIVEKY apparel brand.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Auth**: Clerk
- **Database**: Cloudflare D1 (SQLite at the edge)
- **Storage**: Cloudflare R2 (image uploads)
- **Payments**: Razorpay
- **Deployment**: Cloudflare Workers / Tunnel

## Features

- Product catalog with size & color variants
- Per-size stock management
- Cart, Checkout & Order tracking
- WhatsApp order confirmation
- Admin panel (`/nirvignastudio`) — products, orders, inventory, coupons, hero slides, marquee, announcements
- Interactive 3D clothing rack with hover rotation and mobile circular orbit
- Cloudflare D1 database with R2 image storage

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.local.example` and fill in your keys:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## Admin Panel

Access at `/nirvignastudio` — protected by admin credentials set in `.env.local`.
