# DOCUMENT 0.3: DO NOT BUILD / DO NOT CHANGE RULES

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Development control document
**Purpose:** Define what Antigravity must not build, change, remove, or assume without explicit approval.
**Primary Rule:** Do not add, remove, or alter core product direction unless the documentation explicitly says so.

---

# 1. Purpose of This Document

This document protects Buzz Duka from becoming a bloated, confusing, or wrongly built app.

Antigravity may sometimes add features that sound useful but do not match the approved product direction. This document prevents that.

Buzz Duka must remain:

* Simple
* Fast
* Offline-first
* Accurate
* Scalable
* Easy for shopkeepers
* Focused on selling, stock, profit, debts, and expenses

If a feature is not approved, do not build it.

If a core rule exists, do not change it.

If a decision is unclear, stop and ask before changing the product direction.

---

# 2. Do Not Build Unapproved M-Pesa Features

Buzz Duka must not become an M-Pesa verification or reconciliation system in the core app.

Do not build:

* M-Pesa transaction code entry
* Delayed M-Pesa code entry
* M-Pesa code verification
* M-Pesa transaction reconciliation
* Daraja API setup for shops
* STK Push checkout for customer purchases
* Till number integration
* PayBill integration
* Pochi la Biashara integration
* Automatic M-Pesa matching
* Payment confirmation callbacks
* M-Pesa balance reading
* M-Pesa statement import

Approved payment handling:

```txt id="1jqf61"
Cash
M-Pesa
Bank
Debt
```

Buzz Duka records the selected payment method only.

The owner can compare payment totals outside the app using their real M-Pesa, bank, Till, PayBill, or Pochi records.

---

# 3. Do Not Slow Down Checkout

Checkout speed is a core product requirement.

Do not add anything that slows down the sales flow.

Do not require during normal checkout:

* M-Pesa code
* Customer phone number, except debt sale where needed
* Customer name, except debt sale where needed
* Long notes
* Mandatory receipt sharing
* Mandatory receipt printing
* Payment verification
* Online server confirmation
* Extra approval screens
* Complex discount flow
* Batch selection
* Supplier selection
* Tax form entry

Approved checkout flow:

```txt id="qxl2d4"
Select product → Add to cart → Choose payment method → Complete sale → Next customer
```

If a proposed feature adds steps to checkout, delay it unless explicitly approved.

---

# 4. Do Not Break Offline-First Behavior

Buzz Duka must work offline for core shop operations.

Do not change the app so that selling requires internet.

Do not require online access for:

* Product search
* Adding items to cart
* Completing a sale
* Reducing stock
* Creating receipt
* Creating debt sale
* Recording expense
* Saving local sales history

Approved offline rule:

```txt id="nuyq8m"
Save locally first. Sync later.
```

Do not wait for cloud sync before completing a sale.

Do not remove local persistence.

Do not replace local database logic with server-only logic.

---

# 5. Do Not Use Fake Data for Production Features

Do not build production screens using:

* Hardcoded products
* Hardcoded sales
* Hardcoded profit
* Hardcoded debts
* Hardcoded expenses
* Hardcoded stock values
* Hardcoded dashboard totals
* Hardcoded subscriptions
* Hardcoded analytics

Demo/seed data is allowed only if:

* Clearly labeled as demo data
* Separated from production logic
* Easy to remove
* Not used to claim feature completion

Production screens must use real stored records.

---

# 6. Do Not Calculate Historical Profit From Current Prices

This is a critical rule.

Do not calculate historical profit using current product prices.

Wrong:

```txt id="195lr7"
historical profit = current selling price - current buying price
```

Correct:

```txt id="0tz4qy"
historical profit = SUM(line_profit_or_loss from sale_items)
```

Every sale item must save:

* Unit cost at sale
* Unit selling price at sale
* Quantity sold
* Revenue
* Cost
* Profit/loss
* Margin

Old sales must not change when product prices are edited later.

---

# 7. Do Not Change Buying Price Casually

Buying price must not be treated like a simple editable field that rewrites stock cost.

Buying price changes should happen through stock-in.

When adding stock, the owner enters:

```txt id="pscxhy"
Quantity added
Buying price per item
```

Then Buzz Duka recalculates moving weighted average cost.

Do not overwrite current average cost just because the owner edits default buying price.

Default buying price is only a suggested price for future stock-in.

---

# 8. Do Not Force Batch Selection in Default Checkout

Buzz Duka’s default app should use moving weighted average cost.

Do not force the cashier to choose:

* Old stock batch
* New stock batch
* Supplier batch
* Purchase lot
* FIFO batch

This would slow selling.

Advanced batch/FIFO logic can be considered later, but not in the default checkout.

---

# 9. Do Not Remove Price Snapshots

Every sale item must store price snapshots.

Do not remove or simplify these fields:

```txt id="9t9a3l"
unit_cost_at_sale
unit_selling_price_at_sale
line_revenue
line_cost
line_profit_or_loss
margin_percentage
stock_quantity_before_sale
stock_quantity_after_sale
```

These fields are required for accurate analytics.

If these fields are missing, the sales/profit system is incomplete.

---

# 10. Do Not Allow Sales User to See Owner-Only Information

Sales user must not access sensitive Owner information by default.

Do not allow Sales user to see:

* Net profit
* Gross profit reports
* Expense reports
* Advanced analytics
* Business settings
* Subscription settings
* Device management
* Staff/device controls
* Full activity history if sensitive
* Stock valuation reports

Sales user should mainly access:

* Sell screen
* Product search
* Cart
* Payment method selection
* Basic stock availability
* Recent sales
* Debt sale if allowed

Role restrictions must be enforced in logic, not only hidden from UI.

---

# 11. Do Not Add Extra Roles Early

Do not add roles such as:

* Manager
* Cashier 1
* Cashier 2
* Accountant
* Stock manager
* Auditor
* Branch manager
* Supplier
* Customer portal user

First version roles:

```txt id="5wbo6b"
Owner
Sales
```

Extra roles can be future paid features if needed.

---

# 12. Do Not Allow Unlimited Devices in Base Plan

Base plan device rule:

```txt id="lvqr71"
1 business
1 owner
1 sales user
Maximum 2 active devices
Only 1 sales-enabled device
```

Do not add:

* Unlimited devices
* Multiple sales devices
* Multiple cashiers
* Multiple branches
* Shared sales devices without approval
* Device bypass logic

This rule protects stock accuracy, offline behavior, and subscription value.

---

# 13. Do Not Hard Delete Critical Records

Critical records must not be permanently deleted casually.

Do not hard delete:

* Sales
* Sale items
* Stock movements
* Payment method records
* Debt records
* Debt payments
* Expenses
* Activity logs
* Subscription events
* Device approvals

Use statuses instead:

* Cancelled
* Reversed
* Inactive
* Archived
* Voided

Hard deletion can destroy audit history and analytics.

---

# 14. Do Not Build Complex Accounting Early

Buzz Duka should not become full accounting software in the first version.

Do not build early:

* Balance sheet
* General ledger
* Trial balance
* Double-entry accounting
* Payroll
* Tax filing
* Bank reconciliation
* Supplier ledgers
* Depreciation
* Formal financial statements

Buzz Duka should show simple business visibility:

* Sales
* Cost
* Gross profit
* Expenses
* Net profit
* Stock value
* Debts
* Product analytics

---

# 15. Do Not Build eTIMS or Tax Integration Early

Do not build early:

* eTIMS integration
* Tax filing
* VAT filing
* KRA reporting
* Fiscal printer integration
* Invoice compliance engine

These can be future premium features, but they should not delay the first working app.

---

# 16. Do Not Build Multi-Branch Early

Do not build early:

* Branch management
* Branch stock transfer
* Branch reports
* Multi-branch users
* Branch-level permissions
* Branch stock consolidation

Buzz Duka should first work perfectly for one shop.

Multi-branch can be a future plan.

---

# 17. Do Not Build Hardware Dependency Early

Do not make the first version depend on:

* Receipt printers
* Barcode scanners
* POS terminals
* Cash drawers
* External tablets
* Weighing scales
* Label printers

The first version must work on a normal Android phone.

Phone camera barcode scanning may be considered later, but it should not be required for selling.

---

# 18. Do Not Build Unnecessary AI Features

Do not add:

* AI chatbot
* AI business consultant
* AI product naming
* AI voice assistant
* AI-generated reports
* Predictive AI forecasting

Buzz Duka analytics should first be rule-based, accurate, and understandable.

AI can come later only after the core business data is reliable.

---

# 19. Do Not Build Complex Discounts Early

Do not build early:

* Coupon codes
* Loyalty discounts
* Bulk discounts
* Customer-specific pricing
* Campaign pricing
* Discount approval workflows

First version should use current selling price.

If price override is later allowed, it must save actual selling price at sale and be permission-controlled.

---

# 20. Do Not Build Supplier Management Early

Do not build full supplier management in the first version.

Do not build early:

* Supplier profiles
* Purchase orders
* Supplier debts
* Supplier payments
* Supplier statements
* Supplier performance

Stock-in can capture buying price without full supplier workflows.

Supplier features can come later.

---

# 21. Do Not Build Customer Loyalty Early

Do not build early:

* Loyalty points
* Rewards
* Coupons
* Customer tiers
* Membership cards
* Customer campaigns

Debt customer records are allowed because they support debt management.

Full customer loyalty is not part of the first core scope.

---

# 22. Do Not Build Custom Features Per Shop

