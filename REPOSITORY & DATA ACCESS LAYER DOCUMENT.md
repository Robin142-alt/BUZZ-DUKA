# DOCUMENT 24: REPOSITORY & DATA ACCESS LAYER DOCUMENT

## Buzz Duka — SQLite Repositories, PostgreSQL/Prisma Repositories, Transactions, Queries & Data Isolation

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Repository and data-access architecture document
**Purpose:** Define how Buzz Duka services and engines must read and write data without messy screen logic, fake arrays, unsafe queries, or cross-business data leaks.
**Core Rule:** All real data must be accessed through repositories. Screens must not directly query or mutate the database.

---

# 1. Purpose of This Document

This document defines the repository layer for Buzz Duka.

Antigravity must use this document when building:

* SQLite local database access
* PostgreSQL/Prisma backend data access
* Mobile repositories
* Backend repositories
* Transactions
* Data queries
* Business ID isolation
* Sync mapping
* Idempotency checks
* Report queries
* Safe updates

Repositories are the clean bridge between services and the database.

---

# 2. Repository Layer Principle

Buzz Duka should follow this structure:

```txt id="9wcfyq"
Screen → Service → Engine → Repository → Database
```

Wrong:

```txt id="mz8rel"
SellScreen directly updates products table.
```

Correct:

```txt id="gb2njp"
SellScreen calls SaleService.
SaleService calls SalesEngine.
SalesEngine calls SaleRepository, SaleItemRepository, ProductRepository, StockMovementRepository.
Repositories write to SQLite/PostgreSQL inside transaction.
```

---

# 3. What Repositories Do

Repositories are responsible for:

```txt id="8yefv2"
Creating records
Reading records
Updating records
Soft-deleting records
Running filtered queries
Running database transactions
Checking duplicates
Mapping local IDs to server IDs
Applying business_id filters
Returning clean database results
```

Repositories should not contain UI logic.

Repositories should not decide business rules alone.

Business rules belong in engines/services.

---

# 4. What Repositories Must Not Do

Repositories must not:

```txt id="wbuigz"
Use fake arrays as production storage
Return fake records
Ignore business_id
Expose another business data
Calculate dashboard numbers from hardcoded values
Store money as FLOAT/REAL
Store passwords in plain text
Rewrite old sale item snapshots
Hard delete important business records casually
Mark sync as synced without backend confirmation
Activate subscription from fake payment reference
```

---

# 5. Mobile Repository Structure

Recommended mobile folders:

```txt id="arl40b"
src/repositories/business.repository.ts
src/repositories/user.repository.ts
src/repositories/device.repository.ts
src/repositories/category.repository.ts
src/repositories/product.repository.ts
src/repositories/stock-movement.repository.ts
src/repositories/price-history.repository.ts
src/repositories/sale.repository.ts
src/repositories/sale-item.repository.ts
src/repositories/receipt.repository.ts
src/repositories/customer.repository.ts
src/repositories/debt.repository.ts
src/repositories/debt-payment.repository.ts
src/repositories/expense.repository.ts
src/repositories/sale-reversal.repository.ts
src/repositories/activity-log.repository.ts
src/repositories/sync-queue.repository.ts
src/repositories/subscription.repository.ts
src/repositories/payment-reconciliation.repository.ts
src/repositories/offline-license.repository.ts
```

Each repository should focus on one data area.

Do not create one huge database file with everything mixed together.

---

# 6. Backend Repository Structure

If using NestJS + Prisma, repositories may be implemented as service-level data methods or separate repository classes.

Recommended backend structure:

```txt id="q7vskp"
src/repositories/business.repository.ts
src/repositories/user.repository.ts
src/repositories/device.repository.ts
src/repositories/product.repository.ts
src/repositories/inventory.repository.ts
src/repositories/sale.repository.ts
src/repositories/debt.repository.ts
src/repositories/expense.repository.ts
src/repositories/analytics.repository.ts
src/repositories/sync.repository.ts
src/repositories/subscription.repository.ts
src/repositories/payment-reconciliation.repository.ts
src/repositories/admin.repository.ts
```

Backend repositories must use Prisma/PostgreSQL and must enforce business isolation.

