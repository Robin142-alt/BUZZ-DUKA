# DOCUMENT 6: PROFIT, ANALYTICS & DASHBOARD SPECIFICATION

## Buzz Duka — Reports, Insights, Owner Dashboard & Sales Dashboard

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Analytics and dashboard master document
**Purpose:** Define how Buzz Duka must calculate profit, net profit, product analytics, stock insights, payment method totals, debt totals, expense totals, and dashboard values using real stored data.
**Core Rule:** Dashboard and analytics must never use fake numbers. Every number must come from real records and approved calculation logic.

---

# 1. Purpose of This Document

This document defines how Buzz Duka must calculate and display business performance.

Antigravity must use this document when building:

* Profit Engine
* Analytics Engine
* Owner dashboard
* Sales dashboard
* Product reports
* Payment method reports
* Debt reports
* Expense reports
* Stock value reports
* Low-stock alerts
* Loss-making product alerts
* Price review alerts
* Restock suggestions

Buzz Duka analytics must be simple, useful, fast, and accurate.

---

# 2. Main Analytics Principle

Buzz Duka must help the shop owner answer simple questions:

```txt id="cttihn"
How much did I sell?
How much profit did I make?
Which products are selling?
Which products are giving low profit?
Which products are almost finished?
Who owes me money?
How much did I spend?
Which payment methods were used?
Is my shop improving or losing money?
```

The app must not overwhelm the owner with complex accounting language.

Use simple shop language.

---

# 3. No Fake Dashboard Rule

Dashboard numbers must never be hardcoded.

Do not show fake values such as:

```txt id="72c5ix"
Today sales: KSh 12,400
Profit: KSh 3,200
M-Pesa: KSh 8,000
Low stock: 6 items
```

unless those numbers are calculated from real records.

If there is no data, show an empty state.

Example:

```txt id="pqwubu"
No sales recorded today.
```

Fake dashboard data is forbidden in production.

---

# 4. Approved Data Sources

Analytics must come from these records:

```txt id="0vsjzl"
products
stock_movements
sales
sale_items
debts
debt_payments
expenses
receipts
activity_logs
subscription/license records
sync records
```

Correct source examples:

```txt id="lov4o6"
Total sales → sales + sale_items
Gross profit → sale_items line_profit_or_loss
Net profit → gross profit - expenses
Payment totals → sales payment_method
Low stock → products current_stock_quantity and low_stock_level
Stock value → products stock_value
Debt total → debts balance
Expense total → expenses amount
Best sellers → sale_items quantity_sold
Loss-making products → sale_items line_profit_or_loss
```

Do not calculate analytics from temporary UI state.

---

# 5. Profit Engine Responsibilities

The Profit Engine must calculate:

* Line revenue
* Line cost
* Line profit/loss
* Sale total
* Sale cost
* Sale gross profit/loss
* Product revenue
* Product cost
* Product profit/loss
* Business gross profit
* Total expenses
* Net profit
* Current expected profit
* Profit margin
* Loss-making products
* Low-margin products

Profit calculations must use sale item snapshots.

---

# 6. Revenue Calculation Rules

Line revenue:

```txt id="f3ao7l"
line_revenue = quantity_sold × unit_selling_price_at_sale
```

Sale revenue:

```txt id="i6g0qc"
sale_total = SUM(line_revenue from sale_items)
```

Total sales for a period:

```txt id="helsn0"
total_sales = SUM(sale_total from completed sales in selected period)
```

Do not calculate old sale revenue from current product selling price.

---

# 7. Cost Calculation Rules

Line cost:

```txt id="1nkvfj"
line_cost = quantity_sold × unit_cost_at_sale
```

Sale cost:

```txt id="rqq91m"
sale_cost = SUM(line_cost from sale_items)
```

Total cost for a period:

```txt id="bwds9c"
total_cost = SUM(line_cost from sale_items for completed sales in selected period)
```

Do not calculate old sale cost from current product average cost if the average cost changed later.

---

# 8. Gross Profit Calculation Rules

