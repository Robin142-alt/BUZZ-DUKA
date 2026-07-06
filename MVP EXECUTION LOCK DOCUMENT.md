# DOCUMENT 12: MVP EXECUTION LOCK DOCUMENT

## Buzz Duka — First Build Scope, Build Order & Demo Readiness

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** MVP control and execution document
**Purpose:** Lock exactly what must be built for the first working version of Buzz Duka, what must be delayed, and what Antigravity must verify before the first demo or pilot.
**Core Rule:** The MVP must be small enough to build correctly, but complete enough to prove real shop value.

---

# 1. Purpose of This Document

This document defines the first working version of Buzz Duka.

Antigravity must use this document to avoid building too many features too early.

The first version must prove that Buzz Duka can:

```txt
Sell fast.
Reduce stock.
Track buying price changes.
Track selling price changes.
Save sale snapshots.
Calculate profit correctly.
Record debts.
Record expenses.
Work offline.
Show real owner analytics.
Protect owner data from Sales user.
Control subscription access.
```

The MVP must not be a fake demo.

It must be a real working version that can be tested with actual shop data.

---

# 2. MVP Definition

The Buzz Duka MVP is the smallest useful version that a real shopkeeper can use to run basic daily selling and see correct business information.

The MVP must include:

* Owner account
* Business setup
* Product setup
* Stock-in
* Fast sale
* Payment method selection
* Stock reduction
* Receipt record
* Debt sale
* Debt payment
* Expense recording
* Gross profit
* Net profit
* Basic analytics
* Owner dashboard
* Sales user mode
* Role restrictions
* Device rule foundation
* Offline local save
* Sync queue foundation
* Subscription/license foundation

The MVP does not need every future feature.

It must focus on real correctness.

---

# 3. MVP Core Promise

The first version must prove this promise:

```txt
A shopkeeper can add products, sell quickly, reduce stock automatically, record debts and expenses, and know real profit from real data.
```

If the MVP cannot prove this, it is not ready.

---

# 4. MVP Must-Have Features

The MVP must include these features.

## 4.1 Business and Owner Setup

* Owner can create/login to account.
* Owner can create business.
* Business ID is created.
* Owner role is assigned.
* First device is registered.
* Subscription/license state is created.

## 4.2 Product Setup

Owner can:

* Add product
* Add category
* Set selling price
* Set buying price for initial stock
* Set stock quantity
* Set low-stock level
* Edit product
* Deactivate product

## 4.3 Stock Management

Owner can:

* Add stock
* Enter buying price during stock-in
* See new average cost
* See stock quantity
* See stock value
* View stock movement history

## 4.4 Fast Selling

Owner or Sales user can:

* Search product
* Add product to cart
* Change quantity
* Select payment method
* Complete sale
* Move to next sale quickly

Payment methods:

```txt
Cash
M-Pesa
Bank
Debt
```

## 4.5 Sale Records

A completed sale must create:

* Sale record
* Sale item records
* Price snapshots
* Stock movements
* Receipt record
* Activity log
* Sync queue item where applicable

## 4.6 Debt Management

MVP must support:

* Debt sale
* Customer name
* Customer phone optional
* Debt balance
* Partial payment
* Paid status
* Debt history

## 4.7 Expense Management

MVP must support:

* Add expense
* Expense category
* Expense date
* Expense list
* Total expenses
* Net profit effect
* Owner-only access

## 4.8 Profit and Analytics

MVP must calculate:

* Total sales
* Gross profit
* Net profit
* Payment method totals
* Product profit
* Low-stock products
* Best-selling products
* Loss-making products
* Debt total
* Expense total

## 4.9 Roles

MVP must support:

```txt
Owner
Sales
```

Sales user must not access:

* Net profit
* Expenses
* Owner analytics
* Subscription settings
* Device settings
* Business settings

## 4.10 Offline

MVP must work offline for:

* Product search
* Sale completion
* Stock reduction
* Receipt creation
* Debt sale
* Debt payment
* Expense recording
* Activity logs
* Local dashboard basics

## 4.11 Subscription Foundation

MVP must support:

```txt
active
grace
expired
suspended
reactivated
```

Main plan:

```txt
Buzz Duka Smart Plan: KSh 1,500/month
```

MVP must not allow unlimited expired offline usage.

---

# 5. MVP Must Not Include

Do not build these in MVP:

* M-Pesa transaction code entry
* M-Pesa verification
* M-Pesa reconciliation
* Daraja integration
* STK Push
* Till/PayBill/Pochi integration
* Bank reconciliation
* Full accounting
* Payroll
* eTIMS/KRA integration
* Multi-branch
* Multiple cashiers
* Unlimited devices
* Supplier management
* Purchase orders
* Customer loyalty
* Complex discounts
* Barcode scanner dependency
* Receipt printer dependency
* AI chatbot
* Tax filing
* Advanced reports
* Web dashboard for shop owners