---

# 7. Repository Naming Rule

Use clear names.

Good:

```txt id="o27wfx"
ProductRepository
SaleRepository
DebtRepository
SyncQueueRepository
PaymentReconciliationRepository
```

Bad:

```txt id="jdyuex"
DataHelper
StuffService
DbThings
StorageUtils
```

Repository names should explain what data they control.

---

# 8. Global Repository Rules

Every repository method touching business-owned data must receive or derive:

```txt id="8wfdci"
business_id
```

Example:

```txt id="t5yc4d"
findProductById(businessId, productId)
```

Wrong:

```txt id="5ey37d"
findProductById(productId)
```

Correct:

```txt id="6grhbo"
findProductById(businessId, productId)
```

This prevents cross-shop data leaks.

---

# 9. Transaction Repository Rule

Operations that affect many tables must run inside a transaction.

Required transaction flows:

```txt id="4nbjxt"
Create product with initial stock
Stock-in
Complete sale
Debt sale
Debt payment
Expense creation with activity/sync
Sale reversal
Subscription activation after reconciliation
Sync batch upload
Device status changes
```

If one part fails, rollback the whole operation.

---

# 10. BusinessRepository

## Purpose

Reads and writes business profile records.

## Required methods

```txt id="a30n73"
createBusiness(payload)
findById(businessId)
findCurrentBusiness()
updateBusiness(businessId, payload)
updateStatus(businessId, status)
exists(businessId)
```

## Rules

* Business is created once during onboarding.
* Business status controls access.
* Suspended business must be restricted.
* Do not create fake businesses for production.

---

# 11. UserRepository

## Purpose

Reads and writes Owner and Sales user records.

## Required methods

```txt id="cyj62a"
createUser(payload)
findById(businessId, userId)
findByPhoneOrEmail(phoneOrEmail)
listByBusiness(businessId)
updateStatus(businessId, userId, status)
updatePasswordHash(userId, passwordHash)
countSalesUsers(businessId)
```

## Rules

* Password hash must not be exposed to frontend response.
* Sales user belongs to one business.
* User status must be checked before actions.
* Sales user cannot manage users.

---

# 12. DeviceRepository

## Purpose

Controls device records.

## Required methods

```txt id="ohqbj5"
createDevice(payload)
findById(businessId, deviceId)
findByFingerprint(businessId, fingerprint)
listByBusiness(businessId)
countActiveDevices(businessId)
countSalesEnabledDevices(businessId)
enableSales(businessId, deviceId)
disableSales(businessId, deviceId)
updateStatus(businessId, deviceId, status)
setLastSeen(businessId, deviceId, timestamp)
```

## Rules

```txt id="rrrqbg"
Maximum 2 active devices.
Only 1 sales-enabled device.
Blocked devices cannot sell.
Removed devices cannot sync new sales.
```

Device queries must always filter by business_id.

---

# 13. CategoryRepository

## Purpose

Manages product categories.

## Required methods

```txt id="xvvl6t"
createCategory(businessId, payload)
findById(businessId, categoryId)
findByName(businessId, name)
listActive(businessId)
updateCategory(businessId, categoryId, payload)
deactivateCategory(businessId, categoryId)
```

## Rules

* Category name should be unique per business.
* Sales user may read categories.
* Only Owner may create or edit categories.

---

# 14. ProductRepository

## Purpose

Reads and writes current product records.

## Required methods

```txt id="gsp7bb"
createProduct(businessId, payload)
findById(businessId, productId)
findActiveById(businessId, productId)
searchProducts(businessId, query, filters)
listProducts(businessId, filters)
updateProduct(businessId, productId, payload)
updateStockState(businessId, productId, stockPayload)
updateSellingPrice(businessId, productId, newSellingPriceCents)
deactivateProduct(businessId, productId)
```

## Product stock state fields

```txt id="daacw9"
current_stock_quantity
average_unit_cost_cents
stock_value_cents
```

## Rules

* Product table stores current state only.
* Product repository must not edit old sale item snapshots.
* Sales user query must hide cost fields at service/response level.
* Product cost changes must be done through inventory/cost engines.

---

