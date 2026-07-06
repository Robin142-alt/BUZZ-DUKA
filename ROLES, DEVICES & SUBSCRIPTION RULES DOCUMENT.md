# DOCUMENT 3: ROLES, DEVICES & SUBSCRIPTION RULES DOCUMENTROLES, 

## Buzz Duka — Access Control, Device Control & Subscription Rules

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Business rules and access control master document
**Purpose:** Define how Owner/Sales roles, device limits, sales-enabled devices, subscription status, offline license, and access restrictions must work in Buzz Duka.
**Core Rule:** Buzz Duka must protect owner data, prevent uncontrolled selling devices, and enforce subscription access without slowing normal shop operations.

---

# 1. Purpose of This Document

This document defines the rules for:

* User roles
* Permissions
* Owner access
* Sales user access
* Device limits
* Sales-enabled device control
* Device transfer
* Subscription status
* Grace period
* Expired accounts
* Offline license checks
* Activity logs for access changes

Antigravity must follow these rules exactly.

Do not invent extra roles, unlimited devices, or fake subscription status.

---

# 2. Core Access Principle

Buzz Duka has two access principles:

```txt id="xpg8n9"
Owner controls the business.
Sales user sells only.
```

The Owner should see business performance and sensitive information.

The Sales user should focus on fast selling and should not access sensitive owner data.

---

# 3. Approved Roles

Buzz Duka starts with only two roles:

```txt id="6b9h5e"
Owner
Sales
```

Do not add early roles such as:

* Manager
* Cashier
* Accountant
* Stock manager
* Auditor
* Branch manager
* Supplier
* Customer

Extra roles may be future features, but the first version must stay simple.

---

# 4. Owner Role Definition

The Owner is the business owner or main shop manager.

Owner has full control over the shop.

Owner can:

* Register business
* Manage business profile
* Create products
* Edit products
* Deactivate products
* Create categories
* Add stock
* Adjust stock
* Change selling price
* Perform approved cost correction
* Sell if device allows
* View sales
* View gross profit
* View net profit
* View expenses
* Add expenses
* View debts
* Receive debt payments
* View analytics
* View stock value
* View activity logs
* Manage sales user
* Manage devices
* Manage subscription
* Access settings

Owner should be able to understand what is happening in the shop.

---

# 5. Sales Role Definition

The Sales user is the shop worker or counter seller.

Sales user should have a simple selling experience.

Sales user can:

* Open Sales dashboard
* Search products
* View basic product availability
* Add products to cart
* Change quantity in cart
* Select payment method
* Complete sale
* Create debt sale if allowed
* View basic recent sales
* View optional receipt
* See pending sync status

Sales user should not manage the business.

---

# 6. Sales User Restrictions

Sales user must not access:

* Net profit
* Gross profit reports
* Expense records
* Expense entry screen
* Advanced analytics
* Product profit reports
* Stock value reports
* Subscription settings
* Device settings
* Business settings
* Cost correction tools
* User management
* Full activity history if it exposes sensitive information

Sales user must not access Owner-only data through direct navigation, route manipulation, or local database shortcuts.

Permission restrictions must be enforced in logic, not only hidden from the UI.

---

# 7. Permission Enforcement Rule

Permissions must be checked in multiple places:

```txt id="e5i8um"
Navigation
Screens
Buttons/actions
Local business logic
Database queries
Backend APIs
Reports
Settings
```

Wrong approach:

```txt id="wthn8u"
Hide the expenses button but allow Sales user to open expenses screen directly.
```

Correct approach:

```txt id="vv6can"
Hide the expenses button and block the expenses route/action in permission logic.
```

Antigravity must build a reusable Permission Engine.

Example permission functions:

```txt id="pmddc4"
canManageProducts(user)
canAddStock(user)
canViewProfit(user)
canRecordExpense(user)
canManageDevices(user)
canManageSubscription(user)
canCompleteSale(user, device)
```

---

# 8. Owner Permissions

Owner permissions:

```txt id="6e20ts"
manage_business
manage_users
manage_devices
manage_subscription
manage_products
manage_stock
change_selling_price
correct_cost
complete_sale_if_device_allowed
view_sales
view_profit
view_expenses
record_expense
view_debts
record_debt_payment
view_analytics
view_activity_logs
view_settings
```

Owner actions must still respect device rules.

Example:

An Owner may have full permissions, but if a device is not sales-enabled, selling may be blocked depending on the device setup.

---

# 9. Sales Permissions

Sales permissions:

```txt id="o8s89x"
view_sales_home
search_products
view_basic_stock
add_to_cart
complete_sale_if_device_allowed
select_payment_method
create_debt_sale_if_allowed
view_basic_recent_sales
view_receipt
view_pending_sync_status
```

Sales permissions should remain focused.

Do not allow Sales user to access profit-sensitive features.

---

# 10. Business ID Rule

Every user must belong to a business.

Every authenticated session must load:

```txt id="xovgda"
user_id
business_id
role
device_id
subscription_status
```

Every query must be limited to the user’s `business_id`.

One shop must never access another shop’s:

* Products
* Sales
* Stock
* Debts
* Expenses
* Analytics
* Devices
* Subscription records
* Users

Cross-business access is a critical security bug.

---

# 11. Base Plan Device Rule

The base subscription plan includes:

```txt id="82gc5x"
1 business
1 owner
1 sales user
Maximum 2 active devices
Only 1 sales-enabled device
```

This rule is important because Buzz Duka is offline-first.

Too many sales-enabled devices can create stock conflicts and sync problems.

The first version must not allow unlimited sales devices.

---

# 12. Allowed Device Setups

Buzz Duka supports two simple setups in the base plan.

## Setup 1: One-device shop

Owner uses one phone for everything.

Allowed:

```txt id="o1prmo"
Owner device = management + selling
Sales user may not need separate device
```

## Setup 2: Two-device shop

Owner has one device.
Sales user has one sales-enabled device.

Allowed:

```txt id="vtrqb6"
Owner device = management
Sales device = selling
```

Only one device may be sales-enabled.

---

# 13. Device Record Fields

Each device record should include:

```txt id="mr82se"
device_id
business_id
user_id
device_name
device_type
device_fingerprint
sales_enabled
status
last_seen_at
created_at
updated_at
```

Device statuses:

```txt id="ui1s6i"
pending
active
blocked
removed
transferred
```

Device identity must be stored securely on the device.

---

# 14. Device Registration Rules

When a user logs in on a new device, Buzz Duka must check:

* Business ID
* User ID
* Existing active devices
* Device limit
* Whether device needs Owner approval
* Whether device can be sales-enabled

If device limit is reached, the app must not silently approve the device.

Show a clear message.

Example:

```txt id="qojjv7"
This business already has the maximum number of active devices for this plan.
```

---

# 15. Sales-Enabled Device Rule

Only one device can be sales-enabled in the base plan.

A sales-enabled device can:

* Complete sales
* Create debt sales if allowed
* Reduce stock through sales
* Create receipts
* Create sale sync queue items

A non-sales-enabled device may be allowed to:

* View owner dashboard
* Manage products
* Add stock
* View reports
* Manage subscription

depending on role and permissions.

Do not allow two devices to sell at the same time in the base plan.

---

# 16. Sales Action Device Check

Before completing a sale, Buzz Duka must check:

```txt id="nlb9uw"
User has permission to sell
Device is active
Device is sales-enabled
Subscription allows selling
Local license allows selling
```

If any check fails, sale completion should be blocked with a clear message.

Example:

```txt id="yfhcx3"
This device is not allowed to make sales. Ask the owner to enable sales on this device.
```

---

# 17. Device Transfer Rules

Device transfer allows the owner to replace an old device with a new one.

Device transfer must:

* Be Owner-only
* Deactivate or remove old device
* Register new device
* Preserve business data
* Preserve audit logs
* Prevent device limit bypass
* Create activity log

Do not allow users to bypass the two-device limit by repeatedly logging in on new devices.

---

# 18. Device Removal Rules

Owner can remove/block a device.

When a device is removed:

* It should not sync new data
* It should not perform new sales
* It should not access owner data
* It should remain in history as removed
* Activity log must be created

Do not hard delete device history casually.

---

# 19. Device Activity Logs

Log device actions such as:

* Device registered
* Device approved
* Device blocked
* Device removed
* Device transferred
* Sales-enabled status changed
* Device limit reached
* Login from new device
* Failed device approval

Activity log helps the Owner know who accessed the shop.

---

# 20. Subscription Plan

Buzz Duka first version uses one main subscription plan:

```txt id="j2oyyn"
Buzz Duka Smart Plan: KSh 1,500/month
```

Base plan includes:

* 1 business
* 1 owner
* 1 sales user
* Up to 2 active devices
* Only 1 sales-enabled device
* Product and inventory management
* Fast selling
* Payment method recording
* Debts
* Expenses
* Profit analytics
* Offline-first local use
* Sync
* Subscription/license control

Do not add complex billing plans in the first version.

---

# 21. Subscription Statuses

Buzz Duka must support these statuses:

```txt id="7z1a5n"
active
grace
expired
suspended
reactivated
```

## active

The shop can use normal allowed features.

## grace

Subscription has passed expiry date but is still temporarily allowed.

## expired

Subscription is no longer valid and access should be restricted.

## suspended

Account has been blocked by admin or system rule.

## reactivated

Subscription was renewed and access restored.

---

# 22. Subscription Record Fields

Subscription record should include:

```txt id="38vx05"
subscription_id
business_id
plan_name
amount
currency
status
start_date
expiry_date
grace_until
last_payment_reference
created_at
updated_at
```

Do not show subscription as active unless real subscription/license data supports it.

---

# 23. Offline License Rule

Buzz Duka must support offline usage, but not unlimited offline usage after expiry.

The app should store an offline license state securely.

Offline license should include:

```txt id="q9fwkx"
business_id
subscription_status
expiry_date
grace_until
last_verified_at
license_token
device_id
```

The app should be able to check whether offline usage is allowed.

Do not allow a user to avoid subscription expiry by staying offline forever.

---

# 24. Subscription Access Rules

When subscription is active:

* Selling allowed
* Product management allowed
* Stock management allowed
* Debt/expense features allowed
* Reports allowed according to role
* Sync allowed

When subscription is in grace:

* Show warning
* Allow temporary access
* Encourage renewal

When subscription is expired:

* Restrict core usage according to product policy
* Keep subscription/payment/reactivation screen accessible
* Avoid deleting data
* Show clear message

When subscription is suspended:

* Restrict access
* Show support/admin message
* Do not allow normal selling unless specifically allowed by admin policy

---

# 25. Expired Subscription Message Rules

Messages must be simple.

Examples:

```txt id="wi7u50"
Your Buzz Duka subscription has ended.
Pay KSh 1,500 to continue using the app.
```

```txt id="cr6oew"
Your subscription is in grace period. Renew soon to avoid interruption.
```

```txt id="1scm6w"
This business is suspended. Contact Buzz Duka support.
```

Avoid technical subscription language.

---

# 26. Subscription Restriction Rules

Expired access must not destroy shop data.

Do not delete:

* Products
* Sales
* Debts
* Expenses
* Receipts
* Activity logs
* Local records

Restriction should block or limit app usage but preserve data.

The user should still be able to:

* View renewal screen
* See basic account status
* Reactivate subscription

Exact restriction level can be configured later, but unlimited full usage after expiry is not allowed.

---

# 27. Subscription Reactivation Rules

When subscription is renewed/reactivated:

* Status changes to active/reactivated
* New expiry date is stored
* Offline license is refreshed
* Access is restored
* Activity log is created
* Sync can resume if it was blocked

Do not reactivate using fake local status only.

Reactivation must come from real subscription/admin/payment confirmation logic.

---

# 28. Subscription Activity Logs

Log subscription events such as:

* Subscription activated
* Subscription entered grace
* Subscription expired
* Subscription suspended
* Subscription reactivated
* Offline license refreshed
* Offline license expired
* Renewal failed