Line profit/loss:

```txt id="vx4ke6"
line_profit_or_loss = line_revenue - line_cost
```

Sale gross profit/loss:

```txt id="v04ybj"
sale_gross_profit_or_loss = SUM(line_profit_or_loss from sale_items)
```

Business gross profit for a period:

```txt id="x5rc78"
gross_profit = SUM(line_profit_or_loss from sale_items for completed sales in selected period)
```

Gross profit must support negative values.

---

# 9. Net Profit Calculation Rules

Net profit means profit after expenses.

Formula:

```txt id="56ip5m"
net_profit = gross_profit - total_expenses
```

Expense total:

```txt id="s0jr3o"
total_expenses = SUM(active expenses for selected period)
```

Expenses must not reduce sale item profit directly.

Expenses reduce the business net profit.

---

# 10. Product Profit Calculation Rules

For each product, calculate:

```txt id="nnzzf3"
product_revenue = SUM(line_revenue for that product)
product_cost = SUM(line_cost for that product)
product_profit_or_loss = SUM(line_profit_or_loss for that product)
quantity_sold = SUM(quantity_sold for that product)
```

Product profit must come from sale item snapshots.

Do not calculate product profit using current product price.

---

# 11. Current Expected Profit Rule

Current expected profit tells the owner expected profit if the product sells now.

Formula:

```txt id="szz6ce"
current_expected_profit = current_selling_price - average_unit_cost
```

Current expected margin:

```txt id="t6z0nq"
current_expected_margin =
(current_expected_profit ÷ current_selling_price) × 100
```

This is different from historical profit.

Historical profit comes from actual sale records.

---

# 12. Average Selling Price Rule

Average selling price is for reporting.

Formula:

```txt id="dgn73t"
average_selling_price =
total_product_revenue ÷ total_quantity_sold
```

If quantity sold is zero, show empty state or zero safely.

Average selling price must not replace current selling price during checkout.

---

# 13. Average Buying Cost Rule

Average buying cost for current stock is the product’s average unit cost.

Formula:

```txt id="sd7ebo"
average_buying_cost = stock_value ÷ current_stock_quantity
```

In Buzz Duka, this normally equals `average_unit_cost`.

If stock quantity is zero, avoid division by zero.

---

# 14. Payment Method Analytics

Buzz Duka records payment method only.

Allowed payment methods:

```txt id="po8hef"
Cash
M-Pesa
Bank
Debt
```

Payment method totals:

```txt id="dism8r"
cash_total = SUM(sale_total where payment_method = Cash)
mpesa_total = SUM(sale_total where payment_method = M-Pesa)
bank_total = SUM(sale_total where payment_method = Bank)
debt_sales_total = SUM(sale_total where payment_method = Debt)
```

Do not claim M-Pesa total is verified by Safaricom.

Buzz Duka only reports what the seller selected.

---

# 15. Debt Analytics

Debt analytics must come from real debt records.

Required debt analytics:

* Total debt balance
* New debts created
* Partial debts
* Fully paid debts
* Overdue debts
* Debt payments received
* Customers with highest unpaid debt

Debt balance:

```txt id="bxx64d"
debt_balance = original_debt_amount - total_debt_payments
```

Debt sales count as sales because stock left the shop.

Debt payments reduce debt balance.

---

# 16. Expense Analytics

Expense analytics must come from real expense records.

Required expense analytics:

* Total expenses
* Expenses by category
* Expenses by date range
* Highest expense category
* Recent expenses
* Net profit impact

Expense total:

```txt id="f1jbwz"
total_expenses = SUM(active expenses for selected period)
```

Sales user must not access expense analytics by default.

---

# 17. Stock Value Analytics

Stock value must come from product records and stock calculations.

Formula:

```txt id="u2qsg1"
stock_value = current_stock_quantity × average_unit_cost
```

Business stock value:

```txt id="yu93wh"
total_stock_value = SUM(stock_value from active products)
```

This tells the owner the estimated value of remaining stock.

Do not hardcode stock value.

