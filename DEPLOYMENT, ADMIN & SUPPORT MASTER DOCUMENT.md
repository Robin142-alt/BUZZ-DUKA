# DOCUMENT 11: DEPLOYMENT, ADMIN & SUPPORT MASTER DOCUMENT

## Buzz Duka — Release, Hosting, Admin Dashboard, Monitoring, Backup & Support

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Deployment, operations, admin, and support master document
**Purpose:** Define how Buzz Duka should be prepared for release, deployed safely, monitored, supported, backed up, and managed through an internal admin dashboard.
**Core Rule:** Buzz Duka must not only work during development. It must be reliable, supportable, secure, and maintainable for real shops.

---

# 1. Purpose of This Document

This document defines the rules for:

* Mobile app release preparation
* Backend deployment
* Database deployment
* Admin dashboard
* Environment configuration
* Backups
* Monitoring
* Error logging
* Support operations
* Release checklist
* Version history
* Production safety

Antigravity must use this document when preparing Buzz Duka for real users.

---

# 2. Deployment Principle

Buzz Duka must be deployed in a way that protects:

```txt id="n218pa"
Shop data
Sales records
Stock records
Profit reports
Subscription status
Device access
Offline sync
Admin control
```

Deployment must not be rushed.

A release is not ready just because the app runs locally.

---

# 3. Approved Deployment Architecture

Recommended architecture:

```txt id="u9okbq"
Mobile app: React Native + Expo/EAS build pipeline
Backend API: Node.js + NestJS hosted on managed backend hosting
Cloud database: Managed PostgreSQL
Admin dashboard: Next.js hosted on managed web hosting
Local database: SQLite inside mobile app
```

The mobile app must continue working offline even if backend is temporarily unavailable.

---

# 4. Environment Separation

Buzz Duka must support separate environments:

```txt id="l47ukm"
development
staging
production
```

## development

Used while building features.

## staging

Used for testing production-like behavior before release.

## production

Used by real shops.

Do not test dangerous changes directly in production.

---

# 5. Environment Variables

Sensitive values must not be hardcoded.

Use environment variables for:

```txt id="p2gykd"
API URL
Database URL
JWT secret
Refresh token secret
License signing key
Admin credentials
Storage keys
Logging service keys
Email/SMS provider keys if added later
```

Do not commit secrets to the codebase.

---

# 6. Mobile App Build Rules

Before building a production mobile app, confirm:

* App name is Buzz Duka
* App icon is correct
* Splash screen is correct
* Version number is updated
* Environment points to production API
* No development-only debug screens are exposed
* No fake production data exists
* Offline database works
* Subscription/license logic works
* Role/device restrictions work
* Critical tests pass

Do not release a build that still contains fake dashboard values or demo-only logic.

---

# 7. Backend Deployment Rules

Backend deployment must include:

* Production environment variables
* PostgreSQL connection
* Database migrations
* Auth configuration
* Subscription/license configuration
* API security checks
* Logging
* Error handling
* Health check endpoint

Backend must not expose unprotected production APIs.

Every protected API must check:

```txt id="6idx48"
authentication
business_id
role permission
device status where needed
subscription status where needed
```

---

# 8. Database Deployment Rules

Production database must use PostgreSQL.

Before production launch:

* Apply migrations safely
* Confirm tables exist
* Confirm indexes exist
* Confirm business ID separation
* Confirm idempotency constraints
* Confirm backup process
* Confirm admin access controls
* Confirm no test data is mixed into production

Do not manually edit production database casually.

---

# 9. Database Migration Rules

Every schema change must use a migration.

Migration report must include:

```txt id="9vp6oj"
Migration name
Reason for change
Tables affected
Columns added/removed/changed
Data migration needed
Backward compatibility notes
Rollback notes if possible
Tests performed
```

Do not change schema without updating:

* Types
* Engine logic
* API contracts
* Repositories
* Tests
* Documentation

---

# 10. Backup Rules

Buzz Duka must have a backup strategy.

Backups should protect:

* Businesses
* Users
* Devices
* Products
* Stock movements
* Sales
* Sale items
* Debts
* Debt payments
* Expenses
* Activity logs
* Subscription records
* Admin audit logs

Recommended backup behavior:

```txt id="zkd8ou"
Automatic scheduled PostgreSQL backups
Retention policy
Restore testing
Admin-only backup access
```

Backups must not be public.

---

# 11. Restore Rules

Backup is not useful unless restore works.

Restore process must define:

* How to select backup
* How to restore database
* How to verify restored data
* How to prevent overwriting good production data accidentally
* Who is allowed to perform restore
* How restore is logged

Restoring data should be treated as a high-risk admin operation.

---

# 12. Monitoring Rules

Buzz Duka should monitor important production behavior.

Monitor:

```txt id="c45f7x"
Backend uptime
API errors
Database errors
Sync failures
Subscription/license failures
Login failures
Duplicate sync attempts
Device access errors
Critical app crashes
Slow API responses
```

Do not ignore production errors silently.

---

# 13. Error Logging Rules

Errors should be logged with useful information.

Log:

* Error type
* Error message
* Affected module
* Business ID where safe
* User ID where safe
* Device ID where safe
* Timestamp
* Request path for backend errors
* Sync record ID for sync errors

Do not log:

* Plain passwords
* Full auth tokens
* Sensitive secrets
* Private credentials

---

# 14. Sync Failure Monitoring

Sync failures are important because Buzz Duka is offline-first.

Admin dashboard should eventually show:

* Businesses with failed sync
* Devices with repeated sync failures
* Failed record type
* Last sync error
* Last successful sync
* Pending sync count if available
* Duplicate prevention errors

Sync errors must be real, not fake admin metrics.

---

# 15. Subscription Monitoring

Admin should be able to monitor:

* Active subscriptions
* Grace subscriptions
* Expired subscriptions
* Suspended businesses
* Reactivated businesses
* Failed renewals
* Offline license refresh issues

Subscription status must come from real records.

Do not show fake active subscription counts.

---

# 16. Admin Dashboard Purpose

The Admin Dashboard is for Buzz Duka operators, not shop users.

It helps manage:

* Shops
* Subscriptions
* Devices
* Sync issues
* Support cases
* Admin actions
* Suspensions/reactivations
* Basic system health

Admin dashboard must use real backend data.

---

# 17. Admin Dashboard Stack

Approved admin stack:

```txt id="gtj9ya"
Next.js
TypeScript
Backend API integration
Protected admin login
```

Do not build admin dashboard with fake local arrays.

---

# 18. Admin Login Rules

Admin login must be protected.

Admin users are separate from shop users.

Admin login must:

* Check real admin credentials
* Use secure password hashing
* Issue protected session/token
* Restrict admin routes
* Log important admin activity

Do not allow normal shop users to access admin dashboard.

---

# 19. Admin Dashboard Screens

Recommended admin screens:

```txt id="yfj2jl"
Admin login
Admin home
Business list
Business detail
Subscription management
Device management
Sync issues
Support notes
Admin audit logs
System health
```

Build only what is needed first.

Do not overload admin dashboard before core app is stable.

---

# 20. Business List Admin Screen

Business list should show real shops.

Fields:

```txt id="y25vb6"
Business name
Owner
Subscription status
Active devices
Sales-enabled device
Last sync time
Created date
Status
```

Do not show fake shop counts.

If no shops exist, show:

```txt id="kbmed4"
No businesses registered yet.
```

---

# 21. Business Detail Admin Screen

Business detail should show:

```txt id="v0sl2l"
Business profile
Owner user
Sales user
Device list
Subscription status
Sync status
Recent support notes
Recent admin actions
```

Admin should not casually edit sensitive data without audit logs.

---

# 22. Subscription Admin Rules

Admin may need to:

* View subscription
* Mark subscription active if payment confirmed
* Extend expiry
* Suspend business
* Reactivate business
* View subscription history

Every admin subscription action must create audit log.

