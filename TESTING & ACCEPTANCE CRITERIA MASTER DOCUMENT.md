# DOCUMENT 10: TESTING & ACCEPTANCE CRITERIA MASTER DOCUMENT

## Buzz Duka — Testing, Verification, Quality Gates & Release Acceptance

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Testing and acceptance master document
**Purpose:** Define how Antigravity must test Buzz Duka before marking any module, feature, engine, screen, API, or release as complete.
**Core Rule:** Buzz Duka is not complete unless it works with real data, survives restart, follows business rules, and passes verification.

---

# 1. Purpose of This Document

This document defines the testing rules for Buzz Duka.

Antigravity must use this document when testing:

* Products
* Stock
* Pricing
* Costing
* Sales
* Price snapshots
* Receipts
* Debts
* Debt payments
* Expenses
* Profit
* Analytics
* Dashboards
* Roles
* Devices
* Subscription
* Offline save
* Sync
* Backend APIs
* Admin dashboard
* Deployment readiness

Testing is not optional.

Any feature that affects money, stock, access, subscription, or business reports must be tested carefully.

---

# 2. Main Testing Rule

A Buzz Duka feature is accepted only when:

```txt id="ecndf4"
1. The feature works with real stored data.
2. The feature persists after app restart.
3. The feature follows approved business rules.
4. Related screens update correctly.
5. Role permissions are enforced.
6. Offline behavior works where required.
7. Tests or manual verification steps exist.
8. No fake production data is used.
9. No unapproved feature is added.
```

If any item fails, the feature is not accepted.

---

# 3. Types of Testing Required

Buzz Duka should use several types of testing.

## Unit tests

Used for small business logic functions.

Examples:

* Weighted average cost
* Profit calculation
* Debt balance calculation
* Stock value calculation
* Permission check
* Subscription status check

## Integration tests

Used for database and API flows.

Examples:

* Create product and stock movement
* Complete sale transaction
* Create debt sale
* Add expense and update net profit
* Sync sale to backend

## E2E tests

Used for full user workflows.

Examples:

* Owner adds product and sells it
* Sales user completes sale
* Offline sale syncs later
* Subscription expiry restricts access

## Manual verification

Used for real shop-like testing.

Manual tests must be clear, repeatable, and based on expected results.

---

# 4. No Fake Test Rule

Tests must not prove fake data works.

Forbidden test behavior:

* Testing only hardcoded dashboard numbers
* Testing only UI render without saving data
* Testing sale success without stock reduction
* Testing profit from current product price instead of snapshots
* Testing sync by changing local status without backend confirmation
* Testing subscription by always returning active
* Testing permissions only by hiding buttons

Tests must prove real business behavior.

---

# 5. Module Completion Testing Rule

After each module, Antigravity must report:

```txt id="ajbd1x"
Module tested:
Test type used:
Tests added:
Tests passed:
Tests failed:
Manual verification steps:
Known limitations:
Bugs found:
Bugs fixed:
No fake data confirmation:
```

A module is not complete if there are no tests or manual verification steps.

---

# 6. Project Foundation Acceptance Criteria

Project foundation is accepted only when:

* App runs without errors.
* TypeScript is configured.
* Folder structure is clean.
* Navigation shell works.
* Shared folders exist.
* No fake business data exists.
* No unapproved features are added.
* Basic test setup exists.

Antigravity must not build fake dashboards at this stage.

---

# 7. Local Database Acceptance Criteria

Local database is accepted only when:

* SQLite initializes successfully.
* Tables are created.
* Database migrations work.
* Records can be inserted.
* Records can be read back.
* Records can be updated.
* Data remains after app restart.
* Transactions are supported where needed.
* Business ID is stored in business-owned tables.
* Sync metadata exists for syncable records.

Required manual test:

```txt id="y9jzcm"
1. Create a product record.
2. Close and reopen app.
3. Confirm product still exists.
4. Create a sale record.
5. Close and reopen app.
6. Confirm sale still exists.
```

---

# 8. Product Module Acceptance Criteria

Product module is accepted only when:

* Owner can create product.
* Product saves to database.
* Product persists after restart.
* Product can be searched.
* Product can be edited.
* Product can be deactivated.
* Product belongs to correct business ID.
* Inactive product does not appear in normal selling search.
* Product old sales remain intact after edits.

