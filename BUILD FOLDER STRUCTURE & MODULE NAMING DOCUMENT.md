# DOCUMENT 26: BUILD FOLDER STRUCTURE & MODULE NAMING DOCUMENT

## Buzz Duka — Mobile App, Backend API, Admin Dashboard, Shared Types & Clean Code Organization

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Folder structure and module naming document
**Purpose:** Define how Antigravity must organize the Buzz Duka codebase so the app is clean, scalable, testable, and not built as a messy pile of random files.
**Core Rule:** Buzz Duka must be built module-by-module with clear folders, clear names, and no fake demo-only structure.

---

# 1. Purpose of This Document

This document defines the recommended codebase structure for Buzz Duka.

Antigravity must use this document when creating:

* Mobile app folders
* Backend API folders
* Admin dashboard folders
* Shared types
* Services
* Engines
* Repositories
* Components
* Screens
* Tests
* Database migrations
* Configuration files

The goal is to make Buzz Duka easy to build, debug, test, and scale.

---

# 2. Recommended Project Structure

Recommended monorepo structure:

```txt id="w9cpdy"
buzz-duka/
  apps/
    mobile/
    api/
    admin/
  packages/
    shared/
  docs/
  README.md
```

Meaning:

```txt id="jr62kd"
apps/mobile = Android-first mobile app
apps/api = backend API
apps/admin = admin/support dashboard
packages/shared = shared types, constants, utilities
docs = product/build documents
```

If Antigravity does not use a monorepo, it must still keep the same logical separation.

---

# 3. App Naming Rules

Use the product name consistently:

```txt id="gxvg9c"
Buzz Duka
```

Do not rename the app to:

```txt id="edla0p"
DukaFlow
ShopFlow
SmartDuka
Duka POS
Random placeholder names
```

Code package names may use:

```txt id="cj6e3x"
buzz-duka-mobile
buzz-duka-api
buzz-duka-admin
buzz-duka-shared
```

---

# 4. Mobile App Structure

Recommended mobile structure:

```txt id="ajseyi"
apps/mobile/
  src/
    app/
    navigation/
    screens/
    components/
    features/
    services/
    engines/
    repositories/
    database/
    state/
    hooks/
    utils/
    constants/
    types/
    assets/
    tests/
  app.json
  package.json
```

---

# 5. Mobile `app/` Folder

Purpose:

App entry, providers, startup flow.

```txt id="pn225j"
src/app/
  AppRoot.tsx
  AppProviders.tsx
  StartupGate.tsx
  ErrorBoundary.tsx
```

Responsibilities:

```txt id="igye36"
Initialize database
Load session
Load business context
Load device state
Load subscription/offline license
Load sync status
Render correct navigation
Handle global errors
```

Rules:

* Do not put business logic here.
* Do not create fake startup data.
* Startup must load real local state.

---

# 6. Mobile `navigation/` Folder

Purpose:

Role-based app navigation.

```txt id="s4wx0d"
src/navigation/
  RootNavigator.tsx
  AuthNavigator.tsx
  OwnerNavigator.tsx
  SalesNavigator.tsx
  AdminNotUsedInMobile.ts
  routeGuards.ts
  routes.ts
```

Rules:

* Owner and Sales navigation must be separate.
* Sales user must not see Owner screens.
* Direct route access must be blocked.
* Route guards must use real permission state.

---

# 7. Mobile `screens/` Folder

Purpose:

Top-level screens grouped by role/area.

```txt id="66tu5x"
src/screens/
  auth/
  onboarding/
  owner/
  sales/
  shared/
```

Recommended structure:

```txt id="k10x28"
src/screens/auth/
  LoginScreen.tsx

src/screens/onboarding/
  RegisterBusinessScreen.tsx

src/screens/owner/
  OwnerDashboardScreen.tsx
  ProductsScreen.tsx
  ProductDetailScreen.tsx
  AddProductScreen.tsx
  StockScreen.tsx
  DebtsScreen.tsx
  DebtDetailScreen.tsx
  ExpensesScreen.tsx
  ReportsScreen.tsx
  ActivityScreen.tsx
  SubscriptionScreen.tsx
  DevicesScreen.tsx
  SettingsScreen.tsx

src/screens/sales/
  SalesHomeScreen.tsx
  SellScreen.tsx
  RecentSalesScreen.tsx
  BasicStockScreen.tsx
  SyncStatusScreen.tsx

src/screens/shared/
  ReceiptScreen.tsx
  SaleDetailScreen.tsx
  AccessDeniedScreen.tsx
  OfflineNoticeScreen.tsx
```

