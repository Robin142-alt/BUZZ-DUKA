# DOCUMENT 2: MASTER BUSINESS RULES DOCUMENT

## Buzz Duka — Core Business Logic Rules

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Business rules master document
**Purpose:** Define the core rules that control products, stock, sales, payments, debts, expenses, activity logs, and data behavior in Buzz Duka.
**Core Rule:** Every business action must save real data, follow the approved rules, and protect stock/profit accuracy.

---

# 1. Purpose of This Document

This document defines the business rules Antigravity must follow when building Buzz Duka.

These rules control how the app behaves when a shopkeeper:

* Adds products
* Adds stock
* Changes prices
* Sells products
* Records payment method
* Creates debt sales
* Receives debt payments
* Records expenses
* Views reports
* Works offline
* Uses Owner or Sales role

Antigravity must not invent different business logic.

---

# 2. Core Business Rule

Buzz Duka must always protect four things:

```txt id="4zdl4u"
Stock accuracy
Sales accuracy
Profit accuracy
Owner control
```

No feature should damage these.

If a feature makes selling slower, corrupts stock, exposes owner data, or gives wrong profit, it should not be built.

---

# 3. Business Setup Rules

Each shop must have a business record.

A business record should include:

```txt id="fdpmey"
business_id
business_name
owner_user_id
subscription_status
created_at
updated_at
```

Every important record must belong to a business using `business_id`.

This applies to:

* Products
* Categories
* Stock movements
* Sales
* Sale items
* Debts
* Debt payments
* Expenses
* Receipts
* Devices
* Users
* Activity logs
* Sync records
* Subscription records

One business must never see another business’s data.

---

# 4. User Rules

Buzz Duka starts with two user roles only:

```txt id="39yu0s"
Owner
Sales
```

## Owner can:

* Manage products
* Add stock
* Adjust stock
* Change selling prices
* View profit
* View analytics
* View expenses
* Add expenses
* Manage debts
* Manage subscription
* Manage devices
* View activity history
* Manage business settings

## Sales user can:

* Search products
* Add products to cart
* Complete sales
* Choose payment method
* Create debt sale if allowed
* View basic stock availability
* View basic recent sales

## Sales user cannot:

* View net profit
* View owner analytics
* View expense reports
* Manage subscription
* Manage devices
* Manage business settings
* Change costing rules
* Perform cost corrections

Permissions must be enforced in logic, not only hidden in UI.

---

# 5. Device Rules

Base plan device rule:

```txt id="on5ar8"
1 business
1 owner
1 sales user
Maximum 2 active devices
Only 1 sales-enabled device
```

Allowed setups:

## One-device shop

Owner uses one phone for both management and selling.

## Two-device shop

Owner has one device.
Sales user has one sales-enabled device.

Do not allow two sales-enabled devices in the base plan.

Sales actions should only work on a device allowed to sell.

Device changes must create activity logs.

---

# 6. Product Rules

Every normal sellable item must be registered as a product.

A product must include:

```txt id="y0fbai"
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

Product names should be clear and searchable.

Products can be active or inactive.

Inactive products should not appear in normal selling search, but old sales history must remain intact.

Product deletion should not destroy old sales history.

---

# 7. Category Rules

Categories help organize products.

Examples:

```txt id="vwax5a"
Cosmetics
Food
Drinks
Electronics
Accessories
Household
Other
```

A product may belong to a category.

Category changes must not affect old sale records.

Category is for organization and reporting only.

---

# 8. Stock Rules

Stock quantity must change only through approved stock movements.

Approved stock movement types:

```txt id="6rijtc"
stock_in
sale
debt_sale
adjustment
damage
loss
reversal
cost_correction
```

Every stock change must create a stock movement record.

Do not change product stock silently.

Every stock movement must store:

```txt id="fbjksc"
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

---

# 9. Stock-In Rules

Stock-in means adding new stock to a product.

When adding stock, the Owner must enter:

```txt id="6dbmf5"
product
quantity_added
buying_price_per_unit
```

The system must calculate:

```txt id="e6brth"
total_cost = quantity_added × buying_price_per_unit
```

Stock-in must:

* Increase stock quantity
* Update stock value
* Recalculate moving weighted average cost
* Create stock movement
* Create activity log
* Preserve cost history

Buying price changes mainly happen through stock-in.

---

# 10. Moving Weighted Average Cost Rule

Buzz Duka uses Moving Weighted Average Cost as the default costing method.

Formula:

```txt id="cwqab8"
New Average Unit Cost =
((Old Quantity × Old Average Cost) + (Added Quantity × Added Buying Price))
÷
(Old Quantity + Added Quantity)
```

Example:

```txt id="j0z7tj"
Old remaining stock: 6 units
Old average cost: KSh 250
New stock added: 10 units
New buying price: KSh 300

New average cost =
((6 × 250) + (10 × 300)) ÷ 16
= KSh 281.25
```

