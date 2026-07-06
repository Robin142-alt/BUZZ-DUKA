# DOCUMENT 20: DETAILED ENGINE-BY-ENGINE SPECIFICATION

## Buzz Duka — Business Logic Engines, Rules, Inputs, Outputs, Tests & Acceptance Criteria

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Engine-by-engine specification document
**Purpose:** Define the exact business logic engines Antigravity must build so Buzz Duka works with real products, real stock, real sales, real debts, real expenses, real profit reports, real offline behavior, real permissions, and real subscription reconciliation.
**Core Rule:** Screens must not contain random business logic. Core business logic must live inside tested engines.

---

# 1. Purpose of This Document

This document defines the internal engines that power Buzz Duka.

Antigravity must use this document when building:

* Product engine
* Inventory engine
* Pricing and costing engine
* Sales engine
* Price snapshot engine
* Receipt engine
* Debt engine
* Expense engine
* Profit engine
* Analytics engine
* Permission engine
* Device engine
* Subscription/license engine
* Payment reconciliation engine
* Sync engine
* Reversal engine
* Activity log engine

The app must not depend on fake UI logic.

---

# 2. Engine Architecture Principle

Buzz Duka must separate:

```txt id="5gje9i"
UI screens
Business logic engines
Database repositories
Backend APIs
```

Correct structure:

```txt id="ddp8sg"
Screen → Engine → Repository/Database/API → Result → UI update
```

Wrong structure:

```txt id="iw6mv1"
Screen directly changes fake state and shows success.
```

Engines must be reusable, testable, and independent from UI styling.

---

# 3. Required Engine Pattern

Each engine should follow this pattern:

```txt id="ko9u5d"
Validate input
Check permissions
Check device/subscription if needed
Read current database state
Calculate correct result
Write records inside transaction
Create activity log where needed
Create sync queue record where needed
Return clear success/error result
```

Engines must not silently fail.

---

# 4. Engine Result Format

Each engine should return a consistent result.

Example success:

```txt id="gth33k"
{
  success: true,
  data: {...},
  message: "Sale completed."
}
```

Example failure:

```txt id="ko43te"
{
  success: false,
  error_code: "STOCK_NOT_ENOUGH",
  message: "Only 2 left in stock."
}
```

Do not return vague errors.

---

# 5. Permission Engine

## Purpose

Controls what Owner and Sales users can do.

## Required functions

```txt id="ndix6n"
canViewOwnerDashboard(user)
canViewSalesDashboard(user)
canManageProducts(user)
canAddStock(user)
canAdjustStock(user)
canViewProductCost(user)
canChangeSellingPrice(user)
canPerformCostCorrection(user)
canCompleteSale(user, device, subscriptionState)
canCreateDebtSale(user, settings)
canRecordDebtPayment(user)
canRecordExpense(user)
canViewExpenses(user)
canViewGrossProfit(user)
canViewNetProfit(user)
canViewAnalytics(user)
canManageDevices(user)
canManageSubscription(user)
canViewActivityLogs(user)
canReverseSale(user)
```

## Core rules

```txt id="r8zbsn"
Owner controls the business.
Sales user sells only.
```

Sales user must not access:

```txt id="5ywhlm"
Profit
Expenses
Product costs
Stock value
Owner analytics
Subscription management
Device management
Business settings
```

## Tests

```txt id="i88gyi"
Owner can view profit.
Sales user cannot view profit.
Owner can add expense.
Sales user cannot add expense.
Owner can manage devices.
Sales user cannot manage devices.
Sales user can sell only if device and subscription allow it.
```

---

# 6. Business Setup Engine

## Purpose

Creates the first business, Owner user, first device, and subscription/license foundation.

## Required functions

```txt id="ieneg6"
createBusinessWithOwner(payload)
validateBusinessName(name)
createOwnerUser(payload)
registerFirstDevice(payload)
initializeSubscriptionState(businessId)
initializeOfflineLicenseState(businessId, deviceId)
```

## Required inputs

```txt id="7f1un3"
Owner name
Phone or email
Password
Business name
Business category optional
Location optional
Device name
Device fingerprint
```

## Required outputs

```txt id="q04ebf"
business_id
owner_user_id
device_id
role = owner
device status
subscription state
```

## Core rules

* First user must be Owner.
* First device must belong to the business.
* Business ID must be created before business records.
* Password must be hashed.
* No fake business should be created.