Rules:

* Screens display and call services.
* Screens must not directly write database.
* Screens must not calculate profit directly.
* Screens must not fake success.

---

# 8. Mobile `features/` Folder

Purpose:

Group feature-specific UI, hooks, and helpers.

```txt id="h47xdo"
src/features/
  auth/
  products/
  inventory/
  sales/
  receipts/
  debts/
  expenses/
  analytics/
  subscription/
  devices/
  sync/
  activity/
```

Example:

```txt id="18djlq"
src/features/sales/
  components/
    CartItem.tsx
    PaymentMethodButton.tsx
    ProductSearchResult.tsx
  hooks/
    useSellScreen.ts
  sales.types.ts
```

Rules:

* Feature folders can contain feature-specific UI.
* Shared components must go to `components/`.
* Business logic must remain in engines/services.

---

# 9. Mobile `components/` Folder

Purpose:

Reusable UI components.

```txt id="kp5jq5"
src/components/
  buttons/
  cards/
  forms/
  layout/
  feedback/
  badges/
  money/
  permission/
```

Recommended components:

```txt id="fs6na0"
AppButton.tsx
AppInput.tsx
AppCard.tsx
StatusBadge.tsx
MoneyText.tsx
QuantityText.tsx
ScreenHeader.tsx
EmptyState.tsx
LoadingState.tsx
ErrorBanner.tsx
OfflineBanner.tsx
SyncStatusBadge.tsx
DashboardCard.tsx
PermissionGate.tsx
ConfirmationDialog.tsx
```

Rules:

* Components must be reusable.
* Components must not contain database logic.
* `MoneyText` receives amount in cents.
* `PermissionGate` must not replace backend permissions.

---

# 10. Mobile `services/` Folder

Purpose:

Orchestration layer between screens, engines, repositories, APIs, and storage.

```txt id="x52y5s"
src/services/
  auth/
  business/
  users/
  devices/
  products/
  inventory/
  pricing/
  sales/
  receipts/
  debts/
  expenses/
  analytics/
  reversals/
  subscription/
  payment-reconciliation/
  sync/
  activity/
  api/
  storage/
  errors/
```

Example files:

```txt id="ij5gl9"
src/services/sales/sale.service.ts
src/services/products/product.service.ts
src/services/subscription/subscription.service.ts
src/services/payment-reconciliation/paymentReconciliation.service.ts
src/services/sync/sync.service.ts
```

Rules:

* Services call engines and repositories.
* Services should not be one giant file.
* Services must return clear success/error results.

---

# 11. Mobile `engines/` Folder

Purpose:

Business rules and calculations.

```txt id="p67fdz"
src/engines/
  permissions/
  business/
  products/
  inventory/
  pricing/
  sales/
  snapshots/
  receipts/
  debts/
  expenses/
  profit/
  analytics/
  reversals/
  devices/
  subscription/
  payment-reconciliation/
  sync/
  activity/
  reports/
  errors/
```

Example files:

```txt id="qgaqfc"
src/engines/sales/sales.engine.ts
src/engines/inventory/inventory.engine.ts
src/engines/pricing/costing.engine.ts
src/engines/profit/profit.engine.ts
```

Rules:

* Engines should be testable.
* Engines should not depend on UI.
* Core formulas must live here.
* Weighted average cost must be tested here.

---

# 12. Mobile `repositories/` Folder

Purpose:

SQLite access layer.

```txt id="85343g"
src/repositories/
  business.repository.ts
  user.repository.ts
  device.repository.ts
  category.repository.ts
  product.repository.ts
  stockMovement.repository.ts
  priceHistory.repository.ts
  sale.repository.ts
  saleItem.repository.ts
  receipt.repository.ts
  customer.repository.ts
  debt.repository.ts
  debtPayment.repository.ts
  expense.repository.ts
  saleReversal.repository.ts
  activityLog.repository.ts
  syncQueue.repository.ts
  subscription.repository.ts
  paymentReconciliation.repository.ts
  offlineLicense.repository.ts
```

Rules:

* Repositories must use SQLite.
* Every business-owned query must include `business_id`.
* Repositories must not return fake arrays.
* Repositories must use transactions for multi-table operations.

---

# 13. Mobile `database/` Folder

Purpose:

SQLite schema, migrations, indexes, and database connection.

```txt id="xi0mj4"
src/database/
  database.ts
  migrations/
    001_initial_schema.ts
    002_indexes.ts
  schema/
    tables.ts
    indexes.ts
  transactions.ts
  seed.dev.ts
```

Rules:

* Production must not use fake seed data.
* Migrations must be explicit.
* Tables must support offline-first records.
* Amount values stored as integer cents.
* Sync queue must persist.

---

# 14. Mobile `state/` Folder

Purpose:

Global app state and stores.

```txt id="8tnbps"
src/state/
  session.store.ts
  business.store.ts
  device.store.ts
  subscription.store.ts
  network.store.ts
  sync.store.ts
  permissions.store.ts
```

Rules:

* Use state for app context and UI coordination.
* Real business data must remain in SQLite.
* Do not store all sales/products only in global state.

---

# 15. Mobile `hooks/` Folder

Purpose:

Reusable hooks for screens.

```txt id="w2ltgq"
src/hooks/
  useSession.ts
  usePermissions.ts
  useNetworkStatus.ts
  useSyncStatus.ts
  useSubscriptionStatus.ts
  useDebouncedSearch.ts
  useDateFilter.ts
```

Feature-specific hooks may live inside `features/<feature>/hooks`.

Rules:

* Hooks call services/state.
* Hooks should not duplicate business formulas.
* Hooks should not directly mutate database.

---

# 16. Mobile `utils/` Folder

Purpose:

Small helper utilities.

```txt id="pk05de"
src/utils/
  money.ts
  dates.ts
  ids.ts
  validation.ts
  formatting.ts
  logger.ts
```

Important utilities:

```txt id="orrldx"
formatMoney(cents)
parseMoneyToCents(value)
generateLocalId()
generateIdempotencyKey()
formatDateTime()
```

Rules:

* Money utility must use integer cents.
* Do not use floating-point money logic carelessly.
* Logger must not expose tokens/passwords.

---

# 17. Mobile `constants/` Folder

Purpose:

Central constants.

```txt id="mug3u8"
src/constants/
  roles.ts
  permissions.ts
  paymentMethods.ts
  subscription.ts
  syncStatus.ts
  colors.ts
  spacing.ts
  routes.ts
  errorCodes.ts
```

Required constants:

```txt id="lpy996"
OWNER_ROLE = 'owner'
SALES_ROLE = 'sales'
PAYMENT_CASH = 'cash'
PAYMENT_MPESA = 'mpesa'
PAYMENT_BANK = 'bank'
PAYMENT_DEBT = 'debt'
PLAN_PRICE_CENTS = 150000
GRACE_DAYS = 3
```

Rules:

* Do not scatter magic strings everywhere.
* Use constants consistently.

---

# 18. Mobile `types/` Folder

Purpose:

TypeScript types.

```txt id="8j7i6n"
src/types/
  business.types.ts
  user.types.ts
  device.types.ts
  product.types.ts
  sale.types.ts
  debt.types.ts
  expense.types.ts
  subscription.types.ts
  sync.types.ts
  api.types.ts
  common.types.ts
```

Rules:

* Types must match database/API contracts.
* Avoid using `any` everywhere.
* Keep amount fields clearly named with `_cents`.

---

# 19. Mobile `tests/` Folder

Purpose:

Mobile unit/integration tests.

```txt id="9lnmp2"
src/tests/
  engines/
  services/
  repositories/
  e2e-flows/
```

Required tests:

```txt id="vthiwk"
weighted average cost
sale completion
sale snapshots
stock reduction
debt balance
expense net profit
role restrictions
offline sale persistence
sync queue persistence
subscription expiry
payment reconciliation
```

Do not skip tests for core engines.

---

# 20. Backend API Structure

Recommended backend structure:

```txt id="k35w70"
apps/api/
  src/
    main.ts
    app.module.ts
    config/
    common/
    auth/
    businesses/
    users/
    devices/
    categories/
    products/
    inventory/
    sales/
    receipts/
    debts/
    expenses/
    analytics/
    sync/
    subscription/
    admin/
    prisma/
    tests/
  prisma/
    schema.prisma
    migrations/
  package.json
```

