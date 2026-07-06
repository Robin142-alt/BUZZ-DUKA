# DOCUMENT 15: SALE REVERSAL, REFUND & MISTAKE CORRECTION DOCUMENT

## Buzz Duka — Correcting Wrong Sales Without Breaking Stock, Profit, Debt or Reports

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Sale correction, reversal, refund, and audit rules document
**Purpose:** Define how Buzz Duka should handle wrong sales, mistaken quantities, wrong payment methods, debt sale mistakes, refunds, stock restoration, and report correction.
**Core Rule:** Never delete a completed sale silently. Correct mistakes using clear reversal records and activity logs.

---

# 1. Purpose of This Document

This document defines how Buzz Duka handles sale mistakes.

Real shops will make mistakes such as:

* Wrong product sold
* Wrong quantity entered
* Wrong payment method selected
* Sale completed twice
* Customer returns item
* Debt sale created by mistake
* Sale completed but customer changed mind
* Seller sold the wrong item
* Stock was reduced wrongly
* Receipt was created for wrong sale

Buzz Duka must support correcting these mistakes without corrupting:

```txt id="0kdzsw"
Stock
Revenue
Gross profit
Net profit
Debt balances
Payment method totals
Receipts
Activity history
Sync records
Reports
```

---

# 2. Main Reversal Principle

Completed sales must not be hard deleted.

Correct rule:

```txt id="1i8bxh"
Original sale remains in history.
A reversal record is created.
Reports subtract or exclude reversed sale impact.
Activity log explains what happened.
```

Wrong:

```txt id="hn3yd4"
Delete sale from database and pretend it never happened.
```

Correct:

```txt id="a1gjpl"
Mark sale as reversed and create reversal records.
```

This keeps the business history trustworthy.

---

# 3. Approved Sale Statuses

Sales should support these statuses:

```txt id="mey3wk"
completed
partially_reversed
reversed
voided
```

## completed

Normal successful sale.

## partially_reversed

Only part of the sale was reversed.

Example: Customer returns 1 item out of 4.

## reversed

Entire sale was reversed.

## voided

Sale was cancelled very soon after completion before it should affect reports, but still remains in audit history.

For MVP, full reversal is required. Partial reversal can be added after full reversal works.

---

# 4. MVP Reversal Scope

MVP must support:

```txt id="q4mstd"
Full sale reversal
Stock restoration
Profit reversal
Payment total correction
Receipt marked reversed
Debt cancellation for debt sale
Activity log
Owner-only permission
```

MVP may delay:

```txt id="eylhji"
Partial item return
Exchange flow
Advanced refund tracking
Customer wallet/credit note
Printed refund receipt
Manager approval workflow
```

Do not build complicated refund features before full sale reversal works correctly.

---

# 5. Who Can Reverse a Sale

MVP rule:

```txt id="0vqbzo"
Only Owner can reverse a completed sale.
```

Sales user cannot reverse sale by default.

Reason:

Sale reversal affects:

* Stock
* Profit
* Reports
* Debt balances
* Payment method totals
* Activity history

Sales user may request reversal later as a future feature, but not in MVP.

---

# 6. Reversal Permission Matrix

| Action                         |                      Owner |     Sales |
| ------------------------------ | -------------------------: | --------: |
| View completed sales           |                        Yes |   Limited |
| Reverse full sale              |                        Yes |        No |
| Reverse own sale               |                        Yes | No in MVP |
| Reverse debt sale              |                        Yes |        No |
| Reverse expense                | No, use expense void rules |        No |
| View reversed sale history     |                        Yes |        No |
| Restore stock through reversal |                        Yes |        No |
| Mark receipt reversed          |                        Yes |        No |
| Add reversal reason            |                        Yes |        No |
| See reversal effect on profit  |                        Yes |        No |

---

# 7. Required Reversal Reason

Every reversal must require a reason.

Approved reason examples:

```txt id="xn9so2"
Wrong product selected
Wrong quantity entered
Wrong payment method selected
Customer cancelled purchase
Customer returned item
Sale entered twice
Debt sale created by mistake
Other
```

If reason is “Other”, allow short note.

Do not allow blank reversal reason.

---

# 8. Sale Reversal Flow

Recommended Owner flow:

```txt id="f77iuh"
Owner opens Sales History
Owner selects sale
Owner taps Reverse Sale
App shows sale details and warning
Owner selects reversal reason
Owner confirms reversal
System restores stock
System reverses sale totals
System updates receipt status
System updates debt if needed
System creates activity log
System creates sync queue record
```