Required product test:

```txt id="t6jmjs"
Create product Lotion with stock 10, buying price 250, selling price 400.
Confirm product saves and persists after restart.
```

---

# 9. Stock Module Acceptance Criteria

Stock module is accepted only when:

* Stock-in increases stock.
* Stock movement is created.
* Quantity before and after are saved.
* Stock value before and after are saved.
* Average cost before and after are saved.
* Stock adjustment requires reason.
* Damage/loss reduces stock correctly.
* Low-stock detection works.
* Activity log is created.

Required stock test:

```txt id="04okts"
1. Product stock starts at 10.
2. Add 5 more stock.
3. Confirm stock becomes 15.
4. Confirm stock movement exists.
5. Confirm stock movement has before = 10 and after = 15.
```

---

# 10. Pricing and Costing Acceptance Criteria

Pricing and costing are accepted only when:

* Moving weighted average cost works.
* Stock value updates correctly.
* Buying price changes through stock-in.
* Selling price can change anytime.
* Selling price changes affect new sales only.
* Price history is saved.
* Current expected profit is correct.
* Old sale snapshots remain unchanged.
* Tests cover the formula.

Required costing test:

```txt id="o91l23"
Old remaining stock: 6 units
Old average cost: KSh 250
Add stock: 10 units
New buying price: KSh 300

Expected:
New stock = 16
New stock value = KSh 4,500
New average cost = KSh 281.25
```

If this test fails, the costing engine is not accepted.

---

# 11. Price Snapshot Acceptance Criteria

Price snapshots are accepted only when every sale item saves:

```txt id="1e0x9e"
product_id
product_name_snapshot
quantity_sold
unit_cost_at_sale
unit_selling_price_at_sale
line_revenue
line_cost
line_profit_or_loss
margin_percentage
stock_quantity_before_sale
stock_quantity_after_sale
average_cost_at_sale
created_at
```

Required snapshot test:

```txt id="47vlbp"
1. Sell Lotion at selling price KSh 400.
2. Change current selling price to KSh 450.
3. Confirm old sale item still shows KSh 400.
```

Old sale data must never change because of product price edits.

---

# 12. Sales Engine Acceptance Criteria

Sales Engine is accepted only when:

* Empty cart cannot be sold.
* Product quantity must be greater than zero.
* Stock availability is checked.
* Payment method is required.
* Sale record is created.
* Sale item records are created.
* Stock reduces.
* Stock movement records are created.
* Receipt is created.
* Price snapshots are saved.
* Profit/loss is calculated.
* Activity log is created.
* Sync queue item is created where applicable.
* Sale persists after restart.

Required sale test:

```txt id="7mg8go"
1. Product: Lotion.
2. Stock: 10.
3. Average cost: KSh 250.
4. Selling price: KSh 400.
5. Sell 4 units using M-Pesa.

Expected:
Stock = 6
Revenue = KSh 1,600
Cost = KSh 1,000
Profit = KSh 600
Payment method = M-Pesa
Sale item snapshot saved
```

---

# 13. Receipt Acceptance Criteria

Receipt module is accepted only when:

* Receipt is created from completed sale.
* Receipt number is unique per business.
* Receipt uses real sale data.
* Receipt includes payment method.
* Receipt includes sale items.
* Receipt persists after restart.
* Receipt can be viewed later.
* Receipt does not show product cost or profit to customer.
* Receipt view/share is optional.

Required receipt test:

```txt id="n46b3u"
1. Complete a sale.
2. Open receipt.
3. Confirm receipt shows product, quantity, unit price, total, payment method.
4. Confirm receipt does not show cost or profit.
```

---

# 14. Fast Selling UI Acceptance Criteria

Fast Selling UI is accepted only when:

* Product search works with real products.
* Product can be added to cart.
* Quantity can be changed.
* Cart total is correct.
* Payment method can be selected.
* Complete sale calls real Sales Engine.
* Sale saves locally.
* Stock reduces.
* Cart clears after sale.
* Seller can immediately serve next customer.
* No M-Pesa code entry exists.
* No payment verification slows checkout.

Required UX test:

```txt id="czn3le"
1. Search Lotion.
2. Add 4 units to cart.
3. Select M-Pesa.
4. Complete sale.
5. Confirm sale succeeds.
6. Confirm cart clears.
7. Confirm next sale can start immediately.
```

---

# 15. Debt Module Acceptance Criteria

Debt module is accepted only when:

* Debt sale creates a real sale.
* Debt sale reduces stock.
* Debt sale saves sale item snapshots.
* Payment method is Debt.
* Debt record is created.
* Customer name is stored.
* Partial payment reduces balance.
* Fully paid debt changes status to paid.
* Debt persists after restart.
* Debt appears in Owner debt report.

Required debt test:

```txt id="i905qv"
1. Create debt sale for Mary worth KSh 1,200.
2. Confirm debt balance = KSh 1,200.
3. Record payment of KSh 500.
4. Confirm balance = KSh 700.
5. Record payment of KSh 700.
6. Confirm balance = KSh 0 and status = paid.
```

---

# 16. Expense Module Acceptance Criteria

Expense module is accepted only when:

* Owner can add expense.
* Expense amount is required.
* Expense category is required.
* Expense saves to database.
* Expense persists after restart.
* Expense appears in list.
* Expense affects net profit.
* Sales user cannot access expenses.
* Activity log is created.

Required expense test:

```txt id="p1b0sr"
1. Add expense Transport KSh 200.
2. Confirm expense appears in list.
3. Confirm total expenses increases by KSh 200.
4. Confirm net profit reduces by KSh 200.
5. Login as Sales user.
6. Confirm Sales user cannot open expenses.
```

---

# 17. Profit Engine Acceptance Criteria

Profit Engine is accepted only when:

* Revenue comes from sale item snapshots.
* Cost comes from sale item snapshots.
* Gross profit comes from sale item profit/loss.
* Net profit subtracts expenses.
* Negative profit is supported.
* Old sales do not change after price edits.
* Reversed sales are excluded from active totals.
* Tests cover all formulas.

Required profit test:

```txt id="tkjpbj"
Sale 1:
Revenue KSh 1,600
Cost KSh 1,000
Gross profit KSh 600

Expense:
KSh 200

Expected:
Net profit = KSh 400
```

---

# 18. Analytics Acceptance Criteria

Analytics are accepted only when:

* Total sales comes from real sales.
* Gross profit comes from sale items.
* Net profit includes expenses.
* Payment totals come from payment method field.
* Best sellers come from quantity sold.
* Low stock comes from product stock.
* Loss-making products are detected.
* Low-margin products are detected.
* Debt totals come from debts.
* Expense totals come from expenses.
* No hardcoded analytics exist.

Required analytics test:

```txt id="0xqnhy"
1. Complete real sale using M-Pesa.
2. Add real expense.
3. Create real debt.
4. Open Owner dashboard.
5. Confirm all dashboard values match real records.
```

---

# 19. Dashboard Acceptance Criteria

Owner dashboard is accepted only when:

* It uses real Analytics Engine.
* It updates after real sale.
* It updates after expense.
* It updates after debt payment.
* It shows empty states when no data exists.
* It shows pending sync count.
* It shows subscription status.
* Sales user cannot access owner dashboard.
* No fake numbers exist.

Sales dashboard is accepted only when:

* Sales user can sell.
* Sales user sees basic recent sales.
* Sales user sees basic stock.
* Sales user sees sync status.
* Sales user cannot see profit or expenses.

---

# 20. Role Permission Acceptance Criteria

Roles are accepted only when:

* Owner permissions work.
* Sales permissions work.
* Sales restrictions work.
* Permission checks are centralized.
* Direct route access is blocked.
* Local actions enforce permissions.
* Backend APIs enforce permissions where built.
* Sales user cannot access owner data.

Required role test:

```txt id="svx9po"
1. Login as Sales user.
2. Try to open Owner dashboard.
3. Expected: blocked.
4. Try to open expenses.
5. Expected: blocked.
6. Try to sell.
7. Expected: allowed if device/subscription allows.
```

---

# 21. Device Rules Acceptance Criteria

Device rules are accepted only when:

* Device registration works.
* Device identity persists.
* Maximum 2 active devices rule is enforced.
* Only 1 sales-enabled device is allowed.
* Sale is blocked on non-sales-enabled device.
* Removed device cannot continue selling.
* Device transfer does not bypass limits.
* Device actions create activity logs.

