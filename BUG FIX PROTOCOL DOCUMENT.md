# DOCUMENT 0.8: BUG FIX PROTOCOL DOCUMENT

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Development control document
**Purpose:** Define the correct way Antigravity must investigate, fix, test, and report bugs in Buzz Duka.
**Primary Rule:** Fix the root cause. Do not hide the bug, hardcode values, remove validation, or rewrite unrelated modules.

---

# 1. Purpose of This Document

Buzz Duka depends on accurate stock, sales, pricing, costing, profit, debts, expenses, offline behavior, roles, devices, and subscriptions.

A bad bug fix can quietly damage the business logic.

This document prevents Antigravity from fixing one issue by breaking another part of the app.

Bug fixing must be careful, targeted, tested, and documented.

---

# 2. Main Bug Fix Rule

When fixing a bug, Antigravity must:

```txt id="q5w8wk"
1. Reproduce the bug.
2. Identify the root cause.
3. Explain the broken behavior.
4. Fix the smallest necessary part.
5. Avoid changing unrelated modules.
6. Add or update tests.
7. Run relevant checks.
8. Confirm old behavior still works.
9. Report files changed and verification steps.
```

A bug is not fixed just because the error message disappears.

---

# 3. Forbidden Bug Fix Methods

Antigravity must not fix bugs by:

* Hiding error messages
* Removing validation
* Hardcoding expected values
* Commenting out failing logic
* Skipping failed tests
* Returning fake success responses
* Replacing real database writes with mock data
* Disabling role checks
* Disabling subscription checks
* Ignoring sync errors
* Clearing local data without explanation
* Rewriting entire modules unnecessarily
* Removing price snapshot fields
* Removing stock movement records
* Calculating profit from current prices to “simplify”
* Changing the tech stack to avoid the bug

These are not acceptable fixes.

---

# 4. Required Bug Report Format

Before fixing a bug, Antigravity must describe it using this format:

```txt id="bcvzei"
Bug title:
Affected module:
Steps to reproduce:
Expected behavior:
Actual behavior:
Root cause:
Files likely affected:
Risk level:
Proposed fix:
Tests to add/update:
```

If Antigravity cannot explain the bug, it should not make a large fix.

---

# 5. Required Fix Report Format

After fixing a bug, Antigravity must report:

```txt id="l90xcb"
Bug fixed:
Root cause:
Fix summary:
Files changed:
Database changes:
Tests added/updated:
Manual verification steps:
Regression checks performed:
Known remaining limitations:
Confirmation that no fake/hardcoded workaround was used:
```

This report is required for every serious bug fix.

---

# 6. Bug Severity Levels

Antigravity must classify bugs by severity.

## Severity 1: Critical

Critical bugs affect money, stock, access, or data loss.

Examples:

* Sale does not save
* Stock does not reduce
* Wrong profit calculation
* Old sales change after price edits
* Sales user can access Owner analytics
* Offline sale disappears
* Subscription expiry does not restrict access
* One shop can access another shop’s data
* Sync duplicates sales

Critical bugs must be fixed before adding new features.

## Severity 2: High

High bugs affect important workflows but may not corrupt money or stock immediately.

Examples:

* Product search fails
* Dashboard not updating
* Debt balance wrong
* Expense not reducing net profit
* Receipt missing sale items
* Device rule not enforced properly
* Sync retry fails

High bugs should be fixed before moving to the next major module.

## Severity 3: Medium

Medium bugs affect usability but do not destroy core records.

Examples:

* Bad empty state
* Confusing error message
* Slow list loading
* Minor layout issue
* Missing activity log on non-critical action

Medium bugs can be scheduled but should still be tracked.

## Severity 4: Low

Low bugs are cosmetic or minor.

Examples:

* Spacing issue
* Small typo
* Icon mismatch
* Non-blocking visual inconsistency

Low bugs should not cause large rewrites.

---

# 7. Critical Business Logic Bug Rules

Bugs in these areas require extra care:

* Inventory
* Stock movements
* Moving weighted average cost
* Price snapshots
* Sales
* Profit/loss
* Debts
* Expenses
* Analytics
* Offline save
* Sync
* Roles/permissions
* Subscription/license

