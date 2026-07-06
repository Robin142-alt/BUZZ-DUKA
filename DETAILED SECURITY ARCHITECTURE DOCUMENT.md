# DOCUMENT 19: DETAILED SECURITY ARCHITECTURE DOCUMENT

## Buzz Duka — Authentication, Authorization, Data Protection, Device Security, Admin Security & Payment Reconciliation Safety

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Security architecture document
**Purpose:** Define how Buzz Duka must protect shop data, users, roles, devices, subscriptions, payment reconciliation records, APIs, local storage, cloud data, and admin operations.
**Core Rule:** Buzz Duka must be secure by design. Security must be enforced in the app, backend, database, sync system, and admin dashboard.

---

# 1. Purpose of This Document

This document defines Buzz Duka’s security architecture.

Antigravity must use this document when building:

* Login
* User registration
* Password handling
* Local app permissions
* Backend authentication
* Role-based access control
* Business ID isolation
* Device enforcement
* Subscription/license checks
* Sync security
* Admin dashboard security
* Payment reconciliation security
* Local database protection
* API validation
* Audit logs
* Error handling

Security is not optional.

Buzz Duka will manage real shop records, so it must protect trust.

---

# 2. Main Security Principle

Buzz Duka must protect:

```txt id="mx1lfx"
Shop data
Sales records
Stock records
Profit records
Debt records
Expense records
Customer debt information
Subscription status
Device access
Admin actions
Payment reconciliation records
```

Main rule:

```txt id="7txdzj"
Never trust the frontend alone.
```

The backend and database must also enforce security.

---

# 3. Money Safety Clarification

Buzz Duka is not a wallet, bank, escrow system, or money-holding platform.

Buzz Duka does not:

```txt id="1y7gpu"
Hold money
Store actual funds
Move money
Pay out money
Act as a wallet
Act as escrow
```

Buzz Duka does:

```txt id="hgzi40"
Record sale amount values for reports
Record payment methods for shop sales
Record subscription payment references
Reconcile subscription payments made to the official Till number
Activate subscription after valid reconciliation
```

Subscription money goes directly to the official Buzz Duka Till/M-Pesa.

Buzz Duka only stores reconciliation records.

---

# 4. Security Layers

Buzz Duka security must exist in all layers:

```txt id="3h9emd"
Mobile app
Local database
Sync queue
Backend API
Cloud database
Admin dashboard
Subscription reconciliation system
Monitoring and audit logs
```

Do not secure only one layer.

A Sales user must not access Owner profit just because they found a hidden route.

A blocked device must not sync sales just because it has local data.

A fake payment reference must not activate subscription.

---

# 5. Authentication Security

Authentication proves who the user is.

Buzz Duka must support:

```txt id="vwux0t"
Owner login
Sales user login
Admin login separately
Token refresh
Logout
Blocked user handling
Removed device handling
```

Authentication must not be fake.

Passwords must never be stored in plain text.

---

# 6. Password Security

Password rules:

```txt id="64h9iy"
Passwords must be hashed.
Passwords must never be stored as plain text.
Passwords must never be returned by APIs.
Password reset must be secure.
Admin passwords must use strong hashing.
```

Recommended backend hashing:

```txt id="rbxvny"
bcrypt or Argon2
```

Do not log passwords.

Do not include passwords in activity logs.

Do not expose password hashes to the mobile app.

---

# 7. Token Security

Buzz Duka backend should use JWT or equivalent secure tokens.

Rules:

```txt id="9v62fz"
Access token should expire.
Refresh token should be protected.
Tokens must not contain sensitive secrets.
Tokens must include user ID, business ID, role, and token expiry.
Blocked users should not keep using old sessions forever.
Removed devices should be rejected by backend checks.
```

Access token should be used for API calls.

Refresh token should be used to get a new access token.

---

# 8. Local Token Storage

Mobile app must store tokens safely.

Rules:

```txt id="kfozpw"
Do not store tokens in plain insecure app state only.
Use secure storage where available.
Clear tokens on logout.
Clear or invalidate tokens when device is removed.
Do not expose tokens in logs.
```