---

# 7. Product Engine

## Purpose

Manages product creation, editing, searching, and deactivation.

## Required functions

```txt id="7gb91q"
createProduct(payload)
updateProduct(productId, payload)
deactivateProduct(productId)
searchProducts(query, role)
getProductById(productId)
validateProductPayload(payload)
```

## Product creation input

```txt id="6fcro2"
product_name
category_id optional
initial_stock_quantity
buying_price_cents if initial stock > 0
selling_price_cents
low_stock_level
```

## Core rules

* Owner can create products.
* Sales user can search active products only.
* If initial stock is greater than zero, buying price is required.
* Product creation with stock must create stock movement.
* Product edit must not change old sale items.
* Product table stores current state only.

## Tests

```txt id="xh59xo"
Owner can create product.
Sales user cannot create product.
Product persists after restart.
Inactive product does not show in sales search.
Editing product name does not change old sale item snapshot.
```

---

# 8. Inventory Engine

## Purpose

Controls stock quantities and stock movement records.

## Required functions

```txt id="rlaqq4"
addInitialStock(productId, quantity, buyingPrice)
stockIn(productId, quantityAdded, buyingPrice, note)
adjustStock(productId, quantityChange, reason)
recordDamage(productId, quantity, reason)
recordLoss(productId, quantity, reason)
createStockMovement(payload)
getStockMovements(productId)
checkStockAvailability(productId, requestedQuantity)
```

## Core rules

* Stock must never change without stock movement.
* Stock-in increases quantity.
* Sale reduces quantity.
* Sale reversal restores quantity.
* Damage/loss reduces quantity.
* Adjustment requires reason.
* Negative stock is not allowed in MVP.

## Stock movement types

```txt id="7ue40z"
initial_stock
stock_in
sale
sale_reversal
adjustment
damage
loss
cost_correction
```

## Tests

```txt id="akf85o"
Stock-in increases stock.
Sale reduces stock.
Sale reversal restores stock.
Damage reduces stock.
Stock movement is created for every stock change.
Negative stock is blocked.
```

---

# 9. Pricing and Costing Engine

## Purpose

Calculates buying cost, average cost, stock value, selling price changes, and expected profit.

## Required functions

```txt id="jey4wu"
calculateWeightedAverageCost(oldQty, oldAvgCost, addedQty, addedBuyingPrice)
calculateStockValue(quantity, averageCost)
changeSellingPrice(productId, newSellingPrice, reason)
changeDefaultBuyingPrice(productId, newBuyingPrice, reason)
calculateCurrentExpectedProfit(productId)
calculateCurrentMargin(productId)
```

## Moving weighted average formula

```txt id="he1pys"
new_average_cost =
((old_quantity × old_average_cost) + (added_quantity × added_buying_price))
÷ (old_quantity + added_quantity)
```

## Required example

```txt id="3zdqg4"
Old remaining stock: 6
Old average cost: KSh 250
Add stock: 10
New buying price: KSh 300

Expected:
Stock value = 6×250 + 10×300 = KSh 4,500
New quantity = 16
New average cost = KSh 281.25
```

## Core rules

* Buying price changes through stock-in or audited correction.
* Selling price can change anytime.
* Selling price changes affect new sales only.
* Old sales must never change after price edits.

## Tests

```txt id="u6p3pt"
Weighted average cost calculates correctly.
Stock value updates correctly.
Selling price change creates price history.
Old sale item still uses old selling price.
```

---

# 10. Price Snapshot Engine

## Purpose

Creates immutable sale item snapshots during checkout.

## Required functions

```txt id="g9hjk1"
createSaleItemSnapshot(product, quantity)
calculateLineRevenue(quantity, unitSellingPrice)
calculateLineCost(quantity, unitCost)
calculateLineProfit(lineRevenue, lineCost)
calculateMargin(lineProfit, lineRevenue)
```

## Required sale item snapshot fields

```txt id="lwzsck"
product_id
product_name_snapshot
quantity_sold
unit_cost_at_sale_cents
unit_selling_price_at_sale_cents
line_revenue_cents
line_cost_cents
line_profit_cents
margin_percentage
stock_quantity_before_sale
stock_quantity_after_sale
average_cost_at_sale_cents
created_at
```

## Core rules

* Snapshot is created at sale time.
* Snapshot must not change after sale.
* Product edits must not change snapshots.
* Historical reports must use sale item snapshots.

