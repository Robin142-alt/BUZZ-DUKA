# DOCUMENT 23: SERVICES ARCHITECTURE DOCUMENT

## Buzz Duka — Mobile Services, Backend Services, API Services, Repository Services & Admin Services

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Services architecture document
**Purpose:** Define the service layer Antigravity must build so Buzz Duka is organized, testable, maintainable, and not controlled by random screen logic.
**Core Rule:** Screens should not directly perform business operations. Screens call services/engines, and services handle data, APIs, sync, storage, and orchestration.

---

# 1. Purpose of This Document

This document defines the required services for Buzz Duka.

Antigravity must use this document when creating:

* Mobile app services
* Backend services
* API client services
* Local database services
* Sync services
* Subscription reconciliation services
* Admin services
* Repository services
* Utility services

This document prevents messy code where every screen directly touches the database, APIs, and business logic.

---

# 2. Services vs Engines

Buzz Duka has both **engines** and **services**.

## Engines

Engines contain business rules and calculations.

Examples:

```txt id="755rh0"
Sales Engine
Inventory Engine
Profit Engine
Permission Engine
Subscription Engine
Sync Engine
```

## Services

Services connect engines to storage, APIs, devices, and app infrastructure.

Examples:

```txt id="tuinrv"
LocalDatabaseService
ProductService
SaleService
SyncService
AuthService
ApiClientService
SubscriptionService
AdminService
```

Simple rule:

```txt id="bsxs6v"
Engines decide what should happen.
Services make it happen.
```

---

# 3. Required Service Pattern

Each service should follow this pattern:

```txt id="9omj1u"
Validate input
Call permission/subscription/device checks where needed
Call the correct engine
Read/write through repository/database layer
Create sync queue item where needed
Return a clear result
```

Do not put large business logic directly inside screens.

Wrong:

```txt id="v5aajk"
SellScreen directly calculates profit, reduces stock, creates receipt, and updates dashboard.
```

Correct:

```txt id="zghhit"
SellScreen calls SaleService.completeSale()
SaleService calls SalesEngine
SalesEngine calculates and validates
Repository writes records in transaction
SaleService returns result to screen
```

---

# 4. Mobile App Service Structure

Recommended mobile service folders:

```txt id="rl39wd"
src/services/auth
src/services/business
src/services/database
src/services/products
src/services/inventory
src/services/sales
src/services/receipts
src/services/debts
src/services/expenses
src/services/analytics
src/services/permissions
src/services/devices
src/services/subscription
src/services/sync
src/services/activity
src/services/api
src/services/storage
src/services/errors
```

Do not put all services into one giant file.

---

# 5. Backend Service Structure

Recommended backend service modules:

```txt id="g21jvi"
src/auth/auth.service.ts
src/businesses/businesses.service.ts
src/users/users.service.ts
src/devices/devices.service.ts
src/categories/categories.service.ts
src/products/products.service.ts
src/inventory/inventory.service.ts
src/sales/sales.service.ts
src/receipts/receipts.service.ts
src/debts/debts.service.ts
src/expenses/expenses.service.ts
src/analytics/analytics.service.ts
src/sync/sync.service.ts
src/subscription/subscription.service.ts
src/subscription/payment-reconciliation.service.ts
src/admin/admin.service.ts
src/admin/admin-audit.service.ts
```

Backend services must use real PostgreSQL/Prisma records.

No dummy responses.

---

# 6. ApiClientService

## Purpose

Mobile service for calling backend APIs.

## Responsibilities

```txt id="7fid1y"
Set base API URL
Attach auth token
Attach device ID where needed
Attach idempotency key where needed
Handle API errors
Handle timeout/network failure
Parse success/error responses
Refresh token when needed
```

## Required methods

```txt id="s71fya"
get(path, options)
post(path, body, options)
patch(path, body, options)
delete(path, options)
setAuthToken(token)
clearAuthToken()
setDeviceId(deviceId)
handleApiError(error)
```

## Rules

