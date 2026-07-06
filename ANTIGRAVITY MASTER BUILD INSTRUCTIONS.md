# DOCUMENT 0.1: ANTIGRAVITY MASTER BUILD INSTRUCTIONS

## Buzz Duka — Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Antigravity control document
**Purpose:** Give Antigravity strict development instructions so Buzz Duka is built as a real, working, simple, scalable shop POS system, not as fake UI screens or incomplete features.
**Target Scale:** 100,000+ shops
**Primary Platform:** Android-first mobile app
**Core Promise:** Sell fast. Track stock. Know profit.

---

# 1. Main Instruction

Antigravity must build Buzz Duka as a real working app, one module at a time.

Do not build the whole app at once.

Do not invent features.

Do not create fake screens.

Do not hardcode business data.

Do not mark a module as complete unless it saves real data, follows the business rules, works after app restart, and can be manually verified.

Buzz Duka must be built for real shopkeepers who need speed, simplicity, stock control, and accurate profit analytics.

---

# 2. Product Identity

Buzz Duka is a simple smart POS and shop management app for Kenyan shops.

It helps shopkeepers:

* Sell products quickly
* Track inventory
* Reduce stock after every sale
* Record how a customer paid
* Manage customer debts
* Record shop expenses
* Calculate profit accurately
* View simple analytics
* Work offline
* Sync later when internet returns
* Control subscription access

Buzz Duka should feel simple during selling and intelligent during reporting.

---

# 3. Core Product Direction

Buzz Duka must focus on these main areas:

1. Fast selling
2. Inventory control
3. Accurate pricing and costing
4. Product-level profit analytics
5. Debts
6. Expenses
7. Offline-first usage
8. Owner visibility
9. Simple subscription control

The app should not become complicated accounting software.

The shopkeeper should be able to use the app with minimal training.

---

# 4. What Buzz Duka Must Not Become

Antigravity must not build Buzz Duka as:

* A full accounting system
* A payroll system
* A tax filing system
* A bank reconciliation system
* An M-Pesa verification system
* A Daraja API onboarding service
* A supermarket ERP
* A multi-branch enterprise system in the first version
* A custom system for every individual shop

Buzz Duka must remain simple, standard, and scalable.

---

# 5. M-Pesa Scope Rule

Buzz Duka must not include M-Pesa verification in the core app.

Do not build:

* M-Pesa transaction code entry
* Delayed M-Pesa code entry
* M-Pesa code verification
* M-Pesa reconciliation
* Daraja integration for individual shops
* STK Push for customer shop payments
* Till/PayBill/Pochi API setup
* Automatic M-Pesa matching

Buzz Duka should only record the payment method selected during checkout.

Allowed payment methods:

```txt
Cash
M-Pesa
Bank
Debt
```

The owner can compare Buzz Duka’s payment totals with their real M-Pesa, Pochi, Till, PayBill, or bank records outside the app.

---

# 6. Checkout Speed Rule

The checkout flow must be extremely fast.

Approved selling flow:

```txt
Select product → Add to cart → Choose payment method → Complete sale → Next customer
```

During checkout, do not require:

* M-Pesa code
* Customer phone number, except where debt sale requires customer details
* Long notes
* Forced receipt sharing
* Cloud sync completion
* Payment verification
* Complex forms

When the sale is completed, the app must immediately return the user to the next sale flow.

Selling speed is more important than fancy screens.

---

# 7. Inventory Foundation Rule

Inventory is the foundation of Buzz Duka.

Every normal sellable item must be registered in inventory before it can produce accurate analytics.

Each product must have:

* Product name
* Category
* Current stock quantity
* Low-stock level
* Default buying price
* Current selling price
* Average unit cost
* Stock value
* Active/inactive status

Buzz Duka’s sales, profit, stock alerts, and analytics depend on inventory accuracy.

---

# 8. Dynamic Price Rule

Buying price and selling price can change over time.

Antigravity must handle this correctly.

## Buying price

Buying price changes when stock is added.

A product may still have old stock remaining when new stock is added at a higher or lower buying price.

Buzz Duka must not overwrite old cost blindly.

The app must use a moving weighted average cost for the default version.

## Selling price

Selling price can change at any time because the market is dynamic.

A selling price change must affect new sales only.

Old sales must never change when the selling price is edited.

---

# 9. Moving Weighted Average Cost Rule

When new stock is added, Buzz Duka must recalculate the product’s average unit cost.

Formula:

```txt
New Average Unit Cost =
((Old Quantity × Old Average Cost) + (Added Quantity × Added Buying Price))
÷
(Old Quantity + Added Quantity)
```

Example:

```txt
Old remaining stock: 6 units
Old average cost: KSh 250
New stock added: 10 units
New buying price: KSh 300

New average cost =
((6 × 250) + (10 × 300)) ÷ 16
= (1,500 + 3,000) ÷ 16
= 4,500 ÷ 16
= KSh 281.25
```

This average cost becomes the cost used for future sales.

Normal sales reduce stock quantity and stock value but should not change the average unit cost.

---

# 10. Price Snapshot Rule

