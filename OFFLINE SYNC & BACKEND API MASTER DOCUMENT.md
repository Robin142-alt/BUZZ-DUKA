# DOCUMENT 8: OFFLINE SYNC & BACKEND API MASTER DOCUMENT

## Buzz Duka — Offline-First Sync, Backend APIs & Multi-Tenant Cloud Logic

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Offline sync and backend API master document
**Purpose:** Define how Buzz Duka must save data locally first, sync later, prevent duplicate records, protect shop data, and connect the mobile app to backend APIs.
**Core Rule:** Buzz Duka must work offline first. Cloud sync must support the app, not block the seller.

---

# 1. Purpose of This Document

This document defines how Buzz Duka should handle:

* Offline-first local saving
* Sync queue
* Sync statuses
* Backend API structure
* Authentication APIs
* Product and stock APIs
* Sales APIs
* Debt and expense APIs
* Analytics APIs
* Subscription APIs
* Admin APIs
* Multi-tenant data protection
* Duplicate prevention
* Sync error handling

Antigravity must use this document when building the sync engine and backend.

---

# 2. Offline-First Principle

Buzz Duka must be offline-first.

Main rule:

```txt id="nzy4p7"
Save locally first. Sync later.
```

The seller must not wait for internet before completing a sale.

The app must work even when:

* Internet is slow
* Internet is unavailable
* Server is temporarily down
* Sync fails
* User is inside a shop with poor network

Cloud sync must happen after local saving.

---

# 3. Core Offline Actions

These actions must work offline:

```txt id="xqtd6f"
Product search
Complete sale
Reduce stock
Create receipt
Create debt sale
Record debt payment
Record expense
Save activity log
View basic sales history
View basic dashboard
Queue records for sync
```

Do not make checkout depend on backend response.

Wrong:

```txt id="p5b24h"
Send sale to server first → wait → then complete sale.
```

Correct:

```txt id="qm4bfs"
Save sale locally → reduce stock locally → create receipt locally → queue sync → serve next customer.
```

---

# 4. Local Save Rule

Every important shop action must save to SQLite first.

This includes:

* Product creation
* Stock-in
* Price change
* Sale completion
* Sale item snapshots
* Stock movement
* Receipt
* Debt sale
* Debt payment
* Expense
* Activity log

The data must remain after app restart.

Temporary React state is not enough.

---

# 5. Sync Queue Rule

Whenever a syncable action happens locally, Buzz Duka must create a sync queue record.

Sync queue item must include:

```txt id="fr0a9c"
sync_queue_id
business_id
local_record_id
server_record_id_optional
record_type
operation_type
payload_json
sync_status
attempt_count
last_attempt_at
next_retry_at
sync_error_optional
idempotency_key
created_at
updated_at
```

Sync queue must persist after restart.

Do not store pending sync only in memory.

---

# 6. Sync Statuses

Approved sync statuses:

```txt id="htnz1z"
pending
syncing
synced
failed
```

## pending

Record is saved locally but not yet uploaded.

## syncing

Record is currently being uploaded.

## synced

Backend confirmed that the record was stored.

## failed

Sync attempt failed and needs retry.

Do not mark a record as synced unless backend confirms success.

---

# 7. Syncable Record Types

Buzz Duka should sync:

```txt id="eqfug6"
business
user
device
category
product
stock_movement
price_history
sale
sale_item
receipt
customer
debt
debt_payment
expense
activity_log
subscription_event
```

Some records may sync in batches.

Sales must sync carefully because duplicate sales can corrupt stock and analytics.

---

# 8. Idempotency Rule

Every important syncable action must have an idempotency key.

Idempotency prevents duplicate uploads.

Required especially for:

* Sales
* Sale items
* Stock movements
* Receipts
* Debts
* Debt payments
* Expenses
* Activity logs

Example idempotency key structure:

```txt id="a4a8pd"
business_id + device_id + local_id + record_type
```

Backend must reject or safely ignore duplicate idempotency keys.

---

# 9. Duplicate Sale Prevention Rule

Duplicate sales are dangerous.

They can double:

* Revenue
* Profit
* Stock reduction
* Receipt count
* Debt balance
* Payment totals

Backend must prevent duplicate sale uploads.

If mobile retries a sale sync, backend should recognize the same idempotency key and return the existing server record instead of creating a new sale.

---

# 10. Sync Order Rule

Some records depend on others.

Recommended sync order:

```txt id="zj0txa"
1. Business/user/device records
2. Categories
3. Products
4. Price history
5. Stock movements
6. Sales
7. Sale items
8. Receipts
9. Customers
10. Debts
11. Debt payments
12. Expenses
13. Activity logs
```

Sale sync must preserve sale items and stock movement relationships.

If backend uses batch sync, it must process dependencies safely.

