# DOCUMENT 22: SYNC CONFLICT RESOLUTION DOCUMENT

## Buzz Duka — Offline Conflicts, Duplicate Prevention, Device Conflicts, Product Conflicts & Safe Sync Rules

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Sync conflict resolution document
**Purpose:** Define how Buzz Duka must handle conflicts when offline records later sync to the backend.
**Core Rule:** Offline work must be preserved, but sync must never duplicate sales, corrupt stock, overwrite history, or allow blocked devices to bypass rules.

---

# 1. Purpose of This Document

This document defines how Buzz Duka handles sync conflicts.

Buzz Duka is offline-first, so conflicts can happen when:

* A device works offline
* Owner changes product details while another device is offline
* A device is blocked while it still has pending records
* A subscription expires while the device is offline
* A sale is uploaded twice
* A product is deactivated before an offline sale syncs
* A sale is reversed offline before original sale syncs
* Sync fails and retries later

Antigravity must use this document when building the Sync Engine, backend sync API, local sync queue, and conflict handling UI.

---

# 2. Sync Conflict Principle

Buzz Duka must follow this principle:

```txt id="2o2b0w"
Preserve real offline actions.
Prevent duplicate records.
Protect stock and profit accuracy.
Never silently overwrite important business data.
```

Do not delete offline records just because sync becomes difficult.

Do not fake sync success.

Do not mark a record as synced unless backend confirms.

---

# 3. MVP Conflict Reduction Strategy

MVP should reduce conflicts by design.

Base plan rules:

```txt id="pqa1xx"
Maximum 2 active devices.
Only 1 sales-enabled device.
```

This means only one device should normally create sales.

That reduces:

* Double-selling stock
* Stock conflicts
* Multiple cashier conflicts
* Price conflicts during checkout

Do not build complex multi-cashier conflict logic in MVP unless needed later.

---

# 4. Sync Statuses

Approved sync statuses:

```txt id="3r8n0f"
pending
syncing
synced
failed
```

## pending

Saved locally but not uploaded.

## syncing

Currently uploading.

## synced

Backend confirmed.

## failed

Upload failed and needs retry or review.

No other random sync statuses should be introduced unless approved.

---

# 5. Sync Queue Must Persist

The sync queue must be stored in SQLite.

It must survive:

```txt id="8mapex"
App restart
Phone restart
Network failure
Failed sync attempt
Backend downtime
```

Do not store pending sync only in memory.

---

# 6. Idempotency Rule

Every syncable mutation must have an idempotency key.

Required for:

```txt id="m3pf69"
Sales
Sale items
Stock movements
Receipts
Debts
Debt payments
Expenses
Sale reversals
Subscription payment reconciliations
Activity logs
Product changes
Stock-in
```

Backend must use idempotency to prevent duplicates.

Example idempotency key:

```txt id="d3wkgs"
business_id + device_id + record_type + local_id
```

If the same idempotency key is uploaded again:

```txt id="7iaqp0"
Return existing server record.
Do not create duplicate.
```

---

# 7. Duplicate Sale Conflict

## Problem

A sale created offline may be uploaded more than once because of retry.

## Risk

Duplicate sale can cause:

```txt id="bck55o"
Double revenue
Double profit
Double stock reduction
Duplicate receipt
Duplicate debt
Wrong reports
```

## Resolution

Backend must check:

```txt id="1osc5y"
business_id
record_type
idempotency_key
local_id/device_id if needed
```

If duplicate is detected:

```txt id="ox8jox"
Return existing sale server_id.
Do not create another sale.
Do not reduce stock again.
Do not create another receipt.
Do not create another debt.
```

## Acceptance test

```txt id="i7wmqj"
1. Create offline sale.
2. Sync sale.
3. Retry same sync request.
4. Confirm only one sale exists in backend.
5. Confirm stock reduced once only.
```

---

# 8. Duplicate Sale Reversal Conflict

## Problem

A reversal may be uploaded twice.

## Risk

Stock could be restored twice.

## Resolution

Backend must check if sale is already reversed.

If already reversed:

```txt id="7lp7ad"
Return existing reversal.
Do not restore stock again.
Do not create another reversal.
```

## Acceptance test

```txt id="n0wr9p"
1. Reverse sale offline.
2. Sync reversal.
3. Retry same reversal sync.
4. Confirm stock is restored once only.
```

---

# 9. Product Edited While Sales Device Is Offline

