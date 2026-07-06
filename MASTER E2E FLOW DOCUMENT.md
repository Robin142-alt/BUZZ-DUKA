# DOCUMENT 21: MASTER E2E FLOW DOCUMENT

## Buzz Duka — End-to-End User Flows, Expected Results, Data Changes & Acceptance Tests

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** End-to-end flow document
**Purpose:** Define the full real-user flows Antigravity must build and test from start to finish.
**Core Rule:** A feature is not complete until the whole user flow works with real stored data.

---

# 1. Purpose of This Document

This document defines the main end-to-end flows for Buzz Duka.

Antigravity must use this document to test that screens, engines, local database, backend APIs, permissions, sync, subscription, and reports work together.

E2E means:

```txt id="n02qmk"
A real user starts an action, completes it, data is saved, related records update, reports change correctly, and the result survives app restart.
```

Do not test screens alone.

Test full business flows.

---

# 2. Main E2E Principle

Every E2E flow must prove:

```txt id="yk1lyu"
The UI works.
The engine works.
The database saves real records.
The correct permissions apply.
The correct reports update.
The data survives restart.
No fake data is used.
```

If a button only changes UI state but does not save records, the E2E flow has failed.

---

# 3. Required MVP E2E Flows

Buzz Duka MVP must support these full flows:

```txt id="bsxw2e"
1. Owner onboarding
2. Product setup
3. Stock-in
4. Selling price change
5. Fast sale
6. Debt sale
7. Debt payment
8. Expense recording
9. Profit analytics
10. Sale reversal
11. Offline sale and sync queue
12. Role restriction
13. Device restriction
14. Subscription expiry and reactivation
15. Subscription Till payment reconciliation
16. App restart data persistence
```

---

# 4. E2E Flow Result Format

For every E2E flow, Antigravity must confirm:

```txt id="gwyzn7"
Flow name:
User role:
Preconditions:
Steps performed:
Expected database records:
Expected UI result:
Expected dashboard/report result:
Expected permission behavior:
Restart test result:
Known issues:
Pass/Fail:
```

Do not say “works” without evidence.

---

# 5. Owner Onboarding E2E Flow

## User

```txt id="j3zve8"
Owner
```

## Goal

Owner creates account, business, first device, and starts using Buzz Duka.

## Steps

```txt id="5yfv59"
1. Open app.
2. Tap Create Account.
3. Enter Owner name.
4. Enter phone/email.
5. Enter password.
6. Enter business name.
7. Enter business category optional.
8. Confirm first device.
9. Complete setup.
10. Land on Owner dashboard or first-product setup screen.
```

## Expected records

```txt id="uaz00e"
businesses record created
users record created with role = owner
devices record created
subscription_records or local subscription state created
offline_license_state created if applicable
activity_logs record created
```

## Expected result

```txt id="x35w04"
Owner is logged in.
Business exists.
First device is active.
Owner permissions are loaded.
No fake products or sales appear.
```

## Acceptance criteria

```txt id="6ww7x5"
Owner can continue to product setup.
Business persists after app restart.
Owner remains tied to correct business_id.
```

---

# 6. Product Setup E2E Flow

## User

```txt id="jc1c6t"
Owner
```

## Goal

Owner adds the first sellable product.

## Steps

```txt id="a5494s"
1. Owner opens Products.
2. Taps Add Product.
3. Enters product name: Lotion.
4. Enters initial stock: 10.
5. Enters buying price: KSh 250.
6. Enters selling price: KSh 400.
7. Enters low-stock level: 2.
8. Saves product.
```

## Expected records

```txt id="10k4lx"
products record created
stock_movements record created with movement_type = initial_stock
price_history record optional/created where needed
activity_logs record created
sync_queue record created
```

## Expected product state

```txt id="uhpt4v"
current_stock_quantity = 10
average_unit_cost_cents = 25000
current_selling_price_cents = 40000
stock_value_cents = 250000
```

## Acceptance criteria

```txt id="qdtd8l"
Product appears in product list.
Product appears in Sell search.
Product persists after app restart.
Sales user can see product name, selling price, and stock only.
Sales user cannot see buying price or profit.
```

---

# 7. Stock-In E2E Flow

## User

```txt id="800ytg"
Owner
```

## Goal

Owner adds new stock at a different buying price and average cost updates.

## Preconditions

```txt id="satvkd"
Product Lotion exists.
Current remaining stock = 6.
Current average cost = KSh 250.
```