## Tests

```txt id="6amtnb"
Sell product at KSh 400.
Change selling price to KSh 450.
Old sale item still shows KSh 400.
Profit report still uses original snapshot.
```

---

# 11. Sales Engine

## Purpose

Completes fast sales correctly.

## Required functions

```txt id="2oej2z"
validateCart(cart)
validatePaymentMethod(paymentMethod)
completeSale(payload)
createSaleRecord(payload)
createSaleItems(sale, cart)
reduceStockForSale(saleItems)
createReceiptForSale(sale)
createDebtIfNeeded(sale, customer)
queueSaleForSync(saleBundle)
```

## Sale flow

```txt id="5f4e2a"
Validate user/device/subscription
Validate cart
Validate stock
Validate payment method
Create sale
Create sale item snapshots
Reduce stock
Create stock movements
Create receipt
Create debt if payment method is Debt
Create activity log
Create sync queue item
Return success
```

## Allowed payment methods

```txt id="tsp3s5"
Cash
M-Pesa
Bank
Debt
```

## Core rules

* No M-Pesa code entry.
* No M-Pesa verification for shop sales.
* Checkout must work offline.
* Sale must reduce stock.
* Sale must create sale item snapshots.
* Sale must create receipt.
* Sale must persist after restart.

## Tests

```txt id="lmgxeg"
Empty cart is blocked.
Missing payment method is blocked.
Insufficient stock is blocked.
Sale reduces stock.
Sale creates sale item snapshots.
Sale creates receipt.
Sale persists after restart.
```

---

# 12. Receipt Engine

## Purpose

Creates customer-safe receipts from completed sales.

## Required functions

```txt id="ovfs38"
generateReceiptNumber(businessId)
createReceipt(sale)
getReceipt(receiptId)
markReceiptReversed(receiptId, reversalId)
formatReceiptForDisplay(receipt)
```

## Receipt must show

```txt id="v9ff0v"
Business name
Receipt number
Date/time
Sold by
Products
Quantities
Unit prices
Line totals
Total amount
Payment method
Receipt status
```

## Receipt must not show

```txt id="vh2vba"
Buying price
Average cost
Profit
Margin
Owner analytics
```

## Tests

```txt id="tb1z1b"
Receipt is created after sale.
Receipt number is unique.
Receipt does not show cost/profit.
Reversed sale marks receipt reversed.
```

---

# 13. Debt Engine

## Purpose

Manages debt sales and debt payments.

## Required functions

```txt id="hbp4sz"
createDebtFromSale(sale, customer)
getDebtBalance(debtId)
recordDebtPayment(debtId, payment)
updateDebtStatus(debtId)
listDebts(filters)
cancelDebtForReversedSale(saleId)
```

## Debt statuses

```txt id="sd5luu"
unpaid
partial
paid
overdue
reversed
cancelled
```

## Debt balance formula

```txt id="shgix5"
balance_cents = original_amount_cents - amount_paid_cents
```

## Core rules

* Debt sale is still a real sale.
* Debt sale reduces stock.
* Debt sale saves sale item snapshots.
* Debt payment does not rewrite original sale.
* Sales user may create debt sale if allowed.
* Owner records debt payment by default.

## Tests

```txt id="wmbjtn"
Debt sale creates debt.
Debt sale reduces stock.
Partial payment reduces balance.
Full payment marks debt paid.
Debt sale reversal cancels debt.
```

---

# 14. Expense Engine

## Purpose

Records shop expenses and affects net profit.

## Required functions

```txt id="g5b4db"
createExpense(payload)
listExpenses(filters)
voidExpense(expenseId, reason)
calculateExpenseTotal(filters)
validateExpensePayload(payload)
```

## Core rules

* Expenses are Owner-only.
* Expense amount is required.
* Category is required.
* Expenses reduce net profit.
* Expense records must persist.
* Do not hard delete expenses casually.

## Default categories

```txt id="s9gvpn"
rent
salary
transport
electricity
water
internet
airtime
packaging
repairs
county_charges
other
```

## Tests

```txt id="pm40ji"
Owner can record expense.
Sales user cannot record expense.
Expense appears in list.
Net profit reduces after expense.
Voided expense is excluded from active expense total.
```

---

# 15. Profit and Loss Engine

## Purpose

Calculates gross profit, net profit, product profit, and loss-making products.