## Problem

Owner changes product name, selling price, or low-stock level while Sales device is offline.

Sales device later uploads sale created using old local product data.

## Correct rule

The sale must preserve its sale item snapshots.

If the offline sale was genuinely completed before the device received the latest product update:

```txt id="yo8zt2"
Accept the sale using the snapshot captured at sale time.
```

## Why

Historical truth matters.

The seller sold based on the local price available at that time.

## Resolution

Backend should:

* Accept sale item snapshots if product belonged to same business.
* Preserve unit selling price at sale.
* Preserve unit cost at sale.
* Update reports using sale item snapshots.
* Not rewrite sale item using current product table.

## Acceptance test

```txt id="z1cm36"
1. Sales device has Lotion selling price KSh 400.
2. Sales device goes offline.
3. Owner changes Lotion selling price to KSh 450 online.
4. Sales device sells Lotion offline at KSh 400.
5. Sales device syncs later.
6. Confirm sale item remains KSh 400.
7. Confirm current product price remains KSh 450.
```

---

# 10. Product Deactivated While Offline Sale Exists

## Problem

Owner deactivates a product while Sales device is offline.

Sales device already sold the product offline before receiving the deactivation.

## Resolution

If sale was created before deactivation reached the device:

```txt id="4bmihi"
Accept sale as historical sale.
Keep product inactive for future selling.
```

Do not reject the sale just because product is now inactive.

## Backend must verify:

```txt id="ra05uv"
Product belongs to same business.
Sale created_at is valid.
Sale item snapshot is complete.
Idempotency is valid.
```

## Acceptance test

```txt id="xc95ti"
1. Sales device goes offline with active Lotion.
2. Owner deactivates Lotion.
3. Sales device sells Lotion offline.
4. Sync happens later.
5. Backend accepts historical sale.
6. Product remains inactive for future sale.
```

---

# 11. Product Deleted or Missing on Backend

## Problem

Offline sale references a product that backend cannot find.

## Possible causes

```txt id="hlpgqj"
Product was never synced.
Product sync order is wrong.
Product belongs to another business.
Local data is corrupted.
Payload is malicious.
```

## Resolution

Backend should:

1. Check if product exists by server_id.
2. If missing, check local_id mapping if provided.
3. If product record is included in same sync batch, sync product first.
4. If product belongs to another business, reject.
5. If product truly missing, mark sync failed and require review.

Do not create orphan sale items without valid product/business relationship.

---

# 12. Stock Conflict During Sync

## Problem

Backend stock may differ from offline device stock.

## MVP strategy

Because MVP allows only one sales-enabled device, stock conflicts should be rare.

For offline sales from the approved sales-enabled device:

```txt id="cv8i5e"
Accept sale if it was created by an active allowed device at the time and stock snapshot is valid.
```

But backend must prevent impossible or malicious payloads.

## Backend should validate:

```txt id="wf6obz"
Product belongs to business.
Quantity sold is positive.
Sale item snapshot exists.
Device was allowed.
Idempotency key is valid.
```

## Important

Do not recalculate old sale profit using current product state.

Use sale item snapshots.

---

# 13. Negative Stock Conflict

## Problem

Offline sale sync would make backend stock negative.

## MVP recommended rule

Since there is only one sales-enabled device, backend can accept local stock truth if the sale was valid locally.

But if backend detects suspicious negative stock, mark conflict.

Conflict status:

```txt id="wka3a4"
failed
```

Error:

```txt id="dndpmt"
STOCK_CONFLICT_REVIEW_REQUIRED
```

Owner/admin should review.

## Future

Multi-device sales will require stronger stock reservation/conflict logic.

---

# 14. Owner Stock-In While Sales Device Offline

## Problem

Owner adds stock online while Sales device is offline.

Sales device later uploads sale based on older local quantity.

## Resolution

Both actions should be preserved.

Sync order should apply actions by action time where possible:

```txt id="urnh4h"
stock-in action time
sale action time
```

But for MVP, because sales-enabled device is limited, prefer preserving both records rather than overwriting.

Stock movements must show the history clearly.

---

# 15. Same Product Edited on Two Devices

## Problem

Owner edits product on device A while another Owner device edits same product offline.

## MVP rule

Only Owner should manage products. With max 2 devices, this can still happen.

Resolution for product profile edits:

```txt id="yscexg"
Last confirmed update wins for simple fields, but create activity logs.
```