These features can come later.

MVP must stay focused.

---

# 6. MVP Build Order

Antigravity must build MVP in this order.

## Step 1: Project Foundation

Build:

* React Native + Expo + TypeScript foundation
* Folder structure
* Basic navigation
* Shared components
* Test setup

Do not build fake dashboards.

---

## Step 2: Local SQLite Database

Build tables for:

* businesses
* users
* devices
* products
* categories
* stock_movements
* price_history
* sales
* sale_items
* receipts
* customers
* debts
* debt_payments
* expenses
* activity_logs
* sync_queue
* subscription/license state

Data must persist after restart.

---

## Step 3: Product and Inventory Engine

Build:

* Create product
* Edit product
* Deactivate product
* Search product
* Category support
* Initial stock
* Stock movement
* Low-stock detection

---

## Step 4: Pricing and Costing Engine

Build:

* Moving weighted average cost
* Stock value
* Default buying price
* Current selling price
* Selling price history
* Current expected profit

---

## Step 5: Price Snapshot Engine

Build:

* Sale item snapshot creation
* Unit cost at sale
* Unit selling price at sale
* Line revenue
* Line cost
* Line profit/loss
* Margin
* Old sale protection

---

## Step 6: Sales Engine

Build:

* Cart validation
* Sale creation
* Sale items
* Payment method
* Stock reduction
* Receipt creation
* Activity log
* Sync queue record

---

## Step 7: Fast Selling UI

Build:

* Product search
* Product list
* Cart
* Quantity controls
* Payment buttons
* Complete sale button
* Sale success message
* Optional receipt view
* Next customer flow

---

## Step 8: Debt Engine and UI

Build:

* Debt sale
* Debt customer
* Debt balance
* Partial payment
* Debt status
* Debt list/detail

---

## Step 9: Expense Engine and UI

Build:

* Add expense
* Expense categories
* Expense list
* Expense totals
* Net profit effect
* Owner-only restriction

---

## Step 10: Profit and Analytics Engine

Build:

* Total sales
* Gross profit
* Net profit
* Payment totals
* Product profit
* Low stock
* Best sellers
* Loss-making products
* Debt total
* Expense total

---

## Step 11: Owner and Sales Dashboards

Build:

* Owner dashboard with real analytics
* Sales dashboard with simple selling access
* Role-based visibility
* Empty states

---

## Step 12: Roles and Permission Engine

Build:

* Owner role
* Sales role
* Permission checks
* Direct route blocking
* Action-level restrictions

---

## Step 13: Device Rule Foundation

Build:

* Device registration
* Device status
* Sales-enabled flag
* Maximum 2 active devices
* Only 1 sales-enabled device

---

## Step 14: Offline Sync Queue Foundation

Build:

* Pending sync records
* Sync statuses
* Retry structure
* Pending sync count
* Idempotency key structure

Actual backend sync can be completed after MVP local flows are stable.

---

## Step 15: Subscription and License Foundation

Build:

* Subscription status
* Expiry date
* Grace period
* Offline license state
* Expired restriction
* Reactivation structure

---

# 7. MVP First Demo Scope

The first demo must show these working flows:

```txt
1. Owner creates business.
2. Owner adds product.
3. Owner adds stock.
4. Owner changes selling price.
5. Seller completes sale.
6. Stock reduces.
7. Receipt is created.
8. Debt sale is created.
9. Debt payment is recorded.
10. Expense is recorded.
11. Owner dashboard updates.
12. Sales user is blocked from profit/expenses.
13. Sale works offline.
14. Pending sync queue appears.
15. Subscription status affects access.
```

If these flows do not work, the demo is not ready.

---

# 8. MVP Data Accuracy Demo Test

Antigravity must verify this exact test before first demo:

```txt
1. Create product: Lotion.
2. Initial stock: 10 units.
3. Buying price: KSh 250.
4. Selling price: KSh 400.
5. Confirm stock value = KSh 2,500.
6. Sell 4 units using M-Pesa.
7. Confirm stock becomes 6.
8. Confirm revenue = KSh 1,600.
9. Confirm cost = KSh 1,000.
10. Confirm gross profit = KSh 600.
11. Add 10 units at buying price KSh 300.
12. Confirm stock becomes 16.
13. Confirm stock value becomes KSh 4,500.
14. Confirm average unit cost becomes KSh 281.25.
15. Change selling price to KSh 450.
16. Sell 2 units using Cash.
17. Confirm revenue = KSh 900.
18. Confirm cost = KSh 562.50.
19. Confirm profit = KSh 337.50.
20. Confirm remaining stock becomes 14.
21. Confirm old M-Pesa sale still uses selling price KSh 400.
22. Add expense of KSh 100.
23. Confirm total gross profit = KSh 937.50.
24. Confirm net profit = KSh 837.50.
```