## Required functions

```txt id="zkihk5"
calculateGrossProfit(filters)
calculateNetProfit(filters)
calculateProductProfit(productId, filters)
calculatePaymentMethodTotals(filters)
calculateExpenseImpact(filters)
calculateDebtImpact(filters)
getLossMakingProducts(filters)
getLowMarginProducts(filters)
```

## Gross profit formula

```txt id="tn4l42"
gross_profit_cents = SUM(sale_items.line_profit_cents)
```

## Net profit formula

```txt id="4izwcr"
net_profit_cents = gross_profit_cents - active_expenses_cents
```

## Core rules

* Use sale item snapshots.
* Exclude reversed/voided sales from active totals.
* Expenses reduce net profit, not gross profit.
* Old sales must not change after product price edits.

## Tests

```txt id="hmqwbx"
Gross profit uses sale item snapshots.
Net profit subtracts expenses.
Reversed sales are excluded.
Product price change does not change old profit.
```

---

# 16. Analytics Engine

## Purpose

Turns real business records into dashboard/report insights.

## Required functions

```txt id="n3w3de"
getDashboardSummary(filters)
getBestSellingProducts(filters)
getLowStockProducts()
getDeadStockProducts(filters)
getLossMakingProducts(filters)
getLowMarginProducts(filters)
getPaymentTotals(filters)
getDebtSummary(filters)
getExpenseSummary(filters)
getRestockSuggestions()
getPriceReviewAlerts()
```

## Analytics must include

```txt id="iydclv"
Total sales
Gross profit
Net profit
Expense total
Debt total
Payment method totals
Best sellers
Low stock
Loss-making products
Low-margin products
Pending sync count
Subscription status
```

## Core rules

* No fake dashboard data.
* Use real records only.
* Owner sees full analytics.
* Sales user sees limited/basic information only.

## Tests

```txt id="f0wtvv"
Dashboard updates after sale.
Dashboard updates after expense.
Dashboard updates after debt payment.
Dashboard excludes reversed sale.
Empty state appears when no data exists.
```

---

# 17. Sale Reversal Engine

## Purpose

Corrects sale mistakes without deleting history.

## Required functions

```txt id="0ufdpv"
canReverseSale(user, device, subscriptionState, sale)
validateReversalReason(reason, note)
createSaleReversal(saleId, reason, note, refundInfo)
restoreStockForReversal(sale)
markSaleAsReversed(saleId, reversalId)
markReceiptAsReversed(receiptId, reversalId)
cancelDebtForReversedSale(saleId, reversalId)
createReversalStockMovements(saleItems)
queueReversalForSync(reversal)
```

## Core rules

* Owner-only in MVP.
* Reason is required.
* Original sale is not deleted.
* Sale items are not edited.
* Stock is restored.
* Receipt is marked reversed.
* Debt is cancelled/reversed if debt sale.
* Reports exclude reversed sale from active totals.

## Tests

```txt id="gk9ctd"
Owner can reverse sale.
Sales user cannot reverse sale.
Stock restores after reversal.
Receipt becomes reversed.
Profit and payment totals update.
Sale cannot be reversed twice.
```

---

# 18. Device Engine

## Purpose

Controls device registration, limits, and sales-enabled device rules.

## Required functions

```txt id="gxac7a"
registerDevice(payload)
getDeviceStatus(deviceId)
canDeviceSell(deviceId, businessId)
enableSalesOnDevice(deviceId)
disableSalesOnDevice(deviceId)
blockDevice(deviceId)
removeDevice(deviceId)
checkDeviceLimit(businessId)
checkSalesDeviceLimit(businessId)
```

## Core rules

```txt id="s52lxl"
Maximum 2 active devices.
Only 1 sales-enabled device.
Removed devices cannot sync new sales.
Blocked devices cannot sell.
```

## Tests

```txt id="uwplkq"
Third active device is blocked.
Second sales-enabled device is blocked.
Blocked device cannot sell.
Removed device cannot sync new sale.
```

---

# 19. Subscription and Offline License Engine

## Purpose

Controls subscription access, grace period, expiry, suspended state, and offline license.

## Required functions