* Do not hardcode production API URLs directly inside screens.
* Do not expose raw API errors to users.
* Network failure must not break offline checkout.

---

# 7. AuthService

## Purpose

Handles login, logout, registration, token storage, and current user session.

## Responsibilities

```txt id="vdpmuz"
Register Owner and business
Login Owner/Sales user
Store tokens securely
Load current session
Logout user
Refresh token
Load current user permissions
Clear session on logout
```

## Required methods

```txt id="2r87sq"
registerBusiness(payload)
login(payload)
logout()
refreshToken()
getCurrentSession()
getCurrentUser()
isLoggedIn()
clearSession()
```

## Rules

* Passwords must not be stored locally.
* Tokens must not be logged.
* Blocked users must not continue normal access.
* Current session must include user role, business_id, device_id, and subscription state.

---

# 8. LocalDatabaseService

## Purpose

Initializes and manages SQLite database.

## Responsibilities

```txt id="dq61he"
Open SQLite database
Run migrations
Create tables
Create indexes
Provide transaction wrapper
Expose safe query helpers
Handle database errors
```

## Required methods

```txt id="rsh8na"
initializeDatabase()
runMigrations()
execute(query, params)
queryOne(query, params)
queryMany(query, params)
transaction(callback)
closeDatabase()
```

## Rules

* Data must persist after restart.
* Money/amount values stored as integer cents.
* Sync queue must persist.
* Business records must include business_id.
* Do not store fake local arrays instead of SQLite.

---

# 9. StorageService

## Purpose

Handles secure and normal local storage.

## Responsibilities

```txt id="kqpswy"
Store auth tokens securely
Store device fingerprint
Store app settings
Store last sync timestamp
Store offline license state if needed
Clear session data
```

## Required methods

```txt id="qxr7at"
setSecureItem(key, value)
getSecureItem(key)
removeSecureItem(key)
setItem(key, value)
getItem(key)
removeItem(key)
clearSessionStorage()
```

## Rules

* Tokens should use secure storage where possible.
* Do not store passwords.
* Do not store secrets in plain logs.

---

# 10. BusinessService

## Purpose

Handles business profile and current business context.

## Responsibilities

```txt id="xguz2w"
Create business during onboarding
Load current business
Update business profile
Store business_id locally
Check business status
```

## Required methods

```txt id="vwzpyl"
createBusiness(payload)
getCurrentBusiness()
updateBusiness(payload)
getBusinessStatus()
ensureBusinessContext()
```

## Rules

* Every business-owned action must know business_id.
* Suspended businesses must be restricted.

---

# 11. UserService

## Purpose

Handles Owner and Sales user management.

## Responsibilities

```txt id="8woaq4"
Create Sales user
List business users
Block Sales user
Load user role
Check user status
```

## Required methods

```txt id="silca5"
createSalesUser(payload)
listUsers()
blockUser(userId)
getUserRole(userId)
getCurrentUserPermissions()
```

## Rules

* Sales user cannot create another user.
* Sales user cannot manage users.
* User role must be enforced locally and on backend.

---

# 12. DeviceService

## Purpose

Controls device registration, status, and sales-enabled device rules.

## Responsibilities

```txt id="dk1do3"
Create device fingerprint
Register device
Load current device
Check device status
Enable sales on device
Block/remove device
Check device limits
```

## Required methods

```txt id="rpqvfe"
getDeviceFingerprint()
registerDevice(payload)
getCurrentDevice()
getDeviceStatus(deviceId)
canDeviceSell(deviceId)
enableSales(deviceId)
disableSales(deviceId)
blockDevice(deviceId)
removeDevice(deviceId)
listDevices()
```

## Rules

```txt id="xe37im"
Maximum 2 active devices.
Only 1 sales-enabled device.
Blocked/removed devices cannot sell.
Removed devices cannot sync new sales created after removal time.
```

---

# 13. PermissionService

## Purpose

Central service for checking permissions.

## Responsibilities