---

# 21. Backend `common/` Folder

Purpose:

Shared backend utilities.

```txt id="fgs28r"
src/common/
  guards/
  decorators/
  filters/
  interceptors/
  pipes/
  constants/
  errors/
  utils/
```

Recommended files:

```txt id="jv68u7"
auth.guard.ts
roles.guard.ts
business.guard.ts
device.guard.ts
subscription.guard.ts
current-user.decorator.ts
business-id.decorator.ts
api-error.filter.ts
validation.pipe.ts
```

Rules:

* Guards must enforce security.
* Do not rely only on frontend restrictions.
* API errors must be consistent.

---

# 22. Backend Feature Module Pattern

Each backend module should follow this pattern:

```txt id="hbaeys"
feature/
  feature.module.ts
  feature.controller.ts
  feature.service.ts
  dto/
  tests/
```

Example:

```txt id="q73z1q"
src/products/
  products.module.ts
  products.controller.ts
  products.service.ts
  dto/
    create-product.dto.ts
    update-product.dto.ts
    change-selling-price.dto.ts
  tests/
    products.service.spec.ts
```

Rules:

* Controllers handle HTTP.
* Services handle orchestration/business calls.
* Prisma handles data persistence.
* DTOs validate inputs.

---

# 23. Backend Auth Module

```txt id="8tdixt"
src/auth/
  auth.module.ts
  auth.controller.ts
  auth.service.ts
  jwt.strategy.ts
  dto/
    register-business.dto.ts
    login.dto.ts
    refresh-token.dto.ts
```

Responsibilities:

```txt id="vmu346"
Register business and Owner
Login
Refresh token
Current user
Password hashing
Token issuing
```

Rules:

* Passwords must be hashed.
* Password hashes must not be returned.

---

# 24. Backend Products Module

```txt id="w733ch"
src/products/
  products.module.ts
  products.controller.ts
  products.service.ts
  dto/
    create-product.dto.ts
    update-product.dto.ts
    change-selling-price.dto.ts
```

Rules:

* Owner can create/edit.
* Sales can list limited product data.
* Product creation with initial stock must be transactional.
* Business ID isolation required.

---

# 25. Backend Sales Module

```txt id="g17qcn"
src/sales/
  sales.module.ts
  sales.controller.ts
  sales.service.ts
  sale-number.service.ts
  dto/
    create-sale.dto.ts
    reverse-sale.dto.ts
```

Rules:

* Create sale using transaction.
* Create sale items.
* Reduce stock.
* Create receipt.
* Create debt if needed.
* Use idempotency.
* No M-Pesa code field for shop sales.

---

# 26. Backend Subscription Module

```txt id="mln5l9"
src/subscription/
  subscription.module.ts
  subscription.controller.ts
  subscription.service.ts
  payment-reconciliation.service.ts
  offline-license.service.ts
  dto/
    payment-check.dto.ts
    webhook-payment.dto.ts
    refresh-license.dto.ts
```

Rules:

* Subscription plan is KSh 1,500/month.
* Payment goes to official Till/M-Pesa.
* Buzz Duka only reconciles payment records.
* Fake reference must not activate subscription.
* Duplicate transaction must not activate twice.
* Till number comes from secure config.

---

# 27. Backend Sync Module

```txt id="16vx95"
src/sync/
  sync.module.ts
  sync.controller.ts
  sync.service.ts
  conflict-resolution.service.ts
  dto/
    batch-upload.dto.ts
    changes-query.dto.ts
```

Rules:

* Batch upload must use idempotency.
* Sync must preserve offline records.
* Duplicate sale must not duplicate.
* Failed sync must return clear errors.

---

# 28. Backend Admin Module

```txt id="4v02xa"
src/admin/
  admin.module.ts
  admin-auth.controller.ts
  admin.controller.ts
  admin.service.ts
  admin-audit.service.ts
  dto/
    admin-login.dto.ts
    suspend-business.dto.ts
    manual-subscription-correction.dto.ts
```

Rules:

* Admin auth separate from shop auth.
* Admin actions audited.
* Admin dashboard uses real data only.

---

# 29. Backend Prisma Folder

```txt id="55lyyx"
src/prisma/
  prisma.module.ts
  prisma.service.ts
```

Root Prisma folder:

```txt id="dww88g"
apps/api/prisma/
  schema.prisma
  migrations/
```

Rules:

* Use migrations.
* Use business_id indexes.
* Use unique idempotency constraints.
* Use unique transaction/reference constraints for payment reconciliation.

---

# 30. Admin Dashboard Structure

Recommended admin app structure:

```txt id="c5qhpf"
apps/admin/
  src/
    app/
    screens/
    components/
    services/
    state/
    utils/
    types/
```

Screens:

```txt id="9jgif7"
src/screens/
  AdminLoginScreen.tsx
  BusinessesScreen.tsx
  BusinessDetailScreen.tsx
  SubscriptionReconciliationsScreen.tsx
  DevicesSupportScreen.tsx
  SyncIssuesScreen.tsx
  AdminAuditLogsScreen.tsx
```

Rules:

* Admin uses separate auth.
* Admin actions create audit logs.
* No fake business data.

---

# 31. Shared Package Structure

Recommended shared package:

```txt id="wl7kb1"
packages/shared/
  src/
    types/
    constants/
    validation/
    utils/
```

Shared constants:

```txt id="mt1vgb"
roles
permissions
paymentMethods
subscriptionStatuses
syncStatuses
errorCodes
```

Shared types:

```txt id="3fmsgw"
ApiResponse
UserRole
PaymentMethod
SubscriptionStatus
SyncStatus
SaleStatus
DebtStatus
```

Rules:

* Shared package prevents duplicated strings.
* Do not put secrets in shared package.
* Do not put backend-only credentials here.

---

# 32. Docs Folder Structure

All project docs should be stored clearly.

```txt id="qp5d22"
docs/
  00-control/
  01-product/
  02-business-rules/
  03-technical/
  04-ui-ux/
  05-testing/
  06-deployment/
```

Recommended names:

```txt id="ny80pp"
00-antigravity-master-build-instructions.md
01-product-vision-scope.md
02-business-rules.md
16-database-implementation.md
17-api-contract.md
18-ui-design-system.md
19-security-architecture.md
20-engine-specification.md
21-e2e-flows.md
22-sync-conflict-resolution.md
23-services-architecture.md
24-repository-data-access.md
25-state-management.md
26-folder-structure.md
```

Rules:

* Do not scatter docs randomly.
* Keep docs readable and versioned.

---

# 33. File Naming Rules

Use consistent names.

React components:

```txt id="prtzav"
PascalCase.tsx
Example: SellScreen.tsx
```

Services:

```txt id="1sne2l"
camelCase or kebab with .service.ts
Example: sale.service.ts
```

Repositories:

```txt id="rmo26n"
name.repository.ts
Example: product.repository.ts
```

Engines:

```txt id="6ksr62"
name.engine.ts
Example: sales.engine.ts
```

Types:

```txt id="4zceun"
name.types.ts
Example: sale.types.ts
```

DTOs:

```txt id="zavpyj"
action-name.dto.ts
Example: create-sale.dto.ts
```

Tests:

```txt id="xvr2ll"
name.spec.ts
Example: sales.engine.spec.ts
```

---

# 34. Module Naming Rules

Use domain names:

```txt id="7b3il8"
auth
business
users
devices
products
inventory
pricing
sales
receipts
debts
expenses
analytics
reversals
subscription
payment-reconciliation
sync
activity
admin
```

Avoid vague modules:

```txt id="0ynhao"
helpers
misc
stuff
data
logic
main
manager
```

Small `utils` are okay, but core business logic should not hide there.

---

# 35. Import Rules

Use clear imports.

Good:

```txt id="owxbgq"
import { SaleService } from '@/services/sales/sale.service';
import { ProductRepository } from '@/repositories/product.repository';
import { formatMoney } from '@/utils/money';
```

Avoid deep random imports from unrelated modules.

Antigravity should configure path aliases if possible:

```txt id="ijrqmx"
@/components
@/services
@/engines
@/repositories
@/types
@/constants
```

---

# 36. Configuration Files

Mobile config:

```txt id="lbe73p"
apps/mobile/src/config/env.ts
apps/mobile/src/config/app.config.ts
```

Backend config:

```txt id="3hnvh6"
apps/api/src/config/env.ts
apps/api/src/config/database.config.ts
apps/api/src/config/auth.config.ts
apps/api/src/config/subscription.config.ts
```