## Steps

```txt id="6eccnu"
1. Owner opens Stock or Product detail.
2. Selects Lotion.
3. Taps Add Stock.
4. Enters quantity added: 10.
5. Enters buying price: KSh 300.
6. Saves stock-in.
```

## Expected calculation

```txt id="0yx4sd"
Old stock value = 6 × 250 = KSh 1,500
Added stock value = 10 × 300 = KSh 3,000
New stock value = KSh 4,500
New quantity = 16
New average unit cost = KSh 281.25
```

## Expected records

```txt id="6ch1n7"
products updated
stock_movements record created
price_history average cost change created if needed
activity_logs record created
sync_queue record created
```

## Acceptance criteria

```txt id="ytgtpo"
Stock becomes 16.
Average cost becomes KSh 281.25.
Stock value becomes KSh 4,500.
Old sale item snapshots remain unchanged.
```

---

# 8. Selling Price Change E2E Flow

## User

```txt id="y1vqh6"
Owner
```

## Goal

Owner changes selling price and old sales remain unchanged.

## Steps

```txt id="d6zoh7"
1. Owner opens Product detail for Lotion.
2. Taps Change Selling Price.
3. Current selling price shows KSh 400.
4. Enters new selling price: KSh 450.
5. Adds optional reason.
6. Saves.
```

## Expected records

```txt id="bfq7ou"
products.current_selling_price_cents updated to 45000
price_history record created
activity_logs record created
sync_queue record created
```

## Expected result

```txt id="3do24g"
New sales use KSh 450.
Old sales still show KSh 400 if they were sold before change.
```

## Acceptance criteria

```txt id="yongvg"
Old sale item snapshots do not change.
Product search now shows new selling price.
Owner sees price history.
Sales user sees new selling price only.
```

---

# 9. Fast Sale E2E Flow

## User

```txt id="sqgw2x"
Owner or Sales user if device is sales-enabled
```

## Goal

Seller completes a fast sale.

## Preconditions

```txt id="iupm95"
Product Lotion exists.
Stock = 10.
Average cost = KSh 250.
Selling price = KSh 400.
Device is active and sales-enabled.
Subscription/license allows selling.
```

## Steps

```txt id="c770u1"
1. Open Sell screen.
2. Search Lotion.
3. Add Lotion to cart.
4. Set quantity to 4.
5. Select M-Pesa.
6. Tap Complete Sale.
7. See success message.
8. Start next sale.
```

## Expected records

```txt id="27uuw4"
sales record created
sale_items record created
stock_movements record created
receipts record created
activity_logs record created
sync_queue record created
```

## Expected calculations

```txt id="wco16i"
Revenue = 4 × 400 = KSh 1,600
Cost = 4 × 250 = KSh 1,000
Gross profit = KSh 600
Stock after sale = 6
```

## Expected UI result

```txt id="7ez5qg"
Sale completed.
Cart clears.
Receipt is optional.
Stock updates.
No M-Pesa code is requested.
No M-Pesa verification is required.
```

## Acceptance criteria

```txt id="silz2y"
Sale persists after app restart.
Dashboard updates from real data.
Sales user does not see profit.
Owner sees profit.
```

---

# 10. Debt Sale E2E Flow

## User

```txt id="fusl02"
Owner or Sales user if debt sale is allowed
```

## Goal

Seller completes a sale where customer will pay later.

## Preconditions

```txt id="imqpm5"
Product exists.
Stock is enough.
Device is sales-enabled.
Subscription/license allows selling.
```

## Steps

```txt id="vxdcey"
1. Open Sell screen.
2. Add product to cart.
3. Select payment method: Debt.
4. Enter customer name: Mary.
5. Enter phone optional.
6. Complete sale.
```

## Expected records

```txt id="xz8xbt"
sales record created with payment_method = debt
sale_items records created
stock_movements records created
receipts record created
customers record created if new
debts record created
activity_logs record created
sync_queue record created
```

## Expected result

```txt id="ctayp8"
Stock reduces.
Debt balance is created.
Debt appears in Owner debt list.
Sale appears in sales history.
```

## Acceptance criteria

```txt id="7yz1tn"
Debt sale is still a real sale.
Debt sale affects revenue and stock.
Debt balance equals sale total.
Sales user cannot manage debt payments by default.
```

---

# 11. Debt Payment E2E Flow

## User

```txt id="u8vjsg"
Owner
```

## Goal

Owner records partial or full payment for customer debt.