---

# 11. Local ID and Server ID Rule

Offline-first records need both local and server identity.

Each syncable record should support:

```txt id="yd9fcl"
local_id
server_id
business_id
sync_status
idempotency_key
created_at
updated_at
```

Before sync:

```txt id="txda7e"
local_id exists
server_id may be null
sync_status = pending
```

After successful sync:

```txt id="vov3zc"
local_id remains
server_id is saved
sync_status = synced
```

Do not replace local IDs in a way that breaks relationships.

---

# 12. Conflict Handling Rule

First version should avoid complex conflicts by limiting sales devices.

Base rule:

```txt id="cqd71q"
Only 1 sales-enabled device in the base plan.
```

This reduces conflicting offline sales.

Possible conflict examples:

* Product edited on owner device while sales device is offline
* Stock added on owner device while sales device is offline
* Same record edited on two devices
* Removed device tries to sync later

First-version conflict handling should be simple and safe:

* Preserve local records
* Do not silently overwrite important data
* Use timestamps
* Use business ID
* Use activity logs
* Show sync errors where needed
* Require owner/admin review for serious conflicts

---

# 13. Sync Failure Rule

If sync fails, the app must not delete local data.

When sync fails:

* Keep local record
* Mark sync item as failed
* Save sync error
* Increase attempt count
* Allow retry
* Show simple message where useful

Example message:

```txt id="wtya2c"
Sale was saved on this phone but has not synced yet.
```

Do not hide sync errors.

---

# 14. Retry Rule

Failed sync items should be retryable.

Retry may happen:

* Automatically when internet returns
* Manually when user taps retry
* Periodically in background if supported

Retry must not create duplicate records.

Idempotency must still be used.

---

# 15. Pending Sync Count

Buzz Duka should show real pending sync count.

Examples:

```txt id="c2czrf"
3 records waiting to sync.
```

```txt id="nij0ac"
Sync failed. Tap to retry.
```

Do not show fake “All synced” unless sync queue is actually clear and backend confirmed.

---

# 16. Backend Purpose

The backend exists to support:

* Authentication
* Business registration
* Device control
* Subscription control
* Cloud storage
* Sync
* Admin dashboard
* Backup
* Multi-device support
* Support and monitoring

The backend must not block offline checkout.

---

# 17. Approved Backend Stack

Approved backend stack:

```txt id="ybjrhq"
Node.js
NestJS
TypeScript
PostgreSQL
Prisma
REST API
JWT authentication
```

Antigravity must not randomly change this stack without approval.

---

# 18. Backend Module Structure

Recommended backend modules:

```txt id="y13vw3"
/auth
/businesses
/users
/devices
/products
/inventory
/sales
/debts
/expenses
/analytics
/subscriptions
/sync
/admin
/common
/database
/config
```

Do not scatter API logic randomly.

Recommended pattern:

```txt id="x60wgi"
Controller → Service → Repository/Prisma → Database
```

---

# 19. Authentication API

Authentication APIs should support:

```txt id="9vhv0i"
Register business owner
Login
Refresh token
Logout if needed
Load current user
Load business context
Load role
Load device status
```

Login response should include:

```txt id="oi3r1o"
access_token
refresh_token_optional
user_id
business_id
role
device_id
subscription_status
permissions
```

Do not fake login success.

---

# 20. Business API

Business APIs should support:

```txt id="z6fs5d"
Create business
Get business profile
Update business profile
Get business status
```

Rules:

* Each business has one Owner.
* Business ID must be used in every business-owned record.
* Suspended businesses must be restricted.
* Business data must not leak across shops.

---

# 21. User API

User APIs should support:

```txt id="bwms51"
Create sales user
List users in business
Update user status
Block/remove sales user
Get current user permissions
```

Rules:

* First version supports Owner and Sales only.
* Sales user must not access Owner-only APIs.
* Passwords must not be stored in plain text.
* User actions must create activity logs where needed.

---

# 22. Device API

Device APIs should support:

```txt id="s2te0s"
Register device
Approve device
Block device
Remove device
Transfer device
Set sales-enabled device
List business devices
```

Rules:

* Maximum 2 active devices in base plan.
* Only 1 sales-enabled device.
* Device actions must create activity logs.
* Removed devices must not continue syncing new data.

---

# 23. Product & Inventory API

Product APIs should support:

```txt id="j93yh4"
Create product
Update product
Deactivate product
List products
Search products
Create category
Add stock
Adjust stock
Record damage/loss
List stock movements
Change selling price
Change default buying price
```

Rules:

* Owner can manage products and stock.
* Sales user can read basic product availability.
* Stock-in must update weighted average cost.
* Stock movement must be recorded.
* Product edits must not rewrite old sale records.

---

# 24. Sales API