Important environment variables:

```txt id="rqp18e"
DATABASE_URL
JWT_SECRET
REFRESH_TOKEN_SECRET
ADMIN_JWT_SECRET
PAYMENT_WEBHOOK_SECRET
LICENSE_SIGNING_KEY
SUBSCRIPTION_TILL_NUMBER
API_BASE_URL
```

Rules:

* Do not hardcode secrets.
* Do not commit `.env` files.
* Till number must come from configuration.
* No fake hardcoded Till number.

---

# 37. Test Folder Rules

Tests must be near modules or in clear test folders.

Accepted:

```txt id="1x3sq2"
src/engines/sales/sales.engine.spec.ts
```

or

```txt id="28k02u"
src/tests/engines/sales.engine.spec.ts
```

Required test groups:

```txt id="ofeoua"
engines
services
repositories
api
e2e-flows
security
sync
subscription
```

Do not leave core logic untested.

---

# 38. Build Order by Folder

Antigravity should build in this order:

```txt id="mu07g9"
1. Project structure
2. Shared constants/types
3. SQLite database folder
4. Repositories
5. Engines
6. Services
7. State stores
8. Navigation and route guards
9. Core screens
10. Backend API modules
11. Sync and subscription reconciliation
12. Admin dashboard
13. Tests and E2E flows
```

Do not start with flashy dashboard UI before database, repositories, engines, and services exist.

---

# 39. No Fake Implementation Folder Rule

Antigravity must not create folders that only contain placeholder files.

Wrong:

```txt id="ybdf9o"
analytics.service.ts returns hardcoded sales numbers.
sync.service.ts always says synced.
subscription.service.ts always says active.
```

Correct:

```txt id="p3ut2k"
analytics.service.ts queries real sale_items and expenses.
sync.service.ts reads sync_queue and calls backend.
subscription.service.ts reads real subscription/offline license state.
```

---

# 40. Required Initial Files

At minimum, early implementation should create:

```txt id="3lzqbz"
apps/mobile/src/database/database.ts
apps/mobile/src/database/migrations/001_initial_schema.ts
apps/mobile/src/repositories/product.repository.ts
apps/mobile/src/repositories/sale.repository.ts
apps/mobile/src/repositories/saleItem.repository.ts
apps/mobile/src/repositories/syncQueue.repository.ts
apps/mobile/src/engines/pricing/costing.engine.ts
apps/mobile/src/engines/sales/sales.engine.ts
apps/mobile/src/services/sales/sale.service.ts
apps/mobile/src/screens/sales/SellScreen.tsx
```

This proves the foundation is real.

---

# 41. Folder Structure Verification

Antigravity must verify:

```txt id="qb54sk"
Mobile app folders exist.
Backend API folders exist.
Admin dashboard folders exist if admin phase started.
Shared package exists if monorepo used.
Services are separated.
Engines are separated.
Repositories are separated.
Database migrations exist.
Tests folders exist.
No giant file contains the entire app logic.
No fake placeholder modules are used as production logic.
```

---

# 42. What Antigravity Must Not Do

Antigravity must not:

```txt id="krsph3"
Put everything in App.tsx
Put all screens in one file
Put all services in one file
Put all database logic in UI components
Use fake arrays as production storage
Create random folder names
Mix admin users with shop users
Mix backend code inside mobile screens
Hardcode fake Till number
Hardcode fake dashboard data
Treat Buzz Duka as wallet or money holder
```

---

# 43. Antigravity Completion Report

After creating project structure, Antigravity must report:

```txt id="yghmem"
Folder structure module:
Monorepo created: Yes/No
Mobile folders created:
Backend folders created:
Admin folders created:
Shared package created:
Database folder created:
Repositories folder created:
Engines folder created:
Services folder created:
State folder created:
Navigation folder created:
Tests folder created:
Config files created:
Known limitations:
No fake placeholder confirmation:
No money-holding logic confirmation:
```

---

# 44. Final Rule

Buzz Duka must be organized like a real product, not a quick demo.

A clean structure makes it easier to:

```txt id="s5w6oj"
Build module by module
Test properly
Fix bugs
Add features later
Protect data accuracy
Scale to many shops
Avoid fake dashboards
Avoid messy screen logic
```

If the folder structure is messy, the app will become hard to finish.

Build clean from the beginning.