Confirmation warning:

```txt id="rrjtht"
This will reverse the sale, restore stock, and update reports. The original sale will remain in history.
```

---

# 9. Full Sale Reversal Rules

When a full sale is reversed:

1. Sale status changes to `reversed`.
2. Sale item records remain unchanged.
3. Reversal record is created.
4. Stock is restored for each sale item.
5. Reversal stock movements are created.
6. Receipt is marked reversed.
7. Payment method totals are corrected in reports.
8. Profit is reversed in reports.
9. Debt record is cancelled if sale was debt.
10. Activity log is created.
11. Sync queue item is created.

Do not edit sale item snapshots.

Sale item snapshots are historical truth.

---

# 10. Stock Restoration Rule

When a sale is reversed, stock must be restored.

Example:

```txt id="iv9v3b"
Before sale:
Lotion stock = 10

Sale:
4 units sold

After sale:
Stock = 6

After full reversal:
Stock = 10
```

A stock movement must be created:

```txt id="dufsst"
movement_type = sale_reversal
quantity_change = +4
reason = Sale reversed
related_sale_id = original sale ID
```

Do not restore stock silently.

---

# 11. Profit Reversal Rule

A reversed sale must not count as active profit.

Example:

Original sale:

```txt id="mvk6n4"
Revenue = KSh 1,600
Cost = KSh 1,000
Gross profit = KSh 600
```

After full reversal:

```txt id="am9vho"
Active revenue impact = KSh 0
Active cost impact = KSh 0
Active gross profit impact = KSh 0
```

Reports may show reversal history separately, but active totals must exclude or subtract reversed sales.

---

# 12. Payment Method Total Rule

If a sale is reversed, payment method totals must update.

Example:

Original sale:

```txt id="yfr4m2"
Payment method: M-Pesa
Amount: KSh 1,600
```

After reversal:

```txt id="fl1nw8"
M-Pesa active sales total should reduce by KSh 1,600.
```

Do not leave reversed sale inside active payment totals.

---

# 13. Receipt Reversal Rule

Receipt must not be deleted.

Receipt status should change to:

```txt id="r87z3y"
reversed
```

Receipt screen should show:

```txt id="cqy6zq"
This receipt was reversed.
```

Receipt should still show original sale details for history, but should clearly indicate it is no longer active.

Receipt must not show profit or cost.

---

# 14. Debt Sale Reversal Rule

If the reversed sale was a debt sale:

1. Sale status becomes `reversed`.
2. Debt record should be marked `cancelled` or `reversed`.
3. Debt balance should become zero.
4. Debt should no longer appear as active debt.
5. Debt history should show cancellation reason.
6. Activity log should record debt cancellation.

Example:

```txt id="bq1j00"
Debt sale: Mary owes KSh 1,200
Owner reverses sale
Debt status: reversed
Debt balance: KSh 0
```

Do not leave debt active after reversing the debt sale.

---

# 15. Debt Payment Before Reversal Rule

If a debt sale has already received payment, reversal becomes more sensitive.

Example:

```txt id="zv953j"
Debt sale: KSh 1,200
Payment received: KSh 500
Balance: KSh 700
```

MVP rule:

```txt id="5hfp8j"
Do not allow automatic reversal of debt sale with payments unless Owner confirms special warning.
```

Warning:

```txt id="j3zygd"
This debt already has payments. Reversing it may require refund handling. Continue only if you understand.
```

Recommended MVP behavior:

* Mark debt as reversed.
* Keep debt payment history.
* Create reversal activity log.
* Do not delete payment records.
* Reports should exclude the reversed debt sale from active debt.
* Refund handling may be recorded as a note/manual action in MVP.

---

# 16. Refund Rule

Buzz Duka does not verify actual cash, M-Pesa, or bank movement.

Therefore, refund recording is informational in MVP.

If Owner reverses a paid sale, show:

```txt id="ng5dev"
Remember to refund the customer outside Buzz Duka if needed.
```

Optional refund fields:

```txt id="siz1eu"
refund_required_yes_no
refund_method
refund_note
```

Allowed refund methods:

```txt id="2qxqin"
Cash
M-Pesa
Bank
Not refunded
Not applicable
```

Important rule:

```txt id="7ij5lh"
Buzz Duka records refund information only. It does not send money.
```

---

# 17. Wrong Payment Method Correction

If only payment method was wrong, there are two possible approaches.

MVP preferred approach:

```txt id="ohe1y5"
Owner reverses wrong sale and re-enters correct sale.
```

Future advanced approach:

```txt id="0kq6i7"
Owner edits payment method with audit log if sale items and totals are unchanged.
```

For MVP, do not build payment method editing unless carefully audited.

Reason:

Changing payment method affects payment reports.

---

# 18. Duplicate Sale Correction

If a sale was accidentally entered twice:

```txt id="b31qbw"
Owner reverses the duplicate sale.
```

Do not delete duplicate sale.

The reversed duplicate should remain visible in history.

Activity log example:

```txt id="l1fic8"
Owner reversed sale #0021. Reason: Sale entered twice.
```

---

# 19. Wrong Quantity Correction

If wrong quantity was sold:

MVP rule:

```txt id="fvp4ma"
Owner reverses the whole sale and records a new correct sale.
```

Future feature:

```txt id="h0bciq"
Partial reversal / item return.
```

Do not allow editing completed sale item quantities directly.

That would corrupt historical snapshots.

---

# 20. Wrong Product Correction

If wrong product was selected:

```txt id="t6pupn"
Reverse the sale and create a new correct sale.
```

Do not edit sale item product ID after completion.

Sale item snapshots must remain immutable.

---

# 21. Reversal Record Table

A separate reversal record should be created.

Suggested table:

```txt id="p80nd4"
sale_reversals
```

Suggested fields:

```txt id="rgf6cc"
id
business_id
sale_id
reversed_by_user_id
device_id
reversal_type
reason
note
original_total_amount
original_total_cost
original_gross_profit
refund_required
refund_method
refund_note
created_at
sync_status
idempotency_key
```

Approved `reversal_type` values:

```txt id="h7kmuo"
full
partial_future
void
```

For MVP, use `full`.

---

# 22. Sale Table Fields Needed

Sale table should support:

```txt id="72pbv2"
status
reversed_at
reversed_by_user_id
reversal_reason
reversal_id
```

But do not remove original sale totals.

Original sale values must remain for audit.

---

# 23. Sale Item Rule

Sale item records must remain immutable.

Do not change:

* Product name snapshot
* Quantity sold
* Unit cost at sale
* Unit selling price at sale
* Line revenue
* Line cost
* Line profit/loss
* Stock before sale
* Stock after sale

If reversal is needed, create reversal records and reversal stock movements.

---

# 24. Stock Movement Rule

Sale reversal must create new stock movements.

Example movement:

```txt id="3d48nw"
movement_type: sale_reversal
product_id: Lotion
quantity_change: +4
quantity_before: 6
quantity_after: 10
related_sale_id: original sale ID
reason: Wrong quantity entered
created_by_user_id: Owner
```

Do not edit the original sale stock movement.

---

# 25. Activity Log Rule

Every reversal must create activity log.

Activity log should include:

```txt id="g9uo2n"
business_id
user_id
device_id
action_type = sale_reversed
related_sale_id
reason
amount
created_at
```

Example:

```txt id="75xro0"
Owner reversed sale #0042 worth KSh 1,600. Reason: Sale entered twice.
```

For debt reversal:

```txt id="icqsfl"
Owner reversed debt sale #0045 for Mary. Debt balance was cancelled.
```

---

# 26. Analytics Rule

Analytics must handle reversed sales correctly.

Default active analytics should exclude reversed sales.

Affected analytics:

```txt id="nwpu0p"
Total sales
Gross profit
Net profit
Payment method totals
Best sellers
Product profit
Debt totals
Stock movement reports
Receipt counts
Sales history
```

Sales history may show reversed sales with clear status.

Reports should not count reversed sale as active revenue.

---

# 27. Dashboard Rule

Owner dashboard must not include reversed sales in active totals.

Example:

Before reversal:

```txt id="r4b9ju"
Today sales: KSh 1,600
Gross profit: KSh 600
M-Pesa total: KSh 1,600
```

After reversal:

```txt id="5omcic"
Today sales: KSh 0
Gross profit: KSh 0
M-Pesa total: KSh 0
```

Optional dashboard note:

```txt id="8p6ssu"
1 sale reversed today.
```

---

# 28. Sales History UX

Sales history should show status badge.

Examples:

```txt id="pqnt36"
Completed
Reversed
Partially reversed
Voided
```

A reversed sale should not disappear.

Sale detail screen should show:

```txt id="83amv6"
Original sale details
Reversal reason
Reversed by
Reversed at
Refund note if any
```

---

# 29. Reversal Confirmation UX

Before reversal, show clear confirmation.