Sales APIs should support:

```txt id="ucwfva"
Create sale
List sales
Get sale details
Get sale items
Get receipt
Reverse sale if allowed
```

Rules:

* Sale must include sale items.
* Sale must include payment method.
* Sale items must include price snapshots.
* Sale must reduce stock.
* Backend must prevent duplicate sale uploads.
* Sale must enforce business ID.
* Do not add M-Pesa code or verification fields.

---

# 25. Debt API

Debt APIs should support:

```txt id="opf0m3"
Create debt from sale
List debts
Get debt details
Record debt payment
Update debt status
List overdue debts
```

Rules:

* Debt sale must be a real sale.
* Debt balance must come from original amount minus payments.
* Debt payments must save real records.
* Debt payment must not rewrite old sale snapshots.

---

# 26. Expense API

Expense APIs should support:

```txt id="y9j4t9"
Create expense
List expenses
Get expense details
Update expense if allowed
Void expense
Get expense summary
```

Rules:

* Expenses are Owner-only by default.
* Expenses reduce net profit.
* Sales user cannot access expense APIs.
* Expenses must not be hard deleted casually.

---

# 27. Analytics API

Analytics APIs should support:

```txt id="gzcqzr"
Get dashboard summary
Get sales summary
Get profit summary
Get payment method totals
Get product performance
Get low-stock products
Get loss-making products
Get debt summary
Get expense summary
Get sync summary
```

Rules:

* Analytics must use real records.
* Profit must use sale item snapshots.
* Expenses must affect net profit.
* Sales user must not access Owner-only analytics.
* No fake dashboard data.

---

# 28. Subscription API

Subscription APIs should support:

```txt id="rdzt16"
Get subscription status
Refresh license
Check offline license eligibility
Reactivate subscription
Record subscription event
```

Subscription statuses:

```txt id="zek3uc"
active
grace
expired
suspended
reactivated
```

Rules:

* Do not always return active.
* Expired subscription must restrict access according to policy.
* Offline license must be time-limited.
* Subscription screen must remain accessible when restricted.

---

# 29. Sync API

Sync APIs should support:

```txt id="cltvl1"
Batch upload pending records
Download server changes
Confirm synced records
Return failed records with errors
Handle idempotency
Prevent duplicates
```

Batch upload request should include:

```txt id="jt4nur"
business_id
device_id
records[]
```

Each record should include:

```txt id="h404g3"
record_type
operation_type
local_id
server_id_optional
idempotency_key
payload
created_at
updated_at
```

Backend response should include:

```txt id="58juo8"
success_records[]
failed_records[]
server_id mappings
error messages
```

---

# 30. Admin API

Admin APIs should support internal Buzz Duka operations:

```txt id="qqa9ke"
Admin login
List businesses
View business details
View subscription status
View devices
View sync errors
Suspend business
Reactivate business
View admin audit logs
```

Rules:

* Admin APIs must be protected.
* Admin actions must create audit logs.
* Admin dashboard must use real backend records.
* Do not use fake shop counts or fake revenue.

---

# 31. API Security Rules

Every protected API must check:

```txt id="x4dnpp"
Authentication token
User ID
Business ID
Role permission
Device status where needed
Subscription status where needed
```

Frontend hiding is not enough.

Backend must enforce data protection.

---

# 32. Business ID Enforcement

Every backend query must enforce `business_id`.

Wrong:

```txt id="69lbcf"
SELECT * FROM sales;
```

Correct:

```txt id="didn8n"
SELECT * FROM sales WHERE business_id = current_user.business_id;
```

One shop must never access another shop’s data.

---

# 33. Role Enforcement

Backend must enforce role permissions.

Examples:

* Sales user cannot call expense APIs.
* Sales user cannot call Owner analytics APIs.
* Sales user cannot manage subscription.
* Sales user cannot manage devices.
* Sales user cannot perform cost correction.

If Sales user tries, return clear access denied response.

---

# 34. Device Enforcement

Backend should verify device status where needed.

For sale sync:

* Device must belong to business.
* Device must not be removed or blocked.
* Device must be sales-enabled if creating sales.
* Device must pass plan rules.

Removed device should not continue uploading new sales.

---

# 35. Subscription Enforcement

Backend should enforce subscription status where needed.

If subscription is expired or suspended:

* Restrict normal operations according to policy.
* Allow renewal/reactivation API.
* Preserve data.
* Do not delete records.

Offline license refresh should depend on real subscription status.

---

# 36. API Error Response Format

API errors should be clear and consistent.

Recommended error response:

```txt id="bykfkf"
{
  "success": false,
  "error_code": "STOCK_NOT_ENOUGH",
  "message": "Stock is not enough for this sale.",
  "details": {}
}
```

Avoid vague errors.