# 15. StockMovementRepository

## Purpose

Stores every stock change.

## Required methods

```txt id="f3t5dt"
createMovement(businessId, payload)
listByProduct(businessId, productId, filters)
listByBusiness(businessId, filters)
findById(businessId, movementId)
```

## Rules

* Every stock change must have a stock movement.
* Movement must include before and after quantities.
* Movement must include before and after stock value where needed.
* Movement must include user/device where possible.

---

# 16. PriceHistoryRepository

## Purpose

Stores selling price and cost-related changes.

## Required methods

```txt id="88jv1k"
createPriceHistory(businessId, payload)
listByProduct(businessId, productId)
listByBusiness(businessId, filters)
findLatestByProduct(businessId, productId)
```

## Rules

* Selling price changes must create price history.
* Average cost changes may create price history if useful.
* Old sales must not be rewritten when prices change.

---

# 17. SaleRepository

## Purpose

Stores sale headers and sale status.

## Required methods

```txt id="synkrc"
createSale(businessId, payload)
findById(businessId, saleId)
findBySaleNumber(businessId, saleNumber)
listSales(businessId, filters)
updateSaleStatus(businessId, saleId, status)
markReversed(businessId, saleId, reversalPayload)
findByIdempotencyKey(businessId, idempotencyKey)
```

## Rules

* Sale must not exist without sale items.
* Sale totals must match sale item totals.
* Sale amount values are records, not money held by Buzz Duka.
* Reversed sales remain in history.

---

# 18. SaleItemRepository

## Purpose

Stores immutable sale item snapshots.

## Required methods

```txt id="8vv96b"
createSaleItem(businessId, payload)
createManySaleItems(businessId, items)
listBySale(businessId, saleId)
listByProduct(businessId, productId, filters)
sumByDateRange(businessId, filters)
```

## Rules

* Sale item snapshots must not change after sale completion.
* Historical profit must use sale_items.
* Product price changes must not affect sale_items.
* Sale items must include product name snapshot.

---

# 19. ReceiptRepository

## Purpose

Stores receipt records.

## Required methods

```txt id="ys3oip"
createReceipt(businessId, payload)
findById(businessId, receiptId)
findBySaleId(businessId, saleId)
findByReceiptNumber(businessId, receiptNumber)
markReversed(businessId, receiptId)
listReceipts(businessId, filters)
```

## Rules

* Receipt must not show cost/profit.
* Receipt number must be unique per business.
* Reversed sale should mark receipt reversed.

---

# 20. CustomerRepository

## Purpose

Stores customers mostly for debts.

## Required methods

```txt id="ss5g2h"
createCustomer(businessId, payload)
findById(businessId, customerId)
findByPhone(businessId, phone)
findOrCreateCustomer(businessId, payload)
listCustomers(businessId, filters)
updateCustomer(businessId, customerId, payload)
```

## Rules

* Customer name is required for debt sale.
* Phone is optional.
* Customer belongs to one business.

---

# 21. DebtRepository

## Purpose

Stores debt records and balances.

## Required methods

```txt id="eojcl9"
createDebt(businessId, payload)
findById(businessId, debtId)
findBySaleId(businessId, saleId)
listDebts(businessId, filters)
updateDebtBalance(businessId, debtId, payload)
updateDebtStatus(businessId, debtId, status)
cancelDebtForSaleReversal(businessId, saleId)
```

## Rules

```txt id="wd1qvu"
balance_cents = original_amount_cents - amount_paid_cents
```

* Debt sale is still a real sale.
* Debt payment must not rewrite original sale.
* Debt records are business records, not money held by Buzz Duka.

---

# 22. DebtPaymentRepository

## Purpose

Stores debt payment records.

## Required methods

```txt id="bs2ked"
createDebtPayment(businessId, payload)
findById(businessId, paymentId)
listByDebt(businessId, debtId)
listByCustomer(businessId, customerId)
findByIdempotencyKey(businessId, idempotencyKey)
```

## Rules

* Duplicate payment must not reduce balance twice.
* Payment cannot exceed balance unless future overpayment support is approved.
* Payment record is not money held by Buzz Duka.

---

# 23. ExpenseRepository