```txt id="3ne9yv"
Check Owner permissions
Check Sales permissions
Protect navigation
Protect actions
Provide access denied messages
```

## Required methods

```txt id="961kbm"
can(action, context)
requirePermission(action, context)
canViewOwnerDashboard(user)
canCompleteSale(user, device, subscription)
canRecordExpense(user)
canViewProfit(user)
canManageDevices(user)
canManageSubscription(user)
canReverseSale(user)
```

## Rules

* Screens must use PermissionService.
* Engines must use PermissionService.
* Backend must still enforce permissions.
* Sales user must not see Owner profit or expenses.

---

# 14. ProductService

## Purpose

Handles product-related operations.

## Responsibilities

```txt id="p7fpoq"
Create product
Update product
Deactivate product
Search products
Load product detail
Prepare product data for Owner or Sales user
```

## Required methods

```txt id="o1y547"
createProduct(payload)
updateProduct(productId, payload)
deactivateProduct(productId)
searchProducts(query, role)
getProduct(productId)
listProducts(filters, role)
```

## Rules

* Product creation with stock must create stock movement.
* Sales user response must hide cost/profit fields.
* Product edits must not rewrite sale item snapshots.

---

# 15. InventoryService

## Purpose

Handles stock-in, stock adjustment, stock movement history, and low-stock checks.

## Responsibilities

```txt id="2f8hhj"
Add stock
Adjust stock
Record damage/loss
Create stock movement
Calculate updated average cost through engine
Load stock movement history
Detect low stock
```

## Required methods

```txt id="ebwzzy"
stockIn(payload)
adjustStock(payload)
recordDamage(payload)
recordLoss(payload)
getStockMovements(productId)
getLowStockProducts()
checkStockAvailability(productId, quantity)
```

## Rules

* Stock must never change without a stock movement.
* Stock-in must update weighted average cost.
* Sales user cannot add or adjust stock.
* Stock changes must be transactional.

---

# 16. PricingService

## Purpose

Handles selling price and buying/cost-related updates.

## Responsibilities

```txt id="lyc4b1"
Change selling price
Create price history
Calculate expected profit
Calculate current margin
Handle cost correction if approved
```

## Required methods

```txt id="h6dwcz"
changeSellingPrice(productId, newPrice, reason)
getPriceHistory(productId)
calculateExpectedProfit(productId)
calculateCurrentMargin(productId)
```

## Rules

* Selling price changes affect new sales only.
* Old sale item snapshots must not change.
* Sales user cannot change prices.
* Cost correction is Owner-only and audited.

---

# 17. SaleService

## Purpose

Handles sale completion and sales history.

## Responsibilities

```txt id="9oekyk"
Validate cart
Validate payment method
Complete sale
Create sale items
Reduce stock
Create receipt
Create debt if payment method is Debt
Create activity log
Create sync queue item
List sales
Load sale detail
```

## Required methods

```txt id="c24x5s"
completeSale(payload)
validateCart(cart)
listSales(filters, role)
getSaleDetail(saleId, role)
getRecentSales(role)
```

## Rules

* Checkout must not wait for cloud sync.
* No M-Pesa code entry for shop sales.
* No M-Pesa verification for shop sales.
* Sale must save locally first.
* Sale must create snapshots.
* Sale must reduce stock.
* Sale must persist after restart.

---

# 18. ReceiptService

## Purpose

Handles receipt creation, viewing, and reversal status.

## Responsibilities

```txt id="uq34t1"
Generate receipt number
Create receipt from sale
Load receipt
Format receipt display
Mark receipt reversed
```

## Required methods

```txt id="905ypl"
createReceiptForSale(sale)
generateReceiptNumber(businessId)
getReceipt(receiptId)
getReceiptBySale(saleId)
markReceiptReversed(receiptId)
```

## Rules

* Receipt must not show cost/profit.
* Receipt must show payment method.
* Reversed receipt must show reversed status.
* Receipt is optional after checkout.

---

# 19. DebtService

## Purpose

Handles debt sales, debt balances, and debt payments.