```txt id="5u4e9r"
getSubscriptionState(businessId)
calculateGraceUntil(subscriptionEndAt)
calculateOfflineLicenseValidUntil(lastVerifiedAt, graceUntil)
canUseRestrictedAction(subscriptionState, offlineLicenseState, now)
canSell(subscriptionState, offlineLicenseState, role, device, now)
refreshOfflineLicense(payload)
markSubscriptionExpiredIfNeeded(businessId)
applySubscriptionActivation(payload)
```

## Core rules

```txt id="n8n74u"
Plan: Buzz Duka Smart Plan
Price: KSh 1,500/month
Billing period: 30 days
Grace period: 3 days
Offline license: max 7 days after verification, never beyond grace_until
```

## Access rules

* Active: normal access.
* Grace: normal access with warning.
* Expired: restricted actions blocked.
* Suspended: restricted strongly.
* Reactivated: access restored.

## Tests

```txt id="wmq5br"
Active allows selling.
Grace allows selling with warning.
Expired blocks selling.
Suspended blocks selling.
Offline license expires correctly.
Old records remain viewable after expiry.
```

---

# 20. Subscription Payment Reconciliation Engine

## Purpose

Reconciles subscription payments made to the official Buzz Duka Till number.

Important:

```txt id="2eo9gz"
Buzz Duka does not hold money.
Money goes directly to the official Buzz Duka Till/M-Pesa.
Buzz Duka only reconciles payment records.
```

## Required functions

```txt id="oy6z0x"
getPaymentInstructions(businessId)
startPaymentReconciliationCheck(payload)
verifyPaymentReference(reference)
handlePaymentWebhook(payload)
matchPaymentToBusiness(payload)
validateTillNumber(tillNumber)
validatePaymentAmount(amountPaid, amountExpected)
preventDuplicateTransaction(transactionId)
confirmSubscriptionAfterReconciliation(reconciliationId)
rejectInvalidPayment(reconciliationId, reason)
```

## Required checks

```txt id="2myupi"
Correct Till number
Correct amount
Valid transaction/reference
Transaction not already used
Payment provider data verified
Payment date acceptable
```

## Core rules

* User-entered reference alone does not activate subscription.
* Duplicate transaction must not activate twice.
* Wrong amount must not activate automatically.
* Wrong Till must be rejected.
* Manual admin correction must create audit log.

## Tests

```txt id="5ddtt3"
Valid payment confirms subscription.
Fake reference does not activate subscription.
Wrong amount is rejected.
Wrong Till is rejected.
Duplicate transaction does not activate twice.
Offline license refreshes after confirmation.
```

---

# 21. Sync Engine

## Purpose

Manages offline-first sync between SQLite and backend.

## Required functions

```txt id="gr7fv4"
createSyncQueueItem(recordType, operationType, payload)
getPendingSyncItems()
markSyncing(syncItemId)
markSynced(syncItemId, serverId)
markFailed(syncItemId, error)
retryFailedSync()
batchUploadPendingRecords()
downloadServerChanges(since)
generateIdempotencyKey(record)
```

## Sync statuses

```txt id="q6upvk"
pending
syncing
synced
failed
```

## Core rules

* Local save happens first.
* Sync must not block checkout.
* Sync queue persists after restart.
* Duplicate upload must not duplicate sales.
* Backend confirmation required before marking synced.
* Failed sync must keep local data.

## Tests

```txt id="b70hcp"
Offline sale creates sync queue item.
App restart preserves pending sync.
Sync marks record synced after backend confirmation.
Failed sync stores error.
Retry does not create duplicate sale.
```

---

# 22. Activity Log Engine

## Purpose

Records important business actions.

## Required functions

```txt id="1ueqgm"
createActivityLog(payload)
logProductCreated(product)
logStockAdded(stockMovement)
logSellingPriceChanged(priceHistory)
logSaleCompleted(sale)
logSaleReversed(reversal)
logDebtPaymentReceived(payment)
logExpenseRecorded(expense)
logDeviceChanged(device, action)
logSubscriptionEvent(event)
logSyncFailure(syncItem)
```

## Core actions to log

```txt id="dmsd1q"
product_created
stock_added
selling_price_changed
sale_completed
sale_reversed
debt_created
debt_payment_received
expense_recorded
device_blocked
subscription_payment_matched
subscription_activated
subscription_expired
sync_failed
```

## Core rules

* Logs must be created from real actions.
* No fake activity logs.
* Owner can view full logs.
* Sales user sees limited or no logs.

## Tests