Fields to audit:

```txt id="fac5vw"
admin_user_id
business_id
old_status
new_status
reason
timestamp
```

Do not change subscription silently.

---

# 23. Device Admin Rules

Admin may need to:

* View devices
* Block device
* Remove device
* Help with device transfer
* View sales-enabled device
* View last seen time

Device admin actions must create audit logs.

Do not allow device rules to be bypassed without record.

---

# 24. Sync Issues Admin Rules

Admin dashboard should help support sync problems.

Sync issue view should show:

```txt id="21xbj7"
Business
Device
Record type
Sync status
Error message
Attempt count
Last attempt time
Created time
```

Admin should be able to understand whether the issue is:

* Network related
* Duplicate record
* Device blocked
* Subscription expired
* Invalid business ID
* Backend validation error

---

# 25. Admin Audit Logs

Admin audit logs must record sensitive admin actions.

Examples:

```txt id="cruq1k"
admin_login
business_suspended
business_reactivated
subscription_extended
device_blocked
device_removed
support_note_added
sync_issue_reviewed
```

Audit logs should not be hard deleted casually.

---

# 26. Support Manual Rules

Buzz Duka needs a basic support process.

Support should help users with:

* Login issues
* Device approval
* Device transfer
* Subscription renewal
* Offline sync issues
* Stock mismatch questions
* Product setup
* Sales user access
* Debt/payment confusion
* Expense recording
* Basic dashboard explanation

Support should not manually change business records without clear reason and audit log.

---

# 27. Common Support Responses

Support messages should be simple.

Examples:

```txt id="feem9x"
Your sale was saved on your phone. Connect to internet and tap Sync to upload it.
```

```txt id="j3yu2u"
Only one sales device is allowed on your current plan.
```

```txt id="7fil92"
Your subscription has ended. Renew to continue using Buzz Duka.
```

```txt id="cy73yc"
Stock changed because a sale was completed or stock was adjusted. Check Activity History for details.
```

---

# 28. User Training Guide

Buzz Duka should have a simple user training guide.

Training sections:

```txt id="u8dlkv"
How to add your first product
How to add stock
How to sell
How to choose payment method
How to record a debt sale
How to receive debt payment
How to record an expense
How to check profit
How to check low stock
How to work offline
How to sync
How to renew subscription
```

Training should be short and practical.

---

# 29. Release Checklist

Before release, confirm:

```txt id="oms4mo"
App builds successfully
Backend deploys successfully
Database migrations run successfully
Admin dashboard runs
No fake production data exists
No hardcoded secrets exist
Login works
Product creation works
Stock-in works
Sales work
Stock reduction works
Price snapshots work
Profit is correct
Debt works
Expense works
Dashboard uses real data
Offline sale works
Sync works
Role restrictions work
Device rules work
Subscription rules work
Admin dashboard uses real data
Backups are configured
Monitoring is configured
Critical tests pass
Manual verification passes
```

Do not release if critical money, stock, role, sync, or subscription tests fail.

---

# 30. Versioning Rules

Every release should have a version.

Example:

```txt id="fd0b3a"
1.0.0
1.0.1
1.1.0
```

Suggested version meaning:

```txt id="p7zmcm"
Major version: big product changes
Minor version: new features
Patch version: bug fixes
```

Version should be visible internally and possibly in app settings.

---

# 31. Changelog Rules

Every release should have a changelog.

Changelog should include:

```txt id="l6ndx4"
Version number
Release date
New features
Bug fixes
Database changes
Known limitations
Upgrade notes
```

Do not hide important changes.

If a release affects stock, sales, profit, sync, or subscription, explain clearly.

---

# 32. Rollback Rules

If a production release causes serious bugs, rollback may be needed.

Rollback plan should define:

* Previous stable version
* Database migration risk
* App rollback method
* Backend rollback method
* Communication to users
* Data repair if needed

Never rollback blindly if database schema changed in a destructive way.

---

# 33. Production Bug Rules

Production bugs must be handled carefully.