## Responsibilities

```txt id="mggodr"
Create debt from sale
List debts
Load debt detail
Record debt payment
Update debt status
Cancel/reverse debt when sale is reversed
```

## Required methods

```txt id="j9m1ji"
createDebtFromSale(sale, customer)
listDebts(filters)
getDebtDetail(debtId)
recordDebtPayment(debtId, payload)
updateDebtStatus(debtId)
cancelDebtForReversal(saleId)
```

## Rules

* Debt sale is a real sale.
* Debt sale reduces stock.
* Debt payment does not rewrite sale snapshots.
* Sales user cannot record debt payments by default.
* Payment records are business records, not money held by Buzz Duka.

---

# 20. ExpenseService

## Purpose

Handles shop expense recording.

## Responsibilities

```txt id="y5xzwb"
Create expense
List expenses
Void expense
Calculate expense totals
Create activity log
Create sync queue item
```

## Required methods

```txt id="r18n63"
createExpense(payload)
listExpenses(filters)
voidExpense(expenseId, reason)
getExpenseTotal(filters)
```

## Rules

* Owner-only.
* Expenses reduce net profit.
* Expenses do not reduce gross profit.
* Do not hard delete expenses casually.

---

# 21. AnalyticsService

## Purpose

Provides dashboard and report data.

## Responsibilities

```txt id="zdvx1u"
Load dashboard summary
Calculate total sales
Calculate gross profit
Calculate net profit
Calculate payment method totals
Load best sellers
Load low stock
Load debt summary
Load expense summary
Load product performance
```

## Required methods

```txt id="la65nb"
getDashboardSummary(filters)
getSalesSummary(filters)
getProfitSummary(filters)
getPaymentTotals(filters)
getProductPerformance(filters)
getLowStockSummary()
getDebtSummary(filters)
getExpenseSummary(filters)
```

## Rules

* Owner-only for profit/expense analytics.
* Must use real records.
* Must use sale item snapshots.
* Must exclude reversed sales from active totals.
* No fake dashboard data.

---

# 22. ReversalService

## Purpose

Handles sale reversal and mistake correction.

## Responsibilities

```txt id="mh9md8"
Validate reversal permission
Require reason
Create sale reversal
Restore stock
Mark sale reversed
Mark receipt reversed
Cancel debt if needed
Create activity log
Create sync queue item
```

## Required methods

```txt id="hl7hzi"
reverseSale(saleId, payload)
validateReversalReason(reason)
getReversalDetail(reversalId)
listReversals(filters)
```

## Rules

* Owner-only in MVP.
* Original sale must not be deleted.
* Sale item snapshots must not change.
* Sale cannot be reversed twice.
* Stock must restore once only.
* Refund note is informational only; Buzz Duka does not send or hold refund money.

---

# 23. SubscriptionService

## Purpose

Handles subscription status, expiry, grace period, and offline license.

## Responsibilities

```txt id="f910tc"
Load subscription status
Refresh subscription from backend
Calculate grace period
Check access for restricted actions
Refresh offline license
Show subscription warnings
```

## Required methods

```txt id="s1sf1t"
getSubscriptionStatus()
refreshSubscriptionStatus()
refreshOfflineLicense()
canUseRestrictedAction(action)
isActive()
isInGrace()
isExpired()
isSuspended()
```

## Rules

```txt id="fkn8ah"
Plan: Buzz Duka Smart Plan
Price: KSh 1,500/month
Billing period: 30 days
Grace period: 3 days
Offline license: max 7 days after verification, never beyond grace_until
```

Expired users can view old records but cannot perform restricted new actions.

---

# 24. PaymentReconciliationService

## Purpose

Handles subscription payment reconciliation through the official Till number.

Important:

```txt id="42ys0r"
Buzz Duka does not hold money.
Subscription money goes directly to the official Buzz Duka Till/M-Pesa.
Buzz Duka only records and reconciles payment information.
```

## Responsibilities

