# FlowWare (M-Ware Money)

**FlowWare** is a high-precision personal finance ecosystem developed by **MwaisegheWare**. Unlike standard expense trackers, FlowWare is designed as a "Behavioral Finance" tool—helping users not just record where their money went, but actively manage their spending impulses and social financial obligations.

## Core Pillars

The application is structured into four specialized modules designed to handle different aspects of a user's financial life:

### 1. Transactions (The Ledger)

A high-fidelity digital record of all cash flow.

- **Dual-Type Tracking:** Categorizes every entry as `Income` or `Expense`.
- **Method Metadata:** Tracks payment sources (M-Pesa, Cash, Bank) for granular auditing.
- **Audit Ready:** Every transaction includes a `transaction_date` (user-defined) and a `created_at` timestamp (system-defined) for complete transparency.

### 2. Debts (Social Accounting)

Manages money that exists outside your immediate balance.

- **Lending & Borrowing:** Distinguishes between money you owe and money owed to you.
- **Nudge Utility:** Includes a specialized endpoint to generate polite repayment reminders for debtors.
- **Status Lifecycle:** Tracks debts through `Pending`, `Partial`, and `Settled` states.

### 3. Wishlist (Intentional Spending)

A psychological tool to combat impulsive consumerism.

- **The Cooling-Off Protocol:** Every item added is locked behind a mandatory waiting period.
- **`is_cool` Logic:** The API dynamically calculates if an item is "safe" to buy based on its cooling-off period.
- **Priority Ranking:** Helps users visualize which "wants" are actually "needs."

### 4. Bills (Recurring Commitments)

Automates the tracking of monthly and yearly obligations.

- **Predictive Budgeting:** Tracks service providers and recurring amounts.
- **One-Tap Payment:** The `pay/` utility logs a bill payment and automatically generates a corresponding transaction entry to keep the ledger balanced.

---

## Analytics & Insights

FlowWare provides a dedicated analytics engine to turn raw data into actionable intelligence:

- **Daily Allowance:** Calculates a "Safe to Spend" daily figure by subtracting upcoming bills from the remaining monthly budget.
- **Category Breakdown:** Aggregates spending by type for visual reporting (e.g., Pie Charts).
- **Net Flow:** A real-time calculation of monthly financial health.

---

## 🛠 Technical Stack

| Layer              | Technology                                        |
| :----------------- | :------------------------------------------------ |
| **Backend**        | **Django 5.x** + **Django REST Framework**        |
| **Database**       | **PostgreSQL** (with UUID Primary Keys)           |
| **Authentication** | **JWT** (JSON Web Tokens) via `dj-rest-auth`      |
| **Architecture**   | **Multi-Tenant** (Strict data isolation per user) |
| **Frontend**       | **Next.js** (TypeScript)                          |

---

## Security & Multi-Tenancy

FlowWare is built to scale. It utilizes a **Shared Schema** architecture where every data point is bound to a `user_id`.

- **Row-Level Isolation:** Users can only interact with data they own.
- **Soft Deletes:** Critical financial data is never permanently wiped on the first instance; it is marked as `is_deleted` for audit recovery.
- **UUID Implementation:** All IDs are non-sequential UUIDs to prevent ID-guessing attacks (Insecure Direct Object References).

---

## API Integration

The backend exposes a clean, RESTful API structured under the `/api/finance-manager/` namespace.

> **Note:** All requests require a valid JWT in the Authorization header:
> `Authorization: Bearer <your_token>`

---

**Would you like me to add a "How to Run" section with the specific Django commands to set up the database and migrations?**
s).

---

## API Integration

The backend exposes a clean, RESTful API structured under the `/api/finance-manager/` namespace.

> **Note:** All requests require a valid JWT in the Authorization header:
> `Authorization: Bearer <your_token>`
