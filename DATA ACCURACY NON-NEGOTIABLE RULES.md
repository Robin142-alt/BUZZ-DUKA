# DOCUMENT 0.10: DATA ACCURACY NON-NEGOTIABLE RULES

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Data accuracy control document
**Purpose:** Define the non-negotiable rules Antigravity must follow to keep Buzz Duka’s stock, sales, pricing, profit, debts, expenses, and analytics accurate.
**Primary Rule:** Buzz Duka must never show business numbers that are fake, guessed, hardcoded, or calculated from the wrong source.

---

# 1. Purpose of This Document

Buzz Duka’s value depends on trust.

A shopkeeper must trust that the app shows:

* Correct stock
* Correct sales
* Correct cost
* Correct profit
* Correct debt balances
* Correct expense totals
* Correct payment method totals
* Correct stock value
* Correct analytics

If Buzz Duka gives wrong numbers, the owner may make bad business decisions.

Data accuracy is therefore not optional.

---

# 2. Main Data Accuracy Rule

Every number shown in Buzz Duka must come from real stored records.

Antigravity must not use:

* Guessed values
* Hardcoded totals
* Fake dashboard data
* Temporary UI-only values
* Current product prices for old sale profit
* Manually typed analytics
* Demo data in production screens

Correct rule:

```txt id="uj68u1"
Business numbers must come from database records and approved calculation engines.
```

---

# 3. Source of Truth Rule

Each type of data must have a clear source of truth.

```txt id="5awxmh"
Current product information → products table
Stock changes → stock_movements table
Historical sales → sales and sale_items tables
Historical profit → sale_items snapshots
Current stock value → products table + stock movement history
Debts → debts and debt_payments tables
Expenses → expenses table
Payment totals → sales payment_method field
Activity history → activity_logs table
Sync state → sync_queue and sync metadata
Subscription state → subscription/license records
```

Do not calculate important values from the wrong source.

---

# 4. Inventory Accuracy Rule

Product stock quantity must be accurate.

Stock quantity should change only through approved stock movement actions:

```txt id="d3r103"
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

A stock quantity change is invalid if there is no stock movement history.

Antigravity must not silently edit product quantity without recording why it changed.

---

# 5. Stock Movement Accuracy Rule

Every stock movement must store before and after values.

Required fields:

```txt id="lxa4xw"
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

This allows the owner to understand what happened to stock.

---

# 6. Buying Price Accuracy Rule

Buying price must not be treated as a casual editable field that rewrites stock history.

Buying price changes should happen through:

1. Stock-in
2. Audited cost correction/revaluation

When adding stock, save:

```txt id="mephzb"
quantity_added
unit_buying_price
total_cost
stock_quantity_before
stock_quantity_after
average_cost_before
average_cost_after
stock_value_before
stock_value_after
created_by
created_at
```

Do not overwrite old stock cost without recording a stock-in or correction event.

---

# 7. Moving Weighted Average Cost Rule

Buzz Duka’s default costing method is Moving Weighted Average Cost.

Formula:

```txt id="1al2iv"
New Average Unit Cost =
((Old Quantity × Old Average Cost) + (Added Quantity × Added Buying Price))
÷
(Old Quantity + Added Quantity)
```

Example:

```txt id="p81bxv"
Old stock: 6 units
Old average cost: KSh 250
New stock added: 10 units
New buying price: KSh 300

New average cost =
((6 × 250) + (10 × 300)) ÷ 16
= 4,500 ÷ 16
= KSh 281.25
```

This average cost is used for future sales until another stock-in or cost correction changes it.

---

# 8. Selling Price Accuracy Rule

Selling price can change at any time.

But selling price changes must affect only future sales.

Old sales must keep the selling price that was used at the time of sale.

Do not recalculate old sale revenue using the current selling price.

Correct:

```txt id="7sl072"
Old sale uses old selling price snapshot.
New sale uses current selling price.
```

Wrong:

```txt id="p0d9mz"
Update current selling price and recalculate all old sales.
```

---

# 9. Sale Item Snapshot Rule

Every sale item must save immutable snapshots.

Required fields:

```txt id="z0qpgc"
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

These snapshots are the source of truth for historical profit.

Do not remove these fields.

Do not update these fields after price changes.

---

# 10. Revenue Accuracy Rule

Revenue must come from actual sale item snapshots.

Formula:

```txt id="goxmra"
line_revenue = quantity_sold × unit_selling_price_at_sale
```

Sale total:

```txt id="rd31rl"
sale_total = SUM(line_revenue from sale_items)
```

Do not calculate sale revenue from current product selling price after the sale has already happened.

---

# 11. Cost Accuracy Rule

Cost must come from the unit cost saved at sale time.

Formula:

```txt id="pa33mf"
line_cost = quantity_sold × unit_cost_at_sale
```

The cost at sale time should normally be the product’s average unit cost at that moment.

Do not calculate old sale cost from the current average cost if average cost changed later.

---

# 12. Profit Accuracy Rule

Profit must be calculated from revenue and cost snapshots.

Formula:

```txt id="oi7308"
line_profit_or_loss = line_revenue - line_cost
```

Historical profit:

```txt id="i1saf5"
historical_profit = SUM(line_profit_or_loss from sale_items)
```

Buzz Duka must support negative profit.

If an item is sold below cost, the app must show a loss.

Wrong formula:

```txt id="75lmp8"
historical profit = current selling price - current buying price
```

This is wrong because prices change over time.

---

# 13. Gross Profit Accuracy Rule

Gross profit must come from sale item records.

Formula:

```txt id="47iy52"
gross_profit = SUM(line_profit_or_loss from sale_items for selected period)
```

Do not calculate gross profit from current product prices.

Do not manually type gross profit into dashboard cards.

---

# 14. Net Profit Accuracy Rule

Net profit must subtract real expenses from gross profit.

Formula:

```txt id="eothpy"
net_profit = gross_profit - total_expenses
```

Expenses must come from real expense records.

Do not subtract fake expense totals.

Do not ignore expenses when showing net profit.

---

# 15. Expense Accuracy Rule

Every expense must be saved as a real record.

Required fields:

```txt id="5xh8zs"
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

Expense total must come from the expenses table.

Expenses affect net profit, not gross profit.

Sales user must not access expense data by default.

---

# 16. Debt Accuracy Rule

Debt records must reflect real customer balances.

A debt sale must:

* Create a real sale
* Create sale item snapshots
* Reduce stock
* Save payment method as Debt
* Create a debt balance
* Appear in debt reports

Debt payment must:

* Reduce debt balance
* Save payment date
* Save paid amount
* Update status

Debt balance formula:

```txt id="f9tv83"
debt_balance = original_debt_amount - total_debt_payments
```

Do not hardcode customer balances.

---

# 17. Payment Method Accuracy Rule

Buzz Duka only records payment method.

Allowed payment methods:

```txt id="zmv780"
Cash
M-Pesa
Bank
Debt
```

Payment method totals must come from sales records.

Example:

```txt id="gglh9c"
M-Pesa total = SUM(sale_total where payment_method = "M-Pesa")
```

Do not add M-Pesa code verification.

Do not pretend M-Pesa totals are confirmed by Safaricom.

Buzz Duka records what the seller selected.

---

# 18. Stock Value Accuracy Rule

Stock value must represent the estimated value of remaining inventory.

Formula:

```txt id="c50y3o"
stock_value = current_stock_quantity × average_unit_cost
```

When stock is added:

```txt id="cn043e"
stock value increases by added quantity × buying price
```

When stock is sold:

```txt id="zlph6x"
stock value decreases by quantity sold × average_unit_cost_at_sale
```

Stock value must not be hardcoded.

---

# 19. Average Buying Price Accuracy Rule

Average buying price should mean the average cost of current remaining stock.

Formula:

```txt id="1sdbt9"
average_buying_price = current_stock_value ÷ current_stock_quantity
```

In Buzz Duka, this is usually the same as average unit cost.

If stock quantity is zero, avoid division by zero.

Use a clear empty or zero state.

---

# 20. Average Selling Price Accuracy Rule

Average selling price must come from real sale item records.

Formula:

```txt id="rpo06e"
average_selling_price =
total_product_revenue ÷ total_quantity_sold
```

This is for reporting only.

It must not replace current selling price during checkout.

---

# 21. Current Expected Profit Accuracy Rule

Current expected profit tells the owner the expected profit if the product sells now.

Formula:

```txt id="pe1sf5"
current_expected_profit =
current_selling_price - current_average_unit_cost
```

This is not the same as historical profit.

Historical profit comes from old sale item snapshots.

---

# 22. Dashboard Accuracy Rule

Dashboard cards must use real calculation engines.

Dashboard must not show:

* Fake sales total
* Fake profit
* Fake expense total
* Fake debt total
* Fake M-Pesa total
* Fake low stock count
* Fake best sellers
* Fake subscription status

If there is no data, show an empty state.

Example:

```txt id="s1zai2"
No sales recorded today.
```

Do not show fake “KSh 12,400” to make the dashboard look active.

---

# 23. Analytics Accuracy Rule

Analytics must come from real records.

Required real sources:

* Products
* Stock movements
* Sales
* Sale items
* Debts
* Debt payments
* Expenses
* Payment method field

Analytics must not be guessed.

Examples:

```txt id="jbnwnj"
Best seller = product with highest quantity_sold from sale_items.
```

```txt id="lbzydj"
Loss-making product = product where total line_profit_or_loss is negative.
```

```txt id="6s446i"
Low stock product = product where current_stock_quantity <= low_stock_level.
```

---

# 24. Activity Log Accuracy Rule

Important actions must create activity logs.

Required activity logs include:

* Product created
* Product edited
* Selling price changed
* Stock added
* Average cost recalculated
* Stock adjusted
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

Activity logs must show real user actions.

Do not create fake activity history.

---

# 25. Multi-Tenant Accuracy Rule

Buzz Duka must separate each shop’s data.

Every important record must include `business_id`.

Queries must filter by `business_id`.