Owner and admin should be able to trace subscription events.

---

# 29. Subscription and Sales Interaction

Before completing a sale, Buzz Duka should check:

```txt id="d9dxpf"
subscription_status
offline_license_status
device_status
role_permission
sales_enabled_device
```

If subscription is active or allowed during grace, sale can proceed.

If subscription is expired beyond allowed offline/grace limit, sale should be restricted.

The app must not pretend a sale is allowed if license rules block it.

---

# 30. Subscription and Offline Conflict Rule

Because Buzz Duka is offline-first, subscription must balance access and control.

The app should not require internet for every sale.

But the app must also not allow unlimited offline usage after expiry.

Approved principle:

```txt id="hl4he1"
Allow normal offline work only while the stored offline license is valid.
```

When offline license expires, require internet connection to refresh or renew.

---

# 31. Admin Suspension Rule

Buzz Duka admin may later suspend a business.

Suspension should:

* Block normal access
* Preserve business data
* Show support message
* Create admin audit log
* Sync to device when possible

Suspension should not erase shop records.

---

# 32. Access Check Order

When opening protected features, Buzz Duka should check access in this order:

```txt id="u8wten"
1. User is logged in
2. User belongs to business
3. Device is active
4. Subscription/license allows access
5. User role has permission
6. Device is sales-enabled if action is selling
```

This keeps access control consistent.

---

# 33. No Fake Access Rule

Antigravity must not fake:

* Login success
* Role loading
* Device approval
* Subscription active status
* Offline license validity
* Sales-enabled device status

All access states must come from stored records and approved logic.

---

# 34. Backend Enforcement Rule

When backend APIs are built, access control must be enforced on the backend too.

Backend must check:

* Authentication token
* User ID
* Business ID
* Role
* Device status where needed
* Subscription status where needed

Do not rely only on frontend restrictions.

Frontend restrictions improve UX.
Backend restrictions protect data.

---

# 35. Local Enforcement Rule

Because Buzz Duka works offline, local app logic must also enforce:

* Role permissions
* Device permissions
* Subscription/offline license restrictions
* Sales-enabled device rule

The app must not allow offline Sales user to access Owner-only features just because backend is unavailable.

---

# 36. Role Test Requirements

Antigravity must test:

```txt id="6uqk3b"
Owner can open Owner dashboard
Owner can view profit
Owner can add expense
Owner can manage devices
Sales user can sell
Sales user cannot view net profit
Sales user cannot open expenses
Sales user cannot manage devices
Sales user cannot manage subscription
Direct route access is blocked
```

---

# 37. Device Test Requirements

Antigravity must test:

```txt id="fdkfeg"
First device can register
Second device can be approved
Third active device is blocked in base plan
Only one sales-enabled device is allowed
Sale is blocked on non-sales-enabled device
Removed device cannot continue selling
Device transfer preserves limit
Device actions create activity logs
```

---

# 38. Subscription Test Requirements

Antigravity must test:

```txt id="iej1f4"
Active subscription allows access
Grace period shows warning
Grace period allows temporary access
Expired subscription restricts access
Subscription screen remains accessible after expiry
Offline license allows valid offline use
Offline license blocks unlimited expired offline use
Reactivation restores access
Subscription events create activity logs
```

---

# 39. Completion Checklist

This module is complete only when:

```txt id="9ynhny"
Owner and Sales roles exist
Permission engine exists
Owner permissions work
Sales restrictions work
Device records exist
Device limit is enforced
Only one sales-enabled device is allowed
Sales action checks role + device + subscription
Subscription statuses exist
Offline license state exists
Expired access does not delete data
Activity logs are created
Tests/manual verification exist
No fake access status is used
```

---

# 40. Final Rule

Buzz Duka must stay simple and controlled.

Owner controls the business.
Sales user sells only.
Only one sales-enabled device is allowed in the base plan.
Subscription must be real, not fake.
Offline use is allowed only while the offline license is valid.
Access restrictions must be enforced in logic, not only hidden from the screen.

If role, device, or subscription rules are fake, Buzz Duka is not safe for real shops.
