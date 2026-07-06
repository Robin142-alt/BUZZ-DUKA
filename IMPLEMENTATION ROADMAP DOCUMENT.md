# DOCUMENT 0.5: IMPLEMENTATION ROADMAP DOCUMENT

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Development roadmap
**Purpose:** Define the correct build order for Buzz Duka so Antigravity builds the app module by module, with real logic, tests, and verification at every stage.
**Primary Rule:** Build foundations first, engines second, UI third, sync/backend later. Do not build the whole app at once.

---

# 1. Purpose of This Roadmap

This roadmap tells Antigravity how to build Buzz Duka in the correct order.

Buzz Duka must not be built randomly. The app depends on accurate business logic, so the foundation must come before the screens.

Wrong approach:

```txt id="riwbcx"
Build all screens first, then try to connect logic later.
```

Correct approach:

```txt id="ga6k71"
Build data model → build engines → build UI → connect flows → test → sync → scale.
```

This roadmap prevents:

* Fake UI
* Hardcoded data
* Broken profit calculations
* Missing stock logic
* Weak offline behavior
* Random architecture
* Rebuilding the same feature many times

---

# 2. Roadmap Principle

Buzz Duka must be built in small verified modules.

Each module must have:

1. Clear purpose
2. Data model
3. Business logic
4. Tests or manual checks
5. No fake data
6. No unapproved features
7. Report of files changed

Antigravity must complete one module properly before moving to the next.

---

# 3. High-Level Build Phases

Buzz Duka should be built in these phases:

```txt id="qaf4d0"
Phase 1: Project Foundation
Phase 2: Local Database Foundation
Phase 3: Inventory and Product Engine
Phase 4: Pricing and Costing Engine
Phase 5: Sales Engine
Phase 6: Fast Selling UI
Phase 7: Debt and Expense Modules
Phase 8: Profit and Analytics Engine
Phase 9: Dashboard and Reports UI
Phase 10: Roles, Permissions, and Devices
Phase 11: Offline Sync Engine
Phase 12: Backend APIs
Phase 13: Subscription and License Engine
Phase 14: Admin Dashboard
Phase 15: Testing, Hardening, and Release
```

Do not skip phases.

---

# 4. Phase 1: Project Foundation

## Goal

Create the project structure and development foundation.

## Build

* React Native + Expo + TypeScript mobile app
* Clean folder structure
* Basic navigation setup
* Shared UI components folder
* Shared types folder
* Engine/service folders
* Testing setup
* Linting and formatting setup
* Environment config structure

## Do not build yet

* Full dashboard
* Fake sales screens
* Fake analytics
* Backend integration
* M-Pesa integration
* Subscription payment screens

## Expected output

Antigravity should produce:

* Working project startup
* Clean folder structure
* Navigation shell
* Basic empty screens
* Testing setup
* No business logic yet unless foundation needs it

## Completion check

Phase is complete when:

* App runs without errors.
* Navigation works.
* TypeScript is configured.
* Folder structure is clean.
* No hardcoded business data exists.

---

# 5. Phase 2: Local Database Foundation

## Goal

Build the offline-first local storage foundation.

## Build

SQLite local database setup for:

* Businesses
* Users
* Devices
* Products
* Categories
* Stock movements
* Sales
* Sale items
* Debts
* Debt payments
* Expenses
* Receipts
* Activity logs
* Sync queue
* Subscription/license state

## Required rules

* Core records must persist after app restart.
* Tables must include `business_id` where applicable.
* Tables must support local IDs and future server IDs.
* Database migrations must be planned.
* No core business data should be stored only in React state.

## Do not build yet

* Full UI for all tables
* Fake dashboard
* Backend sync

## Completion check

Phase is complete when:

* SQLite database initializes correctly.
* Tables are created.
* Basic insert/read/update/delete helpers exist where needed.
* Data persists after app restart.
* A simple database test passes.

---

# 6. Phase 3: Inventory and Product Engine

