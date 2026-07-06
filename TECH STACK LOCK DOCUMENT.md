# DOCUMENT 0.4: TECH STACK LOCK DOCUMENT

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Development control document
**Purpose:** Lock the approved technology stack so Antigravity does not randomly change tools, frameworks, databases, or architecture during development.
**Primary Rule:** Once this stack is approved, Antigravity must not replace it without explicit permission.

---

# 1. Purpose of This Document

Buzz Duka must be built with a stable, consistent, scalable technology stack.

Antigravity must not randomly switch between frameworks, databases, libraries, or storage methods.

A changing stack causes:

* Broken code
* Mixed architecture
* Fake integrations
* Duplicate logic
* Harder debugging
* Unstable offline behavior
* Poor maintainability
* Confusing project structure

This document defines the approved stack for Buzz Duka.

---

# 2. Product Technical Needs

Buzz Duka requires a stack that supports:

* Android-first mobile app
* Fast checkout
* Offline-first local storage
* Reliable sync later
* Product inventory
* Weighted average cost calculations
* Sale price snapshots
* Profit analytics
* Role permissions
* Device control
* Subscription license logic
* Cloud backend
* Multi-tenant data isolation
* Admin dashboard
* Testing
* Deployment
* Monitoring

The stack must prioritize correctness, speed, and maintainability.

---

# 3. Approved High-Level Stack

Buzz Duka should use this high-level architecture:

```txt id="udzjd6"
Mobile App: React Native + Expo + TypeScript
Local Database: SQLite
Backend API: Node.js + NestJS + TypeScript
Cloud Database: PostgreSQL
ORM: Prisma
Admin Dashboard: Next.js + TypeScript
Authentication: JWT-based auth with secure token storage
Offline Sync: Custom sync engine using local SQLite + backend sync APIs
Testing: Unit, integration, E2E, and manual verification
Deployment: Managed backend hosting + managed PostgreSQL + EAS/mobile build pipeline
```

This stack is chosen because it supports mobile development, offline storage, custom business logic, cloud syncing, and future scalability.

---

# 4. Mobile App Stack

## Approved mobile stack

```txt id="o57plb"
React Native
Expo
TypeScript
SQLite local database
Secure storage for tokens/licenses
```

## Reason

React Native with Expo allows faster mobile development while still supporting Android-first deployment.

TypeScript reduces errors by making business logic more predictable.

SQLite supports offline-first shop data.

Secure storage is required for:

* Login token
* User session
* Device ID
* Offline license token
* Subscription state

---

# 5. Mobile App Rules

Antigravity must not build the mobile app as a web-only app.

Buzz Duka must be mobile-first and Android-first.

Do not replace the mobile app with:

* Plain HTML app
* Desktop-only web dashboard
* PWA-only app
* Flutter app unless explicitly approved
* Native Android Kotlin app unless explicitly approved
* Ionic app unless explicitly approved

Approved app direction:

```txt id="2mkd2o"
React Native + Expo + TypeScript
```

---

# 6. Local Database Stack

## Approved local database

```txt id="zl0i1a"
SQLite
```

## Reason

Buzz Duka must work offline.

SQLite is needed to store real local data such as:

* Products
* Categories
* Stock movements
* Sales
* Sale items
* Debts
* Debt payments
* Expenses
* Receipts
* Sync queue
* Activity logs
* Offline license state

The app must not rely only on in-memory state or temporary local storage.

---

# 7. Local Storage Rules

Antigravity must not use simple local storage for core business data.

Do not use AsyncStorage/localStorage as the main database for:

* Products
* Sales
* Sale items
* Stock
* Debts
* Expenses
* Analytics
* Sync queue

AsyncStorage or secure storage may be used only for small simple values such as:

* UI preferences
* Login flags
* Small cached settings

Secure storage must be used for:

* Auth tokens
* Offline license token
* Device identity

Core shop records must use SQLite.

---

# 8. Backend Stack

## Approved backend stack

```txt id="szgwxo"
Node.js
NestJS
TypeScript
REST API
```

## Reason

NestJS gives structure for:

* Auth modules
* Business modules
* Product modules
* Sales modules
* Inventory modules
* Analytics modules
* Subscription modules
* Sync modules
* Admin modules

TypeScript helps reduce logic mistakes.

REST APIs are simple and reliable for the mobile app and admin dashboard.

---

# 9. Backend Rules