Normal sales reduce stock and stock value, but do not change average unit cost.

Average unit cost changes when:

* New stock is added
* Owner performs approved cost correction/revaluation

---

# 11. Selling Price Rules

Selling price can change anytime.

When selling price changes:

* New sales use the new selling price
* Old sales remain unchanged
* Price history must be recorded
* Current expected profit must update

Old sale records must never be recalculated using the new selling price.

Correct:

```txt id="2py3jm"
Yesterday sale used KSh 400.
Today selling price changed to KSh 450.
Yesterday sale remains KSh 400.
New sale uses KSh 450.
```

---

# 12. Cost Correction Rules

Cost correction/revaluation is an advanced owner-only action.

It should be used only when the product’s remaining stock cost is wrong.

Cost correction must:

* Be Owner-only
* Require a reason
* Create activity log
* Affect remaining stock only
* Not rewrite old sales
* Create stock/cost correction record

Do not allow Sales user to perform cost corrections.

---

# 13. Sale Rules

A sale is valid only when:

* Cart has at least one item
* Every item exists as a real product
* Quantity sold is greater than zero
* Stock is enough, unless future settings allow negative stock
* Payment method is selected
* Sale is saved locally
* Sale item records are created
* Stock reduces
* Price snapshots are saved
* Receipt number is generated
* Activity log is created

A completed sale must create:

```txt id="jky8b7"
sale record
sale item records
payment method value
stock movement records
receipt record
activity log
sync queue record where applicable
```

Do not show “sale completed” unless these records are created.

---

# 14. Fast Checkout Rules

Approved checkout flow:

```txt id="ai6f4l"
Select product → Add to cart → Choose payment method → Complete sale → Next customer
```

Checkout must not require:

* M-Pesa code
* Payment verification
* Internet connection
* Long notes
* Customer details, except debt sale
* Receipt sharing
* Batch selection
* Complex accounting fields

The seller must be able to serve the next customer immediately after sale completion.

---

# 15. Sale Item Snapshot Rules

Every sale item must save immutable snapshots.

Required sale item snapshot fields:

```txt id="s6fysz"
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

Snapshots must not change after product prices change.

Historical profit must come from sale item snapshots.

---

# 16. Payment Method Rules

Buzz Duka records payment method only.

Allowed payment methods:

```txt id="0xx705"
Cash
M-Pesa
Bank
Debt
```

Payment method must be saved with the sale.

Payment totals must come from real sale records.

Example:

```txt id="h5gxbr"
M-Pesa total = SUM(sale_total where payment_method = "M-Pesa")
```

Buzz Duka must not verify M-Pesa payments in the core app.

Do not build:

* M-Pesa code entry
* M-Pesa confirmation
* M-Pesa reconciliation
* Daraja integration
* STK Push
* Till/PayBill/Pochi setup

---

# 17. Receipt Rules

A receipt must be generated from a completed sale.

Receipt should include:

```txt id="3fm6gt"
receipt_number
business_name
sale_id
date/time
sold_by
sale_items
quantities
unit prices
line totals
total amount
payment method
debt customer if applicable
```

Receipt view/share must be optional.

Receipt must not block the seller from serving the next customer.

Printer support is not required in the first version.

---

# 18. Debt Sale Rules

A debt sale is still a real sale.

Debt sale must:

* Create sale record
* Create sale item records
* Save payment method as Debt
* Reduce stock
* Save price snapshots
* Create debt record
* Create activity log
* Appear in debt reports

Debt sale requires customer name.

Customer phone may be optional.

Debt sale must not skip stock reduction.

---

# 19. Debt Payment Rules

Debt payment must reduce the customer’s debt balance.

Debt balance formula:

```txt id="zarqho"
debt_balance = original_debt_amount - total_debt_payments
```

Debt statuses:

```txt id="6z4p14"
unpaid
partial
paid
overdue
```

When debt is fully paid, status becomes `paid`.

Partial payments must be saved as real records.

Do not hardcode debt balances.

---

# 20. Expense Rules

Only Owner can manage expenses by default.

Expense record must include:

```txt id="80ug0x"
expense_id
business_id
amount
category
description
expense_date
created_by
created_at
updated_at
```

Default categories:

```txt id="6opbs1"
Rent
Salary
Transport
Electricity
Water
Internet
Airtime
Packaging
Repairs
County charges
Other
```

Expenses reduce net profit, not gross profit.

Formula:

```txt id="wtr4u4"
Net profit = Gross profit - Expenses
```

---

# 21. Profit Rules

Revenue:

```txt id="rhuxb5"
line_revenue = quantity_sold × unit_selling_price_at_sale
```

Cost:

```txt id="4knhyb"
line_cost = quantity_sold × unit_cost_at_sale
```

Profit/loss:

```txt id="bx6mf3"
line_profit_or_loss = line_revenue - line_cost
```

Gross profit:

```txt id="rqfgyk"
gross_profit = SUM(line_profit_or_loss from sale_items)
```

Net profit:

```txt id="iu4qqd"
net_profit = gross_profit - total_expenses
```

Buzz Duka must support negative profit.

If an item is sold below cost, the app must show a loss.

---

# 22. Stock Value Rules

Stock value represents the estimated value of remaining inventory.

Formula:

```txt id="26fpnt"
stock_value = current_stock_quantity × average_unit_cost
```

When stock is added:

```txt id="i2chj2"
stock value increases by added quantity × buying price
```

When stock is sold:

```txt id="tb2xjv"
stock value decreases by quantity sold × unit_cost_at_sale
```

Stock value must come from real product and stock records.

---

# 23. Analytics Rules

Analytics must be calculated from real records.

Analytics must not be hardcoded.

Required analytics include:

* Total sales
* Gross profit
* Net profit
* Expenses
* Debt total
* Payment method totals
* Best-selling products
* Low-selling products
* Highest-profit products
* Lowest-profit products
* Low-margin products
* Loss-making products
* Low-stock products
* Dead stock
* Stock value
* Restock suggestions
* Price review alerts

Analytics must use simple shopkeeper language.

Example:

```txt id="jbw3ta"
This product is selling below cost.
```

---

# 24. Activity Log Rules

Important actions must create activity logs.

Log actions such as:

* Product created
* Product edited
* Product deactivated
* Selling price changed
* Stock added
* Stock adjusted
* Average cost recalculated
* Sale completed
* Sale reversed
* Debt created
* Debt payment received
* Expense recorded
* Device added
* Device removed
* Subscription expired
* Subscription reactivated
* Sync failed

Activity logs must show real actions, not fake history.

---

# 25. Offline Rules

Buzz Duka must save locally first.

Offline actions should include:

* Product search
* Sale completion
* Stock reduction
* Receipt creation
* Debt sale
* Debt payment
* Expense recording
* Activity logging
* Basic dashboard data

Offline data must persist after app restart.

A sale must not fail just because internet is unavailable.

---

# 26. Sync Rules

Sync must happen after local save.

Sync statuses:

```txt id="b8lhak"
pending
syncing
synced
failed
```

Sync must:

* Upload real records
* Prevent duplicates
* Preserve business ID
* Preserve timestamps
* Preserve sale item snapshots
* Retry failed records
* Show real pending sync count

Do not mark synced unless backend confirms storage.

---

# 27. Subscription Rules

Buzz Duka uses monthly subscription.

Main plan:

```txt id="4banud"
Buzz Duka Smart Plan: KSh 1,500/month
```

Subscription statuses:

```txt id="f8edle"
active
grace
expired
suspended
reactivated
```

The app must not allow unlimited offline use after expiry.

Subscription screen should remain accessible when access is restricted.

Messages should be simple.

Example:

```txt id="tcylqb"
Your subscription has ended. Pay KSh 1,500 to continue using Buzz Duka.
```

---

# 28. Deletion and Reversal Rules

Critical records should not be hard deleted casually.

Do not hard delete:

* Sales
* Sale items
* Stock movements
* Debt payments
* Expenses
* Activity logs
* Subscription events
* Device records

Use statuses such as:

```txt id="hrw90a"
active
inactive
cancelled
reversed
voided
archived
```

If a sale is reversed, the app must:

* Mark sale as reversed
* Reverse stock where needed
* Exclude reversed sale from active reports
* Create activity log
* Preserve original sale history

---

# 29. Error Message Rules

Error messages must be clear.

Avoid:

```txt id="6q5b3q"
Something went wrong.
```

Use:

```txt id="f76p4n"
Stock is not enough for this sale.
```

```txt id="i987xy"
Sale was saved on this phone but has not synced yet.
```

```txt id="ertqbv"
This expense could not be saved. Try again.
```

```txt id="dw4tft"
Your subscription has expired. Connect to the internet to renew.
```

The user should understand what happened.

---

# 30. Business Rule Completion Checklist

A business module is complete only when:

```txt id="5sn7a9"
Real data is saved
Data persists after restart
business_id is included
Activity log is created where needed
Stock movement is created where needed
Price snapshots are saved where needed
Profit uses sale item snapshots
Expenses affect net profit
Debts update real balances
Roles are respected
Offline behavior works where required
No fake data is used
```

---

# 31. Final Business Rule

Buzz Duka must behave like a real shop system, not a demo.

Every action must protect the truth of the shop:

```txt id="2mxklb"
What was sold
What remains in stock
How much money came in
How much the stock cost
How much profit or loss was made
Who did the action
Whether the data has synced
```

If the system cannot prove those things with real records, the feature is not complete.