If secure storage is unavailable during early development, Antigravity must mark it as a known limitation and fix before production.

---

# 9. Role-Based Access Control

Buzz Duka has two shop roles in MVP:

```txt id="y99bv9"
Owner
Sales
```

Core rule:

```txt id="e6oinz"
Owner controls the business.
Sales user sells only.
```

Sales user must not access:

```txt id="gppshv"
Owner dashboard
Gross profit
Net profit
Expenses
Product costs
Stock value
Subscription management
Device management
Business settings
Admin dashboard
```

Role checks must exist in:

```txt id="1vp4wd"
Navigation
Screens
Buttons
Local engines
Database queries
Backend APIs
Admin APIs
```

---

# 10. Permission Enforcement Rule

Frontend hiding is not enough.

Wrong:

```txt id="42spb2"
Hide Expenses button from Sales user but allow /expenses API.
```

Correct:

```txt id="m00pj9"
Hide Expenses button, block route, block local action, and reject backend API.
```

Permission checks must be centralized through a permission engine.

---

# 11. Business ID Isolation

Business ID isolation is critical.

One shop must never access another shop’s data.

Every business-owned record must include:

```txt id="6gcp86"
business_id
```

Every backend query must filter by business ID.

Wrong:

```txt id="sqe4sk"
Find sale by sale_id only.
```

Correct:

```txt id="0otqrj"
Find sale by sale_id and current_user.business_id.
```

This applies to:

```txt id="ozxirq"
Products
Stock movements
Sales
Sale items
Receipts
Customers
Debts
Debt payments
Expenses
Activity logs
Devices
Subscription records
Payment reconciliation records
Sync records
```

---

# 12. Device Security

Buzz Duka uses device control to protect selling access.

Base plan:

```txt id="zuly7y"
Maximum 2 active devices.
Only 1 sales-enabled device.
```

Before allowing sale actions, check:

```txt id="1c68id"
User is logged in
User role allows sale
Device belongs to business
Device is active
Device is sales-enabled
Subscription/license allows sale
```

Blocked or removed devices must not create new sales or sync new sales.

---

# 13. Device Fingerprint Rule

Each device must have a unique fingerprint.

Device fingerprint should help identify:

```txt id="vdj6c1"
Known device
New device
Removed device
Blocked device
Sales-enabled device
```

Do not rely only on device name.

Device names can be changed by users.

---

# 14. Subscription Security

Subscription access must be enforced securely.

Statuses:

```txt id="ql01gq"
active
grace
expired
suspended
reactivated
```

Rules:

```txt id="1ush1x"
Active subscription allows normal use.
Grace allows temporary use with warning.
Expired blocks restricted actions.
Suspended blocks restricted actions strongly.
Old records remain visible in read-only mode where allowed.
```

Restricted actions include:

```txt id="fd45a6"
Complete sale
Add product
Add stock
Change price
Create debt sale
Record debt payment
Record expense
Manage devices
Manage sales user
```

---

# 15. Offline License Security

Offline license allows temporary offline use.

Recommended MVP rule:

```txt id="qy3c8m"
Offline license is valid up to 7 days after last successful online verification, but never beyond grace_until.
```

Formula:

```txt id="fme2hh"
offline_license_valid_until = earlier of:
last_verified_at + 7 days
grace_until
```

Rules:

* Offline license must be stored locally.
* Offline license must be signed or protected where possible.
* Offline license must not allow unlimited expired usage.
* Suspended status must block use even offline if last known status is suspended.

---

# 16. Subscription Payment Reconciliation Security

Subscription payment is reconciliation-based.

Flow:

```txt id="00bceq"
Shop Owner pays KSh 1,500 to official Buzz Duka Till.
Money goes directly to Buzz Duka owner's M-Pesa.
Backend checks and reconciles transaction details.
Subscription activates only after valid reconciliation.
```

Security checks:

```txt id="mok7se"
Correct Till number
Correct amount
Valid transaction/reference
Transaction not already used
Payment date acceptable
Payment provider data verified
Business/payment flow matched correctly
```

User-entered reference alone must not activate subscription.

---

# 17. Payment Reconciliation Anti-Fraud Rules

Buzz Duka must prevent:

```txt id="0djhqm"
Fake payment reference activation
Duplicate transaction activation
Wrong Till number activation
Wrong amount activation
Manual correction without audit
Frontend-only subscription activation
Unverified webhook activation
```

If the same transaction is submitted twice:

```txt id="qnr2jr"
Return existing reconciliation record.
Do not extend subscription twice.
```

If amount is wrong:

```txt id="roqhcb"
Do not activate automatically.
Mark as rejected or unmatched.
```

---

# 18. Webhook Security

If payment provider webhook is used, backend must verify it.

Webhook rules:

```txt id="dkj1zx"
Verify authenticity/signature/secret where supported.
Reject unknown source.
Normalize provider payload.
Check Till number.
Check amount.
Check duplicate transaction.
Use database transaction.
Create audit/subscription event.
Do not trust raw payload blindly.
```

Webhook endpoint must not be openly usable to activate subscriptions with fake data.

---

# 19. API Security

Every protected API must check:

```txt id="gp5pb6"
Authentication token
User status
Business ID
Role permission
Device status where needed
Subscription/license status where needed
Input validation
Idempotency where needed
```

APIs must not return data from another business.

APIs must not return Owner-only data to Sales user.

---

# 20. Input Validation

Backend must validate all input.

Validate:

```txt id="6q0ja5"
Required fields
Data types
Amount values
Quantity values
Business ownership
Product ownership
Stock availability
Payment method
Role permission
Device permission
Subscription status
Idempotency key
Transaction ID/reference
Till number
```

Do not trust client-calculated profit, stock, or subscription status blindly.

Backend should recalculate important values where cloud action is performed.

---

# 21. Idempotency Security

Important mutation APIs must use idempotency.

Required for:

```txt id="vl3mzt"
Create product
Stock-in
Complete sale
Reverse sale
Record debt payment
Record expense
Sync batch upload
Subscription payment reconciliation
Webhook confirmation
```

Purpose:

```txt id="zi4rpu"
Prevent duplicate sales
Prevent duplicate stock changes
Prevent duplicate debt payments
Prevent duplicate subscription activation
Prevent duplicate reversal
```

Duplicate request should return existing result, not create a new record.

---

# 22. Sync Security

Sync must be secure because offline records can be uploaded later.

Before accepting sync:

```txt id="1cwep7"
Authenticate user/device
Check business ID
Check device status
Check record ownership
Check idempotency key
Validate payload
Reject removed/blocked device for new records
Prevent duplicate sale upload
Prevent cross-business sync
```

Sync must not trust local payload blindly.

Backend must reject payloads that try to write to another business.

---

# 23. Local Database Security

SQLite local database stores sensitive business records.

Local records may include:

```txt id="y11uz0"
Sales
Stock
Debt
Expenses
Profit snapshots
Sync queue
Offline license
```

Rules:

```txt id="5dnswe"
Do not store passwords in local database.
Do not expose local database in logs.
Protect local database where platform allows.
Clear session data on logout where appropriate.
Do not delete business records casually.
```

For production, consider encryption at rest if available and practical.

If encryption is not implemented in MVP, mark it as a known security limitation.

---

# 24. Sensitive Data Handling

Sensitive data includes:

```txt id="yfwcen"
Password hashes
Auth tokens
Admin credentials
Profit data
Expense data
Customer debt records
Payment reconciliation records
License signature
API secrets
Webhook secrets
Database URL
JWT secret
```

Do not log these values.

Do not expose them in frontend errors.

Do not include secrets in Git commits.

---

# 25. Secrets Management

Secrets must be stored in environment variables or secure hosting configuration.

Secrets include:

```txt id="6cof93"
DATABASE_URL
JWT_SECRET
REFRESH_TOKEN_SECRET
ADMIN_JWT_SECRET
PAYMENT_WEBHOOK_SECRET
LICENSE_SIGNING_KEY
SUBSCRIPTION_TILL_NUMBER
API provider credentials
```

Rules:

```txt id="j5hl0o"
Do not hardcode secrets.
Do not commit secrets.
Do not expose secrets to mobile app unnecessarily.
Use different secrets for development, staging, and production.
```

---

# 26. Admin Security

Admin dashboard is separate from shop app.

Admin users are not shop users.

Admin APIs must use separate admin authentication.

Admin must be able to:

```txt id="lpq25d"
View businesses
View subscription states
View payment reconciliation records
View device states
View sync issues
Perform support actions
```

But admin actions must be controlled and audited.

---

# 27. Admin Audit Logs

Every sensitive admin action must create an audit log.

Required audit actions:

```txt id="f5e4c7"
admin_login
business_suspended
business_reactivated
subscription_manual_correction
payment_reconciliation_correction
device_blocked
device_removed
support_note_added
sync_issue_reviewed
```

Audit log must include:

```txt id="aexd0g"
admin_user_id
business_id if applicable
action_type
entity_type
entity_id
description
metadata_json
created_at
```

Admin actions must not happen silently.

---

# 28. Admin Privacy Limits

Admin dashboard should not expose more than needed.

Rules:

```txt id="w2hws6"
Admin can support subscription/device/sync issues.
Admin access should be logged.
Admin should not casually edit shop sales or profit.
Admin should not manually change business records without reason.
Admin should not see passwords or secrets.
```

If support must view sensitive business records, that action should be logged.

---

# 29. Error Handling Security

Errors must be helpful but safe.

Good:

```txt id="8xal7s"
You do not have permission to perform this action.
```

```txt id="y2avie"
Payment not confirmed yet.
```

```txt id="wbaxik"
This device is not allowed to make sales.
```

Bad:

```txt id="12e7o2"
Database query failed: SELECT * FROM users WHERE...
```

Do not expose:

```txt id="d3fkov"
Database internals
Stack traces in production
Secrets
Tokens
Password hashes
Provider credentials
```

---

# 30. Logging Security

Logs should help debug safely.

Log:

```txt id="n97do5"
Error type
Module
Business ID where safe
User ID where safe
Device ID where safe
Timestamp
Request path
Sync record ID
Reconciliation ID
```

Do not log:

```txt id="97xuxr"
Passwords
Full tokens
JWT secrets
Webhook secrets
Database URLs
Raw private credentials
```

---

# 31. Rate Limiting and Abuse Control

Backend should protect sensitive endpoints from abuse.

Important endpoints:

```txt id="ipmk3i"
Login
Password reset
Payment reconciliation check
Webhook endpoint
Sync batch upload
Admin login
```

MVP can implement basic protection first, then improve later.

Examples:

```txt id="xunrfc"
Limit repeated failed login attempts.
Limit repeated payment check attempts.
Reject very large sync payloads.
Block suspicious repeated duplicate transactions.
```

---

# 32. Data Deletion and Soft Delete Security

Do not hard delete important business records casually.

Use statuses:

```txt id="2kp2xe"
product inactive
sale reversed/voided
expense voided
debt cancelled/reversed
user blocked/removed
device blocked/removed
business suspended
```

Reason:

Business history must remain auditable.

Hard delete should be admin-only or reserved for legal/data deletion flows.

---

# 33. Receipt Security

Receipts must be customer-safe.

Receipts must not show:

```txt id="2ua8fx"
Buying price
Average unit cost
Profit
Margin
Owner dashboard data
Expense data
```

Receipts can show:

```txt id="d7tp67"
Business name
Receipt number
Date/time
Items
Quantity
Unit price
Total
Payment method
Receipt status
```

---

# 34. Sales User Data Privacy

Sales user should see only what they need to sell.

Sales user may see:

```txt id="jj8h74"
Product name
Selling price
Available stock
Cart total
Receipt
Own/basic recent sales
Sync status
```