Antigravity must not create random backend styles.

Do not mix:

* Express routes in random files
* Serverless functions without structure
* Direct database calls from frontend
* Unprotected API endpoints
* Mock API responses for production
* Multiple backend frameworks in the same project

Approved backend pattern:

```txt id="gjfc74"
Controller → Service → Repository/Database → Response
```

Each module should follow this structure.

---

# 10. Cloud Database Stack

## Approved cloud database

```txt id="gwhz2a"
PostgreSQL
```

## Reason

Buzz Duka needs relational data.

Important relationships include:

* Business → users
* Business → devices
* Product → stock movements
* Sale → sale items
* Sale → payment method
* Product → analytics
* Customer → debts
* Debt → debt payments
* Business → subscription
* User → activity logs

PostgreSQL is suitable for structured business data and future scale.

---

# 11. Cloud Database Rules

Every important table must include:

```txt id="lquq63"
business_id
created_at
updated_at
sync_status or sync metadata where needed
```

Every shop’s data must be isolated by `business_id`.

Antigravity must not use one shared global product/sale table without business separation.

Do not allow one business to access another business’s records.

---

# 12. ORM Stack

## Approved ORM

```txt id="bq7nia"
Prisma
```

## Reason

Prisma provides:

* Typed database models
* Safer queries
* Easier migrations
* Clear schema
* Better maintainability

Prisma should be used on the backend only.

The mobile app should not connect directly to the cloud database.

---

# 13. API Style

## Approved API style

```txt id="2yd5qd"
REST API
JSON request/response
JWT authentication
Business ID enforcement
Role permission checks
```

GraphQL should not be introduced in the first version unless explicitly approved.

Reason:

REST is easier for Antigravity to build, test, debug, and document.

---

# 14. Admin Dashboard Stack

## Approved admin dashboard stack

```txt id="vhtjzu"
Next.js
TypeScript
React
Backend API integration
```

## Purpose of admin dashboard

The internal admin dashboard is for the Buzz Duka operator, not shop customers.

It should support:

* View registered shops
* View subscription status
* View active/expired shops
* View sync errors
* View support logs
* View app activity summaries
* Manually assist with subscription/support where necessary
* Disable/enable shops where allowed

Admin dashboard must use real backend data.

Do not build admin dashboard with fake shop counts or fake revenue.

---

# 15. Authentication Stack

## Approved authentication approach

```txt id="3ju8gy"
Phone/email + password login
JWT access token
Refresh token
Secure storage on mobile
Role-based access control
Business ID access control
Device ID validation
```

## Authentication rules

Auth must load:

* User ID
* Business ID
* Role
* Device permission
* Subscription/license status

Sales user must not access Owner-only data even if they try to navigate directly.

Backend APIs must also check permissions.

Do not rely on frontend hiding alone.

---

# 16. Device Identity Stack

Buzz Duka must track approved devices.

Each device should have:

```txt id="widlew"
device_id
business_id
user_id
device_name
device_type
sales_enabled
last_seen_at
status
created_at
```

Device identity should be stored securely on the mobile device.

The base plan allows:

```txt id="l4zxsz"
Maximum 2 active devices
Only 1 sales-enabled device
```

---

# 17. Offline Sync Stack

## Approved sync approach

```txt id="y6kgyp"
Local-first writes
SQLite sync queue
Backend sync APIs
Retry on failure
Duplicate prevention
Conflict handling
```

## Sync principle

The mobile app saves locally first.

Then it creates a sync queue item.

When internet is available, the sync engine uploads pending records.

The backend stores synced records.

The app marks records as synced only after backend confirmation.

Do not show fake sync success.

---

# 18. Sync Data Rules

Every syncable local record should have:

```txt id="66331p"
local_id
server_id
business_id
sync_status
created_at
updated_at
last_sync_attempt_at
sync_error
```

Sync statuses:

```txt id="dim5cy"
pending
syncing
synced
failed
```

The sync engine must avoid duplicate sales.

---

# 19. Pricing and Costing Engine Stack

Pricing and costing logic must be implemented as reusable business logic, not scattered inside UI components.

Approved structure:

```txt id="j4qm5j"
pricingCostingEngine.ts
inventoryEngine.ts
salesEngine.ts
profitEngine.ts
analyticsEngine.ts
```

These engines should be testable separately.

Do not place critical profit calculations only inside React components.

---

# 20. Testing Stack