Every sale item must save immutable price snapshots.

For every sold item, save:

* Product ID
* Product name snapshot
* Quantity sold
* Unit cost at sale
* Unit selling price at sale
* Line revenue
* Line cost
* Line profit or loss
* Margin percentage
* Stock quantity before sale
* Stock quantity after sale
* Average cost at sale
* Timestamp

This is non-negotiable.

Old sales and old profit reports must never change after product prices are edited.

---

# 11. Profit Accuracy Rule

Antigravity must not calculate profit using the current product price for historical reports.

Correct historical profit logic:

```txt
Historical profit = SUM(line_profit_or_loss from sale_items)
```

Correct current expected profit logic:

```txt
Current expected profit per item =
current_selling_price - current_average_unit_cost
```

Wrong logic:

```txt
Current selling price - current buying price = all-time profit
```

That is wrong because prices change over time.

Buzz Duka must support both profit and loss.

If a product is sold below cost, the system must show a negative profit.

---

# 12. Stock Value Rule

Buzz Duka must track stock value.

When stock is added:

```txt
Stock value increases by:
added quantity × added buying price
```

When stock is sold:

```txt
Stock value decreases by:
quantity sold × average unit cost at sale
```

When stock is damaged/lost:

```txt
Stock value decreases by:
quantity removed × current average unit cost
```

Stock value must come from real inventory records, not hardcoded numbers.

---

# 13. Roles Rule

Buzz Duka starts with only two roles:

1. Owner
2. Sales

## Owner can:

* Manage products
* Add stock
* Adjust stock
* Sell if device allows
* View profit
* View analytics
* Manage debts
* Record expenses
* Manage subscription
* Manage devices
* View activity history
* Access business settings

## Sales user can:

* Search products
* Add products to cart
* Complete sales
* Select payment method
* Create debt sales if allowed
* View basic stock availability
* View recent sales

## Sales user must not access:

* Net profit
* Business expenses
* Advanced owner analytics
* Subscription management
* Device management
* Business settings

Role restrictions must be real, not just hidden UI.

---

# 14. Device Rule

Base plan device rule:

* One business
* One owner
* One sales user
* Maximum two active devices
* Only one sales-enabled device

Allowed setups:

## One-device shop

Owner uses one phone for both management and selling.

## Two-device shop

Owner has one device.
Sales user has one sales-enabled device.

Do not allow two sales-enabled devices in the base plan.

This protects offline stock accuracy and reduces sync conflicts.

---

# 15. Offline-First Rule

Buzz Duka must save core actions locally first.

Core offline actions:

* Product search
* Selling
* Stock reduction
* Debt sales
* Expense recording
* Receipt creation
* Local sales history
* Basic dashboard data

Main rule:

```txt
Save locally first. Sync later.
```

The seller must not wait for cloud sync before serving the next customer.

---

# 16. Subscription Rule

Buzz Duka uses a monthly subscription.

Main plan:

```txt
Buzz Duka Smart Plan: KSh 1,500/month
```

The subscription system must support:

* Active status
* Grace period
* Expired status
* Suspended status
* Reactivation
* Offline license check

The app must not allow unlimited offline use after subscription expiry.

Subscription messages must be simple.

Example:

```txt
Your subscription has ended. Pay KSh 1,500 to continue using Buzz Duka.
```

---

# 17. No Fake Implementation Rule

Antigravity must never fake core functionality.

Forbidden:

* Hardcoded dashboard totals
* Fake products
* Fake sales history
* Fake analytics
* Fake stock reduction
* Fake sync status
* Fake subscription status
* Buttons that do nothing
* Forms that do not save
* Production APIs returning dummy data
* Console logs instead of real logic
* UI screens with no database/local storage connection
* Tests that only prove fake/mock data works

A feature is not complete because the UI looks good.

A feature is complete only when:

1. User action works.
2. Real data is saved.
3. Data remains after app restart.
4. Related screens update.
5. Business rules are followed.
6. Role permissions are respected.
7. Offline behavior works where required.
8. Tests or manual verification steps exist.

---

# 18. Real Data Rule

All core features must use real stored data.

Dashboard values must come from:

* Sales records
* Sale item records
* Stock movement records
* Product records
* Debt records
* Expense records
* Payment method records

Analytics must be calculated from real sale items.

Do not show sample values unless the app is in a clearly labeled demo mode.

Production logic must not depend on dummy data.

---

# 19. Build Order Rule

Antigravity must build Buzz Duka in controlled modules.

Do not jump straight to screens before building data and engines.

Recommended build order:

1. Project foundation
2. Local database
3. Product and inventory engine
4. Pricing and costing engine
5. Moving weighted average cost logic
6. Price snapshot logic
7. Sales engine
8. Receipt engine
9. Fast selling UI
10. Debt engine
11. Expense engine
12. Profit and loss engine
13. Analytics engine
14. Owner dashboard UI
15. Sales user UI
16. Roles and permissions
17. Device rules
18. Offline sync engine
19. Subscription and license engine
20. Backend APIs
21. Admin dashboard
22. Testing and polish
23. Deployment

Do not build everything at once.