## Preconditions

```txt id="xh3jf5"
Mary has debt of KSh 1,200.
```

## Steps

```txt id="0eaz23"
1. Owner opens Debts.
2. Selects Mary.
3. Taps Record Payment.
4. Enters amount: KSh 500.
5. Selects payment method: Cash.
6. Saves payment.
```

## Expected records

```txt id="fh6tla"
debt_payments record created
debts.amount_paid_cents updated
debts.balance_cents updated
debts.debt_status updated
activity_logs record created
sync_queue record created
```

## Expected calculation

```txt id="ftw5wi"
Original debt = KSh 1,200
Payment = KSh 500
New balance = KSh 700
Status = partial
```

## Acceptance criteria

```txt id="t91fcq"
Debt payment persists after restart.
Debt balance is correct.
Owner dashboard debt total updates.
Sales user cannot record payment by default.
```

---

# 12. Expense Recording E2E Flow

## User

```txt id="7jbhrk"
Owner
```

## Goal

Owner records shop expense and net profit reduces.

## Steps

```txt id="99xssy"
1. Owner opens Expenses.
2. Taps Add Expense.
3. Enters amount: KSh 100.
4. Selects category: Transport.
5. Adds description optional.
6. Saves expense.
```

## Expected records

```txt id="euewkf"
expenses record created
activity_logs record created
sync_queue record created
```

## Expected result

```txt id="91d08e"
Expense appears in expense list.
Expense total increases.
Net profit reduces.
Gross profit does not reduce.
```

## Acceptance criteria

```txt id="zebk8s"
Sales user cannot open Expenses.
Expense persists after restart.
Net profit uses real expense records.
```

---

# 13. Profit Analytics E2E Flow

## User

```txt id="eltrxe"
Owner
```

## Goal

Owner sees correct sales, gross profit, expenses, net profit, debts, and product performance.

## Preconditions

```txt id="r7dvb4"
At least one sale exists.
At least one expense exists.
At least one debt exists.
```

## Steps

```txt id="a1vq7i"
1. Owner opens Dashboard.
2. Selects Today.
3. Reviews sales total.
4. Reviews gross profit.
5. Reviews expenses.
6. Reviews net profit.
7. Opens product performance.
8. Opens debt summary.
```

## Expected analytics

```txt id="dwiqfu"
Total sales comes from sales/sale_items.
Gross profit comes from sale_items.line_profit_cents.
Net profit = gross profit - active expenses.
Debt total comes from active debts.
Payment totals come from sales.payment_method.
```

## Acceptance criteria

```txt id="pxelwj"
No fake dashboard values.
Old sales do not change after product price changes.
Reversed sales are excluded from active totals.
Sales user cannot view Owner analytics.
```

---

# 14. Sale Reversal E2E Flow

## User

```txt id="n8sn4v"
Owner
```

## Goal

Owner corrects a mistaken sale without deleting history.

## Preconditions

```txt id="r7vxc2"
Completed sale exists.
Sale has reduced stock.
Receipt exists.
```

## Steps

```txt id="wqojw7"
1. Owner opens Sales History.
2. Selects sale.
3. Taps Reverse Sale.
4. Reads warning.
5. Selects reason: Sale entered twice.
6. Confirms reversal.
```

## Expected records

```txt id="rxw6aq"
sale_reversals record created
sales.sale_status updated to reversed
stock_movements created with movement_type = sale_reversal
receipts.receipt_status updated to reversed
debts updated if debt sale
activity_logs record created
sync_queue record created
```

## Expected result

```txt id="0ep1sx"
Stock restores.
Sale remains in history with reversed badge.
Receipt says reversed.
Active sales totals exclude reversed sale.
Profit excludes reversed sale.
Payment totals exclude reversed sale.
```

## Acceptance criteria

```txt id="c4tx7g"
Sales user cannot reverse sale.
Sale cannot be reversed twice.
Original sale item snapshots remain unchanged.
```

---

# 15. Offline Sale and Sync Queue E2E Flow

## User

```txt id="7nz9y0"
Owner or Sales user if allowed
```

## Goal

Seller completes sale offline and sync queue records it.

## Preconditions

```txt id="38awqw"
Product exists locally.
Device is allowed.
Offline license is valid.
```

## Steps

```txt id="ix1j3c"
1. Turn off internet.
2. Open Sell screen.
3. Search product.
4. Add product to cart.
5. Choose payment method.
6. Complete sale.
7. Close app.
8. Reopen app.
9. Check sale history and stock.
10. Check sync status.
```