```txt id="mih4e8"
Load payment instructions
Show configured Till number
Start payment check
Handle payment status
Prevent fake reference activation
Prevent duplicate transaction activation
Refresh subscription after confirmation
```

## Required methods

```txt id="9t46zf"
getPaymentInstructions()
startPaymentCheck(payload)
getReconciliationStatus(reconciliationId)
refreshPaymentStatus(reference)
handleConfirmedPayment(payload)
getPaymentHistory()
```

## Rules

* Till number must come from configuration.
* User-entered reference alone must not activate subscription.
* Wrong amount must not activate automatically.
* Duplicate transaction must not activate twice.
* Wrong Till number must be rejected.
* Manual correction is admin/support only and must be audited.

---

# 25. SyncService

## Purpose

Handles local sync queue and backend sync.

## Responsibilities

```txt id="la6q7l"
Create sync queue items
Read pending sync items
Batch upload records
Mark records synced
Mark records failed
Retry failed sync
Download server changes
Show pending sync count
```

## Required methods

```txt id="fz7oz5"
queueRecord(recordType, operationType, payload)
getPendingItems()
getFailedItems()
syncNow()
batchUpload(items)
markSynced(syncItemId, serverId)
markFailed(syncItemId, error)
retryFailed()
getPendingCount()
downloadChanges(since)
```

## Rules

* Sync must not block checkout.
* Sync queue persists after restart.
* Do not mark synced before backend confirmation.
* Do not duplicate sales on retry.
* Failed sync must keep local data.
* Owner should see sync issues.

---

# 26. ActivityLogService

## Purpose

Creates activity logs for important actions.

## Responsibilities

```txt id="3sqpg7"
Log product creation
Log stock-in
Log price change
Log sale completed
Log sale reversed
Log debt payment
Log expense recorded
Log subscription event
Log device event
Log sync failure
```

## Required methods

```txt id="5l8rca"
log(actionType, payload)
listActivityLogs(filters)
getRecentActivity(limit)
```

## Rules

* Activity logs must come from real actions.
* No fake activity history.
* Owner can view full activity.
* Sales user sees limited or no activity history.

---

# 27. ErrorService

## Purpose

Standardizes app errors.

## Responsibilities

```txt id="5q3viy"
Create standard errors
Map technical errors to user messages
Map API errors to app messages
Prevent stack traces in UI
```

## Required methods

```txt id="kddmte"
createError(errorCode, message, details)
fromApiError(error)
fromDatabaseError(error)
toUserMessage(error)
```

## Rules

* Errors must be simple and clear.
* Do not expose secrets.
* Do not expose raw stack traces in production.
* User should know what to do next.

---

# 28. ReportFilterService

## Purpose

Provides consistent date filters.

## Responsibilities

```txt id="n7qu7h"
Today filter
Yesterday filter
This week filter
This month filter
Custom range later
```

## Required methods

```txt id="4b38uh"
getTodayRange()
getYesterdayRange()
getThisWeekRange()
getThisMonthRange()
getCustomRange(from, to)
validateDateRange(from, to)
```

## Rules

* Reports must use action time, not sync time.
* Same date filter rules must apply across dashboard and reports.

---

# 29. Backend AuthService

## Purpose

Backend authentication and token issuing.

## Responsibilities

```txt id="j5km8o"
Register business Owner
Login users
Hash passwords
Validate passwords
Issue tokens
Refresh tokens
Load current user
Reject blocked users
```

## Rules

* Passwords must be hashed.
* Password hash must never be returned.
* Tokens must expire.
* Business ID and role must be included in auth context.

---

# 30. Backend Business Services

Backend must include these services:

```txt id="q64mup"
BusinessesService
UsersService
DevicesService
ProductsService
InventoryService
SalesService
ReceiptsService
DebtsService
ExpensesService
AnalyticsService
SyncService
SubscriptionService
PaymentReconciliationService
AdminService
AdminAuditService
```

All backend services must use Prisma/PostgreSQL and enforce business ID isolation.

---