Required device test:

```txt id="ypsnyu"
1. Register first device.
2. Register second device.
3. Try to register third active device.
4. Expected: blocked.
5. Enable sales on first device.
6. Try to enable sales on second device.
7. Expected: blocked.
```

---

# 22. Subscription Acceptance Criteria

Subscription module is accepted only when:

* Active status allows normal access.
* Grace status shows warning.
* Grace status allows temporary access.
* Expired status restricts access.
* Suspended status restricts access.
* Reactivation restores access.
* Offline license is stored securely.
* Offline license does not allow unlimited expired use.
* Subscription screen remains accessible after restriction.
* Subscription events create activity logs.

Required subscription test:

```txt id="bgenyn"
1. Set subscription active.
2. Confirm selling works.
3. Set subscription grace.
4. Confirm warning appears.
5. Set subscription expired.
6. Confirm restricted access applies.
7. Reactivate subscription.
8. Confirm access returns.
```

---

# 23. Offline Acceptance Criteria

Offline behavior is accepted only when:

* Sale works without internet.
* Stock reduces locally.
* Receipt creates locally.
* Debt sale saves locally.
* Debt payment saves locally.
* Expense saves locally.
* Activity log saves locally.
* Sync queue item is created.
* Records persist after restart.
* App does not block checkout waiting for server.

Required offline test:

```txt id="6n0ny3"
1. Turn off internet.
2. Complete sale.
3. Confirm sale saves locally.
4. Confirm stock reduces locally.
5. Restart app.
6. Confirm sale and stock change remain.
7. Confirm sync queue item exists.
```

---

# 24. Sync Acceptance Criteria

Sync is accepted only when:

* Pending records upload to backend.
* Backend stores records.
* Local record receives server ID.
* Sync status becomes synced only after backend confirmation.
* Failed sync stores error.
* Retry works.
* Duplicate uploads do not create duplicate sales.
* Business ID isolation works.
* Removed device cannot sync new sales.

Required sync test:

```txt id="ltqy8q"
1. Create offline sale.
2. Confirm sync queue pending.
3. Turn internet on.
4. Sync records.
5. Confirm backend stores sale.
6. Confirm local sale becomes synced.
7. Retry same sync.
8. Confirm duplicate sale is not created.
```

---

# 25. Backend API Acceptance Criteria

Backend APIs are accepted only when:

* Auth works.
* Protected routes reject unauthenticated requests.
* Business ID isolation works.
* Role permissions work.
* Product API saves real records.
* Stock-in API updates weighted average cost.
* Sales API saves sale and sale items.
* Sales API preserves snapshots.
* Debt API updates balances.
* Expense API is Owner-only.
* Analytics API uses real records.
* Subscription API returns real status.
* Sync API prevents duplicates.
* No dummy production responses exist.

---

# 26. Admin Dashboard Acceptance Criteria

Admin dashboard is accepted only when:

* Admin login works.
* Admin routes are protected.
* Shop list uses real backend data.
* Subscription statuses are real.
* Device lists are real.
* Sync errors are real.
* Admin actions update real records.
* Admin actions create audit logs.
* Empty states appear when no data exists.
* No fake shop counts or fake revenue exist.

---

# 27. Security Acceptance Criteria

Security is accepted only when:

* Passwords are not stored in plain text.
* Auth tokens are protected.
* Backend validates user access.
* Backend filters by business ID.
* Sales user cannot access Owner data.
* Removed devices cannot continue syncing new data.
* Expired subscriptions are restricted.
* Secrets are not hardcoded.
* Admin dashboard is protected.

---

# 28. Performance Acceptance Criteria

Performance is accepted only when:

* Product search is fast.
* Sale completion is fast locally.
* Checkout does not wait for sync.
* Dashboard loads in reasonable time.
* Analytics do not freeze checkout.
* App works on normal Android phones.
* Sync runs without blocking selling.

Fast selling is more important than fancy animations.

---

# 29. Error Handling Acceptance Criteria

Error handling is accepted only when:

* Errors are specific.
* User understands what happened.
* User knows what to do next.
* Failed saves do not corrupt data.
* Failed sync can retry.
* Validation errors are clear.
* Access denied messages are clear.

