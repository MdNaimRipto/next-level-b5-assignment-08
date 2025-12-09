# Eventide Momento — Backend

A modular, TypeScript-based Express backend for the "Eventide Momento" project. This repository contains the API and server logic for managing users, hosts, events, orders, payments, images, and reviews. Built with Express, Mongoose, Stripe for payments and Cloudinary for image uploads.

## Key Features

- RESTful API built with Express and TypeScript
- MongoDB data modeling with Mongoose
- Authentication and authorization with JWT + cookies
- Request validation with Zod
- File uploads and image hosting using Cloudinary
- Payment flow using Stripe Checkout + webhook handling
- Modular service/controller/router structure for each feature (users, events, orders, payments, reviews, images)
- Pagination helpers, centralized error handling, and consistent response helpers

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Stripe (Payments)
- Cloudinary (Image hosting)
- Zod (request validation)
- Multer (multipart uploads)
- JWT + cookie-based helpers

## Getting Started

Prerequisites

- Node.js 18+ (recommended)
- npm, yarn, or pnpm

Install dependencies

```bash
npm install
# or
# pnpm install
# yarn install
```

Run in development

```bash
npm run dev
```

Start (production-ish with ts-node-dev)

```bash
npm run start
```

## Environment

Create a `.env` file in the project root and provide the following environment variables (values used by `src/config/config.ts`):

- `NODE_ENV`
- `PORT`
- `DATABASE_URL` (MongoDB connection string)
- `SALT_ROUND`
- `NODEMAILER_USER`
- `NODEMAILER_PASS`
- `FRONTEND_URL`
- `EXPRESS_SESSION_SECRET`
- `JWT_ACCESS_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES_IN`
- `STRIPE_PUBLISH_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (required to verify Stripe webhooks)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Important Endpoints

- API prefix: `POST /v1.0.0/apis/...` (see `src/app/routes/router.ts`)
- Stripe webhook (raw body expected): `POST /webhook` (registered in `src/app.ts`)
- Images: `POST /v1.0.0/apis/images/upload` (multipart `file`) and `POST /v1.0.0/apis/images/delete` (body: `{ publicId }`)

## Project Structure (high level)

- `src/app/` — main application modules and boot code
  - `modules/` — feature modules (each module contains `*.controller.ts`, `*.service.ts`, `*.router.ts`, `*.schema.ts`, `*.validation.ts`, `*.interface.ts`)
    - `users/`, `events/`, `order/`, `payment/`, `reviews/`, `images/`, `admin/` etc.
  - `routes/router.ts` — central router that mounts module routers
- `src/config/` — environment and configuration helpers (`config.ts`)
- `src/errors/` — custom error handlers and utilities
- `src/helpers/` — helper functions (pagination, jwt, etc.)
- `src/middlewares/` — global error handler, validation middleware
- `src/shared/` — shared utilities like `catchAsync`, `sendResponse` and small helpers
- `src/util/` — misc utilities (role checks, token verification, DB helpers)
- `uploads/` — temporary upload folder used by `multer` before pushing images to Cloudinary

## Notes

- The Stripe webhook expects the raw request body. `app.ts` registers the webhook route with `express.raw({ type: 'application/json' })`.
- Webhook flow: successful `checkout.session.completed` events create `Order` documents and update associated `Event` participants.
- The images module uses an intermediate local upload folder (`uploads/`) and then uploads to Cloudinary; remove or secure this folder in production.