# 31. Backend PaymentReconciliationService

## Purpose

Securely reconciles subscription payments.

## Responsibilities

```txt id="bmxvdg"
Receive payment provider data
Verify webhook authenticity
Check Till number
Check amount
Check duplicate transaction
Match payment to business
Create reconciliation record
Activate subscription
Refresh license state
Create activity/audit logs
```

## Required methods

```txt id="2hmr9x"
handleWebhook(payload)
verifyProviderPayload(payload)
findMatchingBusinessPayment(payload)
confirmReconciliation(payload)
rejectReconciliation(reason)
preventDuplicateTransaction(transactionId)
activateSubscriptionAfterReconciliation(reconciliationId)
```

## Rules

* Must not activate from fake typed reference alone.
* Must not activate duplicate transaction twice.
* Must not claim Buzz Duka holds money.
* Must create records for audit/support.

---

# 32. Backend Admin Services

## AdminService responsibilities

```txt id="okz1xg"
Admin login
List businesses
View business details
View devices
View subscriptions
View reconciliation records
Suspend/reactivate business
Manual subscription correction
View sync issues
```

## AdminAuditService responsibilities

```txt id="q8zohs"
Log admin login
Log business suspension
Log subscription correction
Log payment reconciliation correction
Log device changes
Log support actions
```

## Rules

* Admin users are separate from shop users.
* Admin actions must be audited.
* Admin dashboard must not use fake data.

---

# 33. Service Dependency Order

Antigravity should build services in this order:

```txt id="vbp6ov"
1. ErrorService
2. LocalDatabaseService
3. StorageService
4. ApiClientService
5. AuthService
6. BusinessService
7. PermissionService
8. DeviceService
9. ProductService
10. InventoryService
11. PricingService
12. SaleService
13. ReceiptService
14. DebtService
15. ExpenseService
16. AnalyticsService
17. ReversalService
18. SubscriptionService
19. PaymentReconciliationService
20. SyncService
21. ActivityLogService
22. ReportFilterService
```

Do not build dashboard services before the records they depend on exist.

---

# 34. Service Testing Requirements

Antigravity must test:

```txt id="xlz16a"
AuthService stores session correctly
LocalDatabaseService persists records after restart
ProductService creates real product
InventoryService creates stock movement
PricingService changes selling price without changing old sales
SaleService completes sale and reduces stock
ReceiptService creates receipt without cost/profit
DebtService updates debt balance
ExpenseService affects net profit
AnalyticsService uses real records
ReversalService restores stock once
SubscriptionService blocks expired access
PaymentReconciliationService does not activate fake reference
SyncService does not mark synced before backend confirmation
PermissionService blocks Sales user from Owner features
ActivityLogService creates real logs
```

---

# 35. What Antigravity Must Not Do

Antigravity must not:

```txt id="mvqcqr"
Put all logic inside screens
Create one giant service file
Use fake local arrays instead of database services
Let services return fake success
Skip permission checks
Skip subscription checks
Skip device checks before selling
Skip sync queue creation
Mark sync complete without backend confirmation
Activate subscription from fake reference
Treat Buzz Duka as wallet or money holder
Expose Owner profit to Sales user
```

---

# 36. Antigravity Completion Report

After building services, Antigravity must report:

```txt id="9efym5"
Services module:
Mobile services created:
Backend services created:
Repositories connected:
Engines connected:
Database connected:
API client connected:
Permission checks added:
Subscription checks added:
Sync queue connected:
Payment reconciliation service added:
Tests added:
Manual verification completed:
Known limitations:
No fake services confirmation:
No money-holding logic confirmation:
```

---

# 37. Final Rule

Buzz Duka services must keep the app organized and real.

Screens should not fake business behavior.

Services must connect:

```txt id="vllucd"
UI
Engines
Database
APIs
Sync
Permissions
Subscription
Reconciliation
Activity logs
```

If services are clean, Buzz Duka will be easier to build, test, debug, and scale.

Build services carefully before building too many screens.
