# DOCUMENT 25: STATE MANAGEMENT & APP ARCHITECTURE DOCUMENT

## Buzz Duka — App Structure, State Flow, Offline Data, Screen Data, Caching & Role-Based Navigation

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** State management and app architecture document
**Purpose:** Define how Buzz Duka screens, services, engines, repositories, local database, API client, sync queue, and UI state must work together.
**Core Rule:** Buzz Duka must not rely on fake in-memory state for real business data. Real business data must come from SQLite/local database and backend sync.

---

# 1. Purpose of This Document

This document defines how Buzz Duka app state should be organized.

Antigravity must use this document when building:

* Mobile app folder structure
* Navigation
* Global app state
* User session state
* Business context
* Role-based navigation
* Offline state
* Sync state
* Product lists
* Cart state
* Sales state
* Dashboard state
* Subscription state
* Device state
* Error/loading states

This document prevents messy screens, fake state, and duplicated logic.

---

# 2. Main Architecture Principle

Buzz Duka should follow this structure:

```txt id="5cuqpz"
UI Screen
↓
State Hook / ViewModel
↓
Service
↓
Engine
↓
Repository
↓
SQLite / API / PostgreSQL
```

Screens must stay simple.

Screens should mainly:

```txt id="myy8ns"
Display data
Handle user input
Call actions
Show loading/error/success states
Navigate after success
```

Screens must not directly calculate profit, update stock, or fake dashboard totals.

---

# 3. State Types

Buzz Duka has four main types of state:

```txt id="rte3wq"
1. Session state
2. UI state
3. Local business data state
4. Sync/backend state
```

## Session state

Examples:

```txt id="vjn82j"
Current user
Role
Business ID
Device ID
Auth token
Subscription status
Permissions
```

## UI state

Examples:

```txt id="fzwzr1"
Current cart
Search text
Selected payment method
Loading state
Form errors
Selected date filter
Modal visibility
```

## Local business data state

Examples:

```txt id="ck9fbn"
Products
Stock
Sales
Sale items
Debts
Expenses
Receipts
Activity logs
Sync queue
```

## Sync/backend state

Examples:

```txt id="x9dz4e"
Pending sync count
Last sync time
Failed sync items
Backend subscription status
Payment reconciliation status
```

---

# 4. Real Data Rule

Real business data must be stored in SQLite first.

Real business data includes:

```txt id="2p2j5e"
Products
Stock
Stock movements
Sales
Sale items
Receipts
Customers
Debts
Debt payments
Expenses
Activity logs
Sync queue
Subscription/license state
```

Do not store these only in React state.

React state may temporarily display them, but the source of truth is SQLite.

---

# 5. Temporary UI State Rule

Some state can live only in UI memory.

Examples:

```txt id="hy0j4m"
Current cart before sale completion
Search text
Open modal
Selected tab
Form input before save
Loading flag
Error message
```

Once a sale is completed, it must leave temporary state and become real database records.

---

# 6. Recommended State Management

Antigravity can use a simple state management approach.

Recommended:

```txt id="vga60o"
React hooks for screen-local state
Context or lightweight store for session/app-wide state
SQLite/repositories for real business data
Query/cache library optional for API/server data
```

Do not overcomplicate MVP.

Avoid putting all app data in one huge global store.

---

# 7. Global App State

Global app state should include only app-wide information.

Recommended global state:

```txt id="23u9j1"
currentUser
currentBusiness
currentDevice
authStatus
subscriptionStatus
offlineLicenseState
networkStatus
syncStatus
permissions
```

Do not put full sales history or all product records permanently in global state unless there is a clear reason.

---

# 8. Session Store

Session store controls login state.

Required fields:

```txt id="pil3kt"
isAuthenticated
accessToken
refreshToken
currentUser
businessId
deviceId
role
permissions
```

Required actions:

```txt id="w01l7d"
setSession(payload)
clearSession()
loadSessionFromStorage()
refreshSession()
logout()
```

Rules:

* Tokens must be stored securely.
* Passwords must never be stored.
* Clearing session must not delete business records.
* Blocked user must not continue normal access.

---

# 9. Business Context Store

Business context tells the app which shop is active.

Required fields:

```txt id="pfy043"
businessId
businessName
businessStatus
businessCategory
location
```