## Goal

Build the real product and inventory foundation.

## Build

* Product creation logic
* Product edit logic
* Product deactivate logic
* Category logic
* Stock-in logic
* Stock adjustment logic
* Stock movement creation
* Low-stock detection

## Product required fields

```txt id="xvcpa3"
product_id
business_id
product_name
category_id
current_stock_quantity
low_stock_level
default_buying_price
current_selling_price
average_unit_cost
stock_value
status
created_at
updated_at
```

## Required stock movement types

```txt id="1s5ab3"
stock_in
sale
debt_sale
adjustment
damage
loss
reversal
cost_correction
```

## Completion check

Phase is complete when:

* Owner can create product through logic.
* Product saves locally.
* Product remains after restart.
* Stock-in creates stock movement.
* Stock quantity updates correctly.
* Low-stock detection works.
* Activity log is created for product/stock actions.

---

# 7. Phase 4: Pricing and Costing Engine

## Goal

Build accurate dynamic pricing and costing logic.

## Build

* Moving weighted average cost
* Stock value updates
* Selling price change logic
* Default buying price update logic
* Price history records
* Stock-in cost history
* Current expected profit calculation
* Average buying price calculation
* Average selling price calculation from sale records

## Critical rule

Buying price changes only through stock-in or audited cost correction.

Selling price can change anytime, but only affects future sales.

## Completion check

Phase is complete when this test works:

```txt id="h6sxrz"
1. Add product: Lotion.
2. Buying price: 250.
3. Selling price: 400.
4. Stock: 10.
5. Sell 4 units later after sales engine exists or simulate stock-out logic.
6. Add 10 stock at buying price 300.
7. Confirm average cost becomes 281.25 when old remaining stock is 6.
8. Change selling price to 450.
9. Confirm current expected profit becomes 168.75.
10. Confirm old price history remains saved.
```

If sales engine is not yet built, this phase must still include unit tests for the costing formula.

---

# 8. Phase 5: Sales Engine

## Goal

Build the real sale creation logic before building the final checkout UI.

## Build

A completed sale must create:

* Sale record
* Sale item records
* Payment method value
* Stock movement records
* Receipt number
* Price snapshots
* Profit/loss values
* Activity log
* Sync queue record if sync is active

## Allowed payment methods

```txt id="r481y3"
Cash
M-Pesa
Bank
Debt
```

## Sale item snapshots

Every sale item must save:

```txt id="m7ishh"
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
created_at
```

## Completion check

Phase is complete when:

* Sale can be created from real products.
* Stock reduces.
* Price snapshots save.
* Profit/loss calculates correctly.
* Payment method saves.
* Receipt number is generated.
* Sale persists after restart.
* Old sales remain unchanged after product price edits.

---

# 9. Phase 6: Fast Selling UI

## Goal

Build the fast checkout experience after the sales engine is real.

## Build

* Product search
* Product list
* Favorites/quick items if simple
* Cart
* Quantity controls
* Payment method selector
* Complete sale button
* Sale success state
* Optional receipt view/share
* Immediate return to next sale

## Required checkout flow

```txt id="m49ia9"
Select product → Add to cart → Choose payment method → Complete sale → Next customer
```

## Do not add

* M-Pesa code entry
* Forced customer details
* Forced receipt sharing
* Online confirmation before sale completes
* Complex discounts
* Batch selection

## Completion check

Phase is complete when:

* A user can complete a sale quickly.
* The UI calls the real sales engine.
* Sale saves locally.
* Stock updates in UI.
* Cart clears after completion.
* App is ready for the next customer immediately.

---

# 10. Phase 7: Debt and Expense Modules

## Goal

Add debt and expense tracking without slowing checkout.

## Build debt module

* Debt sale support
* Customer name
* Customer phone optional
* Debt amount
* Partial payment
* Debt balance
* Debt status
* Due date optional
* Debt history

## Build expense module