## Expected result

```txt id="i51mzy"
Sale saves locally.
Stock reduces locally.
Receipt creates locally.
Sync queue item is created.
Pending sync count increases.
Data remains after restart.
```

## Acceptance criteria

```txt id="13njw0"
Checkout does not wait for internet.
No local data disappears.
No fake synced status appears.
```

---

# 16. Sync Upload E2E Flow

## User

```txt id="7123f5"
App/system sync process
```

## Goal

Pending offline records upload to backend safely.

## Preconditions

```txt id="gkv742"
Pending sync queue exists.
Internet is available.
Backend is available.
```

## Steps

```txt id="efvibm"
1. Turn internet on.
2. App starts sync or user taps Sync.
3. Sync engine uploads pending sale bundle.
4. Backend validates business, device, role, subscription, idempotency.
5. Backend saves records.
6. Backend returns server IDs.
7. App marks local records as synced.
8. User retries sync.
```

## Expected result

```txt id="ngpbpc"
Pending record becomes synced after backend confirmation.
Local records receive server IDs.
Duplicate retry does not create duplicate sale.
Sync errors are stored if upload fails.
```

## Acceptance criteria

```txt id="iecg0w"
No duplicate sale.
No duplicate stock reduction.
No fake synced status.
Failed sync can retry.
```

---

# 17. Role Restriction E2E Flow

## User

```txt id="a4ma6i"
Sales user
```

## Goal

Sales user can sell but cannot access Owner-only data.

## Steps

```txt id="c6vh93"
1. Login as Sales user.
2. Open Sales dashboard.
3. Open Sell screen.
4. Complete allowed sale.
5. Try to open Owner dashboard.
6. Try to open Expenses.
7. Try to open Profit report.
8. Try to open Device settings.
9. Try direct route to restricted screen.
```

## Expected result

```txt id="ue0ftu"
Sales user can sell if device/subscription allows.
Sales user cannot view profit.
Sales user cannot view expenses.
Sales user cannot manage devices.
Sales user cannot manage subscription.
Direct route access is blocked.
```

## Acceptance criteria

```txt id="kcmo2u"
Restrictions work in UI.
Restrictions work in local logic.
Restrictions work in backend APIs.
```

---

# 18. Device Restriction E2E Flow

## User

```txt id="hr7gbz"
Owner and Sales user
```

## Goal

Device limits and sales-enabled device rule work.

## Steps

```txt id="pd2qf3"
1. Owner registers first device.
2. Owner registers second device.
3. Try to register third active device.
4. Enable sales on first device.
5. Try to enable sales on second device.
6. Block first device.
7. Try to sell from blocked device.
```

## Expected result

```txt id="o6i5z6"
Third active device is blocked.
Only one sales-enabled device is allowed.
Blocked device cannot sell.
Removed device cannot sync new sales.
```

## Acceptance criteria

```txt id="wil2x4"
Device rules are enforced locally and on backend.
Activity logs are created for device changes.
```

---

# 19. Subscription Expiry E2E Flow

## User

```txt id="71p2zq"
Owner and Sales user
```

## Goal

Expired subscription blocks restricted actions but keeps old records visible.

## Steps

```txt id="urutz3"
1. Set subscription active.
2. Confirm selling works.
3. Set subscription grace.
4. Confirm warning appears.
5. Confirm selling still works.
6. Set subscription expired.
7. Try to sell.
8. Try to add product.
9. Try to add expense.
10. Open old sales history.
11. Open subscription screen.
```

## Expected result

```txt id="o3zo3o"
Active allows normal use.
Grace allows use with warning.
Expired blocks new restricted actions.
Old records remain visible in read-only mode.
Subscription screen remains accessible.
```

## Acceptance criteria

```txt id="m52o4x"
Expired users cannot continue selling.
Expired users do not lose data.
Sales user cannot bypass expiry.
```

---

# 20. Subscription Till Payment Reconciliation E2E Flow

## User

```txt id="heoqh9"
Owner
```

## Goal

Owner pays subscription to official Till and system reconciles payment.

## Important rule

```txt id="6fxc3x"
Buzz Duka does not hold money.
Payment goes directly to the official Buzz Duka Till/M-Pesa.
Buzz Duka only reconciles payment records.
```

## Steps