## Purpose

Stores shop expenses.

## Required methods

```txt id="3kbug7"
createExpense(businessId, payload)
findById(businessId, expenseId)
listExpenses(businessId, filters)
sumExpenses(businessId, filters)
voidExpense(businessId, expenseId, reason)
findByIdempotencyKey(businessId, idempotencyKey)
```

## Rules

* Owner-only through service/permission checks.
* Active expenses reduce net profit.
* Voided expenses should be excluded from active totals.
* Do not hard delete expenses casually.

---

# 24. SaleReversalRepository

## Purpose

Stores sale reversal records.

## Required methods

```txt id="d9j17c"
createReversal(businessId, payload)
findById(businessId, reversalId)
findBySaleId(businessId, saleId)
listReversals(businessId, filters)
findByIdempotencyKey(businessId, idempotencyKey)
```

## Rules

* Sale cannot be reversed twice.
* Reversal must have reason.
* Reversal must be linked to original sale.
* Refund note is informational only.

---

# 25. ActivityLogRepository

## Purpose

Stores real business activity logs.

## Required methods

```txt id="br7fqk"
createLog(businessId, payload)
listLogs(businessId, filters)
getRecentLogs(businessId, limit)
findByEntity(businessId, entityType, entityId)
```

## Rules

* Activity logs must come from real actions.
* Do not generate fake activity history.
* Owner sees full logs.
* Sales user sees limited or no logs.

---

# 26. SyncQueueRepository

## Purpose

Stores local pending sync operations.

## Required methods

```txt id="fqfw20"
createSyncItem(payload)
findById(syncItemId)
findByIdempotencyKey(idempotencyKey)
listPending(businessId)
listFailed(businessId)
markSyncing(syncItemId)
markSynced(syncItemId, serverRecordId)
markFailed(syncItemId, error)
incrementAttempt(syncItemId)
updateNextRetryAt(syncItemId, timestamp)
deleteOnlyAfterSafeCleanup(syncItemId)
```

## Rules

* Sync queue must persist after restart.
* Do not clear queue before backend confirmation.
* Failed sync must keep local data.
* Idempotency prevents duplicate upload.

---

# 27. SubscriptionRepository

## Purpose

Stores subscription status and subscription periods.

## Required methods

```txt id="t9zbp0"
createSubscriptionRecord(businessId, payload)
findCurrentByBusiness(businessId)
updateSubscriptionStatus(businessId, status)
activateSubscription(businessId, payload)
markExpiredIfNeeded(businessId, now)
listSubscriptionHistory(businessId)
```

## Rules

```txt id="xrxh9n"
Plan price = KSh 1,500/month
Billing period = 30 days
Grace period = 3 days
```

Subscription records control access but do not mean Buzz Duka holds money.

---

# 28. PaymentReconciliationRepository

## Purpose

Stores subscription payment reconciliation records.

Important:

```txt id="aarzqb"
Buzz Duka does not hold money.
Money goes directly to the official Till/M-Pesa.
This repository stores reconciliation records only.
```

## Required methods

```txt id="i9pzpd"
createReconciliation(businessId, payload)
findById(businessId, reconciliationId)
findByReference(paymentReference)
findByTransactionId(transactionId)
findByIdempotencyKey(businessId, idempotencyKey)
updateStatus(reconciliationId, status, payload)
markConfirmed(reconciliationId, payload)
markRejected(reconciliationId, reason)
listByBusiness(businessId)
listForAdmin(filters)
```

## Rules

* Transaction ID must be unique.
* Duplicate transaction must not activate subscription twice.
* Wrong Till number must reject.
* Wrong amount must reject or require review.
* User-entered reference alone must not activate subscription.

---

# 29. OfflineLicenseRepository

## Purpose

Stores local offline license state.

## Required methods

```txt id="erxmzq"
saveLicenseState(payload)
getCurrentLicense(businessId, deviceId)
updateLicenseState(businessId, deviceId, payload)
clearLicenseState(businessId, deviceId)
isLicenseValid(businessId, deviceId, now)
```

## Rules

```txt id="wsvqbb"
offline_license_valid_until = earlier of:
last_verified_at + 7 days
grace_until
```

