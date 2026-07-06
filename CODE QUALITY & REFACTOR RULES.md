# DOCUMENT 0.9: CODE QUALITY & REFACTOR RULES

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Development quality control document
**Purpose:** Define how Antigravity must write, organize, maintain, and refactor Buzz Duka code without breaking existing features.
**Primary Rule:** Code must be clean, typed, testable, modular, and safe to change.

---

# 1. Purpose of This Document

Buzz Duka is not a small demo app. It is intended to support real shops and eventually scale to many businesses.

Poor code quality will create problems such as:

* Broken sales logic
* Wrong stock calculations
* Wrong profit reports
* Duplicate code
* Fake features
* Slow checkout
* Difficult debugging
* Risky refactors
* Expensive future maintenance

This document defines how Antigravity must write and improve code safely.

---

# 2. Main Code Quality Rule

Antigravity must write code that is:

```txt id="gnv59e"
Typed
Modular
Testable
Readable
Reusable
Persistent
Offline-safe
Permission-aware
Business-rule compliant
```

Code should not be written only to make the screen look correct.

Buzz Duka’s business logic must be reliable and separated from UI where possible.

---

# 3. TypeScript Rule

Buzz Duka must use TypeScript properly.

Antigravity must:

* Define clear types and interfaces.
* Avoid unnecessary `any`.
* Type function inputs and outputs.
* Type database records.
* Type engine results.
* Type API request and response structures.
* Type user roles and permissions.
* Type payment methods.
* Type sync statuses.
* Type subscription statuses.

Bad:

```txt id="fwdw93"
const sale: any = {};
```

Good:

```txt id="llsfrl"
type Sale = {
  saleId: string;
  businessId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
};
```

TypeScript should help prevent business logic mistakes.

---

# 4. Business Logic Must Not Live Only in UI

Critical business logic must not be placed directly inside screen components.

Do not put these only inside React screens:

* Stock reduction
* Moving weighted average cost
* Sale price snapshots
* Profit/loss calculation
* Debt balance calculation
* Expense net profit calculation
* Role permission checks
* Subscription access checks
* Sync queue creation

These must be placed in reusable engines or services.

Recommended structure:

```txt id="vi34by"
/engines
  inventoryEngine.ts
  pricingCostingEngine.ts
  salesEngine.ts
  profitEngine.ts
  analyticsEngine.ts
  debtEngine.ts
  expenseEngine.ts
  subscriptionEngine.ts
  permissionEngine.ts
```

UI should call engines.
UI should not replace engines.

---

# 5. Single Source of Truth Rule

Buzz Duka must avoid duplicate business logic.

For example, profit calculation should not be written differently in:

* Sales screen
* Dashboard screen
* Analytics screen
* Backend API
* Admin dashboard

There should be a clear source of truth.

Example:

```txt id="48i3h7"
profitEngine.calculateSaleProfit()
```

should be reused instead of writing profit formulas everywhere.

Duplicate logic increases the chance of inconsistent results.

---

# 6. Engine Design Rule

Each engine should have a clear responsibility.

## Inventory Engine

Handles:

* Product stock
* Stock-in
* Stock adjustment
* Stock movements
* Low-stock detection

## Pricing and Costing Engine

Handles:

* Moving weighted average cost
* Stock value
* Selling price changes
* Buying price through stock-in
* Current expected profit

## Sales Engine

Handles:

* Sale creation
* Sale items
* Payment method
* Stock reduction
* Receipt trigger
* Activity log trigger
* Sync queue trigger

## Profit Engine

Handles:

* Revenue
* Cost
* Gross profit
* Net profit
* Profit/loss per item
* Margin

## Analytics Engine

Handles:

* Best sellers
* Low sellers
* Low-margin products
* Loss-making products
* Dead stock
* Stockout risk
* Restock suggestions
* Price review alerts

Each engine should be testable without needing to render UI.

---

# 7. Folder Structure Rule

Antigravity must keep the project organized.

Recommended mobile structure:

```txt id="1u35vr"
/src
  /app
  /screens
  /components
  /database
  /engines
  /services
  /sync
  /auth
  /permissions
  /types
  /utils
  /tests
```

Recommended backend structure:

```txt id="fwp1e6"
/src
  /modules
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
  /tests
```

Do not scatter files randomly.

Do not place unrelated logic in one large file.

---

# 8. Naming Rule

Names must be clear and consistent.

Good names:

```txt id="xxud6u"
calculateMovingAverageCost
createSaleWithStockMovement
generateSaleItemSnapshot
calculateNetProfit
getLowStockProducts
canUserAccessOwnerDashboard
```

Bad names:

```txt id="e68zv8"
doThing
handleStuff
updateData
calc
process
magicFunction
```

Names should explain what the function does.

---

# 9. Function Size Rule

Functions should be small and focused.

A function should normally do one main thing.

Bad:

```txt id="8ic6xh"
completeSaleAndUpdateEverythingAndShowDashboardAndSyncAndCalculateReports()
```