Antigravity must not change these modules casually.

For bugs in money or stock logic, Antigravity must add a test proving the fix.

---

# 8. Inventory Bug Fix Rules

If the bug affects products or inventory, verify:

* Product saves correctly
* Product belongs to correct business ID
* Product persists after restart
* Stock-in creates movement
* Stock adjustment creates movement
* Stock quantity before/after is correct
* Stock value before/after is correct
* Activity log is created

Do not fix inventory bugs by directly changing quantity without movement history.

Every stock change must remain auditable.

---

# 9. Pricing and Costing Bug Fix Rules

If the bug affects buying price, selling price, or average cost, verify:

* Buying price changes only through stock-in or audited cost correction
* Selling price changes affect future sales only
* Moving weighted average cost is correct
* Stock value is correct
* Price history is recorded
* Old sales remain unchanged
* Current expected profit is correct
* Historical profit uses sale item snapshots

Never fix costing bugs by overwriting old sale records unless the issue is a controlled reversal/correction flow approved by documentation.

---

# 10. Sales Bug Fix Rules

If the bug affects sales, verify that a sale still creates:

* Sale record
* Sale item records
* Payment method value
* Stock movement records
* Receipt number
* Price snapshots
* Profit/loss values
* Activity log
* Sync queue item where applicable

Do not fix a sales bug by skipping stock reduction, skipping sale items, or skipping price snapshots.

A sale without sale items is not a valid Buzz Duka sale.

---

# 11. Profit and Analytics Bug Fix Rules

If the bug affects profit or analytics, verify:

* Historical profit comes from sale item snapshots
* Current expected profit comes from current selling price and current average cost
* Net profit subtracts expenses
* Debt sales are handled according to rules
* Cancelled/reversed sales are excluded from active totals
* Negative profit/loss is supported
* Dashboard updates from real data
* No hardcoded values were introduced

Do not “fix” analytics by manually changing dashboard numbers.

---

# 12. Debt Bug Fix Rules

If the bug affects debts, verify:

* Debt sale creates a real sale
* Debt sale reduces stock
* Debt balance is created
* Partial payment reduces balance
* Paid status updates correctly
* Overdue status works where due date exists
* Debt appears in Owner reports
* Debt data persists after restart

Do not fix debt bugs by editing totals without updating debt records.

---

# 13. Expense Bug Fix Rules

If the bug affects expenses, verify:

* Expense saves correctly
* Expense category is stored
* Expense belongs to correct business ID
* Expense appears in list
* Expense reduces net profit
* Sales user cannot access expense management by default
* Activity log is created

Do not fix expense bugs by hardcoding dashboard expense totals.

---

# 14. Offline Bug Fix Rules

If the bug affects offline behavior, verify:

* User can perform the action without internet
* Data saves locally
* Data persists after app restart
* Sync queue item is created if needed
* App does not block checkout waiting for backend
* Sync can retry later
* User receives clear status message

Do not fix offline bugs by forcing online-only behavior.

Buzz Duka is offline-first.

---

# 15. Sync Bug Fix Rules

If the bug affects sync, verify:

* Pending records upload to backend
* Backend stores records
* Duplicate records are prevented
* Sync status changes only after backend confirmation
* Failed sync stores useful error
* Retry works
* Business ID isolation is enforced
* Local records are not deleted before successful sync

Do not mark sync complete unless data reaches backend successfully.

---

# 16. Role and Permission Bug Fix Rules

If the bug affects roles, verify:

* Owner can access Owner features
* Sales user can access only Sales features
* Sales user cannot access Owner dashboard
* Sales user cannot access expenses
* Sales user cannot access subscription settings
* Sales user cannot access device settings
* Direct navigation cannot bypass restrictions
* Backend APIs enforce role restrictions where applicable

Do not fix role bugs by only hiding buttons.

Permissions must be enforced in logic.

---

# 17. Subscription Bug Fix Rules

If the bug affects subscription or license, verify:

* Active subscription allows access
* Grace period works
* Expired subscription restricts access
* Offline license is checked
* Reactivation restores access
* Subscription status persists after restart
* Restricted users can still reach payment/reactivation screen