Example:

```txt id="u1c8gn"
Reverse this sale?

This will:
- Restore stock
- Remove this sale from active reports
- Mark the receipt as reversed
- Record this action in Activity History

The original sale will remain in history.
```

Buttons:

```txt id="uvkkjw"
Cancel
Reverse Sale
```

Do not make reversal too easy to tap accidentally.

---

# 30. Offline Reversal Rule

Since Buzz Duka is offline-first, Owner may reverse a sale offline.

Offline reversal must:

* Save locally
* Restore stock locally
* Create reversal record locally
* Update sale status locally
* Create activity log locally
* Create sync queue item
* Persist after restart

When online, reversal must sync.

Do not require internet to reverse a local unsynced sale.

---

# 31. Sync Rule for Reversals

Sale reversal must sync safely.

Reversal sync must include:

```txt id="8m28xi"
sale_reversal record
updated sale status
reversal stock movements
updated debt status if needed
updated receipt status
activity log
```

Use idempotency key to prevent duplicate reversal.

Important rule:

```txt id="vt2mnj"
A sale should not be reversed twice.
```

Backend must reject duplicate reversal or return existing reversal.

---

# 32. Reversing Unsynced Sales

If a sale was created offline and reversed before syncing:

MVP safe approach:

```txt id="a6eh5d"
Sync both original sale and reversal, preserving audit trail.
```

Do not simply delete the unsynced sale locally.

Reason:

The shop history should still show what happened.

Alternative future optimization can compress unsynced sale + reversal, but MVP should prioritize audit safety.

---

# 33. Reversing Synced Sales

If sale is already synced:

* Create local reversal record.
* Update local status.
* Queue reversal sync.
* Backend applies reversal after validation.
* Backend returns confirmation.
* Local reversal becomes synced.

Backend must check:

```txt id="zsk6bw"
Sale belongs to business
Sale is not already reversed
User has permission
Device is allowed
Subscription/license allows correction if required
Idempotency key is unique
```

---

# 34. Subscription and Reversal Rule

If subscription is expired, reversal rules must be careful.

Recommended MVP rule:

```txt id="lhku40"
Expired users cannot create new sales, but Owner may view old records.
```

For reversal after expiry:

Option A, stricter:

```txt id="ga1z27"
Block reversals until renewal.
```

Option B, support-friendly:

```txt id="oj6j87"
Allow Owner to reverse same-day mistakes even if expired.
```

MVP recommended rule:

```txt id="mgxbhk"
Reversal is restricted after expiry except through support/admin or after renewal.
```

This prevents unpaid continued operational use.

---

# 35. Device Rule for Reversal

Only allowed Owner device can reverse sale.

Check:

```txt id="8p4fpd"
User is Owner
Device belongs to business
Device is active
Business is not suspended
Subscription/license allows reversal
```

Sales-enabled device status is not required for Owner reversal, but device must be active.

---

# 36. Reversal Engine Required Functions

Antigravity should create a reversal engine.

Suggested functions:

```txt id="alxib6"
canReverseSale(user, device, subscriptionState, sale)
validateReversalReason(reason, note)
createSaleReversal(saleId, reason, note, refundInfo)
restoreStockForReversal(sale)
markSaleAsReversed(saleId, reversalId)
markReceiptAsReversed(receiptId, reversalId)
cancelDebtForReversedSale(saleId, reversalId)
createReversalStockMovements(saleItems)
createReversalActivityLog(reversal)
queueReversalForSync(reversal)
calculateAnalyticsExcludingReversedSales(filters)
```

Do not scatter reversal logic inside UI only.

---

# 37. Reversal Database Transaction Rule

Sale reversal must be atomic.

All these must succeed together:

```txt id="x89st0"
Create sale_reversal
Update sale status
Restore stock
Create reversal stock movements
Update receipt status
Update debt status if needed
Create activity log
Create sync queue item
```

If any step fails, rollback the reversal.

Do not allow sale status to change without stock restoration.

---

# 38. Error Messages

Use clear messages.

Examples:

```txt id="yy7au4"
Only the Owner can reverse a sale.
```

```txt id="o22lw4"
This sale has already been reversed.
```

```txt id="wd0mlf"
Choose a reason before reversing this sale.
```

```txt id="wqfd9u"
This debt sale already has payments. Review before reversing.
```

```txt id="zi4k4r"
Sale reversal was saved on this phone. It will sync when internet returns.
```

```txt id="77sddc"
This business is suspended. Contact support.
```

