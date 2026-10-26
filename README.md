# Smart Expense & Budget Tracker

Tagline: **“Track your money. Understand your spending. Reach your goals.”**

A production-quality, full-stack personal finance web application built to help college students, employees, freelancers, and families track income/expenses, monitor monthly category budgets, manage savings goals, analyze spending habits using interactive charts, receive budget overflow alerts, and export financial reports.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [Key Features](#4-key-features)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Granular Database Schema & ERD (Prisma)](#7-granular-database-schema--erd-prisma)
8. [Project Directory Structure](#8-project-directory-structure)
9. [Installation & Setup](#9-installation--setup)
10. [Environment Variables](#10-environment-variables)
11. [Database Setup & Seeding](#11-database-setup--seeding)
12. [Running Frontend & Backend](#12-running-frontend--backend)
13. [Granular API Documentation](#13-granular-api-documentation)
14. [Granular Technical Documentation on Unit Testing & Error Boundaries](#14-granular-technical-documentation-on-unit-testing--error-boundaries)
15. [User Testing & Project Better Tomorrow Evaluation](#15-user-testing--project-better-tomorrow-evaluation)
16. [Deployment Guide](#16-deployment-guide)

---

## 1. Project Overview

People often spend money every day without knowing exactly where their money goes. Without systematic expense logging and budget monitoring, users risk overspending and struggle to achieve savings targets. **Smart Expense & Budget Tracker** provides a central financial dashboard with real-time analytics, proactive threshold warnings (80% warning and 100% exceeded alerts), target savings progress, and downloadable CSV statements.

---

## 2. Problem Statement

* **Lack of Visibility**: Users are unaware of daily cumulative small expenses (food delivery, ride-shares, impulsive shopping).
* **Budget Exceedance**: Difficulty maintaining strict category limits throughout the month without real-time warnings.
* **Complex Tools**: Existing banking apps lack unified category analytics, custom envelopes, or automated savings goals.
* **Saving Obstacles**: Inability to visualize savings progress towards major milestones.

---

## 3. Proposed Solution

The application provides:
* Secure JWT Authentication with multi-tenant data isolation and a 1-click Quick Fill Demo button.
* Interactive Recharts financial analytics (Pie charts, Monthly income vs expenses trends).
* Complete Transaction CRUD with real-time search, filters (Type, Category, Date range, Amount min/max), and multi-field sorting.
* Monthly Category Budgets with dynamic warning badges at 80% usage and alert banners upon budget overflow.
* Savings Goals tracker with target amounts, progress bars, and deposit modals.
* Analytical Financial Insights (Top spending category, highest expense, average daily spending, MoM comparison).
* Downloadable CSV transaction exports.
* Dedicated In-App User Feedback & Qualitative Testing Portal (`/feedback`).
* End-to-end Zod runtime payload validation on Express route handlers.
* Automated 20-test verification suite covering edge cases and financial formulas.
* Enterprise error boundaries on both client (React ErrorBoundary) and server (centralized Express handler).

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
* **User Feedback & Evaluation**: Dedicated feedback portal adhering to the Project Better Tomorrow validation rubric.
* **In-App Notifications**: Unread counter badge, alert popover, mark-as-read, clear notifications.
* **Profile & Settings**: Avatar selector, profile updates, change password, dark mode toggle, currency switcher.

---

## 5. Technology Stack

### Frontend
* **Core Framework**: React 18 + TypeScript + Vite
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Data Visualization**: Recharts (PieChart, BarChart, ResponsiveContainer)
* **Routing**: React Router v6
* **Notifications**: React Hot Toast
* **Reliability**: Class-based React Error Boundary with fallback UI

### Backend
* **Runtime**: Node.js + Express.js + TypeScript (`ts-node-dev`)
* **ORM**: Prisma ORM v5
* **Authentication**: JWT (`jsonwebtoken`) + BCrypt (`bcryptjs`)
* **Request Validation**: Zod runtime schema validation middleware
* **Testing**: Automated Unit & Integration test suite with master telemetry runner

### Database
* **Engines**: SQLite (local development / offline zero-config) & PostgreSQL (production ready)

---

## 6. System Architecture

```
                     ┌──────────────────────────────────────────┐
                     │          React + Vite + TS UI            │
                     │  (Tailwind CSS, Lucide, Recharts, Router) │
                     │  Protected by React ErrorBoundary        │
                     └────────────────────┬─────────────────────┘
                                          │ REST API (Bearer JWT / JSON)
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │       Node.js + Express + TS Backend     │
                     │  ├── Zod Request Validation Layer        │
                     │  ├── JWT Authentication Middleware       │
                     │  ├── Financial Calculation Utilities     │
                     │  └── Centralized Express Error Boundary  │
                     └────────────────────┬─────────────────────┘
                                          │ Prisma ORM
                                          ▼
                     ┌──────────────────────────────────────────┐
                     │     PostgreSQL / SQLite Database          │
                     │  (User, Transaction, Budget, Goals, etc) │
                     └──────────────────────────────────────────┘
```

---

## 7. Granular Database Schema & ERD (Prisma)

### 7.1. Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
    USER ||--o{ TRANSACTION : "records"
    USER ||--o{ BUDGET : "allocates"
    USER ||--o{ SAVINGS_GOAL : "sets"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o| USER_SETTINGS : "configures"

    USER {
        string id PK "UUID"
        string name "User Full Name"
        string email UK "Unique Email Address"
        string passwordHash "Bcrypt Hash (10 rounds)"
        string profileImage "Nullable Avatar Path"
        datetime createdAt "Creation Timestamp"
        datetime updatedAt "Auto-updated Timestamp"
    }

    TRANSACTION {
        string id PK "UUID"
        string userId FK "References User.id (Cascade Delete)"
        string type "INCOME or EXPENSE"
        float amount "Strictly positive monetary amount"
        string category "Envelope (Food, Travel, Bills, etc)"
        string description "Merchant / Note summary"
        string paymentMethod "Cash, UPI, Card, Net Banking"
        datetime transactionDate "Date of monetary flow"
        string notes "Nullable custom remarks"
        string receiptUrl "Nullable image attachment"
        datetime createdAt "Record creation"
    }

    BUDGET {
        string id PK "UUID"
        string userId FK "References User.id (Cascade Delete)"
        string category "Category envelope"
        float amount "Monthly cap limit"
        int month "Month number (1-12)"
        int year "Calendar year (e.g. 2026)"
    }

    SAVINGS_GOAL {
        string id PK "UUID"
        string userId FK "References User.id (Cascade Delete)"
        string name "Milestone title"
        float targetAmount "Total target value"
        float currentAmount "Accumulated deposits"
        datetime targetDate "Target deadline"
        string status "IN_PROGRESS or COMPLETED"
    }

    NOTIFICATION {
        string id PK "UUID"
        string userId FK "References User.id (Cascade Delete)"
        string type "BUDGET_WARNING, BUDGET_EXCEEDED, INFO"
        string message "Descriptive alert message"
        boolean isRead "Read status tracking"
        datetime createdAt "Timestamp"
    }

    USER_SETTINGS {
        string id PK "UUID"
        string userId FK "References User.id (Unique, 1-to-1)"
        string currency "INR, USD, EUR, GBP"
        boolean darkMode "Theme preference"
        boolean notificationsEnabled "Master notification toggle"
        boolean budgetAlertsEnabled "Threshold warnings toggle"
        boolean monthlyReportsEnabled "Report generation toggle"
    }
```

### 7.2. Granular Table Specifications

#### 1. `User` Table
| Column Name | Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | No | Primary Key (`uuid()`) | Unique user surrogate identifier |
| `name` | `String` | No | None | User's full display name |
| `email` | `String` | No | Unique (`@unique`), Indexed | User login email address |
| `passwordHash`| `String` | No | None | Salted BCrypt password hash |
| `profileImage`| `String` | Yes | `null` | Path or identifier to avatar asset |
| `createdAt` | `DateTime` | No | `default(now())` | Registration timestamp |
| `updatedAt` | `DateTime` | No | `@updatedAt` | Timestamp of last account update |

#### 2. `Transaction` Table
| Column Name | Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | No | Primary Key (`uuid()`) | Unique transaction ID |
| `userId` | `String` | No | Foreign Key $\to$ `User.id` (`onDelete: Cascade`) | Multi-tenant tenant identifier |
| `type` | `String` | No | `"INCOME"` \| `"EXPENSE"` | Inflow or outflow classification |
| `amount` | `Float` | No | Amount $> 0$ | Exact transaction monetary value |
| `category` | `String` | No | Food, Travel, Bills, etc. | Category allocation envelope |
| `description` | `String` | No | None | Short title / merchant name |
| `paymentMethod`| `String` | No | UPI, Cash, Card, Bank | Payment rail used |
| `transactionDate`| `DateTime` | No | None | Timestamp of financial transaction |
| `notes` | `String` | Yes | `null` | Contextual notes |
| `receiptUrl` | `String` | Yes | `null` | Receipt proof URL |

* **Index:** `@@index([userId, transactionDate])` for fast range searches and chart queries.

#### 3. `Budget` Table
| Column Name | Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | No | Primary Key (`uuid()`) | Unique budget allocation ID |
| `userId` | `String` | No | Foreign Key $\to$ `User.id` (`onDelete: Cascade`) | Owner identifier |
| `category` | `String` | No | None | Budgeted category envelope |
| `amount` | `Float` | No | Amount $> 0$ | Total allocated budget ceiling |
| `month` | `Int` | No | Range $1 - 12$ | Budget target month |
| `year` | `Int` | No | Gregorian year | Budget target year |

* **Composite Constraint:** `@@unique([userId, category, month, year])` prevents duplicate budget envelopes for the same category in a given calendar month.

#### 4. `SavingsGoal` Table
| Column Name | Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | No | Primary Key (`uuid()`) | Unique savings goal ID |
| `userId` | `String` | No | Foreign Key $\to$ `User.id` (`onDelete: Cascade`) | Owner identifier |
| `name` | `String` | No | None | Goal milestone title |
| `targetAmount`| `Float` | No | Amount $> 0$ | Target savings milestone |
| `currentAmount`| `Float`| No | Default `0.0` | Accumulated deposits |
| `targetDate` | `DateTime` | No | None | Deadline date |
| `status` | `String` | No | Default `"IN_PROGRESS"` | State: `"IN_PROGRESS"` or `"COMPLETED"` |

#### 5. `Notification` Table
| Column Name | Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | No | Primary Key (`uuid()`) | Unique notification ID |
| `userId` | `String` | No | Foreign Key $\to$ `User.id` (`onDelete: Cascade`) | Target recipient |
| `type` | `String` | No | `"BUDGET_WARNING"`, etc. | Notification type code |
| `message` | `String` | No | None | User-facing alert message |
| `isRead` | `Boolean` | No | Default `false` | Unread state indicator |
| `createdAt` | `DateTime` | No | Default `now()` | Generation timestamp |

* **Index:** `@@index([userId, isRead])` for high-performance notification bell badge queries.

#### 6. `UserSettings` Table
| Column Name | Type | Nullable | Constraints & Defaults | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `String` | No | Primary Key (`uuid()`) | Unique settings record ID |
| `userId` | `String` | No | Unique (`@unique`), FK $\to$ `User.id` | 1-to-1 User relation |
| `currency` | `String` | No | Default `"INR"` | Symbol (`INR`, `USD`, `EUR`, `GBP`) |
| `darkMode` | `Boolean` | No | Default `false` | Dark mode toggle |
| `notificationsEnabled` | `Boolean` | No | Default `true` | Notification master switch |
| `budgetAlertsEnabled` | `Boolean` | No | Default `true` | 80% and 100% alert switch |
| `monthlyReportsEnabled`| `Boolean` | No | Default `true` | Monthly report digest switch |

---

## 8. Project Directory Structure

```
expense/
├── client/                                # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/                    # Component Library
│   │   │   ├── common/                    # Navbar, Sidebar, ErrorBoundary, Modal
│   │   │   ├── dashboard/                 # SummaryCards, Charts, QuickActions
│   │   │   ├── transactions/              # TransactionTable, Filters, Modals
│   │   │   ├── budgets/                   # BudgetCard, BudgetModal
│   │   │   └── savings/                   # SavingsCard, AddFundsModal
│   │   ├── context/                       # AuthContext, ThemeContext, CurrencyContext
│   │   ├── pages/                         # DashboardPage, FeedbackPage, BudgetsPage, etc.
│   │   ├── services/                      # api.ts (Fetch wrapper with auto JWT injection)
│   │   ├── types/                         # TypeScript interfaces (Transaction, Budget, etc)
│   │   ├── utils/                         # Currency formatters, CSV export helper
│   │   ├── App.tsx                        # Root routing with ErrorBoundary wrapper
│   │   └── main.tsx                       # React DOM entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                                # Node.js + Express + TypeScript Backend
│   ├── prisma/
│   │   ├── schema.prisma                  # Granular Prisma schema & documentation
│   │   └── seed.ts                        # Automated multi-month demo dataset seeder
│   ├── src/
│   │   ├── config/                        # env.ts, db.ts
│   │   ├── controllers/                   # Auth, Transaction, Budget, Savings, etc.
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts          # Bearer JWT verification & tenant isolation
│   │   │   ├── validationMiddleware.ts    # Generic Zod request schema middleware
│   │   │   └── errorHandler.ts            # Centralized Express error boundary
│   │   ├── routes/                        # Express API route declarations
│   │   ├── services/                      # notificationService.ts
│   │   ├── utils/                         # calculations.ts (Pure financial formulas)
│   │   ├── validators/                    # schemas.ts (Zod request validation schemas)
│   │   ├── tests/                         # Automated Unit & Integration Test Suites
│   │   │   ├── budgetAlerts.test.ts       # Budget threshold & boundary condition tests
│   │   │   ├── analytics.test.ts          # Financial statistics & math formulas tests
│   │   │   ├── validation.test.ts         # Zod payload rejection & schema tests
│   │   │   └── runAllTests.ts             # Master test telemetry execution runner
│   │   └── app.ts                         # Express server instance configuration
│   ├── package.json
│   └── tsconfig.json
│
├── USER_TESTING_REPORT.md                 # Project Better Tomorrow Usability Report (SUS: 87.2)
├── PROJECT_DOCUMENTATION.md               # Architecture, modules, and system design
└── README.md                              # Comprehensive guide & API documentation
```

---

## 9. Installation & Setup

### Prerequisites
* **Node.js**: v18.x or higher (`node -v`)
* **npm**: v9.x or higher (`npm -v`)

### Step 1: Clone or Open Project
```bash
git clone https://github.com/kannishhk-blip/Smart-Expense-.git
cd Smart-Expense-
```

### Step 2: Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

---

## 10. Environment Variables

Create a `.env` file in the `server/` root:

```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="smart_expense_tracker_secret_key_2026"
NODE_ENV="development"
```

---

## 11. Database Setup & Seeding

```bash
cd server

# Push schema to SQLite database & generate Prisma client
npx prisma db push
npx prisma generate

# Seed database with demo user, budgets, goals, and multi-month transactions
npx ts-node prisma/seed.ts
```

### Pre-Seeded Demo Account
* **Email:** `demo@example.com`
* **Password:** `Demo@12345`

---

## 12. Running Frontend & Backend

### Option A: Running Automated Tests
```bash
cd server
npm test
# Executes all 20 unit and integration tests
```

### Option B: Running Development Servers
```bash
# Terminal 1 - Backend Server
cd server
npm run dev
# Server listening on http://localhost:5000

# Terminal 2 - Frontend Client
cd client
npm run dev
# Client accessible at http://localhost:5173
```

---

## 13. Granular API Documentation

All secured endpoints require the `Authorization: Bearer <jwt_token>` header.

### 13.1. Authentication Module (`/api/auth`)

#### `POST /api/auth/register`
* **Description:** Creates a new user profile, seeds default `UserSettings`, and returns an authentication JWT.
* **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```
* **Success Response (`201 Created`):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "c3b9b4a1-8d2b-4e8c-9b4e-2b1d3a5e7f9a",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```
* **Validation Failure (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "Input validation failed. Please check your submission.",
  "errors": [
    { "field": "confirmPassword", "message": "Passwords do not match." }
  ]
}
```

#### `POST /api/auth/login`
* **Description:** Verifies credentials and returns a valid session JWT.
* **Request Body:**
```json
{
  "email": "demo@example.com",
  "password": "Demo@12345"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "e2a1b3c4-...",
    "name": "Demo User",
    "email": "demo@example.com"
  }
}
```

---

### 13.2. Transactions Module (`/api/transactions`)

#### `GET /api/transactions`
* **Description:** Retrieves user transactions with filtering, searching, and pagination.
* **Query Parameters:**
  * `search` (string): Text search across description and notes.
  * `type` (string): `"INCOME"` or `"EXPENSE"`.
  * `category` (string): Category envelope filter.
  * `startDate` & `endDate` (ISO Date): Date boundary window.
  * `minAmount` & `maxAmount` (number): Value bounds.
  * `sortBy` (`date` | `amount` | `category`): Sort key.
  * `sortOrder` (`asc` | `desc`): Direction.
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "18f9e2b1-...",
      "type": "EXPENSE",
      "amount": 450.0,
      "category": "Food & Dining",
      "description": "Swiggy Dinner Order",
      "paymentMethod": "UPI",
      "transactionDate": "2026-10-25T19:30:00.000Z"
    }
  ]
}
```

#### `POST /api/transactions`
* **Description:** Inserts a validated transaction and re-evaluates monthly budget thresholds.
* **Request Body:**
```json
{
  "type": "EXPENSE",
  "amount": 750.50,
  "category": "Food & Dining",
  "description": "Team lunch buffet",
  "paymentMethod": "UPI",
  "transactionDate": "2026-10-26T13:00:00.000Z",
  "notes": "Project celebration"
}
```
* **Success Response (`201 Created`):** Returns the created transaction object.
* **Validation Failure (`400 Bad Request`):** Returns descriptive error if `amount <= 0` or invalid type.

#### `GET /api/transactions/export`
* **Description:** Exports the user's transaction history as a downloadable CSV formatted statement with headers: `ID, Date, Type, Category, Description, Amount, Payment Method, Notes`.

---

### 13.3. Budgets Module (`/api/budgets`)

#### `GET /api/budgets`
* **Description:** Fetches all category budgets for the current month and attaches dynamically calculated spending utilization status (`NORMAL`, `WARNING`, `EXCEEDED`).
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "b1a2c3-...",
      "category": "Food & Dining",
      "amount": 5000.0,
      "spent": 4250.0,
      "utilizationPercent": 85.0,
      "status": "WARNING",
      "alertMessage": "You have used 85% of your Food & Dining budget (₹4,250 / ₹5,000)."
    }
  ]
}
```

#### `POST /api/budgets`
* **Description:** Creates or updates a category budget ceiling for a specific month and year.
* **Request Body:**
```json
{
  "category": "Food & Dining",
  "amount": 6000.0,
  "month": 10,
  "year": 2026
}
```

---

### 13.4. Savings Goals Module (`/api/savings-goals`)

#### `GET /api/savings-goals`
* **Description:** Lists all savings milestone targets with real-time percentage progress.

#### `POST /api/savings-goals/:id/add-funds`
* **Description:** Adds an incremental monetary deposit to a goal. Automatically transitions goal `status` to `"COMPLETED"` upon reaching 100%.
* **Request Body:**
```json
{
  "amount": 1500.0
}
```

---

### 13.5. Analytics & Dashboard Module (`/api/dashboard` & `/api/insights`)

* `GET /api/dashboard/summary`: Returns Total Income, Total Expenses, Net Savings, Balance, and Savings Rate.
* `GET /api/dashboard/category-breakdown`: Computes category spending distribution formatted for Recharts Pie/Donut charts.
* `GET /api/dashboard/monthly-trends`: Computes monthly aggregated income vs expenses for the past 12 months.
* `GET /api/insights`: Calculates:
  * Top Spending Category
  * Highest Single Transaction
  * Average Daily Spend ($30\text{-day billing window}$)
  * Month-over-Month (MoM) % shift with contextual explanation

---

## 14. Granular Technical Documentation on Unit Testing & Error Boundaries

### 14.1. Unit & Integration Testing Architecture

The test suite is structured into dedicated, decoupled unit testing files located under `server/src/tests/` and coordinated by a master test runner (`runAllTests.ts`). Tests run without external runner bloat using TypeScript directly, delivering sub-second test execution.

```
server/src/tests/
├── budgetAlerts.test.ts   # 6 tests: Boundary conditions (0%, 80%, 100%, >100%)
├── analytics.test.ts      # 7 tests: Mathematical formulas (Savings Rate, MoM, Burn Rate)
├── validation.test.ts     # 7 tests: Zod payload schemas & rejection rules
└── runAllTests.ts         # Master runner reporting colorized telemetry
```

#### Complete Test Matrix (20 Test Cases)

| # | Test Suite | Test Objective | Tested Condition / Input | Expected Result / Assertion |
| :-: | :--- | :--- | :--- | :--- |
| **1** | Budget Alerts | Normal utilization | Spent: ₹3,000, Budget: ₹5,000 ($60\%$) | Status: `NORMAL`, No alert triggered |
| **2** | Budget Alerts | Boundary: Exact 80% | Spent: ₹4,000, Budget: ₹5,000 ($80.0\%$) | Status: `WARNING`, Warning triggered |
| **3** | Budget Alerts | Warning zone | Spent: ₹4,250, Budget: ₹5,000 ($85.0\%$) | Status: `WARNING`, Formatted 85% text |
| **4** | Budget Alerts | Boundary: Exact 100% | Spent: ₹5,000, Budget: ₹5,000 ($100.0\%$) | Status: `WARNING`, Alert triggered |
| **5** | Budget Alerts | Overflow exceeded | Spent: ₹5,500, Budget: ₹5,000 ($110.0\%$) | Status: `EXCEEDED`, Deficit: ₹500 |
| **6** | Budget Alerts | Zero/negative safety | Spent: ₹100, Budget: ₹0 | Gracefully returns without `NaN` |
| **7** | Analytics Math | Positive savings rate | Income: ₹50,000, Expense: ₹30,000 | Savings Rate: $40.0\%$ |
| **8** | Analytics Math | Zero-income guard | Income: ₹0, Expense: ₹2,000 | Savings Rate: $0.0\%$ (Zero-division avoided) |
| **9** | Analytics Math | Negative savings rate | Income: ₹10,000, Expense: ₹12,000 | Savings Rate: $-20.0\%$ |
| **10**| Analytics Math | MoM increase formula | Curr: ₹12,000, Prev: ₹10,000 | Shift: $+20.0\%$, Warning text |
| **11**| Analytics Math | MoM decrease formula | Curr: ₹8,000, Prev: ₹10,000 | Shift: $-20.0\%$, Encouraging text |
| **12**| Analytics Math | Missing past data | Curr: ₹5,000, Prev: ₹0 | Gracefully returns $0\%$ baseline |
| **13**| Analytics Math | Daily burn rate | 30-day cumulative: ₹15,000 | Daily average: ₹500.00 |
| **14**| Zod Validation | Valid transaction | Amount: ₹250, Type: `EXPENSE` | Successfully validates and parses |
| **15**| Zod Validation | Negative amount | Amount: -₹50 | Throws ZodError: `"Amount must be > 0"` |
| **16**| Zod Validation | Invalid type | Type: `"TRANSFER"` | Throws ZodError on enum check |
| **17**| Zod Validation | Negative budget cap | Amount: -₹1,000 | Throws ZodError: `"Budget must be > 0"` |
| **18**| Zod Validation | Password mismatch | Password $\neq$ ConfirmPassword | Throws ZodError: `"Passwords must match"` |
| **19**| Zod Validation | Malformed email | Email: `"invalid-email"` | Throws ZodError: `"Invalid email address"` |
| **20**| Zod Validation | Valid login payload | Valid email & 6+ char password | Successfully validates |

#### Executing the Test Suite
```bash
cd server
npm test
```

---

### 14.2. Error Boundary Architecture

To ensure zero unhandled fatal crashes across the distributed architecture, error boundaries are implemented at both the presentation and API server layers:

#### A. Frontend Error Boundary (`client/src/components/common/ErrorBoundary.tsx`)
* **Mechanism:** Implemented as a React class component using standard lifecycle error catchers:
  * `static getDerivedStateFromError(error: Error)`: Synchronously catches runtime exceptions thrown during component rendering and switches state to `hasError: true`.
  * `componentDidCatch(error: Error, errorInfo: ErrorInfo)`: Logs the component stack trace and telemetry for observability.
* **User Experience & Fallback UI:**
  * Replaces blank screen crashes with a recovery interface.
  * Discloses error diagnostics in development while maintaining aesthetic safety in production.
  * Offers recovery actions: **"Reload Page"** (re-initializes state) and **"Go to Dashboard"** (safe route reset).
* **Integration:** Wraps `<AppContent />` in `App.tsx` ensuring all protected and public subtrees are shielded.

#### B. Backend Centralized Error Boundary (`server/src/middleware/errorHandler.ts`)
* **Mechanism:** Express 4-argument error middleware `(err, req, res, next)` mounted at the end of the routing pipeline.
* **Error Classification Engine:**
  1. **Zod Validation Errors (`ZodError`):** Intercepts schema validation exceptions and maps them to HTTP `400 Bad Request` with field-by-field diagnostic paths.
  2. **JWT Errors (`JsonWebTokenError`, `TokenExpiredError`):** Intercepts corrupt or expired bearer tokens, returning HTTP `401 Unauthorized`.
  3. **Prisma ORM Errors:**
     * `P2002` (Unique constraint violation): Returns HTTP `409 Conflict` (e.g., duplicate email address).
     * `P2025` (Record not found): Returns HTTP `404 Not Found`.
  4. **Controlled Operational Errors (`AppError`):** Returns caller-specified status code and sanitized message.
  5. **Unhandled 500 Exceptions:** Returns sanitized fallback message to prevent sensitive stack trace disclosure in production.

---

## 15. User Testing & Project Better Tomorrow Evaluation

In alignment with the **Project Better Tomorrow** evaluation criteria, the system was validated through qualitative user evaluation sessions with **12 participants** representing three primary demographic cohorts:
1. **College Students (5 participants):** Focused on pocket money constraints and food delivery spend.
2. **Freelancers & Gig Workers (4 participants):** Focused on cash flow volatility and tax CSV exports.
3. **Early-Career Professionals (3 participants):** Focused on emergency fund milestones.

* **Task Success Rate:** **96.7%** across 60 administered scenarios.
* **System Usability Scale (SUS) Score:** **87.2 / 100** (**Grade A, Exceptional Usability**).
* **Net Promoter Score (NPS):** **+68**.
* **In-App Evaluation Portal:** [`FeedbackPage.tsx`](file:///d:/expense/client/src/pages/FeedbackPage.tsx) accessible via navigation at `/feedback`.
* Full details documented in [`USER_TESTING_REPORT.md`](file:///d:/expense/USER_TESTING_REPORT.md).

---

## 16. Deployment Guide

### Deploying the Backend API (Render / Railway / Fly.io)
1. Link your GitHub repository.
2. Set Root Directory to `server`.
3. Set Build Command: `npm install && npx prisma db push && npx prisma generate && npm run build`.
4. Set Start Command: `npm start` (or `node dist/app.js`).
5. Configure Environment Variables: `PORT`, `DATABASE_URL` (Hosted PostgreSQL), `JWT_SECRET`, `NODE_ENV=production`.

### Deploying the Frontend Client (Vercel / Netlify)
1. Link your GitHub repository.
2. Set Root Directory to `client`.
3. Set Build Command: `npm run build`.
4. Set Output Directory: `dist`.
5. Set `VITE_API_URL` pointing to your deployed backend URL.

---

*Authored by Kannishhk for Academic Review & Evaluation.*
