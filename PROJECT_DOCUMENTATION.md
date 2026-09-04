# Project Documentation — Smart Expense & Budget Tracker

## 1. Introduction

The **Smart Expense & Budget Tracker** is a production-grade full-stack web application developed to provide personal financial clarity. It addresses the common issue of unplanned daily spending and lack of budget discipline among students, working professionals, freelancers, and families. The application converts daily financial activities into structured data visualizations, automatic budget threshold warnings, target savings progress tracking, and downloadable monthly reports.

---

## 2. Problem Statement

Modern individuals face several financial management challenges:
1. **Unconscious Daily Micro-Spending**: Small daily purchases (canteen snacks, swiggy deliveries, ride-shares) accumulate unnoticed, resulting in month-end budget shortages.
2. **Static & Manual Tracking Limitations**: Traditional paper logbooks or spreadsheets require high manual effort, lack automated overspending alerts, and fail to generate dynamic charts.
3. **No Clear Budget Boundary**: Users struggle to know how much money can be safely spent in specific categories (Food, Travel, Entertainment) before running out of funds.
4. **Lack of Motivation for Saving**: Without visual progress trackers for specific savings milestones (e.g. buying a new laptop or emergency fund), saving money feels abstract and difficult.

---

## 3. Project Objectives

* **Centralize Financial Data**: Provide a single dashboard summarizing total income, expenses, remaining balance, and savings rate.
* **Automate Spending Control**: Implement monthly category budgets with real-time warning indicators (80% utilization) and overflow alerts (>= 100%).
* **Visual Data Analysis**: Utilize Recharts data visualization libraries (Pie/Donut charts for category breakdown, Bar charts for income vs expenses over time).
* **Enable Goal-Driven Saving**: Allow users to set dedicated savings targets, deposit funds, and monitor percentage completion.
* **Data Portability**: Enable users to export personal transaction statements in CSV format.
* **Responsive & Accessible User Experience**: Deliver persistent dark/light mode support, clean typography, mobile card layouts, and accessible form components.

---

## 4. Existing System vs. Proposed System

| Feature | Existing Manual Systems (Spreadsheets/Notepads) | Proposed Smart Expense & Budget Tracker |
| :--- | :--- | :--- |
| **Data Entry & Categorization** | Manual row formatting | Instant dropdown categories, payment methods & receipt links |
| **Overspending Alerts** | None | Automatic in-app notification alerts upon exceeding 80%/100% budget |
| **Visual Analytics** | Manual chart construction | Auto-generated interactive Recharts Pie & Bar charts |
| **Savings Goal Progress** | Static balance checks | Dedicated visual goal cards with deposit modals & status badges |
| **Data Portability** | Manual file save | 1-Click CSV export containing complete transactional logs |
| **Theme & Device Adaptability** | Desktop only | Full mobile responsive design + persistent Dark Mode toggle |

---

## 5. System Modules Breakdown

### 5.1 Authentication & Security Module
* Email and password registration with strict input validation.
* Password hashing using `bcryptjs` with salt rounds.
* Stateless JWT session tokens sent via HTTP Authorization headers.
* Protected API routing ensuring User A cannot read or mutate User B's financial data.
* Quick-fill demo account (`demo@example.com` / `Demo@12345`) for evaluation.

### 5.2 Dashboard Module
* **Summary Cards**: Displays Total Income, Total Expenses, Remaining Balance, and Savings Rate %.
* **Quick Action Buttons**: Direct shortcuts to Add Income, Add Expense, Set Budget, and Add Savings Goal.
* **Recharts Visualizations**: Donut chart for category distribution; dual-bar chart comparing Income vs Expenses over months.
* **Recent Transactions List**: Shows the 5 latest transactions with direct view, edit, and delete controls.

### 5.3 Transactions Management Module
* Complete CRUD operations (Create, Read, Update, Delete).
* Real-time search by description, category, or payment method.
* Multi-filtering by transaction type (Income/Expense), category, date ranges (Today, This week, This month, Last month, Custom), and amount bounds.
* Sorting options (Newest, Oldest, Highest Amount, Lowest Amount, A-Z, Z-A).
* 1-Click CSV export generation.

### 5.4 Budget Management & Alert Module
* Category-level budget targets set for specific months and years.
* Dynamic category progress bars:
  * **Green**: Spending < 75% of budget.
  * **Yellow**: Spending between 75% and 99% of budget.
  * **Red**: Spending >= 100% of budget.
* Automatic notification trigger creating system alerts when 80% or 100% threshold is breached.

### 5.5 Savings Goals Module
* Target milestone creation (Goal name, target amount, current amount, target date, description).
* Visual progress bar calculating exact percentage completed.
* "Add Money" deposit modal to allocate savings directly to goals.
* Goal status transitions from `IN_PROGRESS` to `COMPLETED` with milestone notifications.

### 5.6 Financial Insights & Trends Module
* Automated metric calculations: Top Spending Category, Highest Single Expense, Average Daily Spending (30-day window), Monthly Savings Rate %.
* Month-over-Month (MoM) spending shift comparison with natural language explanations.
* Period switchers for filtering spending trends across Month, Year, and All-Time.

### 5.7 Monthly Reports Module
* Selector for month and year.
* Executive summary detailing Total Income, Total Expenses, Net Savings, Highest Spending Category, Average Expense, and Budget Performance.
* Instant CSV report download.

### 5.8 Notification System Module
* In-app bell icon with unread count badge.
* Dropdown list showing budget warnings, budget overflow alerts, and goal completion messages.
* Options to mark individual notifications read, mark all read, or clear all.

### 5.9 Profile & Settings Module
* User avatar selection and profile metadata updates.
* Password change form with current password verification.
* Appearance settings (Persistent Light/Dark mode).
* Currency preferences (INR ₹ as default, USD, EUR, GBP).
* Notification preference toggles.

---

## 6. Advantages of the System

1. **User-Centric Financial Control**: Helps users identify wasteful spending habits and increase overall savings rate.
2. **Zero-Delay Visual Feedback**: Dashboard charts and budget progress bars update immediately upon transaction entry.
3. **Data Integrity & Security**: Passwords are securely hashed; JWT authorization ensures strict multi-tenant data isolation.
4. **Academic & Professional Quality**: Clean, maintainable TypeScript monorepo architecture adhering to industry web standards.

---

## 7. Future Enhancements

* **Bank Account Aggregation**: Integration with Plaid or Open Banking APIs for automated bank feed syncing.
* **AI Financial Advisor**: Machine-learning predictions for future spending and personalized savings recommendations.
* **Receipt OCR & Document Parsing**: Camera upload with automatic optical character recognition for receipts.
* **Collaborative Family Vaults**: Shared household budgets with multi-user spending permissions.
