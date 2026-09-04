# Smart Expense & Budget Tracker

Tagline: **“Track your money. Understand your spending. Reach your goals.”**

A production-quality, full-stack personal finance web application built to help college students, employees, freelancers, and families track income/expenses, monitor monthly category budgets, manage savings goals, analyze spending habits using interactive charts, receive budget overflow alerts, and export financial reports.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Proposed Solution](#proposed-solution)
4. [Key Features](#key-features)
5. [Technology Stack](#technology-stack)
6. [System Architecture](#system-architecture)
7. [Database Schema (Prisma)](#database-schema-prisma)
8. [Project Structure](#project-structure)
9. [Installation & Setup](#installation--setup)
10. [Environment Variables](#environment-variables)
11. [Database Setup & Seeding](#database-setup--seeding)
12. [Running Frontend & Backend](#running-frontend--backend)
13. [API Documentation](#api-documentation)
14. [Testing & Verification](#testing--verification)
15. [Deployment Guide](#deployment-guide)
16. [Future Improvements](#future-improvements)

---

## 1. Project Overview

People often spend money every day without knowing exactly where their money goes. Without systematic expense logging and budget monitoring, users risk overspending and struggle to achieve savings targets. **Smart Expense & Budget Tracker** provides a central financial dashboard with real-time analytics, overspending warnings, target savings progress, and downloadable CSV statements.

---

## 2. Problem Statement

* **Lack of Visibility**: Users are unaware of daily cumulative small expenses (swiggy, cabs, shopping).
* **Budget Exceedance**: Difficulty maintaining strict category limits throughout the month.
* **Complex Tools**: Existing banking apps lack unified category analytics or customizable goals.
* **Saving Obstacles**: Inability to visualize savings progress towards major milestones.

---

## 3. Proposed Solution

The application provides:
* Secure JWT Authentication with session management.
* Interactive Recharts financial analytics (Pie charts, Monthly income vs expenses trends).
* Complete Transaction CRUD with real-time search, filters (Type, Category, Date range, Amount min/max), and multi-field sorting.
* Monthly Category Budgets with dynamic warning badges at 80% usage and alert banners upon budget overflow.
* Savings Goals tracker with target amounts, progress bars, and deposit modals.
* Analytical Financial Insights (Top spending category, highest expense, average daily spending, MoM comparison).
* Downloadable CSV transaction exports.
* Persistent Dark Mode & Customizable Currency (INR ₹ default, USD, EUR, GBP).

---

## 4. Key Features

* **Landing Page**: Modern hero section, features list, how-it-works overview, and CTA buttons.
* **Auth**: Registration, Login, Logout, protected routes, bcrypt password hashing, JWT authorization headers, quick demo credentials fill (`demo@example.com` / `Demo@12345`).
* **Dashboard**: Income/Expenses/Balance/Savings summary cards, Recharts visualizations, recent transactions.
* **Transactions Page**: Full table view + responsive mobile card layout with instant search, multi-filters, sorting, and CSV exporter.
* **Budgets Page**: Monthly category budget targets, progress bars (Green < 75%, Yellow 75-99%, Red >= 100%), and alert indicators.
* **Savings Goals Page**: Target goal cards, progress trackers, deposit funds modal, and goal completion badges.
* **Financial Insights**: Analytical calculations for average daily spending, MoM % shifts, top spending categories.
* **Monthly Reports**: Selectable month/year executive summaries with key performance indicators.
* **In-App Notifications**: Unread counter badge, alert popover, mark-as-read, clear notifications.
* **Profile & Settings**: Avatar selector, profile updates, change password, dark mode toggle, currency switcher.

---

## 5. Technology Stack

### Frontend
* **Core**: React 18 + TypeScript + Vite
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Data Visualization**: Recharts
* **Routing**: React Router v6
* **Notifications**: React Hot Toast

### Backend
* **Runtime**: Node.js + Express.js + TypeScript
* **ORM**: Prisma ORM
* **Auth**: JWT (jsonwebtoken) + Bcryptjs
* **Validation & Utilities**: Zod / Express Middleware

### Database
* **Database Engine**: PostgreSQL / SQLite (configured via Prisma schema)

---

## 6. System Architecture

```
                     ┌──────────────────────────────────────────┐
                     │          React + Vite + TS UI            │
                     │  (Tailwind CSS, Lucide, Recharts, Router) │
                     └────────────────────┬─────────────────────┘
                                          │ REST API (JSON)
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │       Node.js + Express + TS Backend     │
                     │  (JWT Auth, bcryptjs, Zod/Express-Val)   │
                     └────────────────────┬─────────────────────┘
                                          │ Prisma ORM
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │     PostgreSQL / SQLite Database          │
                     └──────────────────────────────────────────┘
```

---

## 7. Database Schema (Prisma)

* **User**: `id`, `name`, `email`, `passwordHash`, `profileImage`, `createdAt`, `updatedAt`
* **Transaction**: `id`, `userId`, `type` (INCOME/EXPENSE), `amount`, `category`, `description`, `paymentMethod`, `transactionDate`, `notes`, `receiptUrl`
* **Budget**: `id`, `userId`, `category`, `amount`, `month`, `year`
* **SavingsGoal**: `id`, `userId`, `name`, `targetAmount`, `currentAmount`, `targetDate`, `description`, `status` (IN_PROGRESS/COMPLETED)
* **Notification**: `id`, `userId`, `type` (BUDGET_WARNING/BUDGET_EXCEEDED/GOAL_ACHIEVED/INFO), `message`, `isRead`
* **UserSettings**: `id`, `userId`, `currency`, `darkMode`, `notificationsEnabled`, `budgetAlertsEnabled`, `monthlyReportsEnabled`

---

## 8. Project Structure

```
expense/
├── client/                      # React + Vite Frontend
│   ├── public/                  # Favicon & Static assets
│   ├── src/
│   │   ├── components/          # Reusable Navbar, Sidebar, Modals, Cards, Charts
│   │   ├── context/             # AuthContext, ThemeContext, CurrencyContext
│   │   ├── layouts/             # AppLayout
│   │   ├── pages/               # Landing, Login, Register, Dashboard, Transactions, Budgets, Savings, Insights, Reports, Profile, Settings
│   │   ├── services/            # api.ts (Fetch wrapper)
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # Formatters & CSV exporter
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                      # Express + TypeScript Backend
│   ├── prisma/
│   │   ├── schema.prisma        # Database models
│   │   └── seed.ts              # Demo seed data script
│   ├── src/
│   │   ├── config/              # env.ts, db.ts
│   │   ├── controllers/         # Auth, Transaction, Budget, Savings, Dashboard, Report, Notification, Profile, Settings
│   │   ├── middleware/          # authMiddleware, errorHandler
│   │   ├── routes/              # Express API routers
│   │   ├── services/            # Notification & Budget alert service
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── PROJECT_DOCUMENTATION.md
```

---

## 9. Installation & Setup

### Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher

### Step 1: Clone or Open Project Directory
```bash
cd d:/Twillo/expense
```

### Step 2: Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

---

## 10. Environment Variables

Create `.env` inside `server/`:

```env
PORT=5000
DATABASE_URL="file:./dev.db" # Or postgresql://user:password@localhost:5432/expensedb
JWT_SECRET="smart_expense_tracker_secret_key_2026"
NODE_ENV="development"
```

---

## 11. Database Setup & Seeding

Inside `server/`:

```bash
# Push schema & generate Prisma client
npx prisma db push
npx prisma generate

# Seed database with demo user & realistic transaction history
npx ts-node prisma/seed.ts
```

### Demo Credentials
* **Email**: `demo@example.com`
* **Password**: `Demo@12345`

---

## 12. Running Frontend & Backend

### Start Backend API Server
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

### Start Frontend Client Server
```bash
cd client
npm run dev
# Client running at http://localhost:5173
```

---

## 13. API Documentation

### Authentication
* `POST /api/auth/register` - Create user account.
* `POST /api/auth/login` - Authenticate user & return JWT.
* `POST /api/auth/logout` - Clear session.
* `GET /api/auth/me` - Fetch authenticated user profile.

### Transactions
* `GET /api/transactions` - Fetch transactions (search, filter, sort, paginate).
* `POST /api/transactions` - Create income/expense transaction.
* `GET /api/transactions/:id` - Fetch transaction details.
* `PUT /api/transactions/:id` - Update transaction.
* `DELETE /api/transactions/:id` - Delete transaction.
* `GET /api/transactions/export` - Export user transactions CSV.

### Budgets & Savings
* `GET /api/budgets` - Fetch category budgets & alert statuses.
* `POST /api/budgets` - Upsert category budget.
* `DELETE /api/budgets/:id` - Delete budget.
* `GET /api/savings-goals` - List savings goals.
* `POST /api/savings-goals` - Create goal.
* `POST /api/savings-goals/:id/add-funds` - Deposit funds into goal.

### Analytics & Reports
* `GET /api/dashboard/summary` - Summary cards data.
* `GET /api/dashboard/category-breakdown` - Category expense distribution.
* `GET /api/dashboard/monthly-trends` - Income vs Expense monthly trends.
* `GET /api/insights` - Calculated financial analytics.
* `GET /api/reports/monthly` - Detailed monthly performance report.

---

## 14. Testing & Verification

1. **TypeScript Typecheck**:
   ```bash
   cd server && npx tsc --noEmit
   cd ../client && npx tsc --noEmit
   ```
2. **Frontend Production Build Check**:
   ```bash
   cd client && npm run build
   ```
3. **End-to-End User Flow Verification**:
   * Login with demo account (`demo@example.com` / `Demo@12345`).
   * Add new Income and Expense. Verify dashboard totals & pie chart auto-update.
   * Exceed a category budget (e.g. Food) to trigger budget alert notification.
   * Deposit money into a savings goal to complete goal milestone.
   * Export transactions CSV and open in Excel.

---

## 15. Deployment Guide

* **Backend**: Deploy Node/Express server on Render / Railway / Heroku. Configure environment variable `DATABASE_URL` pointing to hosted PostgreSQL.
* **Frontend**: Deploy React Vite build on Vercel / Netlify. Configure API base URL.

---

## 16. Future Improvements

* Bank account aggregation & Open Banking API integration.
* AI-driven spending recommendations & recurring bill detection.
* Receipt OCR scanning with automatic transaction text extraction.
* Multi-user shared family budgets.
