# DOCUMENT 5: SALES, DEBT & EXPENSE ENGINE SPECIFICATION

## Buzz Duka — Checkout, Sales Records, Debts, Receipts & Expenses

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Engine specification master document
**Purpose:** Define how Buzz Duka must handle fast selling, sale creation, payment method selection, stock reduction, receipts, debt sales, debt payments, expenses, and net profit impact.
**Core Rule:** Every sale, debt, payment, and expense must be saved as real data and must update stock, profit, debts, expenses, and reports correctly.

---

# 1. Purpose of This Document

This document defines the rules for the Sales Engine, Debt Engine, Expense Engine, and Receipt Engine.

Antigravity must use this document when building:

* Fast checkout logic
* Sale creation
* Sale item creation
* Cart validation
* Payment method recording
* Stock reduction during sale
* Receipt generation
* Debt sale creation
* Debt payment handling
* Expense recording
* Net profit calculation support
* Activity logs
* Offline save behavior
* Sync queue behavior

This document must be followed together with the Inventory, Pricing & Costing Engine Specification.

---

# 2. Core Sales Principle

Buzz Duka must make selling fast.

Approved selling flow:

```txt id="53nwsm"
Select product → Add to cart → Choose payment method → Complete sale → Next customer
```

The seller should not be slowed down by:

* M-Pesa code entry
* Payment verification
* Internet dependency
* Long customer forms
* Mandatory receipt sharing
* Batch selection
* Complex discounts
* Accounting fields

Sale completion must save locally first and return the seller to the next sale quickly.

---

# 3. Sales Engine Responsibilities

The Sales Engine must handle:

* Cart validation
* Product availability check
* Payment method validation
* Sale record creation
* Sale item record creation
* Price snapshot creation
* Stock reduction
* Stock movement creation
* Receipt record creation
* Profit/loss calculation per item
* Sale totals calculation
* Activity log creation
* Sync queue creation
* Offline-safe transaction handling

The Sales Engine must not be fake UI logic.

It must save real records.

---

# 4. Sale Record Specification

Each sale record should include:

```txt id="cv1phf"
sale_id
local_id
server_id
business_id
sold_by_user_id
device_id
sale_number
receipt_number
payment_method
sale_status
subtotal
discount_total
tax_total
total_amount
total_cost
gross_profit_or_loss
customer_id_optional
debt_id_optional
sale_note_optional
created_at
updated_at
sync_status
```

For the first version:

* `discount_total` may be zero.
* `tax_total` may be zero.
* Complex discount and tax logic should not be built early.
* Payment method must be one of the approved values.

---

# 5. Sale Status Rules

Sale status may include:

```txt id="d70k3c"
completed
cancelled
reversed
pending_sync
failed
```

## completed

Sale was successfully saved locally.

## cancelled

Sale was cancelled before completion.

## reversed

Sale was completed earlier but later reversed.

## pending_sync

Sale is saved locally but not yet synced.

## failed

Sale failed and should not affect stock or reports unless partially saved and repaired.

Do not hard delete completed sales casually.

---

# 6. Sale Item Record Specification

Every sale must have one or more sale item records.

Each sale item must include immutable snapshots:

```txt id="wgi9hp"
sale_item_id
local_id
server_id
business_id
sale_id
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
sync_status
```

These fields must not change when product prices change later.

Historical profit must come from these sale item records.

---

# 7. Cart Rules

A cart is valid only when:

* Cart has at least one item.
* Every item has a valid product ID.
* Quantity is greater than zero.
* Quantity does not exceed available stock.
* Product is active.
* Product belongs to the correct business.
* Selling price is available.
* Average unit cost is available.
* Payment method is selected before completion.

If cart is empty, show:

```txt id="08y1nm"
Add at least one product before completing the sale.
```

If stock is not enough, show:

```txt id="o2emhb"
Stock is not enough for this sale.
```

---

# 8. Payment Method Rules

Allowed payment methods:

```txt id="g9b28o"
Cash
M-Pesa
Bank
Debt
```

Payment method must be saved with the sale.

Buzz Duka must not add:

* M-Pesa transaction code
* M-Pesa verification
* M-Pesa reconciliation
* Daraja integration
* STK Push
* Till/PayBill/Pochi setup
* Automatic payment matching