---

# 18. Low Stock Analytics

A product is low stock when:

```txt id="g4wz0j"
current_stock_quantity <= low_stock_level
```

Low-stock analytics should show:

* Product name
* Current quantity
* Low-stock level
* Suggested action

Simple message:

```txt id="ixn2bb"
This item is almost finished.
```

Do not use fake low-stock items.

---

# 19. Best-Selling Products

Best-selling products must be calculated from sale item quantities.

Formula:

```txt id="7kiqf2"
best_sellers =
products ordered by SUM(quantity_sold) descending
```

Show:

* Product name
* Quantity sold
* Revenue
* Profit if Owner is viewing
* Period selected

Sales user may see simple recent/frequently sold products, but not sensitive profit unless allowed.

---

# 20. Low-Selling Products

Low-selling products are products with low or zero sales in a selected period.

Possible logic:

```txt id="orimmo"
low_sellers =
active products with low quantity_sold in selected period
```

Dead stock may be products with no sales for a selected number of days.

Example default:

```txt id="a47eir"
dead_stock_days = 30
```

Simple message:

```txt id="7pwvvh"
This product has not sold recently.
```

---

# 21. Highest-Profit Products

Highest-profit products are products with the highest total product profit.

Formula:

```txt id="njxo69"
highest_profit_products =
products ordered by SUM(line_profit_or_loss) descending
```

This must use sale item snapshots.

Do not use current selling price minus current cost multiplied by quantity sold.

---

# 22. Lowest-Profit and Loss-Making Products

A loss-making product is a product where profit is negative.

Formula:

```txt id="p3cx3k"
product_profit_or_loss < 0
```

Simple message:

```txt id="9qlv03"
This product is selling below cost.
```

Lowest-profit products should help the owner review prices.

---

# 23. Low-Margin Product Rule

A low-margin product is one where profit percentage is below a threshold.

Possible formula:

```txt id="of0m25"
margin_percentage =
(line_profit_or_loss ÷ line_revenue) × 100
```

Possible threshold:

```txt id="mm2xfq"
LOW_MARGIN_THRESHOLD_PERCENT = 10
```

Use simple message:

```txt id="5qqyco"
This product sells fast but gives low profit.
```

Threshold can be configurable later.

---

# 24. Price Review Alerts

Buzz Duka should help the owner notice when selling price may need review.

Show price review alert when:

* Current selling price is below average unit cost
* Current expected profit is too low
* Buying cost increased but selling price stayed the same
* Product sells fast but has low margin

Example insights:

```txt id="rjvczz"
Buying cost increased, but selling price stayed the same. Profit per item has reduced.
```

```txt id="4kvvl1"
This product is selling below cost.
```

```txt id="57pvyq"
This product sells fast but gives low profit.
```

---

# 25. Restock Suggestions

Restock suggestions should come from real stock and sales data.

A product may need restocking when:

* Current stock is at or below low-stock level
* Product sells frequently
* Product is close to stockout

Suggested fields:

```txt id="8e8jfy"
product_name
current_stock_quantity
low_stock_level
recent_quantity_sold
suggested_action
```

Simple message:

```txt id="pfatca"
Restock soon. This item is almost finished.
```

---

# 26. Owner Dashboard Scope

Owner dashboard should show business performance.

Owner dashboard may include:

* Today’s sales
* Gross profit
* Net profit
* Expenses
* Debt total
* Cash total
* M-Pesa total
* Bank total
* Debt sales total
* Low stock count
* Best-selling products
* Low-margin products
* Loss-making products
* Restock suggestions
* Price review alerts
* Recent activity
* Pending sync count
* Subscription status

Owner dashboard must use real analytics engine results.

---

# 27. Sales Dashboard Scope

Sales user dashboard should be simple and selling-focused.

Sales dashboard may show:

* Big Sell button
* Product search shortcut
* Recent sales
* Basic stock availability
* Pending sync count
* Optional receipt history
* Subscription warning if it affects selling

Sales dashboard must not show:

* Net profit
* Gross profit
* Expense totals
* Owner analytics
* Stock value
* Product profit reports
* Subscription management
* Device management
* Business settings

---

# 28. Dashboard Empty States

If no data exists, dashboard must show empty states.

Examples:

```txt id="t47cuw"
No sales recorded today.
```

```txt id="2rfu8j"
No expenses recorded this period.
```

```txt id="ik2dre"
No customer debts yet.
```

```txt id="2z0qco"
No low-stock products right now.
```

Do not fill empty dashboards with fake numbers.

---

# 29. Dashboard Time Filters

Dashboard should support simple date filters.

Recommended filters:

```txt id="e0uoha"
Today
Yesterday
This week
This month
Custom range later
```

Reports must use correct timestamps.

Offline records should use original action time, not sync time.

---

# 30. Reversed and Cancelled Sales Rule

Reversed or cancelled sales must not count as active sales.

Analytics should exclude:

```txt id="q4itj1"
cancelled
reversed
voided
```

unless the report is specifically showing cancelled/reversed history.

Original records must remain for audit.

---

# 31. Offline Analytics Rule

Buzz Duka should show useful local analytics offline.

Offline dashboard may use local records.

If some data has not synced, show status clearly.

Example:

```txt id="vqpg1d"
Some sales are saved on this phone and not yet synced.
```

Do not block local dashboard just because internet is unavailable.

---

# 32. Sync Status Analytics

Owner and Sales user may need to know whether data is synced.

Show:

* Pending sync count
* Failed sync count
* Last sync time
* Simple sync message

Examples:

```txt id="ruwqu2"
3 records waiting to sync.
```

```txt id="1dbo8c"
Sync failed. Tap to retry.
```

Do not show fake synced status.

---

# 33. Subscription Status on Dashboard

Dashboard should show subscription status simply.

Examples:

```txt id="g6nzi0"
Subscription active.
```

```txt id="k1tgy4"
Your subscription is in grace period. Renew soon.
```

```txt id="js82gr"
Your subscription has ended. Pay KSh 1,500 to continue using Buzz Duka.
```

Subscription status must come from real subscription/license records.

---

# 34. Dashboard Performance Rule

Dashboard must be fast.

Do not run heavy calculations during checkout.

Do not slow the selling screen because analytics are updating.

Recommended approach:

* Use saved records as source of truth.
* Use efficient queries.
* Use cached summaries where appropriate.
* Refresh dashboard when user opens it.
* Avoid blocking sale completion.

Checkout speed is more important than fancy analytics animations.

---

# 35. Analytics Engine Suggested Functions

Antigravity should create reusable functions such as:

```txt id="ea30a2"
calculateTotalSales(businessId, dateRange)
calculateGrossProfit(businessId, dateRange)
calculateTotalExpenses(businessId, dateRange)
calculateNetProfit(businessId, dateRange)
calculatePaymentMethodTotals(businessId, dateRange)
getBestSellingProducts(businessId, dateRange)
getLowSellingProducts(businessId, dateRange)
getHighestProfitProducts(businessId, dateRange)
getLossMakingProducts(businessId, dateRange)
getLowMarginProducts(businessId, dateRange)
getLowStockProducts(businessId)
calculateStockValue(businessId)
getDebtSummary(businessId)
getExpenseSummary(businessId, dateRange)
getRestockSuggestions(businessId)
getPriceReviewAlerts(businessId)
getDashboardSummary(user, businessId, dateRange)
```

Analytics logic must not live only inside dashboard UI components.

---

# 36. Owner Dashboard Components

Recommended Owner dashboard components:

```txt id="08h36k"
SalesSummaryCard
GrossProfitCard
NetProfitCard
ExpenseSummaryCard
DebtSummaryCard
PaymentMethodTotalsCard
LowStockCard
BestSellersCard
LowMarginProductsCard
LossMakingProductsCard
RestockSuggestionsCard
PriceReviewAlertsCard
RecentActivityCard
SyncStatusBanner
SubscriptionStatusBanner
```