Required actions:

```txt id="w7peo2"
setBusiness(payload)
loadBusiness()
updateBusiness(payload)
clearBusinessContext()
```

Rules:

* Every business-owned query must use business_id.
* If business is suspended, restricted actions must be blocked.

---

# 10. Device State Store

Device state controls the current phone/device access.

Required fields:

```txt id="sqy0ne"
deviceId
deviceName
deviceFingerprint
deviceStatus
isSalesEnabled
lastSeenAt
```

Required actions:

```txt id="wfpb2a"
loadCurrentDevice()
registerDevice()
setDeviceStatus(status)
refreshDeviceStatus()
```

Rules:

* Blocked devices cannot sell.
* Removed devices cannot sync new sales.
* Only one sales-enabled device allowed.

---

# 11. Subscription State Store

Subscription state controls access.

Required fields:

```txt id="s816pd"
planName
planPriceCents
status
subscriptionEndAt
graceUntil
lastVerifiedAt
offlineLicenseValidUntil
paymentReconciliationStatus
```

Required actions:

```txt id="x3j5sa"
loadSubscriptionStatus()
refreshSubscriptionStatus()
refreshOfflineLicense()
setPaymentReconciliationStatus(status)
markExpiredIfNeeded()
```

Rules:

* Expired subscription blocks restricted actions.
* Grace shows warning.
* Offline license must not last forever.
* Subscription money goes directly to official Till/M-Pesa.
* Buzz Duka only reconciles payment records.

---

# 12. Network State

Network state tells the app whether it can sync.

Required fields:

```txt id="m3jdi4"
isOnline
lastOnlineAt
connectionType optional
```

Required actions:

```txt id="0rjf9e"
setOnline()
setOffline()
listenForNetworkChanges()
```

Rules:

* Offline checkout must still work if local license is valid.
* Network failure must not erase unsynced data.
* Do not show “synced” when offline.

---

# 13. Sync State Store

Sync state controls pending records and sync messages.

Required fields:

```txt id="a7exgd"
pendingCount
failedCount
isSyncing
lastSyncAt
lastSyncError
```

Required actions:

```txt id="pmf7ck"
loadSyncStatus()
syncNow()
setSyncing()
setSynced()
setSyncFailed(error)
refreshPendingCount()
```

Rules:

* Pending count must come from sync_queue.
* Failed count must come from sync_queue.
* Do not fake sync status.
* Do not mark synced before backend confirmation.

---

# 14. Product Screen State

Product screens should use local UI state plus repository data.

Temporary UI state:

```txt id="vcpc40"
searchText
selectedCategory
isLoading
error
formValues
validationErrors
```

Real data source:

```txt id="c22ku5"
products table
categories table
stock_movements table
price_history table
```

Rules:

* Product list must load from database.
* Sales user must not see cost fields.
* Product creation must save to database.
* Product edit must not rewrite old sales.

---

# 15. Sell Screen State

Sell screen has special state because checkout must be fast.

Temporary state:

```txt id="671smr"
searchText
searchResults
cartItems
selectedPaymentMethod
selectedCustomerForDebt
isCompletingSale
checkoutError
```

Cart item should include:

```txt id="imssm0"
product_id
product_name
quantity
unit_selling_price_cents
available_stock
```

Important:

Cart is temporary until sale is completed.

When user taps Complete Sale:

```txt id="z63i61"
SaleService.completeSale()
```

Then the app must create real records:

```txt id="v1fqd2"
sales
sale_items
stock_movements
receipts
debt if needed
activity_logs
sync_queue
```

Rules:

* Cart clears only after successful local save.
* Checkout must not wait for cloud sync.
* No M-Pesa code field.
* No shop-sale M-Pesa verification.

---

# 16. Sales History State

Sales history must load from database.

State fields:

```txt id="ydb0gw"
sales
selectedDateFilter
isLoading
error
```

Rules:

* Owner may see full sale detail including profit.
* Sales user sees limited details.
* Reversed sales show reversed badge.
* Sales history must persist after restart.

---

# 17. Debt State

Debt screens must load from database.

State fields:

```txt id="rlex37"
debts
selectedDebt
debtPayments
filters
isLoading
error
```

Rules:

* Owner can view and manage debts.
* Debt sale creates debt from sale flow.
* Debt payments update balances.
* Debt values are records, not money held by Buzz Duka.

---

# 18. Expense State

Expense state is Owner-only.

State fields:

```txt id="88r9or"
expenses
selectedDateFilter
formValues
isLoading
error
```

Rules:

* Sales user cannot access expense state/screens.
* Expenses reduce net profit.
* Voided expenses excluded from active totals.
* Expense data must persist after restart.

---

# 19. Dashboard State

Dashboard state must be derived from real records.

State fields:

```txt id="7ynpod"
selectedDateFilter
dashboardSummary
lowStockProducts
bestSellers
debtSummary
expenseSummary
pendingSyncCount
subscriptionStatus
isLoading
error
```

Rules:

* No fake dashboard values.
* Gross profit uses sale item snapshots.
* Net profit subtracts active expenses.
* Reversed sales excluded from active totals.
* Sales user cannot access Owner dashboard state.

---

# 20. Activity State

Activity state loads real logs.

State fields:

```txt id="kd7xax"
activityLogs
filters
isLoading
error
```

Rules:

* Logs must come from real actions.
* No fake activity history.
* Owner sees full logs.
* Sales user sees limited/no logs.

---

# 21. Admin Dashboard State

Admin dashboard has separate state.

Admin state includes:

```txt id="kmxkxl"
adminUser
adminToken
businessList
selectedBusiness
subscriptionReconciliations
syncIssues
adminAuditLogs
```

Rules:

* Admin users are separate from shop users.
* Admin dashboard must use real backend data.
* Admin actions must create audit logs.
* No fake business counts.

---

# 22. Loading State Rules

Every async screen should have loading state.

Examples:

```txt id="ysfzth"
Loading products...
Saving sale...
Checking payment...
Syncing records...
Loading dashboard...
```

Do not show blank screens.

---

# 23. Error State Rules

Errors must be user-friendly.

Examples:

```txt id="c4a54h"
Stock is not enough.
You do not have permission to perform this action.
This device is not allowed to sell.
Your subscription has expired.
Payment not confirmed yet.
Sync failed. Tap to retry.
```

Do not expose stack traces in UI.

---

# 24. Empty State Rules

Empty states must guide the user.

Examples:

```txt id="ensc1n"
No products yet. Add your first product to start selling.
No sales today.
No debts yet.
No expenses recorded this month.
No failed sync records.
```

Do not show fake sample data as if it is real.

---

# 25. Role-Based Navigation State

Navigation must be built from role and permissions.

Owner navigation:

```txt id="qmbtt5"
Dashboard
Sell
Products
Stock
Debts
Expenses
Reports
Activity
Subscription
Devices
Settings
```

Sales navigation:

```txt id="gagp27"
Sell
Recent Sales
Basic Stock
Sync Status
Settings
```

Rules:

* Sales user must not see Owner-only navigation.
* Direct route access must still be blocked.
* Backend must still reject unauthorized API access.

---

# 26. Route Guard Rules

Every protected route/screen must check:

```txt id="of3l1w"
isAuthenticated
businessStatus
userRole
permission
deviceStatus when needed
subscription/license when needed
```

If blocked:

```txt id="r22i32"
Show clear access denied message.
Do not render restricted data.
```

---

# 27. State Refresh Rules

After important actions, refresh affected data.

After product creation:

```txt id="9zg7z2"
Refresh product list
Refresh low-stock list if needed
Refresh sync count
```

After sale completion:

```txt id="akvdaa"
Clear cart
Refresh product stock
Refresh recent sales
Refresh dashboard summary
Refresh pending sync count
```

After expense:

```txt id="lhqypo"
Refresh expense list
Refresh net profit dashboard
Refresh activity logs
Refresh sync count
```

After subscription payment confirmation:

```txt id="a0fgz4"
Refresh subscription state
Refresh offline license
Unlock restricted actions if active
Refresh activity logs
```

---

# 28. Offline State Rules

When offline:

```txt id="yd5idu"
Use SQLite data.
Allow permitted local actions if license valid.
Queue sync records.
Show offline banner.
Do not block checkout because internet is unavailable.
```

When online returns:

```txt id="3ws7by"
Refresh subscription/device state.
Upload pending sync.
Download changes.
Refresh local summaries.
```

Do not silently replace local records with backend data without conflict handling.

---

# 29. Cache Rules

Cache can be used for performance, but database remains source of truth.

Allowed cache:

```txt id="cmrxrv"
Recently loaded products
Dashboard summary for current session
Current user session
Current subscription status
```

Rules:

* Cache must be invalidated after writes.
* Cache must not create fake data.
* Cache must not override SQLite truth.
* Cache must not show stale subscription active forever.

---

# 30. App Startup Flow

When app starts:

```txt id="afgp3s"
1. Initialize SQLite database.
2. Run migrations.
3. Load stored session.
4. Load business context.
5. Load current device.
6. Load local subscription/offline license.
7. Load network state.
8. Load pending sync count.
9. Route user to correct screen.
10. If online, refresh subscription/device/sync status.
```

If no session:

```txt id="8ay89e"
Show login/onboarding.
```

If session exists:

```txt id="jkwiro"
Check role and route to Owner or Sales area.
```

---

# 31. App Restart Persistence Rule

After restart, the app must restore:

```txt id="yzfsxk"
Logged-in session if valid
Business context
Device context
Products
Stock
Sales history
Debts
Expenses
Sync queue
Offline license state
```

Do not lose sale data after restart.

---

# 32. Logout Rule

Logout should:

```txt id="dib0kt"
Clear session tokens
Clear current user state
Clear temporary UI state
Keep local business records unless user chooses secure reset
Return to login screen
```

Logout must not delete shop records by accident.

---

# 33. Data Reset Rule

Data reset is dangerous.

If implemented, it must:

```txt id="q16ogs"
Require Owner permission
Show serious warning
Explain unsynced data may be lost
Require confirmation
Never be available to Sales user
```

Do not add casual “clear all data” buttons.

---

# 34. State Testing Requirements

Antigravity must test:

```txt id="2uhak6"
App starts and initializes database
Session loads after restart
Products load from SQLite
Cart clears only after sale is saved
Sale persists after restart
Dashboard updates after sale
Dashboard updates after expense
Sales user navigation hides Owner screens
Direct restricted route is blocked
Offline sale creates sync queue item
Sync pending count comes from SQLite
Subscription expired state blocks sale
Payment confirmation refreshes subscription state
Logout clears session but not business records
```

---

# 35. Manual State Verification

Use this test:

```txt id="jyiyvp"
1. Login as Owner.
2. Add product.
3. Complete sale.
4. Confirm dashboard updates.
5. Close app completely.
6. Reopen app.
7. Confirm product remains.
8. Confirm sale remains.
9. Confirm stock remains reduced.
10. Confirm dashboard still shows correct totals.
```

Second test:

```txt id="p7wpbn"
1. Login as Sales user.
2. Confirm Owner dashboard is hidden.
3. Try direct route to Expenses.
4. Confirm access denied.
5. Complete sale if device/subscription allows.
6. Confirm no profit is shown.
```

---

# 36. What Antigravity Must Not Do

Antigravity must not:

```txt id="w9gv63"
Use React state as the only storage for sales
Use fake arrays for product list
Use fake dashboard state
Lose data after app restart
Show Sales user Owner navigation
Let direct routes bypass permissions
Mark sync as complete from UI only
Show subscription active forever from stale cache
Clear local records on logout
Treat Buzz Duka as wallet or money holder
```

---

# 37. Antigravity Completion Report

After implementing state management, Antigravity must report:

```txt id="mf0z80"
State module:
Global stores created:
Session store created:
Business context created:
Device state created:
Subscription state created:
Sync state created:
Screen states implemented:
Route guards added:
Offline state handled:
Cache invalidation handled:
Tests added:
Manual verification completed:
Known limitations:
No fake state confirmation:
No money-holding logic confirmation:
```

---

# 38. Final Rule

Buzz Duka app state must support real offline-first business use.

Temporary UI state is allowed for forms and carts.

Real business records must live in SQLite and sync to backend.

A sale must not disappear when the screen changes.

A product must not disappear after restart.

A dashboard must not show fake values.

A Sales user must not access Owner data through hidden routes.

State management must protect the truth of the shop.