## Approved testing tools

Use appropriate tests for each layer:

```txt id="ywkk88"
Unit tests for engines
Integration tests for APIs/database
E2E tests for major flows
Manual verification for shop workflows
```

Required tested areas:

* Product creation
* Stock-in
* Moving weighted average cost
* Selling price changes
* Sale creation
* Stock reduction
* Price snapshots
* Profit/loss
* Debt balances
* Expense effect on net profit
* Role restrictions
* Offline save
* Sync queue
* Subscription expiry

---

# 21. Styling and UI Stack

The UI should be consistent and simple.

Approved UI approach:

```txt id="hlyi4w"
Reusable components
Shared theme
Simple colors
Large buttons
Readable text
Mobile-first layout
```

Do not create every screen with random one-off styles.

The app should have reusable components such as:

* Button
* Input
* Card
* Product item
* Cart row
* Dashboard card
* Alert banner
* Empty state
* Loading state
* Error message
* Bottom navigation

---

# 22. State Management Rule

State management must be predictable.

Approved approach:

* Local UI state for temporary screen actions
* SQLite for persistent business data
* Query/cache layer for backend data where needed
* Shared services/engines for business logic

Do not store critical business records only in React state.

Do not duplicate business logic across screens.

---

# 23. Folder Structure Rule

Antigravity should use a clean folder structure.

Recommended mobile app structure:

```txt id="71q8qn"
/src
  /app
  /screens
  /components
  /database
  /engines
  /services
  /sync
  /auth
  /store
  /utils
  /types
  /tests
```

Recommended backend structure:

```txt id="dhmzbg"
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

---

# 24. Environment Rules

Buzz Duka should support separate environments:

```txt id="uf95cb"
development
staging
production
```

Do not use production keys in development.

Do not hardcode secrets in code.

Environment variables should be used for:

* API URL
* Database URL
* JWT secret
* Encryption keys
* Payment/subscription settings
* Admin credentials
* Logging tools

---

# 25. Secrets Rule

Antigravity must not hardcode secrets.

Do not commit:

* Database passwords
* JWT secrets
* API keys
* Admin passwords
* License signing keys
* Production URLs if sensitive

Use environment variables.

---

# 26. Deployment Stack

Recommended deployment approach:

```txt id="yw71hy"
Mobile app builds: Expo/EAS or approved mobile build pipeline
Backend: Managed Node.js hosting
Cloud database: Managed PostgreSQL
Admin dashboard: Managed Next.js hosting
```

Deployment details may be finalized later, but Antigravity must not lock the project into a tool that prevents scale or maintenance.

---

# 27. Monitoring and Logging Stack

Buzz Duka should eventually support:

* App crash logging
* Backend error logging
* Sync failure logging
* Subscription event logging
* Admin activity logs
* API request logs
* Performance monitoring

Do not ignore errors silently.

Errors should be logged with enough detail to support debugging.

---

# 28. What Antigravity Must Not Change

Once approved, Antigravity must not change without permission:

* React Native + Expo mobile direction
* TypeScript
* SQLite local database
* Node.js/NestJS backend
* PostgreSQL cloud database
* Prisma backend ORM
* REST API style
* Local-first sync strategy
* JWT authentication approach
* Two-role model
* One-sales-device base rule
* Payment method-only approach
* Moving weighted average cost logic
* Sale item snapshot logic

---

# 29. Approved Stack Summary

The approved Buzz Duka stack is:

```txt id="gv3ii7"
Mobile:
React Native + Expo + TypeScript

Local database:
SQLite

Backend:
Node.js + NestJS + TypeScript

Cloud database:
PostgreSQL

ORM:
Prisma

Admin dashboard:
Next.js + TypeScript

Auth:
JWT + secure mobile storage + role/device checks

Sync:
Custom offline-first sync engine

Testing:
Unit + integration + E2E + manual verification

Architecture:
Multi-tenant, business_id-separated, local-first, scalable
```

---

# 30. Final Rule

Antigravity must not randomly change the technology stack.

Buzz Duka must be built on a stable, consistent architecture that supports real offline sales, accurate inventory, dynamic pricing, profit analytics, subscriptions, and scale.

If a stack change is needed, Antigravity must explain:

1. Why the change is necessary
2. What problem it solves
3. What files/modules it affects
4. What risks it creates
5. How existing features will be protected

No stack change is allowed without explicit approval.