---

# 39. Required Tests

Antigravity must test:

```txt id="ynrsbl"
Owner can reverse completed sale
Sales user cannot reverse sale
Reversal requires reason
Stock is restored after reversal
Sale status becomes reversed
Receipt status becomes reversed
Payment totals exclude reversed sale
Gross profit excludes reversed sale
Net profit updates after reversal
Debt sale reversal cancels debt
Duplicate reversal is blocked
Reversal creates activity log
Reversal creates sync queue item
Offline reversal persists after restart
Synced reversal does not duplicate on retry
Direct route/action reversal by Sales user is blocked
```

---

# 40. Manual Reversal Verification Test

Use this test:

```txt id="2yif6f"
1. Login as Owner.
2. Create product Lotion.
3. Stock: 10 units.
4. Buying price: KSh 250.
5. Selling price: KSh 400.
6. Sell 4 units using M-Pesa.
7. Confirm stock becomes 6.
8. Confirm revenue = KSh 1,600.
9. Confirm gross profit = KSh 600.
10. Open sales history.
11. Select the sale.
12. Reverse sale with reason: Sale entered twice.
13. Confirm sale status becomes reversed.
14. Confirm stock becomes 10.
15. Confirm receipt says reversed.
16. Confirm active sales total becomes KSh 0.
17. Confirm active gross profit becomes KSh 0.
18. Confirm M-Pesa total becomes KSh 0.
19. Confirm activity log was created.
20. Login as Sales user.
21. Confirm Sales user cannot reverse sale.
```

---

# 41. Debt Reversal Verification Test

Use this test:

```txt id="3nytsb"
1. Create product Sugar.
2. Stock: 20 units.
3. Sell 3 units as Debt to customer Mary.
4. Confirm debt balance is created.
5. Login as Owner.
6. Reverse the debt sale.
7. Confirm stock is restored.
8. Confirm sale status is reversed.
9. Confirm debt status is reversed/cancelled.
10. Confirm debt balance is KSh 0.
11. Confirm active debt total no longer includes the reversed debt.
12. Confirm activity log was created.
```

---

# 42. Offline Reversal Verification Test

Use this test:

```txt id="cev7xc"
1. Complete a sale.
2. Turn off internet.
3. Reverse the sale as Owner.
4. Confirm stock restores locally.
5. Confirm sale status becomes reversed locally.
6. Confirm activity log exists locally.
7. Confirm sync queue item exists.
8. Close and reopen app.
9. Confirm reversal still exists.
10. Turn internet on.
11. Sync.
12. Confirm backend receives reversal.
13. Retry sync.
14. Confirm duplicate reversal is not created.
```

---

# 43. Acceptance Criteria

Sale reversal is accepted only when:

```txt id="mh82x7"
Owner-only reversal works
Sales user reversal is blocked
Reason is required
Original sale is not deleted
Sale status updates correctly
Stock restores correctly
Receipt is marked reversed
Debt sale reversal cancels active debt
Payment totals update correctly
Gross profit updates correctly
Net profit updates correctly
Activity log is created
Sync queue is created
Offline reversal works
Duplicate reversal is prevented
Reports exclude reversed sales from active totals
Manual tests pass
```

---

# 44. What Antigravity Must Not Do

Antigravity must not:

* Hard delete completed sales
* Edit old sale item snapshots
* Edit old sale quantities directly
* Hide sale instead of reversing it
* Restore stock without stock movement record
* Change dashboard totals with fake logic
* Let Sales user reverse sales
* Leave debt active after debt sale reversal
* Mark receipt normal after reversal
* Allow same sale to be reversed twice
* Sync reversal without idempotency
* Ignore reversal in profit reports

---

# 45. Antigravity Completion Report

After building reversal module, Antigravity must report:

```txt id="io2enx"
Module name:
Reversal type implemented:
Files created:
Files modified:
Database tables affected:
Engine functions added:
Screens/components added:
Permission checks added:
Stock restoration logic:
Profit/report logic:
Debt reversal logic:
Receipt reversal logic:
Sync queue logic:
Tests added:
Manual verification completed:
Known limitations:
No hard delete confirmation:
```

---

# 46. Final Rule

Buzz Duka must correct mistakes without destroying history.

A reversed sale is still part of business history, but it must no longer count as active revenue, active profit, active debt, or active payment total.

The original sale must remain visible, the reversal reason must be clear, stock must be restored correctly, and Owner must be able to trust the reports after correction.

Do not delete the truth.

Reverse it properly.