* Offline license must not allow unlimited expired usage.
* Suspended known state should block restricted actions.

---

# 30. AnalyticsRepository

## Purpose

Runs report queries from real data.

## Required methods

```txt id="mk4l90"
getSalesTotal(businessId, filters)
getGrossProfit(businessId, filters)
getExpenseTotal(businessId, filters)
getNetProfit(businessId, filters)
getPaymentTotals(businessId, filters)
getDebtSummary(businessId, filters)
getProductPerformance(businessId, filters)
getLowStockProducts(businessId)
getBestSellers(businessId, filters)
getLossMakingProducts(businessId, filters)
```

## Rules

* Use sale item snapshots for profit.
* Exclude reversed/voided sales from active totals.
* Use expense records for net profit.
* No fake dashboard values.

---

# 31. AdminRepository

## Purpose

Reads platform-level admin data.

## Required methods

```txt id="b2njk7"
listBusinesses(filters)
findBusinessById(businessId)
listSubscriptionReconciliations(filters)
findReconciliationById(reconciliationId)
listSyncIssues(filters)
suspendBusiness(businessId, reason)
reactivateBusiness(businessId, reason)
```

## Rules

* Admin users are separate from shop users.
* Admin actions must create audit logs.
* Admin dashboard must not use fake totals.

---

# 32. AdminAuditRepository

## Purpose

Stores admin audit logs.

## Required methods

```txt id="c9ku5a"
createAuditLog(payload)
listAuditLogs(filters)
listByBusiness(businessId)
listByAdmin(adminUserId)
```

## Rules

Audit logs are required for:

```txt id="hws6co"
Subscription manual correction
Payment reconciliation correction
Business suspension
Business reactivation
Device support action
Admin login
```

---

# 33. Local ID and Server ID Mapping

Offline records need local IDs before sync.

Each syncable local table should support:

```txt id="g6v6vj"
id
server_id
sync_status
idempotency_key
```

Repository methods must handle:

```txt id="byi24h"
Local record creation
Server ID update after sync
Finding local record by idempotency key
Preventing duplicate local records
```

Example:

```txt id="ymrfhb"
updateServerId(localId, serverId)
```

---

# 34. Idempotency Repository Rule

Any mutation that can duplicate must check idempotency.

Required repositories:

```txt id="zn9g24"
SaleRepository
SaleReversalRepository
DebtPaymentRepository
ExpenseRepository
SyncQueueRepository
PaymentReconciliationRepository
ProductRepository for create
StockMovementRepository where needed
```

If idempotency key already exists:

```txt id="kzdbrt"
Return existing record.
Do not create duplicate.
```

---

# 35. Amount Storage Rule

Repositories must store amount values as integer cents.

Correct:

```txt id="7qaoo4"
amount_cents INTEGER
selling_price_cents INTEGER
unit_cost_at_sale_cents INTEGER
```

Wrong:

```txt id="6f3r5y"
amount FLOAT
price REAL
profit decimal without control
```

Examples:

```txt id="p2t6o8"
KSh 400 = 40000
KSh 1,500 = 150000
KSh 281.25 = 28125
```

---

# 36. Soft Delete Rule

Repositories should not hard delete important records casually.

Use status updates:

```txt id="8g0ljt"
Product → is_active = 0
Sale → sale_status = reversed/voided
Receipt → receipt_status = reversed
Expense → expense_status = voided
Debt → debt_status = cancelled/reversed
User → status = blocked/removed
Device → status = blocked/removed
Business → status = suspended/closed
```

Hard delete should be rare and controlled.

---

# 37. Query Safety Rule

Repositories must use parameterized queries.

Wrong:

```txt id="zrbkx4"
"SELECT * FROM products WHERE name = '" + search + "'"
```

Correct:

```txt id="avmmuu"
query("SELECT * FROM products WHERE name LIKE ?", [search])
```

For Prisma, use safe Prisma methods instead of raw unsafe SQL unless absolutely necessary.

---

# 38. Business Isolation Query Examples

Product query:

```txt id="dl6w03"
SELECT * FROM products
WHERE business_id = ?
AND is_active = 1
```