Sales user must not see:

```txt id="xq3yg0"
Buying cost
Average cost
Gross profit
Net profit
Expenses
Stock value
Owner analytics
Subscription management
Device management
Full activity logs
```

---

# 35. Security Testing Requirements

Antigravity must test:

```txt id="u0cbsb"
Password is hashed
Password is not returned by API
Blocked user cannot continue normal access
Sales user cannot access Owner dashboard
Sales user cannot access expenses API
Sales user cannot access profit API
Sales user cannot view product cost
Direct route access is blocked
Backend rejects cross-business access
Device limit is enforced
Removed device cannot sync new sales
Expired subscription blocks restricted actions
Suspended business blocks restricted actions
Fake payment reference does not activate subscription
Wrong Till number is rejected
Wrong amount is rejected
Duplicate transaction does not activate twice
Webhook requires verification
Duplicate sale idempotency works
Receipt does not expose cost/profit
Admin actions create audit logs
Secrets are not hardcoded
```

---

# 36. Manual Security Verification

Use this test:

```txt id="y5x3ll"
1. Create Owner account and business.
2. Create Sales user.
3. Login as Sales user.
4. Try to open Owner dashboard.
5. Expected: blocked.
6. Try to open expenses.
7. Expected: blocked.
8. Try to access product cost.
9. Expected: blocked.
10. Try direct route to profit analytics.
11. Expected: blocked.
12. Block Sales device.
13. Try to sell.
14. Expected: blocked.
15. Set subscription expired.
16. Try to sell.
17. Expected: blocked.
18. Submit fake payment reference.
19. Expected: subscription not activated.
20. Submit duplicate transaction.
21. Expected: subscription not extended twice.
22. Login as admin.
23. Suspend business.
24. Confirm audit log exists.
```

---

# 37. Production Security Checklist

Before production, confirm:

```txt id="yhtd8c"
Passwords are hashed
Tokens expire
Secrets are in environment variables
No secrets are committed
Business ID isolation works
Sales restrictions work
Device restrictions work
Subscription restrictions work
Offline license has expiry
Payment reconciliation is verified
Duplicate transaction prevention works
Admin dashboard is protected
Admin audit logs work
Receipts hide cost/profit
Production errors do not expose stack traces
Backup access is restricted
```

---

# 38. What Antigravity Must Not Do

Antigravity must not:

* Store plain text passwords
* Expose password hashes
* Hardcode secrets
* Hardcode fake Till number
* Trust frontend role checks only
* Let Sales user access Owner profit
* Let one business access another business data
* Allow fake payment reference to activate subscription
* Allow same transaction to activate subscription twice
* Allow removed device to sync new sales
* Show stack traces in production UI
* Log tokens or passwords
* Build admin dashboard with fake security
* Treat Buzz Duka as wallet or money holder

---

# 39. Antigravity Completion Report

After implementing security architecture, Antigravity must report:

```txt id="r876xp"
Security module:
Auth security implemented:
Password hashing implemented:
Token handling implemented:
Role checks implemented:
Business ID isolation implemented:
Device checks implemented:
Subscription checks implemented:
Offline license security implemented:
Payment reconciliation security implemented:
Admin security implemented:
Audit logs implemented:
Sensitive logging protections added:
Tests added:
Manual verification completed:
Known limitations:
No money-holding logic confirmation:
No fake security confirmation:
```

---

# 40. Final Rule

Buzz Duka must be secure enough for real shops.

Security must protect:

```txt id="vlyh9m"
Owner control
Sales restrictions
Shop records
Profit privacy
Expense privacy
Customer debt records
Device access
Subscription access
Payment reconciliation records
Admin operations
```

If Sales user can see Owner profit, Buzz Duka is unsafe.

If one shop can access another shop’s data, Buzz Duka is unsafe.

If fake payment references can activate subscription, Buzz Duka is unsafe.

If a blocked device can keep selling, Buzz Duka is unsafe.

Build security as part of the foundation, not as an afterthought.