```txt id="7mx3b0"
Sale creates activity log.
Stock-in creates activity log.
Expense creates activity log.
Reversal creates activity log.
Fake logs are not generated.
```

---

# 23. Report Filter Engine

## Purpose

Provides consistent date filtering across reports.

## Required functions

```txt id="7o7tii"
getTodayRange()
getYesterdayRange()
getThisWeekRange()
getThisMonthRange()
getCustomRange(from, to)
validateDateRange(from, to)
applyDateFilter(query, range)
```

## Required filters

```txt id="3l8gkn"
Today
Yesterday
This week
This month
Custom later
```

## Core rules

* Reports must use sale/expense action time.
* Offline sale synced later must count on original sale date.
* Date ranges must be consistent across dashboard and reports.

---

# 24. Error Handling Engine

## Purpose

Standardizes user-facing errors.

## Required functions

```txt id="89gkhj"
createError(errorCode, message, details)
mapEngineErrorToUserMessage(error)
mapApiErrorToUserMessage(error)
```

## Required error examples

```txt id="i1szh6"
STOCK_NOT_ENOUGH
ACCESS_DENIED
DEVICE_NOT_ALLOWED
SUBSCRIPTION_EXPIRED
PAYMENT_NOT_CONFIRMED
DUPLICATE_TRANSACTION
SALE_ALREADY_REVERSED
VALIDATION_ERROR
SYNC_FAILED
```

## Core rules

* Error messages must be clear.
* Do not expose technical stack traces.
* Do not expose secrets.
* User should know what to do next.

---

# 25. Engine Dependency Order

Antigravity should build engines in this order:

```txt id="wrdhkv"
1. Error Handling Engine
2. Permission Engine
3. Business Setup Engine
4. Product Engine
5. Inventory Engine
6. Pricing and Costing Engine
7. Price Snapshot Engine
8. Sales Engine
9. Receipt Engine
10. Debt Engine
11. Expense Engine
12. Profit and Loss Engine
13. Analytics Engine
14. Sale Reversal Engine
15. Device Engine
16. Subscription and Offline License Engine
17. Subscription Payment Reconciliation Engine
18. Sync Engine
19. Activity Log Engine
20. Report Filter Engine
```

Do not build dashboard analytics before sales, sale items, expenses, and profit logic exist.

---

# 26. Required Engine Tests

Antigravity must create tests for:

```txt id="xv1wo2"
Weighted average cost
Stock value
Sale item snapshot
Sale completion
Stock reduction
Receipt creation
Debt sale
Debt payment
Expense effect on net profit
Gross profit
Net profit
Reversed sale exclusion
Role permission checks
Device selling checks
Subscription expiry checks
Offline license checks
Payment reconciliation checks
Sync queue creation
Duplicate sync prevention
Activity log creation
```

---

# 27. Master Engine Data Accuracy Test

Use this exact test:

```txt id="wsntxp"
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

If this test fails, engine implementation is not accepted.

---

# 28. What Antigravity Must Not Do

Antigravity must not:

```txt id="q0qhsv"
Put important business logic only inside UI components
Use fake dashboard calculations
Use hardcoded products
Use hardcoded sales
Skip sale item snapshots
Recalculate old sale profit from current product prices
Change old sale item snapshots
Change stock without stock movement
Complete sale without stock reduction
Create receipt with cost/profit
Let Sales user access Owner profit
Allow fake subscription reference activation
Let duplicate transaction activate subscription twice
Let duplicate sync create duplicate sale
Mark sync successful without backend confirmation
Treat Buzz Duka as wallet or money holder
```

---

# 29. Antigravity Completion Report

After building engines, Antigravity must report:

```txt id="8nyacf"
Engine module:
Engines created:
Functions added:
Database repositories connected:
Screens connected:
Backend APIs connected if any:
Tests added:
Tests passed:
Tests failed:
Manual verification completed:
Data accuracy test result:
Known limitations:
No fake engine logic confirmation:
No money-holding logic confirmation:
```

---

# 30. Final Rule

Buzz Duka must be powered by real engines, not fake screens.

The engines must protect:

```txt id="3zcp2d"
Stock accuracy
Cost accuracy
Sale accuracy
Profit accuracy
Debt accuracy
Expense accuracy
Role privacy
Device control
Subscription access
Payment reconciliation safety
Offline reliability
Sync correctness
```

If the engines are wrong, the app is wrong.

Build engines first, then screens.