Simple fields:

```txt id="hr4bx0"
product_name
category_id
low_stock_level
is_active
```

Dangerous fields should not be casually overwritten:

```txt id="e3fm0a"
average_unit_cost
current_stock_quantity
stock_value
```

Stock and cost must change through engines, not simple overwrite.

---

# 16. Selling Price Conflict

## Problem

Selling price changed on two devices before sync.

## Rule

Selling price changes must create price history records.

Resolution:

```txt id="ew2tcs"
Apply changes in created_at order where possible.
Latest valid selling price becomes current product selling price.
Old sales remain based on sale item snapshots.
```

Do not rewrite old sales.

---

# 17. Buying Price / Cost Conflict

## Problem

Buying price or average cost conflicts from multiple devices.

## Rule

Average cost must only change through:

```txt id="rh0pl7"
stock-in
cost correction
sale reversal where needed
```

Do not allow direct product overwrite of average cost from sync.

If cost conflict cannot be safely resolved:

```txt id="9dgbbk"
Mark sync failed.
Require Owner/admin review.
```

---

# 18. Debt Payment Conflict

## Problem

Debt payment may sync twice or after debt has been reversed.

## Resolution

Use idempotency.

If duplicate payment:

```txt id="0qxy1p"
Return existing payment.
Do not reduce balance twice.
```

If debt is already reversed/cancelled:

```txt id="w0dvb3"
Reject payment sync or mark review required.
```

If payment exceeds current balance:

```txt id="bl3i6w"
Reject unless future overpayment support exists.
```

---

# 19. Expense Conflict

## Problem

Same expense syncs twice.

## Resolution

Use idempotency.

Duplicate expense upload:

```txt id="6ysbl5"
Return existing expense.
Do not count expense twice.
```

If expense was voided offline and original expense is not yet synced:

```txt id="f3gmpr"
Sync original expense and void record/status to preserve audit trail.
```

---

# 20. Subscription Conflict

## Problem

Local app thinks subscription is active, but backend says expired/suspended.

## Rule

Backend is source of truth when online.

Resolution:

```txt id="iim7df"
When online, refresh subscription status from backend.
If backend says expired/suspended, update local license state.
Restrict new actions accordingly.
```

Offline license may allow temporary offline use only until valid_until.

Suspended status should block strongly after known.

---

# 21. Offline License Conflict

## Problem

Device has expired offline license but tries to sell offline.

## Resolution

Block restricted action.

Message:

```txt id="ah02z5"
Connect to internet to verify your subscription before continuing.
```

Do not allow unlimited offline use.

---

# 22. Payment Reconciliation Conflict

## Problem

Same subscription transaction is submitted multiple times or by multiple businesses.

## Resolution

Backend must enforce unique transaction ID/reference.

If duplicate transaction:

```txt id="xxaf88"
Return existing reconciliation record.
Do not activate subscription twice.
```

If same transaction is claimed by different business:

```txt id="6o04nt"
Mark as duplicate/conflict.
Do not activate automatically.
Require admin/support review.
```

If wrong Till number:

```txt id="cmdvfy"
Reject.
```

If wrong amount:

```txt id="m7znjw"
Reject or mark under review.
Do not activate automatically.
```

Important:

```txt id="f40zh9"
Buzz Duka does not hold money.
It only reconciles payment records.
```

---

# 23. Blocked Device With Pending Sales

## Problem

A device creates sales offline, then Owner/admin blocks the device before it syncs.

## Resolution depends on timing.

## If sales were created before device was blocked

Recommended MVP rule:

```txt id="i6v70u"
Accept historical pending sales if created before block time, but reject new sales created after block time.
```

## If sales were created after block time

```txt id="06y01k"
Reject sync.
Mark failed.
Show device blocked message.
```

Backend must compare:

```txt id="ho6d8n"
sale.created_at
device.blocked_at
```

If blocked_at does not exist yet, add it to device records.

---

# 24. Removed Device With Pending Sales

## Problem

Device was removed before pending sales synced.

## Recommended rule

Same as blocked device, but stricter.

If sale was created before removal:

```txt id="w2mazp"
Allow sync only if business policy allows preserving historical offline sales.
```

If sale was created after removal:

```txt id="3sugrh"
Reject.
```

For MVP, preserve genuine historical sales created before removal to avoid losing shop records.

---

# 25. Sales User Removed While Offline