Better:

```txt id="md2uin"
createSale()
createSaleItems()
reduceStockForSale()
calculateSaleTotals()
createReceipt()
addToSyncQueue()
```

Small functions are easier to test and debug.

---

# 10. No Magic Numbers Rule

Do not hide important values inside random code.

Bad:

```txt id="lawbsb"
if (days > 3) suspendUser();
```

Better:

```txt id="o94kvr"
const SUBSCRIPTION_GRACE_DAYS = 3;
if (daysPastExpiry > SUBSCRIPTION_GRACE_DAYS) suspendUser();
```

Important constants should be named clearly.

Examples:

```txt id="5onmws"
SUBSCRIPTION_GRACE_DAYS
MAX_ACTIVE_DEVICES_BASE_PLAN
MAX_SALES_ENABLED_DEVICES
LOW_MARGIN_THRESHOLD_PERCENT
DEAD_STOCK_DAYS
```

---

# 11. No Hardcoded Business Data Rule

Do not hardcode shop business data into production logic.

Forbidden:

* Hardcoded products
* Hardcoded sales
* Hardcoded expenses
* Hardcoded debts
* Hardcoded analytics
* Hardcoded dashboard totals
* Hardcoded subscription statuses
* Hardcoded shop users

Allowed:

* Named constants for system rules
* Demo data only in clearly separated seed/demo files
* Test data inside test files

Production screens must read real data.

---

# 12. Database Access Rule

Database logic should be organized.

Do not make random database calls from every component.

Use services/repositories where possible.

Example structure:

```txt id="56bq7q"
/database
  productRepository.ts
  salesRepository.ts
  stockMovementRepository.ts
  expenseRepository.ts
  debtRepository.ts
  syncQueueRepository.ts
```

UI should call services.
Services can call repositories.
Engines can calculate logic and pass results to repositories.

---

# 13. Transaction Safety Rule

Important multi-step business actions must be handled safely.

A completed sale must create several records:

* Sale
* Sale items
* Stock movements
* Receipt
* Activity log
* Sync queue item

These should be saved in a safe transaction where possible.

The app must avoid half-saved sales.

Bad situation:

```txt id="hhp8xl"
Sale saved but stock did not reduce.
```

Or:

```txt id="f7h7qt"
Stock reduced but sale was not saved.
```

Important operations should be atomic where possible.

---

# 14. Error Handling Code Rule

Errors must not be ignored.

Bad:

```txt id="jwjvld"
try {
  saveSale();
} catch (e) {
  console.log(e);
}
```

Better:

```txt id="g5l91x"
try {
  saveSale();
} catch (error) {
  logError(error);
  return {
    success: false,
    message: "Sale could not be saved. Try again.",
  };
}
```

Errors should be:

* Logged where useful
* Shown clearly to the user where needed
* Not hidden silently
* Not fixed by fake success messages

---

# 15. Validation Rule

Antigravity must validate important inputs.

Validate:

* Product name
* Stock quantity
* Buying price
* Selling price
* Sale quantity
* Payment method
* Debt customer name
* Expense amount
* Subscription state
* Device approval
* User role

Examples:

* Quantity cannot be negative.
* Selling price cannot be blank.
* Stock-in quantity must be greater than zero.
* Expense amount must be greater than zero.
* Payment method must be Cash, M-Pesa, Bank, or Debt.

Do not remove validation to make errors disappear.

---

# 16. Permission Check Rule

Permission checks must be centralized and reusable.

Recommended:

```txt id="1vy0a2"
permissionEngine.canManageProducts(user)
permissionEngine.canViewProfit(user)
permissionEngine.canRecordExpense(user)
permissionEngine.canManageDevices(user)
```

Do not rely only on hiding buttons.

Restricted actions must be blocked even if a user reaches the screen directly.

Backend APIs must later enforce the same restrictions.

---

# 17. Offline-Safe Code Rule

Code must respect offline-first behavior.

Do not write code that requires the backend before saving a sale.

Correct flow:

```txt id="fipavx"
Save locally → create sync queue item → return success → sync later
```

Wrong flow:

```txt id="1r1wvv"
Call server → wait → save sale only if server responds
```

Checkout must remain usable without internet.

---

# 18. Sync-Safe Code Rule

Sync code must avoid duplicates.

Every syncable record should support:

* Local ID
* Server ID
* Business ID
* Sync status
* Idempotency key where needed
* Created at
* Updated at
* Sync error

Do not create sync logic that uploads the same sale multiple times as different sales.

Duplicate sales can destroy stock and profit accuracy.

---

# 19. Multi-Tenant Code Rule

Every shop’s data must be separated by `business_id`.

Database queries must filter by business ID.

APIs must enforce business ID.

Local data must also store business ID.

Do not write global queries like:

```txt id="u71yy9"
getAllSales()
```

without business context.

Use:

```txt id="gp0vcy"
getSalesByBusinessId(businessId)
```

One shop must never access another shop’s data.

---

# 20. Activity Log Code Rule