If this test fails, the MVP is not ready.

---

# 9. MVP Role Demo Test

Antigravity must verify:

```txt
1. Login as Owner.
2. Confirm Owner can view dashboard, profit, expenses, products, stock, subscription, devices.
3. Login as Sales user.
4. Confirm Sales user can sell.
5. Confirm Sales user can view basic stock.
6. Confirm Sales user cannot view net profit.
7. Confirm Sales user cannot open expenses.
8. Confirm Sales user cannot open subscription settings.
9. Confirm Sales user cannot open device settings.
10. Confirm direct navigation to restricted screens is blocked.
```

Role restrictions must be real.

---

# 10. MVP Offline Demo Test

Antigravity must verify:

```txt
1. Turn off internet.
2. Search product.
3. Add product to cart.
4. Complete sale.
5. Confirm sale saves locally.
6. Confirm stock reduces locally.
7. Confirm receipt is created locally.
8. Confirm activity log is created locally.
9. Confirm sync queue item is created.
10. Restart app.
11. Confirm sale, stock change, receipt, and sync queue remain.
```

Offline behavior must be real.

---

# 11. MVP Subscription Demo Test

Antigravity must verify:

```txt
1. Set subscription to active.
2. Confirm selling works.
3. Set subscription to grace.
4. Confirm warning appears.
5. Confirm temporary access works.
6. Set subscription to expired.
7. Confirm restricted access applies.
8. Confirm renewal/reactivation screen remains accessible.
9. Reactivate subscription.
10. Confirm access returns.
```

Subscription status must not be fake.

---

# 12. MVP Screens Required

Minimum MVP screens:

```txt
Splash / loading
Login
Business setup
Owner dashboard
Sales dashboard
Fast selling
Receipt
Product list
Add / edit product
Stock-in
Stock movement history
Debt list
Debt detail
Debt payment
Expense list
Add expense
Reports / analytics
Activity history
Device management
Subscription
Sync status
Settings
```

Do not build unnecessary extra screens before these work.

---

# 13. MVP Backend Requirement

The MVP may be built in two stages.

## Stage A: Local-first MVP

Must include:

* SQLite
* Local persistence
* Engines
* UI
* Offline sale
* Sync queue structure
* Subscription/license local state

## Stage B: Cloud-connected MVP

Must add:

* Backend API
* PostgreSQL
* Authentication backend
* Sync API
* Subscription API
* Admin dashboard foundation

Antigravity must not pretend Stage A has real cloud sync before backend exists.

If backend sync is not yet built, app must clearly show:

```txt
Saved locally. Sync backend not connected yet.
```

---

# 14. MVP Acceptance Criteria

The MVP is accepted only when:

```txt
Product setup works
Stock-in works
Moving weighted average cost works
Selling price change works
Fast sale works
Stock reduction works
Sale item snapshots save
Receipt works
Debt sale works
Debt payment works
Expense recording works
Gross profit works
Net profit works
Owner dashboard uses real data
Sales user restrictions work
Offline sale works
Sync queue exists
Subscription status works
Data persists after restart
No fake production data exists
No M-Pesa verification exists
```

---

# 15. MVP Antigravity Report Required

After MVP build, Antigravity must report:

```txt
MVP build status:
Features completed:
Features not completed:
Files created:
Files modified:
Database tables created:
Engines created:
Screens created:
Tests added:
Manual tests completed:
Data accuracy test result:
Role test result:
Offline test result:
Subscription test result:
Known limitations:
No fake data confirmation:
Ready for demo: Yes/No
```

Do not accept MVP without this report.

---

# 16. MVP Red Flags

Stop Antigravity immediately if it:

* Builds dashboard before database
* Uses fake products
* Uses fake sales
* Uses hardcoded profit
* Adds M-Pesa code entry
* Makes checkout depend on internet
* Skips sale item snapshots
* Calculates old profit from current product prices
* Lets Sales user see Owner profit
* Claims sync works without backend confirmation
* Claims subscription is active with fake status
* Does not persist data after restart
* Marks MVP complete without manual tests

---

# 17. Final MVP Rule

Buzz Duka MVP must be a real shop tool, not a prototype illusion.

The MVP must prove that Buzz Duka can handle:

```txt
Real products
Real stock
Real buying price changes
Real selling price changes
Real sales
Real stock reduction
Real profit
Real debts
Real expenses
Real offline saving
Real role restrictions
Real subscription states
```

Anything outside this should wait.

The MVP goal is not to build many features.

The MVP goal is to build the correct foundation that can become a reliable business.