* Add expense
* Expense categories
* Expense list
* Expense totals
* Owner-only access
* Net profit effect

## Completion check

Debt is complete when:

* Debt sale reduces stock.
* Debt balance is created.
* Partial payment reduces balance.
* Paid debt status updates correctly.

Expense is complete when:

* Expense saves locally.
* Expense appears in list.
* Expense reduces net profit.
* Sales user cannot access expense management by default.

---

# 11. Phase 8: Profit and Analytics Engine

## Goal

Build real analytics from stored records.

## Build

* Total sales
* Gross profit
* Net profit
* Payment method totals
* Product quantity sold
* Product revenue
* Product cost
* Product profit/loss
* Average selling price
* Average buying cost
* Low-margin products
* Loss-making products
* Best sellers
* Low sellers
* Low stock
* Dead stock
* Stock value
* Debt totals
* Expense totals
* Restock suggestions
* Price review alerts

## Critical rule

Analytics must use real stored records, especially sale item snapshots.

Wrong:

```txt id="exbcj0"
Analytics from hardcoded dashboard values.
```

Correct:

```txt id="edetdk"
Analytics from sales, sale_items, products, stock_movements, debts, and expenses.
```

## Completion check

Phase is complete when:

* Analytics change after real sales.
* Profit uses sale item snapshots.
* Expenses reduce net profit.
* Debt totals update.
* Product reports are accurate.
* No hardcoded analytics exist.

---

# 12. Phase 9: Dashboard and Reports UI

## Goal

Build owner and sales dashboards using real analytics.

## Owner dashboard

Show:

* Today’s sales
* Gross profit
* Net profit
* Expenses
* Debt total
* Payment method totals
* Low stock
* Best sellers
* Low-margin products
* Loss-making products
* Restock alerts
* Price review alerts

## Sales dashboard

Show:

* Sell button
* Basic recent sales
* Basic stock availability
* Pending sync count
* No sensitive profit/expense analytics by default

## Completion check

Phase is complete when:

* Owner dashboard uses real analytics engine.
* Sales dashboard is restricted.
* Empty states appear when no data exists.
* Dashboard updates after real records change.

---

# 13. Phase 10: Roles, Permissions, and Devices

## Goal

Protect owner data and enforce device rules.

## Build

* Owner role
* Sales role
* Role-based navigation
* Role-based action restrictions
* Device registration
* Device approval
* Sales-enabled device flag
* Device transfer logic
* Activity logs for device changes

## Base plan rule

```txt id="dahjke"
1 business
1 owner
1 sales user
Maximum 2 active devices
Only 1 sales-enabled device
```

## Completion check

Phase is complete when:

* Sales user cannot access Owner-only screens.
* Sales user cannot access expenses/net profit/subscription/device settings.
* Only one sales-enabled device is allowed.
* Device changes are logged.

---

# 14. Phase 11: Offline Sync Engine

## Goal

Sync real local records to the backend later without blocking checkout.

## Build

* Sync queue
* Pending/syncing/synced/failed statuses
* Retry logic
* Batch upload logic
* Duplicate prevention
* Conflict detection
* Sync error display
* Pending sync count

## Required sync statuses

```txt id="vo63fs"
pending
syncing
synced
failed
```

## Completion check

Phase is complete when:

* Offline sale creates pending sync item.
* Internet return triggers sync.
* Backend receives data.
* Records are not duplicated.
* Failed sync can retry.
* UI shows real sync status.

---

# 15. Phase 12: Backend APIs

## Goal

Create backend APIs that store real cloud data.

## Build APIs for:

* Authentication
* Businesses
* Users
* Devices
* Products
* Inventory
* Sales
* Debts
* Expenses
* Analytics
* Subscription
* Sync
* Admin

## Required backend rules

* Validate input
* Check auth
* Check business ID
* Check role permission
* Store real database records
* Return real saved data
* Prevent cross-shop access

## Completion check

Phase is complete when:

* Mobile app can sync to backend.
* Backend stores records in PostgreSQL.
* APIs do not return dummy production data.
* Business ID isolation works.

---

# 16. Phase 13: Subscription and License Engine

## Goal

Control monthly access without making the app too complicated.

## Build

* KSh 1,500/month plan
* Subscription status
* Expiry date
* Grace period
* Suspended status
* Reactivation
* Offline license token
* License refresh
* Subscription screen

## Statuses

```txt id="8j3y1u"
active
grace
expired
suspended
reactivated
```

## Completion check

Phase is complete when:

* App knows active/expired status.
* Grace period works.
* Expired account is restricted.
* Offline license prevents unlimited offline use.
* Reactivation restores access.

---

# 17. Phase 14: Admin Dashboard

## Goal

Build an internal dashboard for managing Buzz Duka shops and support.

## Build

* Shop list
* Business details
* Subscription status
* Device list
* Sync issues
* Support notes
* Admin actions where approved
* Admin audit logs

## Do not build fake admin data

Admin dashboard must use real backend records.

## Completion check

Phase is complete when:

* Admin sees real shops.
* Admin actions affect real records.
* Admin activity is logged.
* No fake shop counts or fake revenue appear.

---

# 18. Phase 15: Testing, Hardening, and Release

## Goal

Make the app reliable before real shop use.

## Required testing

* Unit tests
* Integration tests
* E2E tests
* Manual tests
* Offline tests
* Data accuracy tests
* Permission tests
* Subscription tests
* Performance tests

## Critical test scenarios

* Changing buying price during stock-in
* Changing selling price anytime
* Old sales staying unchanged
* Profit/loss accuracy
* Stock value accuracy
* Fast checkout
* Offline sale
* Sync retry
* Sales user restrictions
* Subscription expiry

## Completion check

The app is release-ready only when:

* Core flows pass.
* No fake production data exists.
* Checkout is fast.
* Stock/profit calculations are correct.
* Offline behavior works.
* Role restrictions work.
* Subscription control works.
* Errors are understandable.

---

# 19. Build Gates

Antigravity must not move to the next major phase if the current phase fails its gate.

## Gate 1: Foundation Gate

Project runs, structure is clean, local database exists.

## Gate 2: Data Gate

Products, stock, sales, and sale items persist locally.

## Gate 3: Accuracy Gate

Weighted average cost, sale snapshots, stock value, and profit/loss are correct.

## Gate 4: UI Gate

Fast selling UI uses real engines and real data.

## Gate 5: Offline Gate

Core actions work without internet.

## Gate 6: Security Gate

Roles, devices, and business isolation work.

## Gate 7: Release Gate

Tests, manual checks, and acceptance criteria pass.

---

# 20. Required Report After Every Phase

After completing each phase, Antigravity must report:

```txt id="tt6o4z"
Phase completed:
Files created:
Files modified:
Database tables added/changed:
Engines/services added:
Screens added/changed:
Business rules implemented:
Tests added:
Manual verification steps:
Known limitations:
No fake data confirmation:
Next recommended phase:
```

If this report is missing, the phase is not complete.

---

# 21. What Antigravity Must Not Do During Roadmap

Antigravity must not:

* Build all screens first
* Use hardcoded dashboard values
* Skip local database
* Skip engines
* Skip price snapshots
* Skip weighted average cost
* Skip tests
* Add M-Pesa verification
* Add complex accounting
* Add multiple cashiers
* Add multi-branch early
* Hide owner data only through UI
* Claim offline works without real local persistence
* Claim sync works without backend storage
* Mark modules complete without verification

---

# 22. Final Roadmap Rule

Buzz Duka must be built from the inside out:

```txt id="0vsh28"
Data → Engines → Simple UI → Offline → Sync → Backend → Subscription → Admin → Testing → Release
```

The app should not merely look complete.

It must correctly handle real products, real stock, real sales, real changing prices, real debts, real expenses, real profit, real offline use, and real shop operations.