Buzz Duka targets many shops, not one custom client.

Do not build one-off features for one shop unless approved as a general configurable feature.

Bad:

```txt id="2wdkxw"
Build a special workflow only for Beauty Shop A.
```

Good:

```txt id="sw3np0"
Add a configurable setting that many shops can use.
```

At 100,000+ shops, custom code per shop will not scale.

---

# 23. Do Not Change Tech Stack Randomly

Once the tech stack is approved, do not change:

* Frontend framework
* Backend framework
* Database
* Local database
* State management approach
* Authentication approach
* Sync strategy
* Deployment strategy

Any tech stack change must be explicitly approved.

Antigravity must not rewrite the project because it prefers a different tool.

---

# 24. Do Not Rewrite Working Modules Without Reason

If a module works and passes tests, do not rewrite it unnecessarily.

Do not rewrite:

* Inventory engine
* Pricing engine
* Sales engine
* Profit engine
* Sync engine
* Subscription engine
* Role permission system

Fix bugs with small targeted changes.

Avoid large rewrites unless the architecture document requires it.

---

# 25. Do Not Hide Bugs

Do not fix bugs by:

* Hiding error messages
* Removing validation
* Commenting out failing logic
* Hardcoding correct-looking values
* Skipping failed tests
* Ignoring sync failures
* Suppressing console errors without fixing cause

Bug fixes must address the root cause.

---

# 26. Do Not Skip Tests

Do not mark core modules complete without tests or manual verification.

Required test areas:

* Product creation
* Stock-in
* Weighted average cost
* Selling price change
* Sale creation
* Stock reduction
* Price snapshots
* Profit/loss
* Expense effect on net profit
* Debt balance
* Role restrictions
* Offline save
* Sync queue
* Subscription expiry

If the module affects money, stock, or access, it must be tested.

---

# 27. Do Not Ignore Business ID

Buzz Duka is multi-tenant.

Every important record must include `business_id`.

Do not create records without business separation.

Do not allow one shop to access another shop’s:

* Products
* Sales
* Stock
* Debts
* Expenses
* Analytics
* Subscription
* Devices
* Users

Tenant isolation is mandatory.

---

# 28. Do Not Ignore Activity Logs

Important actions must create activity logs.

Do not skip logs for:

* Product changes
* Price changes
* Stock-in
* Stock adjustment
* Sale completion
* Sale reversal
* Debt creation
* Debt payment
* Expense creation
* Device changes
* Subscription events

Activity logs protect trust and accountability.

---

# 29. Do Not Add Complicated Language

The app should use shopkeeper-friendly language.

Do not use complicated terms like:

* Gross margin variance
* Inventory threshold exception
* Payment reconciliation status
* Cost basis anomaly
* Revenue recognition
* Ledger posting

Use simple language like:

* This product gives low profit.
* This item is almost finished.
* This sale was saved offline.
* This customer still owes money.
* This product is selling below cost.

---

# 30. Do Not Make Dashboard Heavy

The dashboard should be fast and useful.

Do not overload it with:

* Too many charts
* Complex graphs
* Technical metrics
* Unnecessary animations
* Slow calculations during checkout
* Data that Sales user should not see

Owner dashboard should show clear, useful business insights.

Sales user dashboard should stay simple and focused on selling.

---

# 31. Do Not Block Sales Because of Analytics

Analytics should not slow checkout.

Do not calculate heavy reports during sale completion if it delays the next customer.

Sale completion should save necessary records quickly.

Analytics can update through cached summaries, background jobs, or later calculation as long as saved sale data is accurate.

---

# 32. Do Not Make Subscription Too Complex

Subscription should be simple.

Do not build early:

* Complex usage-based billing
* Enterprise contracts
* Reseller billing
* Multi-plan confusion
* Add-on marketplace
* Credit limits
* Custom invoices per shop

Start with:

```txt id="hg2gm3"
Buzz Duka Smart Plan: KSh 1,500/month
```

With:

* Active
* Grace
* Expired
* Suspended
* Reactivated

---

# 33. Stop Conditions

Antigravity must stop and ask before proceeding if:

* A requirement conflicts with another requirement
* A feature would slow checkout
* A feature would change pricing/costing logic
* A feature would expose Owner data to Sales user
* A feature would require M-Pesa integration
* A feature would require removing offline-first behavior
* A feature would require changing the tech stack
* A feature would require rewriting a working engine
* A feature is not listed in the approved documents

Do not guess on major product decisions.

---

# 34. Final Rule

Buzz Duka must remain focused.

Do not build anything that weakens these core goals:

```txt id="xt8qug"
Sell fast.
Track stock accurately.
Calculate profit correctly.
Work offline.
Show useful owner analytics.
Stay simple for shopkeepers.
Scale to many shops.
```

If a feature does not support those goals, do not build it now.