For serious bugs, record:

```txt id="v65n68"
Bug title
Affected version
Affected businesses if known
Severity
Root cause
Fix plan
Data repair needed
Release patch version
Verification steps
```

Critical production bugs include:

* Wrong profit
* Wrong stock
* Sale duplication
* Lost offline sales
* Sales user seeing owner data
* Subscription bypass
* Cross-business data leak

---

# 34. Data Repair Rules

If production data becomes inaccurate, Antigravity/admin must not silently patch totals.

Data repair must explain:

* What caused the issue
* Which records are affected
* How affected records are detected
* How repair will work
* Whether backup exists
* How repair will be verified
* Who approved repair

Data repair must create audit records where appropriate.

---

# 35. Security Rules

Production must protect:

* User passwords
* Admin passwords
* Auth tokens
* Business records
* Sales records
* Profit data
* Expense data
* Subscription controls
* Device controls

Security rules:

```txt id="icm8ux"
Do not store plain text passwords
Do not commit secrets
Use HTTPS in production
Protect admin routes
Enforce business ID
Enforce role permissions
Do not expose Owner data to Sales user
Do not expose one shop’s data to another shop
```

---

# 36. Performance Rules

Production app must remain fast.

Critical performance expectations:

* Product search should be quick.
* Sale completion should be local and fast.
* Checkout should not wait for sync.
* Dashboard should load in reasonable time.
* Sync should not freeze the app.
* Backend APIs should respond reliably.
* Admin dashboard should not run heavy unoptimized queries.

Do not make analytics slow down selling.

---

# 37. Support Escalation Rules

Some issues require escalation.

Escalate if:

* Sales disappeared
* Stock is wrong
* Profit is wrong
* Sync duplicates sales
* User cannot access paid subscription
* Device was wrongly blocked
* Sales user sees owner data
* Business data appears in another shop
* Admin action caused wrong restriction

These issues affect trust and must be handled carefully.

---

# 38. Production Monitoring Alerts

Recommended alerts:

```txt id="r5w3a0"
Backend down
Database connection failure
High API error rate
Repeated sync failures
Duplicate sale sync attempt
Subscription license validation failure
Admin login failure spike
Cross-business access attempt
Mobile crash spike
```

Alerts should help the team respond before many shops are affected.

---

# 39. Admin Dashboard Acceptance Criteria

Admin dashboard is complete only when:

```txt id="m6o7np"
Admin login works
Admin routes are protected
Business list uses real data
Business detail uses real data
Subscription status is real
Device list is real
Sync issues are real
Admin actions create audit logs
Empty states appear when no data exists
No fake shop counts are used
No fake revenue is used
```

---

# 40. Deployment Acceptance Criteria

Deployment is complete only when:

```txt id="ogvc96"
Mobile app builds correctly
Backend is live and protected
Database migrations are applied
Admin dashboard is live and protected
Production environment variables are configured
Secrets are not hardcoded
Backup process exists
Monitoring exists
Critical tests pass
Manual release checklist passes
Rollback plan exists
```

---

# 41. Final Release Report Format

Before release, Antigravity must provide:

```txt id="5yhi79"
Release version:
Release environment:
Mobile build status:
Backend deployment status:
Database migration status:
Admin dashboard status:
Tests run:
Tests passed:
Tests failed:
Manual verification completed:
Known limitations:
Backup status:
Monitoring status:
Rollback plan:
No fake data confirmation:
Release recommendation:
```

---

# 42. Final Rule

Buzz Duka must be safe to run for real shops.

Deployment is not only about putting the app online.

Deployment must protect:

```txt id="mx8m5a"
Real sales
Real stock
Real profit
Real debts
Real expenses
Real subscriptions
Real devices
Real shop data
```

Do not release fake dashboards.

Do not release broken sync.

Do not release without backups.

Do not release if Sales users can access Owner data.

Do not release if profit or stock calculations are wrong.

Buzz Duka is ready only when it is real, tested, secure, monitored, and supportable.