Sale query:

```txt id="ed8l3u"
SELECT * FROM sales
WHERE business_id = ?
AND created_at BETWEEN ? AND ?
```

Debt query:

```txt id="dlhjio"
SELECT * FROM debts
WHERE business_id = ?
AND debt_status IN ('unpaid', 'partial', 'overdue')
```

Do not query business-owned records without business_id.

---

# 39. Repository Transaction Examples

## Complete sale transaction

```txt id="qcfz3t"
1. Create sale.
2. Create sale items.
3. Update product stock.
4. Create stock movements.
5. Create receipt.
6. Create debt if payment method is debt.
7. Create activity log.
8. Create sync queue item.
```

## Stock-in transaction

```txt id="zwkjig"
1. Read current product.
2. Calculate new average cost.
3. Update product stock/cost/value.
4. Create stock movement.
5. Create price history if needed.
6. Create activity log.
7. Create sync queue item.
```

## Reversal transaction

```txt id="orpxy4"
1. Check sale is not already reversed.
2. Create reversal.
3. Mark sale reversed.
4. Restore stock.
5. Create reversal stock movements.
6. Mark receipt reversed.
7. Cancel debt if needed.
8. Create activity log.
9. Create sync queue item.
```

---

# 40. Repository Testing Requirements

Antigravity must test:

```txt id="nrs76p"
Business repository creates business
User repository creates Owner/Sales users
Product repository creates product and persists it
Product search filters by business_id
Stock movement repository records stock changes
Sale repository creates sale
Sale item repository saves immutable snapshots
Receipt repository creates receipt
Debt repository updates balance correctly
Expense repository sums active expenses only
Analytics repository uses real sale_items
Sync queue repository persists pending items after restart
Payment reconciliation repository prevents duplicate transaction
Offline license repository expires correctly
Repositories reject or avoid cross-business data access
```

---

# 41. Manual Repository Verification

Use this manual check:

```txt id="18zfxv"
1. Create Business A.
2. Create Business B.
3. Add product Lotion to Business A.
4. Add product Soap to Business B.
5. Query products as Business A.
6. Confirm only Lotion appears.
7. Query products as Business B.
8. Confirm only Soap appears.
9. Try to fetch Business B product using Business A context.
10. Confirm repository returns not found or access denied.
```

Second check:

```txt id="pq4x70"
1. Create offline sale.
2. Confirm sale exists in SQLite.
3. Confirm sale_items exist.
4. Confirm stock movement exists.
5. Confirm receipt exists.
6. Confirm sync_queue item exists.
7. Restart app.
8. Confirm all records still exist.
```

---

# 42. What Antigravity Must Not Do

Antigravity must not:

```txt id="dq70bn"
Let screens directly mutate database
Use fake arrays for production data
Skip repositories and write random SQL everywhere
Query business-owned records without business_id
Store amount values as FLOAT/REAL
Hard delete sales
Hard delete expenses casually
Overwrite sale item snapshots
Duplicate sale on retry
Activate subscription from fake payment reference
Store actual money/funds
Claim Buzz Duka holds money
Ignore sync_status/server_id/idempotency_key
```

---

# 43. Antigravity Completion Report

After building repositories, Antigravity must report:

```txt id="6el7uu"
Repository module:
Mobile repositories created:
Backend repositories created:
SQLite connected:
PostgreSQL/Prisma connected:
Business ID isolation added:
Transactions added:
Idempotency checks added:
Local/server ID mapping added:
Amount integer storage confirmed:
Soft delete/status rules added:
Tests added:
Manual verification completed:
Known limitations:
No fake repository data confirmation:
No money-holding logic confirmation:
```

---

# 44. Final Rule

Repositories protect Buzz Duka’s data truth.

If repositories are weak:

```txt id="bbj2qf"
One shop may see another shop’s data.
Sales may duplicate.
Stock may become wrong.
Profit may become wrong.
Sync may corrupt records.
Subscription reconciliation may duplicate.
```

Therefore, every real record must pass through a clean repository layer with business isolation, idempotency, safe queries, and transactions.

Buzz Duka must never be powered by fake arrays or random screen logic.
