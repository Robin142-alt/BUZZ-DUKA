# DOCUMENT 0.2: NO FAKE IMPLEMENTATION RULES

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Development control document
**Purpose:** Prevent Antigravity from creating fake, placeholder, hardcoded, UI-only, or incomplete features.
**Primary Rule:** A feature is not complete unless it works with real logic, real data, real persistence, and real verification.

---

# 1. Main Rule

Antigravity must not mark any Buzz Duka feature as complete unless the feature actually works.

A feature is not complete because:

* The screen looks good
* The button exists
* A success message appears
* A card shows numbers
* A dashboard has charts
* A form opens
* A list displays sample data

A feature is complete only when:

1. The user can perform the action.
2. The action saves real data.
3. The saved data remains after app restart.
4. The saved data updates related screens.
5. The feature follows Buzz Duka business rules.
6. The feature respects roles and permissions.
7. The feature works offline where required.
8. The feature has tests or manual verification steps.
9. No production feature depends on hardcoded sample data.

---

# 2. Forbidden Fake Work

Antigravity must not use fake implementation for core Buzz Duka features.

The following are forbidden in production logic:

* Hardcoded dashboard totals
* Hardcoded products
* Hardcoded sales
* Hardcoded profit values
* Hardcoded expenses
* Hardcoded debts
* Fake analytics
* Fake stock reduction
* Fake payment totals
* Fake subscription status
* Fake sync status
* Fake login success
* Buttons that do nothing
* Forms that show success but do not save
* APIs returning dummy data
* Console logs instead of real logic
* TODO comments replacing required logic
* Temporary placeholder functions marked as complete
* Frontend-only state pretending to be permanent storage
* Demo values mixed into real app logic
* Tests that pass only because they test mocked fake data

If demo data is needed for development, it must be clearly separated from production data and clearly labeled as demo/seed data.

---

# 3. UI Is Not Completion

A screen is not complete just because it appears in the app.

Every screen must be connected to real app behavior.

## Example: Product screen

The Product screen is not complete if it only displays product cards.

It is complete only when:

* Owner can add a product.
* Product saves to the local database.
* Product appears in the product list.
* Product remains after app restart.
* Product can be edited.
* Product can be used in a sale.
* Product stock reduces after sale.
* Product appears in analytics where applicable.

## Example: Sales screen

The Sales screen is not complete if it only shows a cart layout.

It is complete only when:

* User can select real products.
* Cart totals calculate correctly.
* Payment method is saved.
* Sale record is created.
* Sale item records are created.
* Stock reduces.
* Price snapshots are saved.
* Receipt number is created.
* Dashboard updates from the sale.
* Data remains after restart.

## Example: Dashboard screen

The Dashboard is not complete if it shows sample cards.

It is complete only when:

* Sales total comes from real sales records.
* Profit comes from real sale item snapshots.
* Expenses come from real expense records.
* Debt totals come from real debt records.
* Payment method totals come from real sale/payment records.
* Low stock comes from real product stock.
* Empty state appears when there is no data.

---

# 4. Real Data Persistence Rule

Buzz Duka must use real persistence for all important business data.

Important data must not disappear after closing or restarting the app.

This applies to:

* Businesses
* Users
* Devices
* Products
* Categories
* Stock movements
* Sales
* Sale items
* Payment methods
* Receipts
* Debts
* Debt payments
* Expenses
* Subscriptions
* Offline license data
* Sync queue
* Activity logs

For offline-first behavior, core data must be saved locally first.

---

# 5. Product and Inventory Must Be Real

Product and inventory features must not be fake.

A product feature is real only when:

* Product is stored in the database.
* Product belongs to the correct business ID.
* Product has required fields.
* Product can be searched.
* Product can be edited.
* Product can be deactivated.
* Product stock is tracked.
* Product stock changes after real stock movements.
* Product data is available offline.

Required product fields include:

```txt id="78nust"
product_id
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

Antigravity must not build a product list from static arrays unless clearly used only as temporary seed data.

---

# 6. Stock Must Be Real

Stock must not only change visually.

When stock changes, the system must create real stock movement records.

Stock movement must happen for:

* Stock-in
* Sale
* Debt sale
* Return/reversal
* Damage
* Loss
* Manual adjustment
* Cost correction where applicable

Every stock movement must store:

```txt id="42e8ib"
stock_movement_id
business_id
product_id
movement_type
quantity_change
quantity_before
quantity_after
unit_cost
stock_value_before
stock_value_after
average_cost_before
average_cost_after
reason
created_by
created_at
```

A stock feature is fake if:

* The number changes only on screen
* Stock resets after app restart
* No movement history is created
* Sale does not reduce stock
* Low-stock alerts use hardcoded data

---

# 7. Pricing and Costing Must Be Real

Buzz Duka’s pricing and costing logic must be real because analytics depend on it.

Antigravity must implement:

* Default buying price
* Current selling price
* Average unit cost
* Stock value
* Stock-in cost calculation
* Moving weighted average cost
* Selling price history
* Sale item price snapshots

Antigravity must not use this wrong shortcut:

```txt id="n0hg9w"
profit = current_selling_price - default_buying_price
```

Correct historical profit must come from saved sale item snapshots.

Correct sale item calculation:

```txt id="rt6j9p"
line_revenue = quantity_sold × unit_selling_price_at_sale
line_cost = quantity_sold × unit_cost_at_sale
line_profit_or_loss = line_revenue - line_cost
```

If prices change later, old sale records must remain unchanged.

---

# 8. Sales Must Be Real

A completed sale must create real records.

Every completed sale must create:

* Sale record
* Sale item records
* Payment method value
* Stock movement records
* Receipt number
* Profit/loss calculations
* Activity log
* Sync queue record if sync is enabled

A sale is fake if:

* It only shows “Sale completed”
* It does not save sale items
* It does not reduce stock
* It does not save price snapshots
* It does not update dashboard
* It disappears after restart
* It stores only total amount but not item details

Required sale item snapshots:

```txt id="8qk9vu"
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
created_at
```

---

# 9. Payment Method Must Be Real but Simple

Buzz Duka records payment method only.

Allowed payment methods:

```txt id="nkpj4u"
Cash
M-Pesa
Bank
Debt
```

Payment method is fake if:

* It does not save with the sale
* It does not appear in reports
* It does not update payment method totals
* It is hardcoded on dashboard
* It tries to verify M-Pesa even though verification is outside core scope

Antigravity must not add:

* M-Pesa code entry
* M-Pesa reconciliation
* M-Pesa API setup
* Automatic payment matching

---

# 10. Debt Must Be Real

Debt management must use real customer and balance records.

A debt feature is complete only when:

* Debt sale saves customer details.
* Debt sale reduces stock.
* Debt amount is recorded.
* Partial payments reduce balance.
* Paid debt status updates correctly.
* Overdue status works where due date exists.
* Debt appears in Owner dashboard.
* Debt data remains after restart.

Debt is fake if:

* Customer balance is hardcoded
* Partial payment does not update balance
* Debt sale does not reduce stock
* Debt status does not change from real payments

---

# 11. Expenses Must Be Real

Expense tracking must use real records.

An expense feature is complete only when:

* Owner can add expense.
* Expense saves to database.
* Expense appears in expense list.
* Expense reduces net profit.
* Expense is categorized.
* Expense remains after restart.
* Sales user cannot access expenses by default.

Expenses are fake if:

* Dashboard expense total is hardcoded
* Expense form shows success but does not save
* Net profit ignores expenses
* Sales user can access owner-only expense screens

---

# 12. Analytics Must Be Real

Analytics must be calculated from stored records.

Analytics must not be typed manually or hardcoded.

Required real analytics sources:

* Products table
* Stock movements table
* Sales table
* Sale items table
* Debts table
* Debt payments table
* Expenses table
* Payment method field

Analytics must calculate:

* Total sales
* Gross profit
* Net profit
* Payment method totals
* Product sales quantity
* Product revenue
* Product cost
* Product profit/loss
* Average selling price
* Average buying cost
* Low-margin products
* Loss-making products
* Low-stock products
* Dead stock
* Stock value
* Debt totals
* Expense totals

Analytics is fake if:

* Best sellers are hardcoded
* Profit is estimated from current prices
* Dashboard cards display sample numbers
* Reports do not change after real sales
* Expenses do not affect net profit
* Debt sales do not affect debt totals

---

# 13. Offline Mode Must Be Real

Offline mode is not complete because the app displays “Offline.”

Offline mode is complete only when:

* User can use core features without internet.
* Sale saves locally.
* Stock reduces locally.
* Receipt is created locally.
* Debt sale saves locally.
* Expense saves locally.
* Data remains after app restart.
* Pending sync record is created.
* Data syncs when internet returns.

Offline mode is fake if:

* App only shows an offline badge
* Sale fails without internet
* Sale saves only in memory
* Data disappears after restart
* Sync queue is not created
* App blocks checkout waiting for server

---

# 14. Sync Must Be Real

Sync is not complete because a label says “Synced.”

Sync is complete only when:

* Local unsynced records are uploaded to backend.
* Backend stores the records.
* Records are not duplicated.
* Failed sync shows error.
* Retry works.
* Sync status is updated from real results.
* User can see pending sync count.

Sync is fake if:

* It only changes text from pending to synced
* It does not send data to backend
* It does not handle failure
* It duplicates sales
* It ignores business ID

---

# 15. Authentication Must Be Real

Authentication is fake if login simply redirects to dashboard.

Authentication is real only when:

* User credentials are checked.
* Session/token is stored securely.
* Protected screens require login.
* User role is loaded.
* Business ID is loaded.
* Device permission is checked.
* Sales user cannot open Owner-only areas.
* Logged-out users cannot access protected screens.

---

# 16. Subscription Must Be Real

Subscription is fake if the app always shows “Active.”

Subscription is real only when:

* Subscription status is stored.
* Expiry date is stored.
* Grace period is calculated.
* Expired status restricts access.
* Offline license is checked.
* Reactivation can restore access.
* Subscription state persists after restart.
* User sees correct subscription status.

Subscription messages must be based on real subscription/license data.

---

# 17. Role Permissions Must Be Real

Role permission is not complete if the UI simply hides some buttons.

Permissions must be enforced in:

* Navigation
* Screens
* Local actions
* Backend APIs
* Data access
* Reports
* Settings

Sales user must not access:

* Net profit
* Expenses
* Advanced analytics
* Subscription settings
* Device management
* Business settings

If a Sales user can bypass UI and still access Owner data, the permission system is fake.

---

# 18. APIs Must Use Real Database Logic

Backend APIs must not return fake sample responses for production features.

Every production API must:

* Validate input
* Check authentication
* Check user role
* Check business ID
* Read/write real database records
* Return real saved data
* Handle errors clearly
* Prevent cross-business data access

Dummy API responses are only allowed in clearly labeled mock/demo mode.

---

# 19. Admin Dashboard Must Be Real

The internal admin dashboard must not show fake customer/shop data.

Admin dashboard features are real only when they read from actual backend records.

Admin dashboard must not:

* Hardcode shop counts
* Hardcode revenue
* Hardcode subscriptions
* Pretend to suspend/reactivate shops
* Show fake sync/error logs

If admin actions exist, they must update real records and create audit logs.

---

# 20. Tests Must Not Be Fake

Tests must verify real business logic.

Tests are weak or fake if they:

* Only check that components render
* Only test mocked sample values
* Do not test stock changes
* Do not test price snapshots
* Do not test profit/loss
* Do not test role restrictions
* Do not test persistence
* Do not test offline behavior

Required logic tests include:

* Product creation
* Stock-in
* Moving weighted average cost
* Selling price change
* Sale creation
* Stock reduction
* Sale item snapshots
* Profit/loss calculation
* Debt balance update
* Expense effect on net profit
* Dashboard totals
* Role restrictions
* Subscription expiry

---

# 21. Required Verification After Every Module

After each module, Antigravity must provide:

```txt id="o3ekf7"
1. Files created
2. Files modified
3. Database/local storage tables used
4. Real data saved by the feature
5. Business rules implemented
6. Tests added
7. Manual test steps
8. Known limitations
9. Confirmation that no fake or hardcoded production data was used
```

If Antigravity cannot provide this, the module is not complete.

---

# 22. Manual Verification Example

For product, stock, sales, pricing, and analytics, Antigravity must provide checks like this:

```txt id="7x9478"
Manual test:
1. Add product: Lotion.
2. Set buying price: KSh 250.
3. Set selling price: KSh 400.
4. Set stock: 10.
5. Close and reopen the app.
6. Confirm product still exists.
7. Sell 4 units.
8. Confirm stock becomes 6.
9. Confirm revenue is KSh 1,600.
10. Confirm cost is KSh 1,000.
11. Confirm profit is KSh 600.
12. Add 10 more stock at KSh 300.
13. Confirm average cost becomes KSh 281.25.
14. Change selling price to KSh 450.
15. Sell 2 units.
16. Confirm revenue is KSh 900.
17. Confirm cost is KSh 562.50.
18. Confirm profit is KSh 337.50.
19. Confirm old sale profit remains KSh 600.
20. Confirm dashboard uses these real values.
```

---

# 23. Red Flags

If Antigravity does any of the following, stop and fix immediately:

* Builds UI before data model
* Uses hardcoded totals
* Says “wired up” but no database writes exist
* Uses temporary arrays for production data
* Creates buttons with no real action
* Skips stock movement records
* Calculates profit from current product prices
* Allows Sales user to see Owner analytics
* Claims offline works without local persistence
* Claims sync works without backend storage
* Adds M-Pesa code/reconciliation features
* Marks module complete without manual tests

---

# 24. Definition of Real Completion

A Buzz Duka feature is complete only if it passes this checklist:

```txt id="usxu81"
UI exists
User action works
Data is saved
Data persists after restart
Related screens update
Business rules are followed
Role permissions are enforced
Offline behavior works where required
Tests or manual checks exist
No hardcoded production data is used
No unapproved features are added
```

---

# 25. Final Instruction

Antigravity must never claim a Buzz Duka feature is complete unless it is real, persistent, tested, and verifiable.

Good-looking UI without working logic is not acceptable.

Buzz Duka must be built for real shopkeepers, real sales, real stock, real profit, real debts, real expenses, and real analytics.

The app must not just look complete.

It must actually work.