One shop must never see another shop’s:

* Products
* Sales
* Stock
* Debts
* Expenses
* Analytics
* Subscription
* Devices
* Users

Cross-business data leakage is a critical bug.

---

# 26. Offline Accuracy Rule

Offline records must be real and persistent.

When offline, the app must still save:

* Sales
* Sale items
* Stock movements
* Debts
* Expenses
* Receipts
* Activity logs
* Sync queue records

Offline data must remain after app restart.

Do not pretend offline mode works using temporary screen state.

---

# 27. Sync Accuracy Rule

Sync must not duplicate or lose records.

Sync must preserve:

* Sale totals
* Sale item snapshots
* Stock movement history
* Debt balances
* Expense records
* Activity logs
* Business ID
* User ID
* Timestamps

A synced record should not be uploaded twice as two different records.

Use local IDs, server IDs, and idempotency keys where needed.

---

# 28. Subscription Accuracy Rule

Subscription status must come from real subscription/license data.

Do not always return “active.”

Subscription must support:

```txt id="4yu51a"
active
grace
expired
suspended
reactivated
```

Offline license state must be real and time-limited.

The app must not allow unlimited offline usage after expiry.

---

# 29. Role Accuracy Rule

Role permissions must be real.

Owner and Sales users must see different data.

Sales user must not access:

* Net profit
* Expense records
* Owner analytics
* Subscription settings
* Device settings
* Business settings

Do not rely only on hiding buttons.

Restricted data access must be blocked in logic.

---

# 30. Rounding Accuracy Rule

Money calculations must use consistent rounding.

Amounts should be stored and calculated carefully.

Recommended rule:

```txt id="15hnqf"
Store money in the smallest practical unit or use decimal-safe handling.
Display money rounded to 2 decimal places where needed.
```

Avoid floating point mistakes in important calculations.

Examples:

* Average cost may show KSh 281.25
* Profit may show KSh 337.50
* Quantity may be whole number for normal products unless fractional products are later approved

---

# 31. Time and Date Accuracy Rule

Every business record must have a timestamp.

Required:

```txt id="3qkvsn"
created_at
updated_at where applicable
business_date where reporting needs it
```

Reports such as “today’s sales” must use correct date filtering.

Offline records must preserve the original time of action, not only the sync time.

---

# 32. Reversal Accuracy Rule

Sales and stock records should not be hard deleted casually.

If a sale is reversed, create a proper reversal record.

Reversal must:

* Mark original sale as reversed/cancelled
* Reverse stock movement where appropriate
* Adjust analytics by excluding reversed sale
* Create activity log
* Preserve audit trail

Do not delete sale records to “fix” totals.

---

# 33. Data Repair Rule

If inaccurate data is discovered, Antigravity must not silently patch totals.

It must explain:

* What caused the inaccuracy
* Which records are affected
* How to detect affected records
* How to repair them safely
* How to prevent the issue from happening again

Data repair must be auditable.

---

# 34. Accuracy Test Requirements

Antigravity must test data accuracy for:

* Product creation
* Stock-in
* Moving weighted average cost
* Stock value
* Selling price change
* Sale item snapshot
* Stock reduction
* Revenue
* Cost
* Profit/loss
* Gross profit
* Net profit
* Expense totals
* Debt balances
* Payment method totals
* Low stock
* Role restrictions
* Offline persistence
* Sync duplicate prevention

Any module that affects money, stock, or access must be tested.

---

# 35. Required Manual Accuracy Test

Antigravity must verify this test across product, stock, sales, pricing, and analytics:

```txt id="zvdagm"
1. Add product: Lotion.
2. Initial stock: 10 units.
3. Buying price: KSh 250.
4. Selling price: KSh 400.
5. Confirm stock value is KSh 2,500.
6. Sell 4 units using M-Pesa.
7. Confirm stock becomes 6.
8. Confirm revenue is KSh 1,600.
9. Confirm cost is KSh 1,000.
10. Confirm gross profit is KSh 600.
11. Add 10 units at buying price KSh 300.
12. Confirm stock becomes 16.
13. Confirm stock value becomes KSh 4,500.
14. Confirm average unit cost becomes KSh 281.25.
15. Change selling price to KSh 450.
16. Sell 2 units using Cash.
17. Confirm revenue is KSh 900.
18. Confirm cost is KSh 562.50.
19. Confirm profit is KSh 337.50.
20. Confirm remaining stock becomes 14.
21. Confirm old M-Pesa sale still uses selling price KSh 400.
22. Confirm dashboard totals come from these real records.
23. Add expense of KSh 100.
24. Confirm net profit reduces by KSh 100.
```

If this test fails, data accuracy is not acceptable.

---

# 36. Final Non-Negotiable Rule

Buzz Duka must never lie to the shop owner.

If data is missing, show an empty state.

If sync failed, show pending or failed sync.

If a product sold at a loss, show the loss.

If subscription expired, show expired.

If no sales exist, show no sales.

Do not fake numbers to make the app look good.

Buzz Duka must be trusted because its numbers are real.