Each component must receive real analytics data.

---

# 37. Sales Dashboard Components

Recommended Sales dashboard components:

```txt id="ng491f"
StartSaleButton
ProductSearchShortcut
RecentSalesList
BasicStockStatus
PendingSyncBanner
SubscriptionWarningBanner
ReceiptShortcut
```

Do not include owner-sensitive components in Sales dashboard.

---

# 38. Simple Insight Language

Buzz Duka should use simple messages.

Good:

```txt id="hjvcky"
This product gives low profit.
```

```txt id="gck7y6"
This item is almost finished.
```

```txt id="8cyqj3"
This product has not sold recently.
```

```txt id="7b497g"
This product is selling below cost.
```

Bad:

```txt id="5uk009"
Gross margin variance below benchmark.
```

```txt id="nqwzyp"
Inventory threshold exception.
```

```txt id="2qsf45"
Revenue velocity anomaly detected.
```

---

# 39. Role-Based Analytics Access

Analytics must respect roles.

Owner can see:

* Sales
* Profit
* Expenses
* Debts
* Product performance
* Stock value
* Advanced insights
* Activity history

Sales user can see:

* Basic recent sales
* Basic product availability
* Pending sync count
* Sales success messages

Sales user cannot see:

* Gross profit
* Net profit
* Expense totals
* Product cost/profit
* Stock value
* Owner-only analytics

---

# 40. Required Tests

Antigravity must test:

```txt id="v739le"
Total sales calculation
Gross profit calculation
Net profit calculation
Expense total calculation
Payment method totals
Product profit from sale item snapshots
Best sellers from quantity sold
Loss-making product detection
Low-margin product detection
Low-stock detection
Stock value calculation
Debt balance summary
Dashboard empty states
Owner analytics access
Sales analytics restriction
Old sale unchanged after price edit
Reversed sale excluded from active totals
Offline records included in local dashboard
No hardcoded dashboard data
```

---

# 41. Required Manual Verification Test

Use this manual test:

```txt id="rbpv8c"
1. Create product Lotion with stock 10, average cost KSh 250, selling price KSh 400.
2. Sell 4 units using M-Pesa.
3. Confirm total sales = KSh 1,600.
4. Confirm gross profit = KSh 600.
5. Confirm M-Pesa total = KSh 1,600.
6. Add expense Transport KSh 200.
7. Confirm total expenses = KSh 200.
8. Confirm net profit = KSh 400.
9. Add 10 stock at KSh 300 after remaining stock is 6.
10. Confirm average cost becomes KSh 281.25.
11. Change selling price to KSh 450.
12. Sell 2 units using Cash.
13. Confirm Cash total = KSh 900.
14. Confirm old M-Pesa sale still uses KSh 400.
15. Confirm new Cash sale profit = KSh 337.50.
16. Confirm total gross profit = KSh 937.50.
17. Confirm net profit = KSh 737.50.
18. Confirm remaining stock = 14.
19. Confirm stock value is based on remaining stock and average cost.
20. Confirm Owner can see profit and expenses.
21. Confirm Sales user cannot see profit or expenses.
22. Confirm dashboard uses real data only.
```

If this test fails, analytics are not complete.

---

# 42. Antigravity Completion Report

After building this module, Antigravity must report:

```txt id="c6b5i0"
Module name:
Files created:
Files modified:
Database tables affected:
Engine functions added:
Dashboard components added:
Business rules implemented:
Tests added:
Manual verification steps:
Known limitations:
No fake data confirmation:
```

---

# 43. Final Rule

Buzz Duka analytics must tell the truth.

The Owner must be able to trust:

```txt id="d2t7p3"
Sales total
Gross profit
Net profit
Expenses
Debts
Payment totals
Product performance
Stock value
Low stock
Loss-making products
Restock suggestions
Price review alerts
```

If the app does not have data, show an empty state.

If the number is not calculated from real records, do not show it.

Buzz Duka must not look smart with fake analytics.

It must be smart because its data is real.