---

# 20. Module Completion Report Rule

After every module, Antigravity must report:

1. Files created
2. Files modified
3. Database tables affected
4. Business logic added
5. UI screens added or changed
6. Tests added
7. Manual test steps
8. Known limitations
9. Confirmation that no fake data was used

If this report is missing, the module should not be considered complete.

---

# 21. Manual Verification Rule

Every feature must include manual verification steps.

Example:

```txt
Manual test:
1. Add product: Lotion.
2. Buying price: 250.
3. Selling price: 400.
4. Stock: 10.
5. Sell 4 units.
6. Confirm stock becomes 6.
7. Confirm revenue is 1,600.
8. Confirm cost is 1,000.
9. Confirm profit is 600.
10. Add 10 new stock at buying price 300.
11. Confirm new average cost is 281.25.
12. Change selling price to 450.
13. Sell 2 units.
14. Confirm revenue is 900.
15. Confirm cost is 562.50.
16. Confirm profit is 337.50.
17. Confirm old sale profit did not change.
```

If a feature cannot be manually verified, it is not complete.

---

# 22. Required Test Areas

Antigravity must add tests for important business logic.

Required test areas:

* Product creation
* Stock-in
* Stock reduction after sale
* Moving weighted average cost
* Selling price changes
* Sale item snapshots
* Profit and loss calculations
* Average selling price
* Average buying price
* Stock value
* Debt balance updates
* Expense effect on net profit
* Payment method totals
* Role restrictions
* Offline save behavior
* Sync queue behavior
* Subscription expiry behavior

Business calculations must not rely on visual checking only.

---

# 23. Activity History Rule

Important actions must be logged.

Log actions such as:

* Product created
* Product edited
* Selling price changed
* Stock added
* Buying price changed through stock-in
* Average cost recalculated
* Stock adjusted
* Sale completed
* Sale cancelled or reversed
* Debt created
* Debt payment received
* Expense recorded
* Device added
* Device removed
* User login
* Subscription expired
* Subscription reactivated
* Sync failed

Activity history helps the Owner know what happened in the shop.

---

# 24. UI Simplicity Rule

Buzz Duka must be simple for real shopkeepers.

Use:

* Large buttons
* Clear labels
* Short forms
* Simple words
* Fast search
* Clear totals
* Helpful empty states
* Simple error messages

Avoid technical language.

Use:

```txt
This product gives low profit.
```

Instead of:

```txt
Gross margin below threshold.
```

Use:

```txt
This item is almost finished.
```

Instead of:

```txt
Inventory threshold warning.
```

---

# 25. Performance Rule

Buzz Duka must remain fast on normal Android phones.

Performance expectations:

* Product search should be fast.
* Sale completion should be instant locally.
* Dashboard should load quickly.
* Sync should not freeze the app.
* Checkout should not require internet.
* Analytics should not slow the selling screen.

Selling speed is a core product requirement.

---

# 26. Error Handling Rule

Errors must be clear and useful.

Avoid vague messages like:

```txt
Something went wrong.
```

Use specific messages like:

```txt
Sale was saved on this phone but has not synced yet.
```

```txt
Stock is not enough for this sale.
```

```txt
This product could not be saved. Try again.
```

```txt
Your subscription has expired. Connect to the internet to renew.
```

The user should understand what happened and what to do next.

---

# 27. Feature Creep Rule

Do not add features just because they sound useful.

Before adding any feature, check whether it directly supports:

* Faster selling
* Stock control
* Profit accuracy
* Debts
* Expenses
* Offline use
* Subscription access
* Owner visibility

If not, delay it.

---

# 28. Do Not Break Existing Features Rule

When modifying the app, Antigravity must not break already working modules.

Before changing existing logic, confirm:

* Sales still work
* Stock still reduces correctly
* Weighted average cost still works
* Sale snapshots still save correctly
* Profit still calculates correctly
* Dashboard still uses real data
* Offline save still works
* Role restrictions still apply
* Subscription rules still work

Every change must preserve previous correct behavior unless documentation explicitly says otherwise.

---

# 29. Bug Fix Rule

When fixing a bug, Antigravity must:

1. Identify the root cause.
2. Explain what is broken.
3. Fix only the necessary part.
4. Avoid rewriting unrelated modules.
5. Add or update a test.
6. Run relevant checks.
7. Explain what changed.

Do not fix bugs by hiding errors, removing validation, or hardcoding values.

---

# 30. Final Master Instruction

Build Buzz Duka as a real, simple, offline-first smart POS for Kenyan shops.

Do not create fake UI-only features.

Do not invent unapproved features.

Do not add M-Pesa verification, M-Pesa codes, reconciliation, or Daraja setup in the core app.

Keep checkout fast.

Use inventory as the foundation.

Use moving weighted average cost for stock costing.

Save immutable price snapshots on every sale item.

Calculate historical profit from sale item records only.

Build one module at a time.

After every module, provide changed files, real data behavior, tests, manual verification steps, and confirmation that no fake data was used.

The goal is not to make Buzz Duka look complete.

The goal is to make Buzz Duka actually work for real shops.