Do not fix subscription bugs by always returning “active.”

---

# 18. UI Bug Fix Rules

If the bug affects UI only, fix it without touching business logic unless necessary.

UI bug fixes should not modify:

* Pricing calculations
* Sales engine
* Inventory engine
* Profit engine
* Sync engine
* Subscription engine
* Role permission logic

Unless the root cause is truly in those modules.

---

# 19. Refactor During Bug Fix Rule

Do not perform large refactors while fixing a bug unless required.

If refactor is necessary, Antigravity must explain:

* Why the refactor is needed
* Which modules it affects
* What risks it creates
* How existing behavior will be protected
* Which tests prove nothing broke

Small targeted fixes are preferred.

---

# 20. Regression Check Rule

After fixing a bug, Antigravity must run regression checks for related flows.

Example:

If fixing sales bug, also verify:

* Product stock still reduces
* Price snapshots still save
* Profit still calculates
* Receipt still creates
* Dashboard still updates
* Offline sale still works if applicable

Do not fix one part while breaking another.

---

# 21. Required Test Update Rule

Every bug in business logic must result in a test.

Examples:

## Bug: old sales change after price edit

Add test:

```txt id="fl8t17"
Create product at selling price 400.
Sell 2 units.
Change selling price to 450.
Confirm old sale item still has selling price 400.
```

## Bug: stock average cost wrong after stock-in

Add test:

```txt id="bmi94a"
Old stock: 6 units at 250.
Add 10 units at 300.
Expected average cost: 281.25.
```

## Bug: Sales user can see expenses

Add test:

```txt id="7zmp0e"
Login as Sales user.
Attempt to open expenses route.
Expected: access blocked.
```

---

# 22. Manual Verification Requirement

After fixing a bug, Antigravity must provide manual verification steps.

Bad:

```txt id="b2w7rt"
Bug fixed. Test it.
```

Good:

```txt id="ycn5pj"
Manual verification:
1. Add product Lotion with stock 10, cost 250, selling price 400.
2. Sell 4 units.
3. Confirm stock becomes 6.
4. Add stock 10 at cost 300.
5. Confirm average cost becomes 281.25.
6. Change selling price to 450.
7. Confirm old sale still shows 400.
8. Sell 2 units.
9. Confirm new sale uses 450.
```

Verification must be specific.

---

# 23. Data Repair Rule

If a bug corrupts existing data, Antigravity must not silently ignore it.

It must explain:

* What data may be affected
* How to detect affected records
* Whether repair is needed
* What repair script/migration is proposed
* How to back up data before repair
* How to verify repair worked

Do not delete corrupted records without approval.

---

# 24. Database Migration Bug Rule

If a fix requires database schema changes:

Antigravity must provide:

* Migration file
* Reason for change
* Backward compatibility consideration
* Data migration plan if needed
* Rollback plan if possible
* Tests/manual verification

Do not casually change schema without explanation.

---

# 25. Stop Conditions

Antigravity must stop and ask before fixing if:

* The fix changes product direction
* The fix requires removing offline-first behavior
* The fix changes pricing/costing method
* The fix changes role/device rules
* The fix adds M-Pesa verification
* The fix changes the tech stack
* The fix requires deleting critical business records
* The fix requires rewriting a working engine
* The bug cannot be reproduced

Do not guess on high-risk fixes.

---

# 26. Bug Fix Acceptance Checklist

A bug fix is accepted only if:

```txt id="z4ut3a"
Bug is reproduced
Root cause is explained
Fix is targeted
No fake workaround is used
No unrelated module is rewritten
Tests are added/updated
Manual verification is provided
Regression checks are performed
Relevant business rules still pass
No unapproved features are added
```

---

# 27. Final Rule

Antigravity must fix bugs like an engineer, not like a designer hiding errors.

Every bug fix must protect Buzz Duka’s core promises:

```txt id="ov0smy"
Sell fast.
Track stock accurately.
Calculate profit correctly.
Work offline.
Protect Owner data.
Use real stored data.
Stay simple for shopkeepers.
```

If a fix weakens any of these promises, it is not acceptable.