Buzz Duka records what the seller selected.

Payment totals must come from real sales records.

---

# 9. Sale Completion Rules

When a sale is completed, Buzz Duka must perform these steps:

```txt id="js82ij"
1. Validate user permission.
2. Validate device is allowed to sell.
3. Validate subscription/license allows selling.
4. Validate cart.
5. Validate stock availability.
6. Validate payment method.
7. Start safe local transaction where possible.
8. Create sale record.
9. Create sale item records with snapshots.
10. Reduce stock for each product.
11. Create stock movement records.
12. Calculate sale totals and profit/loss.
13. Create receipt record.
14. Create activity log.
15. Create sync queue item.
16. Commit transaction.
17. Return success quickly.
```

Do not show sale success until the local transaction succeeds.

---

# 10. Sale Transaction Safety Rule

A sale must not be half-saved.

Bad situations:

```txt id="wkb9hr"
Sale saved but stock did not reduce.
```

```txt id="1vn76t"
Stock reduced but sale item was not saved.
```

```txt id="thkkbx"
Receipt generated but sale failed.
```

The sale process should use a database transaction where possible.

If a transaction fails, rollback and show clear error.

---

# 11. Sale Calculation Rules

For each sale item:

```txt id="440naf"
line_revenue = quantity_sold × unit_selling_price_at_sale
line_cost = quantity_sold × unit_cost_at_sale
line_profit_or_loss = line_revenue - line_cost
```

Sale totals:

```txt id="1w1fp5"
subtotal = SUM(line_revenue)
total_cost = SUM(line_cost)
gross_profit_or_loss = SUM(line_profit_or_loss)
total_amount = subtotal - discount_total + tax_total
```

For first version:

```txt id="wcl2jr"
discount_total = 0
tax_total = 0
total_amount = subtotal
```

Buzz Duka must support negative profit.

---

# 12. Stock Reduction During Sale

When a product is sold:

* Stock quantity decreases by quantity sold.
* Stock value decreases by quantity sold × unit cost at sale.
* Average unit cost normally remains the same.
* Stock movement is created.
* Sale item snapshot is saved.

Stock movement type:

```txt id="itj4eo"
sale
```

For debt sale, stock movement type may be:

```txt id="nm2w6s"
debt_sale
```

Stock must not only change visually.

---

# 13. Sale Example

Product before sale:

```txt id="j1xvu8"
Product: Lotion
Stock: 10
Average cost: KSh 250
Selling price: KSh 400
```

Sale:

```txt id="rmtcnu"
Quantity sold: 4
Payment method: M-Pesa
```

Expected result:

```txt id="xr7kmt"
Revenue = 4 × 400 = KSh 1,600
Cost = 4 × 250 = KSh 1,000
Profit = 1,600 - 1,000 = KSh 600
Stock after sale = 6
Payment method saved = M-Pesa
```

A sale record, sale item record, stock movement, receipt, activity log, and sync queue item must be created.

---

# 14. Receipt Engine Responsibilities

The Receipt Engine must generate receipt records from real completed sales.

It must not use fake sale data.

Receipt should be created automatically after sale completion.

Receipt viewing or sharing must be optional and must not block the next sale.

---

# 15. Receipt Record Specification

Receipt record should include:

```txt id="2h6nin"
receipt_id
local_id
server_id
business_id
sale_id
receipt_number
business_name_snapshot
sold_by_user_name_snapshot
payment_method
total_amount
receipt_data_json
created_at
sync_status
```

`receipt_data_json` may include:

```txt id="nhbbfp"
sale items
quantities
unit selling prices
line totals
sale date/time
customer name if debt sale
```

Receipt number must be unique per business.

---

# 16. Receipt Rules

Receipt must include:

* Business name
* Receipt number
* Date/time
* Sold by
* Product names
* Quantities
* Unit selling prices
* Line totals
* Total amount
* Payment method
* Customer name if debt sale

Receipt must not include hidden cost/profit information for the customer.

Receipt must remain available after app restart.

---

# 17. Debt Engine Responsibilities

The Debt Engine must manage customer debt created from sales.

Debt must not be a fake balance.

Debt must connect to real sale records.

Debt Engine must handle:

* Debt sale creation
* Customer details
* Original debt amount
* Remaining balance
* Partial payments
* Full payment
* Debt status
* Debt history
* Activity logs
* Debt reports

---

# 18. Debt Sale Rules

A debt sale is a real sale where payment method is Debt.

Debt sale must:

```txt id="gshd72"
1. Create sale record.
2. Create sale item records.
3. Save payment_method = Debt.
4. Reduce stock.
5. Save price snapshots.
6. Create receipt record.
7. Create debt record.
8. Create activity log.
9. Create sync queue item.
```

Debt sale must not skip stock reduction.

Debt sale must not skip profit calculation.

---

# 19. Debt Customer Rules

Debt sale requires at least customer name.

Customer phone may be optional.

Customer record may include:

```txt id="et7pu2"
customer_id
business_id
customer_name
phone_optional
created_at
updated_at
```

Debt customer is not a full customer loyalty system.

Do not build loyalty points or customer marketing in the first version.

---

# 20. Debt Record Specification

Debt record should include:

```txt id="q9wmnz"
debt_id
local_id
server_id
business_id
sale_id
customer_id
customer_name_snapshot
customer_phone_snapshot_optional
original_amount
amount_paid
balance
status
due_date_optional
created_by
created_at
updated_at
sync_status
```

Debt statuses:

```txt id="gpzks8"
unpaid
partial
paid
overdue
cancelled
```

---

# 21. Debt Balance Rules

Debt balance formula:

```txt id="7uqw84"
balance = original_amount - total_debt_payments
```

When no payment has been made:

```txt id="jnt6ad"
balance = original_amount
status = unpaid
```

When partial payment has been made:

```txt id="tf5q20"
balance > 0
status = partial
```

When fully paid:

```txt id="spzlsm"
balance = 0
status = paid
```

Do not allow negative debt balance unless overpayment handling is explicitly added later.

---

# 22. Debt Payment Record Specification

Each debt payment must be saved as a real record.

Fields:

```txt id="f95kky"
debt_payment_id
local_id
server_id
business_id
debt_id
amount_paid
payment_method
payment_note_optional
received_by_user_id
paid_at
created_at
sync_status
```

Allowed payment methods for debt payment:

```txt id="gcsou4"
Cash
M-Pesa
Bank
```

Debt payment should not use payment method Debt.

---

# 23. Debt Payment Rules

When a debt payment is recorded:

1. Validate debt exists.
2. Validate amount is greater than zero.
3. Validate amount does not exceed balance unless overpayment is supported.
4. Save debt payment record.
5. Update debt amount paid.
6. Update debt balance.
7. Update debt status.
8. Create activity log.
9. Create sync queue item.

Debt payment must not change original sale item snapshots.

Debt payment affects cash flow and debt balance, not the original sale profit.

---

# 24. Debt Example

Debt sale:

```txt id="5wqej3"
Customer: Mary
Sale total: KSh 1,200
Payment method: Debt
```

Expected debt:

```txt id="5e12x0"
original_amount = 1,200
amount_paid = 0
balance = 1,200
status = unpaid
```

Partial payment:

```txt id="j3hvrj"
Mary pays KSh 500
```

Expected result:

```txt id="a2lfp5"
amount_paid = 500
balance = 700
status = partial
```

Final payment:

```txt id="sqnkld"
Mary pays KSh 700
```

Expected result:

```txt id="631mq4"
amount_paid = 1,200
balance = 0
status = paid
```

---

# 25. Expense Engine Responsibilities

The Expense Engine must manage real business expenses.

Expenses are used to calculate net profit.

Expense Engine must handle:

* Add expense
* Edit expense if allowed
* Cancel/void expense if allowed
* Categorize expense
* Calculate expense totals
* Support net profit calculation
* Restrict access to Owner
* Create activity logs
* Queue sync

---

# 26. Expense Record Specification

Expense record should include:

```txt id="u5fmau"
expense_id
local_id
server_id
business_id
amount
category
description_optional
expense_date
created_by_user_id
status
created_at
updated_at
sync_status
```

Expense statuses:

```txt id="u5zgvy"
active
voided
cancelled
```

Do not hard delete expenses casually.

---

# 27. Expense Category Rules

Default expense categories:

```txt id="bc6n6o"
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

Owner may later create custom categories if approved, but default categories are enough for first version.

Expense category is required.

If no category fits, use `Other`.

---

# 28. Expense Rules

Expense must:

* Belong to a business.
* Have amount greater than zero.
* Have a category.
* Have expense date.
* Be created by an authorized user.
* Persist after restart.
* Affect net profit.
* Create activity log.
* Create sync queue item.

Sales user must not access expense management by default.

---

# 29. Expense and Profit Rule

Expenses reduce net profit, not gross profit.

Formula:

```txt id="3lb6v7"
gross_profit = SUM(line_profit_or_loss from sale_items)
total_expenses = SUM(active expenses)
net_profit = gross_profit - total_expenses
```

Example:

```txt id="pum7sn"
Gross profit = KSh 2,000
Expenses = KSh 600

Net profit = KSh 1,400
```

Do not reduce sale item profit directly because of expenses.

Expenses are separate business costs.

---

# 30. Expense Example

Expense:

```txt id="6g35t3"
Category: Transport
Amount: KSh 200
Description: Delivery boda
```

Expected result:

```txt id="07uc7n"
Expense saves locally
Expense appears in expense list
Total expenses increase by KSh 200
Net profit reduces by KSh 200
Activity log is created
Sync queue item is created
```

---

# 31. Activity Log Rules

The Sales, Debt, and Expense Engines must create activity logs.

Required logs:

```txt id="1bf9dz"
Sale completed
Sale reversed
Receipt created
Debt sale created
Debt payment received
Debt fully paid
Expense recorded
Expense edited
Expense voided
Sale failed
Debt payment failed
Expense save failed
```

Activity logs must show real actions.

Do not create fake history.

---

# 32. Offline Rules

Sales, debts, and expenses must work offline.

When offline, Buzz Duka must still:

* Complete sale locally
* Reduce stock locally
* Create receipt locally
* Create debt sale locally
* Record debt payment locally
* Record expense locally
* Create activity log locally
* Create sync queue item locally

Data must remain after app restart.

Do not block checkout because there is no internet.

---

# 33. Sync Queue Rules

After saving local records, Buzz Duka should create sync queue items for:

* Sale
* Sale items
* Stock movements
* Receipt
* Debt
* Debt payment
* Expense
* Activity log

Sync status values:

```txt id="380n90"
pending
syncing
synced
failed
```

Records must be marked synced only after backend confirmation.

---

# 34. Idempotency and Duplicate Prevention

Sales must not duplicate during sync.

Each locally created sale should have:

```txt id="akb162"
local_id
business_id
device_id
idempotency_key
created_at
```

Backend sync should use these values to prevent duplicate uploads.

Duplicate sales can corrupt:

* Stock
* Revenue
* Profit
* Debt totals
* Reports

---

# 35. Reversal Rules

Sales should not be hard deleted.

If a sale must be reversed:

1. Mark original sale as reversed.
2. Create reversal activity log.
3. Restore stock if appropriate.
4. Create reversal stock movement.
5. Exclude reversed sale from active reports.
6. Preserve original sale and sale item snapshots.

Debt sale reversal must also handle debt status carefully.

Expense reversal/voiding should mark expense as voided, not hard delete it.

---

# 36. Permission Rules

Owner can:

* Sell if device allows
* View all sales
* View profit
* Manage debts
* Record debt payments
* Add expenses
* View expenses
* Reverse sales if allowed
* View reports

Sales user can:

* Sell if device allows
* Create debt sale if allowed
* View basic recent sales
* View receipt

Sales user cannot:

* View net profit
* View expenses
* Record expenses
* Reverse sensitive sales unless allowed
* View advanced analytics
* Manage subscription/devices

---

# 37. Error Handling Rules

Use clear error messages.

Examples:

```txt id="js5ml6"
Stock is not enough for this sale.
```

```txt id="x739nl"
Add at least one product before completing the sale.
```

```txt id="41v81x"
Choose a payment method before completing the sale.
```

```txt id="fr23da"
Debt payment is more than the remaining balance.
```

```txt id="mkqs11"
Only the Owner can record expenses.
```

```txt id="cpxu9v"
Sale was saved on this phone but has not synced yet.
```

Avoid vague messages unless a detailed message is impossible.

---

# 38. Sales Engine Suggested Functions

Antigravity should create reusable functions such as:

```txt id="r5ydmg"
validateCart(cart, businessId)
calculateCartTotals(cartItems)
createSale(input)
createSaleItemSnapshot(product, quantity)
completeSale(input)
reduceStockForSale(productId, quantity, saleId)
generateReceiptForSale(saleId)
reverseSale(saleId, reason)
getRecentSales(businessId)
getSalesByDateRange(businessId, dateRange)
```

Critical sale logic must not live only inside UI components.

---

# 39. Debt Engine Suggested Functions

Suggested functions:

```txt id="2n43xt"
createDebtSale(input)
createDebtRecordFromSale(sale)
recordDebtPayment(debtId, amount, paymentMethod)
calculateDebtBalance(debtId)
updateDebtStatus(debtId)
getCustomerDebts(customerId)
getBusinessDebts(businessId)
getOverdueDebts(businessId)
```

Debt balances must come from real records.

---

# 40. Expense Engine Suggested Functions

Suggested functions:

```txt id="lnwivq"
createExpense(input)
updateExpense(expenseId, input)
voidExpense(expenseId, reason)
getExpensesByDateRange(businessId, dateRange)
calculateTotalExpenses(businessId, dateRange)
getExpenseCategories(businessId)
```

Expense totals must come from real expense records.

---

# 41. Receipt Engine Suggested Functions

Suggested functions:

```txt id="h4n97j"
generateReceiptNumber(businessId)
createReceiptFromSale(saleId)
getReceiptBySaleId(saleId)
formatReceiptForDisplay(receiptId)
shareReceiptIfRequested(receiptId)
```

Receipt sharing must be optional.

---

# 42. Required Tests

Antigravity must test:

```txt id="2751b3"
Cart validation
Sale creation
Sale item snapshot creation
Stock reduction after sale
Payment method saving
Receipt generation
Sale persistence after restart
Old sale unchanged after price change
Debt sale creation
Debt sale stock reduction
Debt payment partial balance
Debt paid status
Expense creation
Expense total calculation
Expense effect on net profit
Sales user restriction from expenses
Offline sale save
Sync queue creation
Duplicate sale prevention structure
```

---

# 43. Required Manual Verification Test

Use this test:

```txt id="6h0q0i"
1. Create product Lotion with stock 10, average cost KSh 250, selling price KSh 400.
2. Complete sale of 4 units using M-Pesa.
3. Confirm sale record exists.
4. Confirm sale item record exists.
5. Confirm stock becomes 6.
6. Confirm revenue = KSh 1,600.
7. Confirm cost = KSh 1,000.
8. Confirm profit = KSh 600.
9. Confirm receipt exists.
10. Confirm payment method = M-Pesa.
11. Change selling price to KSh 450.
12. Confirm old sale still uses KSh 400.
13. Create debt sale for customer Mary worth KSh 1,200.
14. Confirm stock reduces.
15. Confirm debt balance = KSh 1,200.
16. Record debt payment of KSh 500.
17. Confirm debt balance = KSh 700 and status = partial.
18. Record expense Transport KSh 200.
19. Confirm expense appears in list.
20. Confirm net profit reduces by KSh 200.
21. Restart app and confirm all records remain.
```

If this test fails, the Sales, Debt, and Expense Engines are not complete.

---

# 44. Antigravity Completion Report

After building this module, Antigravity must report:

```txt id="0pzlqo"
Module name:
Files created:
Files modified:
Database tables affected:
Engine functions added:
Business rules implemented:
Tests added:
Manual verification steps:
Known limitations:
No fake data confirmation:
```

---

# 45. Final Rule

Buzz Duka’s Sales, Debt, and Expense Engines must protect the truth of the shop.

The app must know:

```txt id="1k6xkx"
What was sold
Who sold it
How the customer paid
What stock reduced
What cost was used
What profit or loss was made
Who owes money
Who paid debt
What expenses were recorded
How expenses affect net profit
Whether records have synced
```

Do not fake sales.

Do not fake debt balances.

Do not fake expenses.

Do not show sale success unless real records are saved.

Buzz Duka must work for real shop operations, not just look like a POS.