Good examples:

```txt id="9gb9ip"
Stock is not enough for this sale.
```

```txt id="2ykl4k"
This device is not allowed to make sales.
```

```txt id="r4o8r8"
Sale was saved on this phone but has not synced yet.
```

Avoid vague messages like:

```txt id="zvbkdw"
Something went wrong.
```

---

# 30. Master Data Accuracy Test

This is the most important manual test.

Antigravity must run this test before release.

```txt id="scgdar"
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
22. Confirm total gross profit = KSh 937.50.
23. Add expense of KSh 100.
24. Confirm net profit = KSh 837.50.
25. Confirm dashboard totals come from these real records.
```

If this test fails, Buzz Duka is not ready.

---

# 31. End-to-End Owner Acceptance Test

```txt id="g2mekf"
1. Owner registers business.
2. Owner creates product.
3. Owner adds stock.
4. Owner changes selling price.
5. Owner completes sale.
6. Owner records expense.
7. Owner creates debt sale.
8. Owner records debt payment.
9. Owner views dashboard.
10. Owner confirms profit, debts, expenses, and stock are correct.
11. Owner checks activity history.
12. Owner checks subscription status.
13. Owner checks device status.
```

Expected result:

* All actions save real data.
* Dashboard updates correctly.
* Activity logs exist.
* No fake values appear.

---

# 32. End-to-End Sales User Acceptance Test

```txt id="q0bwbe"
1. Sales user logs in.
2. Sales user opens Sell screen.
3. Sales user searches product.
4. Sales user adds item to cart.
5. Sales user selects payment method.
6. Sales user completes sale.
7. Sales user sees success message.
8. Sales user can start next sale immediately.
9. Sales user tries to open expenses.
10. Sales user tries to open profit dashboard.
```

Expected result:

* Sale works.
* Stock reduces.
* Receipt is available.
* Expenses are blocked.
* Profit dashboard is blocked.

---

# 33. End-to-End Offline Acceptance Test

```txt id="2g2gkm"
1. Turn internet off.
2. Complete sale.
3. Confirm sale saved locally.
4. Confirm stock reduced locally.
5. Confirm receipt created locally.
6. Confirm sync queue item created.
7. Restart app.
8. Confirm local records still exist.
9. Turn internet on.
10. Sync records.
11. Confirm backend receives records.
12. Confirm local sync status becomes synced.
13. Confirm duplicate sale is not created.
```

Expected result:

* Offline work is real.
* Sync is real.
* No duplicate records.

---

# 34. Release Readiness Checklist

Buzz Duka is release-ready only when:

```txt id="bqqil5"
Project runs without critical errors
Local database works
Product setup works
Stock-in works
Moving weighted average cost works
Selling price changes work
Sales work
Stock reduces correctly
Sale item snapshots save
Receipt works
Debt sale works
Debt payment works
Expense recording works
Gross profit is correct
Net profit is correct
Dashboard uses real data
Roles are enforced
Device rules are enforced
Subscription rules work
Offline save works
Sync works where enabled
Backend APIs use real database
Admin dashboard uses real data
No fake production data exists
Critical tests pass
Manual verification passes
```

If any critical item fails, do not release.

---

# 35. Antigravity Final Test Report Format

Before claiming Buzz Duka is ready, Antigravity must provide:

```txt id="hakdw3"
Release test report:

App version:
Test date:
Modules tested:
Automated tests run:
Automated tests passed:
Automated tests failed:
Manual tests completed:
Critical bugs found:
Critical bugs fixed:
Known limitations:
Data accuracy test result:
Offline test result:
Sync test result:
Role test result:
Subscription test result:
No fake data confirmation:
Release recommendation:
```

---

# 36. Final Acceptance Rule

Buzz Duka must be accepted based on real working behavior, not appearance.

A screen that looks good but does not save data is not accepted.

A dashboard with beautiful fake numbers is not accepted.

A sale that does not reduce stock is not accepted.

A profit report that uses current product prices for old sales is not accepted.

A sync button that only changes text is not accepted.

Buzz Duka is accepted only when it can support a real shop with real products, real sales, real stock, real debts, real expenses, real offline use, real subscription control, and real analytics.