Important actions must create activity logs.

Activity log creation should be reusable.

Examples of actions to log:

* Product created
* Product edited
* Selling price changed
* Stock added
* Average cost recalculated
* Sale completed
* Sale reversed
* Debt created
* Debt payment recorded
* Expense recorded
* Device added
* Subscription expired
* Sync failed

Do not scatter activity log logic randomly.

Use a shared activity log service.

---

# 21. Refactor Rule

Refactoring means improving structure without changing behavior.

Antigravity may refactor only when:

* Code is duplicated
* A function is too large
* Business logic is mixed into UI
* Naming is unclear
* Tests are missing but can be added
* Existing structure makes bugs likely

Antigravity must not refactor just for preference.

A refactor must preserve behavior.

---

# 22. Refactor Report Rule

Before a significant refactor, Antigravity must explain:

```txt id="2zalvg"
Refactor target:
Reason for refactor:
Expected behavior to preserve:
Files affected:
Risks:
Tests to run:
Rollback plan:
```

After refactor:

```txt id="2jl56h"
What changed:
Behavior preserved:
Tests run:
Manual verification:
Known risks:
```

No silent large refactors.

---

# 23. Do Not Rewrite Working Engines

If an engine works and passes tests, do not rewrite it unless necessary.

Protected engines:

* Inventory Engine
* Pricing and Costing Engine
* Sales Engine
* Profit Engine
* Analytics Engine
* Debt Engine
* Expense Engine
* Sync Engine
* Subscription Engine
* Permission Engine

Bug fixes should be targeted.

---

# 24. Test Before Refactor Rule

Before refactoring core business logic, make sure tests exist.

If tests do not exist, Antigravity must add tests before or during the refactor.

Do not refactor the pricing/costing or sales engine without tests covering:

* Stock-in
* Weighted average cost
* Sale snapshots
* Stock reduction
* Profit/loss
* Selling price changes

---

# 25. Comments Rule

Comments should explain why, not obvious what.

Bad:

```txt id="6303wm"
// add quantity
quantity = quantity + addedQuantity;
```

Good:

```txt id="cpnyip"
// Average cost changes only on stock-in, not on normal sale.
```

Useful comments are welcome around:

* Moving weighted average cost
* Sale snapshots
* Offline sync
* Subscription license
* Role restrictions
* Data repair/migrations

---

# 26. Performance Code Rule

Checkout must remain fast.

Do not run heavy analytics during sale completion if it slows the cashier.

Sale completion should:

* Save sale
* Save sale items
* Reduce stock
* Save receipt
* Queue sync
* Return quickly

Heavy reports can be calculated later, cached, or run in background.

Product search should be optimized for normal shop use.

---

# 27. UI Code Rule

UI components should be reusable.

Avoid building every button, input, card, and empty state differently.

Use shared components such as:

* AppButton
* AppInput
* AppCard
* ProductListItem
* CartItemRow
* DashboardMetricCard
* EmptyState
* ErrorBanner
* LoadingState

This keeps the app consistent and easier to maintain.

---

# 28. Screen Code Rule

Screens should be readable.

A screen should mainly handle:

* Display
* User interaction
* Calling services/engines
* Showing results/errors

A screen should not contain hundreds of lines of business logic.

If a screen becomes too large, extract:

* Components
* Hooks
* Services
* Engine functions

---

# 29. API Code Rule

Backend APIs should follow a clean structure.

Recommended pattern:

```txt id="pkuknj"
Controller → Service → Repository/Prisma → Database
```

Controllers should not contain heavy business logic.

Services should handle business rules.

Repositories/Prisma should handle database operations.

API responses should be consistent.

---

# 30. Security Code Rule

Do not expose secrets or sensitive information.

Do not hardcode:

* JWT secrets
* Database passwords
* Admin passwords
* License signing keys
* API keys

Do not log sensitive tokens.

Do not expose owner financial analytics to Sales user.

Do not trust frontend permissions only.

---

# 31. Migration Code Rule

Database changes must be managed carefully.

When adding/changing tables:

* Create migration
* Explain reason
* Preserve existing data where possible
* Avoid destructive changes
* Add rollback guidance where possible
* Update related types and repositories

Do not change schema randomly without updating code and tests.

---

# 32. Code Review Checklist

Before marking code complete, Antigravity must check:

```txt id="1vnahv"
No fake production data
No unapproved features
No M-Pesa verification features
No business logic only in UI
No duplicate profit formulas
No missing business_id
No missing price snapshots
No stock changes without movement records
No Sales access to Owner-only data
No server-required checkout
No hardcoded secrets
No broken tests
```

---

# 33. Final Code Quality Standard

Buzz Duka code must be good enough for real shops.

The code should make it easy to:

* Add products
* Add stock
* Sell quickly
* Handle changing prices
* Calculate profit correctly
* Work offline
* Sync later
* Protect owner data
* Debug problems
* Scale to many shops

If code only works for a demo but cannot support real shop operations, it is not acceptable.