## Problem

Sales user creates sale offline, then Owner removes user before sync.

## Resolution

If sale created before user removal:

```txt id="shm43r"
Accept sale as historical record.
```

If sale created after removal:

```txt id="nfxrcz"
Reject sync.
```

Backend should compare:

```txt id="2x66yh"
sale.created_at
user.removed_at
```

Add `blocked_at` or `removed_at` timestamps to users/devices where needed.

---

# 26. Expired Subscription With Pending Offline Sales

## Problem

Device creates sales offline while license was valid, but subscription expires before sync.

## Resolution

If sale was created while offline license was valid:

```txt id="c0en67"
Accept historical sale.
```

If sale was created after offline license expired:

```txt id="wej99n"
Reject sync or mark conflict.
```

Backend should validate using:

```txt id="cckcsx"
sale.created_at
offline_license_valid_until
subscription status history where available
```

---

# 27. Sale Created Offline Then Reversed Offline Before Sync

## Problem

Original sale and reversal are both pending.

## Rule

Preserve audit trail.

Recommended MVP sync behavior:

```txt id="suaybf"
Sync original sale first.
Then sync reversal.
```

Do not simply delete both locally.

Expected backend result:

```txt id="nt45u9"
Sale exists with status reversed.
Reversal exists.
Stock final state is correct.
Reports exclude reversed sale.
Receipt marked reversed.
```

---

# 28. Sync Bundle Rule

Some records should sync as a bundle.

Sale bundle should include:

```txt id="8ghfjc"
sale
sale_items
stock_movements
receipt
customer if debt
debt if debt
activity_logs
```

Reversal bundle should include:

```txt id="3p8vdc"
sale_reversal
updated sale status
sale_reversal stock movements
updated receipt status
updated debt status if any
activity_log
```

Backend should process bundle atomically where possible.

If part of bundle fails, the bundle should fail safely.

---

# 29. Conflict Status Handling

When conflict cannot be resolved automatically:

```txt id="ujgb25"
Mark sync item as failed.
Store clear sync_error.
Do not delete local record.
Show Owner a simple message.
Allow retry or support review.
```

Example sync error:

```txt id="81hp6u"
This sale could not sync because the device was blocked before the sale time.
```

Another:

```txt id="75sfnc"
This payment transaction was already used. Contact support if you think this is wrong.
```

---

# 30. Conflict Error Codes

Use clear error codes:

```txt id="s5ncxz"
DUPLICATE_RECORD
DUPLICATE_SALE
DUPLICATE_REVERSAL
DUPLICATE_TRANSACTION
BUSINESS_MISMATCH
PRODUCT_NOT_FOUND
PRODUCT_BUSINESS_MISMATCH
DEVICE_BLOCKED
DEVICE_REMOVED
USER_BLOCKED
USER_REMOVED
SUBSCRIPTION_EXPIRED_AT_ACTION_TIME
OFFLINE_LICENSE_EXPIRED_AT_ACTION_TIME
STOCK_CONFLICT_REVIEW_REQUIRED
DEBT_ALREADY_REVERSED
PAYMENT_AMOUNT_INVALID
PAYMENT_TILL_MISMATCH
PAYMENT_CLAIMED_BY_ANOTHER_BUSINESS
SYNC_BUNDLE_FAILED
```

Do not return only “Sync failed” without details.

---

# 31. Conflict UI Rules

Conflict messages should be simple.

Examples:

```txt id="u81xlb"
Some records could not sync. Tap to review.
```

```txt id="wo7vxc"
This sale was saved on this phone but could not sync yet.
```

```txt id="9wm38g"
This payment was already used. Contact support.
```

```txt id="yiaecw"
This device is no longer allowed to sync new sales.
```

Owner should see more detail than Sales user.

Sales user should get simple instruction:

```txt id="vhjajw"
Ask the Owner to check sync issues.
```

---

# 32. Conflict Review Screen

Owner sync review should show:

```txt id="4zwlq0"
Record type
Action time
Status
Error message
Retry button
Support note if needed
```

Examples:

```txt id="tu1x8g"
Sale #S-0009
Failed: Device was blocked before sale time.
```

```txt id="y493dh"
Subscription payment
Failed: Transaction already used.
```

Do not expose technical stack traces.

---

# 33. Backend Conflict Audit Logs

Backend should log serious conflicts.

Log:

```txt id="3a34ed"
business_id
device_id
user_id
record_type
local_id
server_id if any
idempotency_key
error_code
created_at
resolved_at optional
```

Important conflicts:

```txt id="80s5l2"
Duplicate sale attempt
Cross-business payload
Blocked device sync attempt
Payment transaction duplicate
Wrong Till payment attempt
Suspicious stock conflict
```

---

# 34. Admin Conflict Support

Admin dashboard should eventually show:

```txt id="gcx68r"
Business
Device
User
Conflict type
Record type
Error code
Attempt count
Last attempt time
Support action
```

Admin may help with:

* Payment reconciliation disputes
* Blocked device issues
* Duplicate transaction issues
* Serious sync failures
* Device transfer problems

Admin action must create audit log.

---

# 35. Conflict Resolution Priority

When resolving conflicts, use this priority:

```txt id="pfxhpg"
1. Protect business data.
2. Prevent duplicates.
3. Preserve genuine historical actions.
4. Protect stock accuracy.
5. Protect profit accuracy.
6. Enforce device/user/subscription rules.
7. Avoid silent overwrites.
8. Require review when unsafe.
```

---

# 36. Sync Conflict Tests Required

Antigravity must test:

```txt id="kydgq4"
Duplicate sale sync does not duplicate sale
Duplicate reversal does not restore stock twice
Product price changed while offline sale keeps old snapshot
Product deactivated while offline sale still preserves historical sale
Missing product causes failed sync not silent corruption
Blocked device cannot sync sales created after block time
Removed device cannot sync sales created after removal time
Sales user removed before sync is handled by action time
Offline license expired action is rejected
Sale created and reversed offline syncs as sale then reversal
Duplicate subscription transaction does not activate twice
Wrong Till number is rejected
Wrong subscription amount is rejected
Sync bundle failure does not partially corrupt data
Failed sync stores error and allows retry
```

---

# 37. Manual Conflict Verification

Use this manual test:

```txt id="tnw2hc"
1. Create product Lotion at KSh 400.
2. Put Sales device offline.
3. Change Lotion price to KSh 450 on Owner/backend.
4. Sell Lotion offline on Sales device at KSh 400.
5. Turn internet on.
6. Sync sale.
7. Confirm sale item remains KSh 400.
8. Confirm current product price remains KSh 450.
9. Retry same sync.
10. Confirm duplicate sale is not created.
```

Second test:

```txt id="et6xgn"
1. Create sale offline.
2. Block device before sync.
3. Try sync.
4. If sale time is before block time, confirm historical sale is accepted.
5. If sale time is after block time, confirm sync is rejected.
```

Third test:

```txt id="uupyuv"
1. Submit subscription payment transaction.
2. Confirm subscription activates.
3. Submit same transaction again.
4. Confirm subscription is not extended twice.
```

---

# 38. What Antigravity Must Not Do

Antigravity must not:

```txt id="idnjhr"
Delete failed sync records
Clear sync queue without backend confirmation
Mark failed records as synced
Create duplicate sales on retry
Restore stock twice on duplicate reversal
Overwrite sale item snapshots with current product data
Reject genuine historical offline sale only because product is now inactive
Allow blocked device to sync sales created after block time
Allow fake payment reference to activate subscription
Allow duplicate transaction to activate subscription twice
Silently overwrite stock or average cost
Hide sync conflicts from Owner
Expose technical stack traces to users
Treat Buzz Duka as holding money
```

---

# 39. Antigravity Completion Report

After implementing sync conflict handling, Antigravity must report:

```txt id="txkh8l"
Module name:
Conflict rules implemented:
Idempotency implemented:
Duplicate sale handling:
Duplicate reversal handling:
Product conflict handling:
Device conflict handling:
Subscription/license conflict handling:
Payment reconciliation conflict handling:
Failed sync UI added:
Admin/support conflict logs added:
Tests added:
Manual verification completed:
Known limitations:
No fake sync confirmation:
No money-holding logic confirmation:
```

---

# 40. Final Rule

Buzz Duka must remain trustworthy even when offline sync becomes messy.

A real sale made offline should not disappear.

A duplicate sync should not duplicate the sale.

A blocked device should not bypass security.

A price change should not rewrite historical sales.

A payment transaction should not activate subscription twice.

When automatic resolution is unsafe, Buzz Duka must preserve the record, mark the sync as failed, show a clear message, and require review.

Sync must protect the truth.
