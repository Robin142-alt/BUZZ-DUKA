# DOCUMENT 0.7: DEFINITION OF DONE DOCUMENT

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Development quality gate document
**Purpose:** Define the exact standard a Buzz Duka module must meet before Antigravity can claim it is complete.
**Primary Rule:** A module is only done when it is real, persistent, tested, verifiable, and follows Buzz Duka business rules.

---

# 1. Purpose of This Document

This document prevents incomplete work from being marked as finished.

Antigravity must use this document after every module, feature, screen, engine, API, or workflow.

A feature is not done because:

* The UI looks nice
* A button exists
* A success message appears
* A form opens
* A dashboard card shows a number
* A test passes using fake data only

A feature is done only when it works correctly with real data and can be verified.

---

# 2. Universal Definition of Done

A Buzz Duka module is done only if all the following are true:

```txt id="ctvoub"
1. The feature follows approved documentation.
2. No unapproved feature was added.
3. The feature uses real data.
4. The feature saves data correctly.
5. The data persists after app restart.
6. Related screens update from saved records.
7. Business rules are followed.
8. Role permissions are enforced.
9. Offline behavior works where required.
10. Tests or manual verification steps exist.
11. No hardcoded production data is used.
12. Errors are handled clearly.
13. Files changed are reported.
14. Known limitations are reported.
```

If any item fails, the module is not done.

---

# 3. Completion Report Required

After every module, Antigravity must provide this report:

```txt id="b33tdu"
Module name:
Status:
Files created:
Files modified:
Database/local tables affected:
Business logic implemented:
UI screens/components changed:
Tests added:
Manual verification steps:
Known limitations:
No fake data confirmation:
Unapproved features added: Yes/No
Next recommended step:
```

If this report is missing, the module should be treated as incomplete.

---

# 4. Data Persistence Done Criteria

Any feature that creates or changes shop data must persist that data.

Data persistence is done when:

* Data is stored in SQLite for local/offline use.
* Data remains after closing and reopening the app.
* Data can be read back from storage.
* Related screens load from storage.
* Syncable records are marked for sync where applicable.
* No important business record exists only in temporary screen state.

This applies to:

* Products
* Stock movements
* Sales
* Sale items
* Debts
* Debt payments
* Expenses
* Receipts
* Activity logs
* Subscription/license state
* Sync queue

---

# 5. Product Module Done Criteria

The product module is done only when:

* Owner can create a product.
* Product has required fields.
* Product saves to SQLite.
* Product persists after restart.
* Product can be searched.
* Product can be edited.
* Product can be deactivated.
* Product belongs to correct business ID.
* Product appears in selling flow.
* Product does not use hardcoded data.

Required product fields:

```txt id="3rafzw"
product_id/local_id
server_id where applicable
business_id
product_name
category_id
current_stock_quantity
low_stock_level
default_buying_price
current_selling_price
average_unit_cost
stock_value
status
created_at
updated_at
```

---

# 6. Stock Module Done Criteria

The stock module is done only when:

* Stock-in increases stock.
* Stock adjustment changes stock.
* Stock movement record is created for every change.
* Stock movement stores before and after values.
* Low-stock detection works.
* Stock value updates correctly.
* Stock persists after restart.
* Stock changes are linked to business ID, product ID, user ID, and timestamp.
* Activity log is created.

Stock is not done if quantity only changes visually.

---

# 7. Pricing and Costing Module Done Criteria

The pricing and costing module is done only when:

* Moving weighted average cost works.
* Buying price changes only through stock-in or audited correction.
* Selling price can change anytime.
* Selling price changes affect new sales only.
* Price history is saved.
* Stock value is calculated correctly.
* Current expected profit is calculated correctly.
* Old sales are not affected by price edits.
* Unit tests cover the formulas.

Required weighted average formula:

```txt id="1oq1yi"
New Average Unit Cost =
((Old Quantity × Old Average Cost) + (Added Quantity × Added Buying Price))
÷
(Old Quantity + Added Quantity)
```

Required test:

```txt id="01140z"
Old stock: 6 units at KSh 250
New stock: 10 units at KSh 300

Expected average cost:
((6 × 250) + (10 × 300)) ÷ 16 = KSh 281.25
```

---

# 8. Price Snapshot Done Criteria

The price snapshot module is done only when every sale item stores:

```txt id="863bms"
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

Snapshot is done only when:

* Snapshot is created at sale time.
* Snapshot values do not change after product price edits.
* Profit/loss supports negative values.
* Historical reports use snapshots.
* Tests prove old sales remain unchanged.

---

# 9. Sales Module Done Criteria

The sales module is done only when a completed sale creates:

* Sale record
* Sale item records
* Payment method value
* Stock movement records
* Receipt number
* Price snapshots
* Profit/loss values
* Activity log
* Sync queue record where applicable

Sale module is not done if:

* It only shows “sale completed”
* It does not reduce stock
* It does not save sale items
* It does not save price snapshots
* It disappears after restart
* It uses fake product data

Approved payment methods:

```txt id="w6dgsn"
Cash
M-Pesa
Bank
Debt
```

Do not add M-Pesa code or verification.

---

# 10. Receipt Module Done Criteria

The receipt module is done only when:

* Receipt is generated from a real sale.
* Receipt number is unique per business.
* Receipt includes real sale items.
* Receipt includes payment method.
* Receipt persists after restart.
* Receipt can be viewed later.
* Receipt viewing/sharing is optional.
* Receipt does not block next sale.

Receipt printer support is not required in the first version.

---

# 11. Fast Selling UI Done Criteria

The fast selling UI is done only when:

* Product search works with real products.
* User can add product to cart.
* Quantity can be changed.
* Cart total is correct.
* Payment method can be selected.
* Complete sale calls the real Sales Engine.
* Sale saves locally.
* Stock reduces.
* Cart clears after sale.
* User can immediately serve the next customer.
* No M-Pesa code or verification is added.
* No fake products are used.

Approved checkout flow:

```txt id="4ebzi1"
Select product → Add to cart → Choose payment method → Complete sale → Next customer
```

---

# 12. Debt Module Done Criteria

The debt module is done only when:

* Debt sale creates a real sale.
* Debt sale reduces stock.
* Debt sale saves sale item snapshots.
* Customer name is stored.
* Customer phone is optional.
* Debt balance is created.
* Partial payment reduces balance.
* Fully paid debt changes status to paid.
* Overdue status works if due date exists.
* Debt appears in Owner reports.
* Debt persists after restart.

Debt module is not done if it only shows customer balances without real debt records.

---

# 13. Expense Module Done Criteria

The expense module is done only when:

* Owner can add expense.
* Expense has amount and category.
* Expense saves to database.
* Expense appears in expense list.
* Expense persists after restart.
* Expense reduces net profit.
* Sales user cannot access expenses by default.
* Activity log is created.

Expense module is not done if dashboard expense totals are hardcoded.

---

# 14. Profit and Loss Module Done Criteria

Profit and loss module is done only when:

* Historical profit comes from sale item snapshots.
* Current expected profit comes from product current selling price and average cost.
* Gross profit is calculated from real sale items.
* Net profit subtracts real expenses.
* Negative profit/loss is supported.
* Debt sales are treated correctly.
* Cancelled/reversed sales are excluded from active profit.
* Tests cover profit formulas.

Correct historical formula:

```txt id="vfgzxv"
Historical profit = SUM(line_profit_or_loss from sale_items)
```

Correct net profit formula:

```txt id="8chlaw"
Net profit = Gross profit - Expenses
```

---

# 15. Analytics Module Done Criteria

Analytics module is done only when reports are calculated from real records.

Required analytics:

* Total sales
* Gross profit
* Net profit
* Payment method totals
* Best-selling products
* Low-selling products
* Highest-profit products
* Lowest-profit products
* Low-margin products
* Loss-making products
* Average selling price
* Average buying cost
* Low-stock products
* Dead stock
* Stock value
* Debt totals
* Expense totals
* Restock suggestions
* Price review alerts

Analytics is not done if:

* Values are hardcoded
* Reports do not update after real sales
* Profit is calculated from current prices
* Expenses do not affect net profit
* Debt data is ignored

---

# 16. Dashboard Done Criteria

The dashboard is done only when:

* It uses the real Analytics Engine.
* It shows empty state when there is no data.
* It updates after real records change.
* Owner dashboard is restricted to Owner.
* Sales dashboard does not expose sensitive owner data.
* Dashboard loads quickly.
* No fake numbers are shown.

Owner dashboard may show:

* Sales
* Gross profit
* Net profit
* Expenses
* Debt total
* Payment method totals
* Low stock
* Product insights
* Activity summary

Sales dashboard should stay simple and selling-focused.

---

# 17. Roles and Permissions Done Criteria

Roles and permissions are done only when:

* Owner and Sales roles exist.
* Permission checks are centralized.
* UI uses permission checks.
* Restricted screens are blocked.
* Restricted actions are blocked.
* Backend APIs later enforce permissions too.
* Sales user cannot access Owner-only data through direct navigation.
* Tests/manual checks prove restrictions work.

Sales user must not access:

* Net profit
* Expenses
* Advanced analytics
* Subscription settings
* Device management
* Business settings

---

# 18. Device Rules Done Criteria

Device rules are done only when:

* Device registration works.
* Device identity persists securely.
* Device status is stored.
* Owner can approve/remove devices.
* Only two active devices are allowed in base plan.
* Only one sales-enabled device is allowed.
* Sales actions only work on sales-enabled device.
* Device changes create activity logs.
* Tests/manual checks prove limits work.

---

# 19. Offline Done Criteria

Offline behavior is done only when:

* Core actions work without internet.
* Sale saves locally.
* Stock reduces locally.
* Receipt creates locally.
* Debt sale saves locally.
* Expense saves locally.
* Data remains after restart.
* Sync queue item is created.
* App does not block checkout waiting for server.

Offline is not done if the app only shows an “offline” label.

---

# 20. Sync Done Criteria

Sync is done only when:

* Local changes create sync queue items.
* Pending/syncing/synced/failed statuses work.
* Backend receives records when available.
* Duplicate uploads are prevented.
* Failed sync stores useful error.
* Retry works.
* Pending sync count is real.
* Records are marked synced only after backend confirmation.

Sync is not done if it only changes UI text.

---

# 21. Backend API Done Criteria

Backend APIs are done only when:

* They validate input.
* They require authentication.
* They enforce business ID.
* They enforce role permissions.
* They read/write real PostgreSQL records.
* They return real saved data.
* They prevent cross-business access.
* They handle errors clearly.
* They have tests/manual verification.

APIs are not done if they return dummy production data.

---

# 22. Subscription and License Done Criteria

Subscription/license module is done only when:

* Subscription status is stored.
* Expiry date is stored.
* Grace period works.
* Expired status restricts access.
* Offline license is checked.
* Reactivation restores access.
* Subscription status persists after restart.
* Subscription screen remains accessible when restricted.
* Tests/manual checks prove active, grace, expired, suspended, and reactivated states.

---

# 23. Admin Dashboard Done Criteria

Admin dashboard is done only when:

* Admin authentication exists.
* Admin routes are protected.
* Dashboard reads real backend records.
* Empty state appears when no shops exist.
* Shop list is real.
* Subscription statuses are real.
* Device lists are real.
* Admin actions update real records.
* Admin actions create audit logs.
* No fake shop counts or fake revenue are shown.

---

# 24. Error Handling Done Criteria

Error handling is done only when:

* Errors explain what happened.
* User knows what to do next.
* Errors are logged where needed.
* Failed actions do not corrupt data.
* Failed sales do not half-save silently.
* Failed sync can retry.
* Validation errors are clear.

Avoid vague errors like:

```txt id="kljrj8"
Something went wrong.
```

Use specific errors like:

```txt id="zvnffd"
Sale was saved on this phone but has not synced yet.
```

---

# 25. Testing Done Criteria

Testing is done only when the module has suitable tests.

Required test types depend on module:

* Engine modules need unit tests.
* API modules need integration tests.
* Full workflows need E2E/manual tests.
* Offline behavior needs offline manual tests.
* Role restrictions need permission tests.

Core logic that affects money, stock, access, or analytics must be tested.

---

# 26. Manual Verification Done Criteria

Manual verification is done only when steps are clear and repeatable.

Manual verification must include:

1. What to open
2. What data to enter
3. What action to perform
4. What result to expect
5. What related screen should update
6. Whether data remains after restart
7. Whether role restrictions apply

Manual verification should not be vague.

Bad:

```txt id="vlr6su"
Test sales and confirm it works.
```

Good:

```txt id="eq45iw"
Add product Lotion, stock 10, cost 250, selling price 400. Sell 4 units. Confirm stock becomes 6, revenue is 1,600, cost is 1,000, profit is 600, and sale persists after restart.
```

---

# 27. Release Done Criteria

Buzz Duka is release-ready only when:

* Registration/login works.
* Product setup works.
* Stock-in works.
* Moving weighted average cost works.
* Selling price changes work.
* Sales work.
* Stock reduces.
* Price snapshots save.
* Profit/loss is correct.
* Debts work.
* Expenses work.
* Dashboard uses real data.
* Offline selling works.
* Sync works where enabled.
* Roles and device rules work.
* Subscription control works.
* No fake production data exists.
* Critical tests pass.
* Manual checks pass.
* App is fast enough for shop use.

---

# 28. Final Definition

A Buzz Duka feature is done when it can be used by a real shopkeeper without pretending.

It must save real data, produce accurate results, survive app restart, respect permissions, work offline where required, and pass verification.

If it only looks done, it is not done.