```txt id="qsixtp"
1. Owner opens Subscription screen.
2. App shows KSh 1,500/month plan.
3. App shows configured official Till number.
4. Owner pays KSh 1,500 to Till outside the app.
5. Owner taps Check Payment or Refresh.
6. Backend checks/reconciles payment.
7. Backend confirms correct Till, amount, and transaction.
8. Subscription becomes active/reactivated.
9. Offline license refreshes.
```

## Expected records

```txt id="kpz0ns"
subscription_payment_reconciliations record created/updated
subscription_records record created/updated
offline_license_state refreshed
activity_logs record created
admin audit/support log if manual correction was used
```

## Acceptance criteria

```txt id="71b9jk"
Typed reference alone does not activate subscription.
Wrong amount does not activate automatically.
Wrong Till is rejected.
Duplicate transaction does not activate twice.
Subscription activates after valid reconciliation only.
```

---

# 21. App Restart Persistence E2E Flow

## User

```txt id="10lvw1"
Owner or Sales user
```

## Goal

Data remains after app closes and reopens.

## Steps

```txt id="r6hhcc"
1. Add product.
2. Add stock.
3. Complete sale.
4. Record expense.
5. Record debt payment.
6. Close app completely.
7. Reopen app.
8. Check product list.
9. Check sales history.
10. Check stock quantity.
11. Check expense list.
12. Check debt balance.
13. Check dashboard.
```

## Expected result

```txt id="86lxfr"
All records remain.
Dashboard totals still match records.
Sync queue remains if records are pending.
User role remains correct.
```

## Acceptance criteria

```txt id="8hwt7t"
No important data disappears after restart.
No fake data replaces real data.
```

---

# 22. Master Data Accuracy E2E Flow

This is the most important E2E test.

## Steps

```txt id="xrx46n"
1. Create product Lotion.
2. Stock = 10.
3. Buying price = KSh 250.
4. Selling price = KSh 400.
5. Confirm stock value = KSh 2,500.
6. Sell 4 units using M-Pesa.
7. Confirm stock = 6.
8. Confirm revenue record = KSh 1,600.
9. Confirm cost record = KSh 1,000.
10. Confirm profit record = KSh 600.
11. Add 10 units at KSh 300.
12. Confirm stock = 16.
13. Confirm stock value = KSh 4,500.
14. Confirm average cost = KSh 281.25.
15. Change selling price to KSh 450.
16. Sell 2 units using Cash.
17. Confirm revenue record = KSh 900.
18. Confirm cost record = KSh 562.50.
19. Confirm profit record = KSh 337.50.
20. Confirm old M-Pesa sale still used KSh 400.
21. Add expense of KSh 100.
22. Confirm gross profit = KSh 937.50.
23. Confirm net profit = KSh 837.50.
```

## Acceptance criteria

```txt id="bnwv1z"
If this flow fails, Buzz Duka MVP is not ready.
```

---

# 23. Required E2E Tests Before MVP Demo

Antigravity must pass these before demo:

```txt id="89yszi"
Owner onboarding
Product setup
Stock-in
Fast sale
Debt sale
Debt payment
Expense recording
Owner analytics
Role restriction
Offline sale
App restart persistence
Subscription expiry
Subscription payment reconciliation
Sale reversal
Master data accuracy
```

Do not demo Buzz Duka if these fail.

---

# 24. What Antigravity Must Not Do

Antigravity must not:

```txt id="e7cvk7"
Test only UI rendering
Use fake product lists
Use fake dashboard values
Use fake subscription active status
Skip database persistence
Skip sale item snapshots
Skip stock movement records
Skip activity logs
Skip role restrictions
Skip offline testing
Mark sync as complete without backend confirmation
Activate subscription from fake payment reference
Treat Buzz Duka as money holder
```

---

# 25. Antigravity E2E Report Format

After E2E testing, Antigravity must report:

```txt id="sl80el"
E2E test report:
Flows tested:
Flows passed:
Flows failed:
Data accuracy result:
Offline result:
Role restriction result:
Subscription reconciliation result:
Sync result:
Sale reversal result:
Bugs found:
Bugs fixed:
Known limitations:
No fake data confirmation:
MVP demo ready: Yes/No
```

---

# 26. Final Rule

Buzz Duka must be proven through full flows.

A screen is not complete because it looks good.

A sale is complete only when stock, receipt, profit, activity log, and sync queue update correctly.

A subscription is active only when payment reconciliation confirms it.

A dashboard is correct only when it comes from real records.

Buzz Duka is ready only when the full shop workflow works from beginning to end.
