# Eventide Momento — Frontend

A responsive, modern Next.js frontend for the "Eventide Momento" project. Built with the Next.js App Router, TypeScript, Tailwind CSS and Redux Toolkit. This repository contains the UI for browsing events, viewing public profiles, and managing user profiles and reviews.

## Key Features

- Responsive, component-driven UI using Tailwind CSS
- Next.js App Router with nested layouts for auth, main and user flows
- Redux Toolkit for client state management and API slices
- Axios-powered API helpers and base query integrations
- Animations and interactions with Framer Motion, GSAP and Lottie
- Accessible UI primitives using Radix UI

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Redux Toolkit + React Redux
- Axios
- Radix UI, Lucide icons
- Framer Motion, GSAP, Lottie
- Swiper for carousels

## Getting Started

Prerequisites

- Node.js 18+ (recommended)
- npm, yarn, or pnpm

Install dependencies

```bash
npm install
# or
# pnpm install
# yarn
```

Run in development

```bash
npm run dev
```

Build for production

```bash
npm run build
npm run start
```

Lint

```bash
npm run lint
```

## Environment

No environment needed for this project.

## Project Structure (high level)

- `src/app/` — Next.js App Router pages and layouts
  - `(auth)/` — authentication layouts and pages
  - `(mainLayout)/` — main public pages and event routes
  - `(userLayout)/` — user dashboard/profile pages
- `src/components/` — reusable UI components, animations and page sections
- `src/lib/` — axios helpers and utility functions
- `src/contexts/` — React context providers (Auth, Store)
- `src/redux/` — Redux toolkit setup and feature slices
- `public/` — static assets (images, lottie files)
- `src/styles/` — global styles (Tailwind config is at project root)