Examples:

```txt id="raodvh"
INVALID_PAYMENT_METHOD
ACCESS_DENIED
DEVICE_NOT_ALLOWED
SUBSCRIPTION_EXPIRED
DUPLICATE_RECORD
SYNC_FAILED
STOCK_NOT_ENOUGH
BUSINESS_NOT_FOUND
```

---

# 37. Backend Validation Rules

Backend must validate:

* Required fields
* Business ID
* User role
* Device status
* Product ownership
* Stock availability
* Payment method
* Sale item snapshots
* Debt payment amount
* Expense amount
* Subscription state
* Idempotency key

Do not trust client input blindly.

---

# 38. Offline vs Backend Truth

The local app is the first source of truth during offline work.

After sync, backend becomes cloud source of truth for multi-device/admin visibility.

But backend must preserve local sale truth:

* Original sale time
* Sale item snapshots
* Unit cost at sale
* Unit selling price at sale
* Payment method selected
* Device ID
* User ID

Do not recalculate synced historical sales using current backend product prices.

---

# 39. Data Download Rule

When device downloads cloud changes, it must not overwrite local unsynced records incorrectly.

Download should be careful with:

* Products
* Prices
* Devices
* Subscription status
* User permissions

If conflict exists, preserve local pending changes and show sync issue if needed.

---

# 40. Sync Error Examples

Useful sync errors:

```txt id="k56lx6"
This sale is already synced.
```

```txt id="ldgeev"
This device is no longer allowed to sync sales.
```

```txt id="d5glx4"
Product could not sync because it belongs to another business.
```

```txt id="fu46zw"
Subscription is expired. Connect to renew.
```

```txt id="pcmnfa"
Some records could not sync. Tap to retry.
```

---

# 41. Backend Tests Required

Antigravity must test:

```txt id="hhcsmb"
Owner registration
Login success
Login failure
Protected route rejection
Business ID isolation
Sales user expense API blocked
Product creation API
Stock-in API
Sale sync API
Duplicate sale prevention
Sale item snapshot preservation
Debt payment API
Expense API Owner-only
Analytics from real records
Subscription status API
Offline license refresh
Device limit enforcement
Sync failed record handling
```

---

# 42. Mobile Sync Tests Required

Antigravity must test:

```txt id="ldxgdz"
Offline sale creates local records
Offline sale creates sync queue item
App restart preserves pending sync
Sync uploads sale when online
Backend returns server ID
Local record becomes synced
Failed sync stores error
Retry works
Duplicate upload does not duplicate sale
Pending sync count is correct
Removed device cannot sync new sale
Expired license blocks restricted actions
```

---

# 43. Manual Verification Test

Use this test:

```txt id="1macv1"
1. Turn off internet.
2. Create or use product Lotion with stock 10, cost 250, selling price 400.
3. Sell 4 units using M-Pesa.
4. Confirm sale saves locally.
5. Confirm stock becomes 6 locally.
6. Confirm receipt is created locally.
7. Confirm sync queue has pending sale-related records.
8. Close and reopen app.
9. Confirm sale, receipt, stock, and sync queue still exist.
10. Turn internet on.
11. Trigger sync.
12. Confirm backend receives sale.
13. Confirm local sale gets server_id.
14. Confirm sync_status becomes synced.
15. Trigger sync again.
16. Confirm duplicate sale is not created.
17. Login as Sales user.
18. Confirm Sales user cannot sync or access Owner-only data.
19. Block device from backend/admin.
20. Confirm blocked device cannot sync new sales.
```

If this test fails, offline sync is not complete.

---

# 44. No Fake Sync Rule

Antigravity must not fake sync.

Forbidden:

* Changing UI text to “Synced” without backend confirmation
* Clearing sync queue without uploading
* Returning dummy success responses
* Ignoring failed records
* Deleting local records before successful sync
* Uploading duplicate sales
* Syncing without business ID
* Syncing without auth

Sync must be real and verifiable.

---

# 45. Antigravity Completion Report

After building this module, Antigravity must report:

```txt id="omgvrq"
Module name:
Files created:
Files modified:
Database tables affected:
Backend modules added:
API endpoints added:
Sync logic added:
Security rules implemented:
Tests added:
Manual verification steps:
Known limitations:
No fake sync/API confirmation:
```

---

# 46. Final Rule

Buzz Duka must work even when the internet is bad.

The app must save locally first, protect the sale, protect stock, protect profit snapshots, and sync later.

Backend APIs must store real records, enforce business separation, enforce roles, prevent duplicate sales, support subscription/license control, and power the admin dashboard.

Do not build fake sync.

Do not block checkout waiting for the server.

Do not let one shop access another shop’s data.

Buzz Duka’s offline-first system must be reliable enough for real shops.
