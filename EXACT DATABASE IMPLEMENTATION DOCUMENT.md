# DOCUMENT 16: EXACT DATABASE IMPLEMENTATION DOCUMENT

## Buzz Duka — SQLite, PostgreSQL, Prisma Schema Rules, Amount Records, Indexes, Sync & Reconciliation

**Document Version:** 2.0
**Product Name:** Buzz Duka
**Document Type:** Exact database implementation document
**Purpose:** Define how Buzz Duka data must be stored locally and in the cloud so products, stock, sales, profit reports, debts, expenses, roles, devices, subscription access, sync, and payment reconciliation remain accurate.
**Core Rule:** Buzz Duka stores business records, not money. Money paid through the Till goes directly to the Buzz Duka owner’s M-Pesa. Buzz Duka only records and reconciles payment information.

---

# 1. Purpose of This Document

This document tells Antigravity how to implement the Buzz Duka database.

It covers:

* Local SQLite database
* Cloud PostgreSQL database
* Prisma schema direction
* Table fields
* Field types
* Required constraints
* Amount value storage
* Quantity storage
* Business ID isolation
* Sync metadata
* Idempotency
* Subscription payment reconciliation
* Indexes
* Migration rules
* Data accuracy rules

This document must be followed before building engines, dashboards, reports, sync, backend APIs, or admin tools.

---

# 2. Important Money Clarification

Buzz Duka must never be described as a wallet, bank, escrow system, or money-holding platform.

Buzz Duka does **not**:

```txt id="t6tj8o"
Hold money
Store actual funds
Move money
Pay out money
Keep customer money
Act as a wallet
Act as escrow
```

Buzz Duka does:

```txt id="o5kq5m"
Record sales amounts
Record payment methods
Record debt amounts
Record expense amounts
Record subscription payment references
Reconcile Till payments
Activate subscription after valid reconciliation
Show reports from recorded business data
```

Important distinction:

```txt id="pgxa7o"
Buzz Duka stores amount records, not money.
```

Example:

If a shop pays KSh 1,500 subscription to the official Buzz Duka Till, the money goes directly to the Buzz Duka owner’s M-Pesa.

Buzz Duka only stores a reconciliation record showing that payment was matched and confirmed.

---

# 3. Database Architecture

Buzz Duka uses two databases:

```txt id="4ai7c2"
Local database: SQLite inside mobile app
Cloud database: PostgreSQL on backend
```

## SQLite

Used for:

* Offline products
* Offline product search
* Offline sales
* Offline stock updates
* Offline debt records
* Offline expense records
* Local receipts
* Activity history
* Sync queue
* Offline subscription license state

## PostgreSQL

Used for:

* Backend APIs
* Cloud backup
* Admin dashboard
* Subscription payment reconciliation
* Subscription/license status
* Device control
* Sync storage
* Multi-device support
* Support and monitoring

Main rule:

```txt id="rsm3ev"
Mobile app saves locally first. Backend stores synced cloud copy.
```

---

# 4. Global Database Rules

Every important business-owned table must include:

```txt id="o8x47b"
id
business_id
created_at
updated_at
sync_status
idempotency_key
```

Every syncable local record should include:

```txt id="hwavog"
local_id
server_id
sync_status
idempotency_key
```

The cloud database should include stable server IDs.

Do not depend only on auto-increment IDs for sync.

---

# 5. ID Rules

Use UUID-style IDs for important records.

Recommended local SQLite style:

```txt id="qkt6ec"
id TEXT PRIMARY KEY
server_id TEXT NULL
```

Recommended PostgreSQL style:

```txt id="al5e1i"
id UUID PRIMARY KEY
```

Reason:

* Offline records need IDs before server sync.
* Sale items need to link to local sales immediately.
* Sync must work before backend returns server IDs.
* Idempotency must prevent duplicate uploads.

---

# 6. Amount Value Storage Rule

Buzz Duka stores amount **values** for records and reports.

It does not store actual money/funds.

All monetary amount values must be stored as integer cents/minor units.

Example:

```txt id="vyt20j"
KSh 400 = 40000
KSh 281.25 = 28125
KSh 1,500 = 150000
```

Approved amount field type:

```txt id="796z7j"
SQLite: INTEGER
PostgreSQL/Prisma: Int or BigInt depending scale
```

For MVP, integer cents are enough.

Display conversion:

```txt id="gx24ni"
stored_amount_cents / 100 = display amount
```

Example:

```txt id="4rtmr6"
stored: 150000
display: KSh 1,500
```

Do not store amount values as `REAL`, `FLOAT`, or uncontrolled JavaScript decimals.

---

# 7. Quantity Storage Rule

MVP should use whole-number quantities for normal shop goods.

Example:

```txt id="wekp1q"
1 soap
4 lotions
10 packets
```

Approved MVP type:

```txt id="yfxaub"
quantity INTEGER NOT NULL
```

Future fractional quantities can be added later for items sold by kilograms, litres, or metres.

Do not complicate MVP with fractional inventory unless approved.

---

# 8. Date and Time Rule

Store timestamps consistently.

Recommended SQLite:

```txt id="ku9o5f"
TEXT ISO datetime
```

Recommended PostgreSQL:

```txt id="0ft81q"
TIMESTAMPTZ
```

Required timestamp fields:

```txt id="kzr045"
created_at
updated_at
deleted_at optional
synced_at optional
```

Use action time for reports, not only sync time.

Example:

```txt id="ixh0fn"
A sale made offline at 10:00 AM but synced at 2:00 PM should count as a 10:00 AM sale.
```

---

# 9. Sync Status Values

Approved values:

```txt id="vb6liq"
pending
syncing
synced
failed
```

Use these values consistently.

Do not create random sync states.

---

# 10. Business Table

Table name:

```txt id="pwxagy"
businesses
```

Purpose:

Stores shop/business profile.

Fields:

```txt id="vke7i3"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_name TEXT NOT NULL
business_category TEXT NULL
location TEXT NULL
owner_user_id TEXT NULL
status TEXT NOT NULL DEFAULT 'active'
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed business statuses:

```txt id="w1tldf"
active
suspended
closed
```

Rules:

* Every business-owned record must reference `business_id`.
* One business cannot access another business data.
* Suspended business must be restricted.

---

# 11. Users Table

Table name:

```txt id="ui529t"
users
```

Purpose:

Stores Owner and Sales users.

Fields:

```txt id="zkvzt3"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
full_name TEXT NOT NULL
phone TEXT NULL
email TEXT NULL
password_hash TEXT NULL
role TEXT NOT NULL
status TEXT NOT NULL DEFAULT 'active'
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed roles:

```txt id="g6l80x"
owner
sales
```

Allowed statuses:

```txt id="dbet9z"
active
blocked
removed
```

Rules:

* Password must not be stored as plain text.
* Sales user must not access Owner-only data.
* First MVP supports one Owner and one Sales user.

---

# 12. Devices Table

Table name:

```txt id="3yynuo"
devices
```

Purpose:

Tracks allowed phones/devices.

Fields:

```txt id="2c8okt"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
user_id TEXT NULL
device_name TEXT NOT NULL
device_fingerprint TEXT NOT NULL
status TEXT NOT NULL DEFAULT 'active'
is_sales_enabled INTEGER NOT NULL DEFAULT 0
last_seen_at TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed statuses:

```txt id="d2qlkx"
active
blocked
removed
pending
```

Rules:

```txt id="gl9419"
Maximum 2 active devices.
Only 1 sales-enabled device.
Removed devices cannot sync new sales.
```

---

# 13. Categories Table

Table name:

```txt id="5q3gh1"
categories
```

Fields:

```txt id="zqnjb9"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
name TEXT NOT NULL
is_active INTEGER NOT NULL DEFAULT 1
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Constraint:

```txt id="mi0bqz"
UNIQUE(business_id, name)
```

---

# 14. Products Table

Table name:

```txt id="7jdghc"
products
```

Purpose:

Stores current product state.

Fields:

```txt id="i9lrbi"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
category_id TEXT NULL
product_name TEXT NOT NULL
sku TEXT NULL
current_stock_quantity INTEGER NOT NULL DEFAULT 0
low_stock_level INTEGER NOT NULL DEFAULT 0
default_buying_price_cents INTEGER NOT NULL DEFAULT 0
current_selling_price_cents INTEGER NOT NULL DEFAULT 0
average_unit_cost_cents INTEGER NOT NULL DEFAULT 0
stock_value_cents INTEGER NOT NULL DEFAULT 0
is_active INTEGER NOT NULL DEFAULT 1
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Rules:

* Product table shows current state only.
* Old sales must not use current product price.
* Historical profit must use `sale_items`.
* Sales user must not see cost fields by default.

---

# 15. Stock Movements Table

Table name:

```txt id="e2t0mp"
stock_movements
```

Purpose:

Tracks every stock change.

Fields:

```txt id="qgmg0x"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
product_id TEXT NOT NULL
movement_type TEXT NOT NULL
quantity_change INTEGER NOT NULL
quantity_before INTEGER NOT NULL
quantity_after INTEGER NOT NULL
unit_cost_before_cents INTEGER NOT NULL DEFAULT 0
unit_cost_after_cents INTEGER NOT NULL DEFAULT 0
stock_value_before_cents INTEGER NOT NULL DEFAULT 0
stock_value_after_cents INTEGER NOT NULL DEFAULT 0
related_sale_id TEXT NULL
related_sale_item_id TEXT NULL
reason TEXT NULL
created_by_user_id TEXT NOT NULL
device_id TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed movement types:

```txt id="nibg7z"
initial_stock
stock_in
sale
sale_reversal
adjustment
damage
loss
cost_correction
```

Rules:

* Stock must never change without a stock movement.
* Sale stock reduction must create movement.
* Sale reversal must create movement.
* Stock-in must update average cost.

---

# 16. Price History Table

Table name:

```txt id="wmo6p4"
price_history
```

Purpose:

Tracks selling price and cost-related changes.

Fields:

```txt id="dygpzc"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
product_id TEXT NOT NULL
change_type TEXT NOT NULL
old_value_cents INTEGER NOT NULL DEFAULT 0
new_value_cents INTEGER NOT NULL DEFAULT 0
reason TEXT NULL
changed_by_user_id TEXT NOT NULL
device_id TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed change types:

```txt id="tc21pn"
selling_price_change
default_buying_price_change
average_cost_change
cost_correction
```

Rules:

* Selling price changes affect new sales only.
* Price history must not rewrite old sale items.

---

# 17. Sales Table

Table name:

```txt id="nyo32j"
sales
```

Purpose:

Stores completed sale header.

Important:

Buzz Duka records sale amounts for business history and reports. It does not hold the sale money.

Fields:

```txt id="52ufk1"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
sale_number TEXT NOT NULL
sold_by_user_id TEXT NOT NULL
device_id TEXT NULL
payment_method TEXT NOT NULL
sale_status TEXT NOT NULL DEFAULT 'completed'
total_amount_cents INTEGER NOT NULL
total_cost_cents INTEGER NOT NULL
gross_profit_cents INTEGER NOT NULL
customer_id TEXT NULL
debt_id TEXT NULL
receipt_id TEXT NULL
reversed_at TEXT NULL
reversed_by_user_id TEXT NULL
reversal_reason TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed payment methods:

```txt id="qxz00b"
cash
mpesa
bank
debt
```

Allowed sale statuses:

```txt id="q1172c"
completed
partially_reversed
reversed
voided
```

Rules:

* Sale must not exist without sale items.
* Sale totals must equal sum of sale items.
* Sale records payment method only.
* Do not add M-Pesa code fields.
* Do not add M-Pesa verification fields.
* Do not treat recorded sale amount as money held by Buzz Duka.

Constraint:

```txt id="sw48lq"
UNIQUE(business_id, sale_number)
```

---

# 18. Sale Items Table

Table name:

```txt id="vfuhg2"
sale_items
```

Purpose:

Stores immutable sale item snapshots.

Fields:

```txt id="d79vm2"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
sale_id TEXT NOT NULL
product_id TEXT NOT NULL
product_name_snapshot TEXT NOT NULL
quantity_sold INTEGER NOT NULL
unit_cost_at_sale_cents INTEGER NOT NULL
unit_selling_price_at_sale_cents INTEGER NOT NULL
line_revenue_cents INTEGER NOT NULL
line_cost_cents INTEGER NOT NULL
line_profit_cents INTEGER NOT NULL
margin_percentage INTEGER NOT NULL DEFAULT 0
stock_quantity_before_sale INTEGER NOT NULL
stock_quantity_after_sale INTEGER NOT NULL
average_cost_at_sale_cents INTEGER NOT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Rules:

* Do not edit sale item snapshots after sale completion.
* Old reports must use this table.
* Product price edits must not affect this table.
* Product name snapshot protects history if product name changes later.

Margin storage:

```txt id="wzfl56"
Store margin_percentage as integer basis points.
Example: 25.50% = 2550
```

---

# 19. Receipts Table

Table name:

```txt id="l1hkav"
receipts
```

Purpose:

Stores receipt records for completed sales.

Fields:

```txt id="fpb47z"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
sale_id TEXT NOT NULL
receipt_number TEXT NOT NULL
receipt_status TEXT NOT NULL DEFAULT 'active'
total_amount_cents INTEGER NOT NULL
payment_method TEXT NOT NULL
customer_name_snapshot TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed receipt statuses:

```txt id="mywqq2"
active
reversed
voided
```

Constraint:

```txt id="oc7y3i"
UNIQUE(business_id, receipt_number)
```

Rules:

* Receipt must not show profit or cost.
* Reversed sale should mark receipt reversed.
* Receipt should persist after app restart.
* Receipt records amount paid for the sale; it does not mean Buzz Duka holds the money.

---

# 20. Customers Table

Table name:

```txt id="qwacyh"
customers
```

Purpose:

Used mostly for debts.

Fields:

```txt id="6lp26p"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
customer_name TEXT NOT NULL
phone TEXT NULL
notes TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Rules:

* Customer name is required for debt sale.
* Phone is optional.
* Do not make debt checkout too long.

---

# 21. Debts Table

Table name:

```txt id="qt8qjl"
debts
```

Purpose:

Tracks customer debt records.

Fields:

```txt id="ki771l"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
customer_id TEXT NOT NULL
sale_id TEXT NOT NULL
original_amount_cents INTEGER NOT NULL
amount_paid_cents INTEGER NOT NULL DEFAULT 0
balance_cents INTEGER NOT NULL
debt_status TEXT NOT NULL DEFAULT 'unpaid'
due_date TEXT NULL
note TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed debt statuses:

```txt id="0e392f"
unpaid
partial
paid
overdue
reversed
cancelled
```

Rules:

```txt id="fd56bi"
balance_cents = original_amount_cents - amount_paid_cents
```

Debt sale must still be a real sale.

Debt values are business records only. Buzz Duka does not hold money owed by customers.

---

# 22. Debt Payments Table

Table name:

```txt id="g40ns1"
debt_payments
```

Purpose:

Records payments made toward customer debts.

Fields:

```txt id="1w5kia"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
debt_id TEXT NOT NULL
customer_id TEXT NOT NULL
received_by_user_id TEXT NOT NULL
device_id TEXT NULL
amount_paid_cents INTEGER NOT NULL
payment_method TEXT NOT NULL
note TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed payment methods:

```txt id="ox984s"
cash
mpesa
bank
```

Rules:

* Debt payment cannot exceed debt balance unless future overpayment support is added.
* Sales user cannot record debt payment by default.
* Debt payments must not rewrite original sale snapshots.
* Debt payment record does not mean Buzz Duka holds the payment.

---

# 23. Expenses Table

Table name:

```txt id="c2abs9"
expenses
```

Purpose:

Stores shop expense records for net profit reports.

Fields:

```txt id="ljrsgz"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
recorded_by_user_id TEXT NOT NULL
device_id TEXT NULL
amount_cents INTEGER NOT NULL
category TEXT NOT NULL
description TEXT NULL
expense_date TEXT NOT NULL
expense_status TEXT NOT NULL DEFAULT 'active'
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed expense statuses:

```txt id="gjt4ne"
active
voided
```

Default categories:

```txt id="1kaj2w"
rent
salary
transport
electricity
water
internet
airtime
packaging
repairs
county_charges
other
```

Rules:

* Expenses reduce net profit.
* Expenses are Owner-only by default.
* Do not hard delete expenses casually.
* Expense records are business records, not money held by Buzz Duka.

---

# 24. Sale Reversals Table

Table name:

```txt id="op8rzd"
sale_reversals
```

Purpose:

Stores sale correction/reversal records.

Fields:

```txt id="sgkl82"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
sale_id TEXT NOT NULL
reversed_by_user_id TEXT NOT NULL
device_id TEXT NULL
reversal_type TEXT NOT NULL DEFAULT 'full'
reason TEXT NOT NULL
note TEXT NULL
original_total_amount_cents INTEGER NOT NULL
original_total_cost_cents INTEGER NOT NULL
original_gross_profit_cents INTEGER NOT NULL
refund_required INTEGER NOT NULL DEFAULT 0
refund_method TEXT NULL
refund_note TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed reversal types:

```txt id="yg2722"
full
partial_future
void
```

Rules:

* MVP supports full reversal.
* Original sale is not deleted.
* Stock restoration must create stock movement.
* Sale cannot be reversed twice.
* Refund note is informational only; Buzz Duka does not send or hold refund money.

---

# 25. Activity Logs Table

Table name:

```txt id="qryou0"
activity_logs
```

Purpose:

Stores important business actions.

Fields:

```txt id="602tu0"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
user_id TEXT NULL
device_id TEXT NULL
action_type TEXT NOT NULL
entity_type TEXT NULL
entity_id TEXT NULL
description TEXT NOT NULL
metadata_json TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Examples of action types:

```txt id="iqjfo8"
product_created
stock_added
selling_price_changed
sale_completed
sale_reversed
debt_created
debt_payment_received
expense_recorded
device_blocked
subscription_payment_matched
subscription_activated
subscription_expired
sync_failed
```

Rules:

* Important actions must create logs.
* Logs must use real events.
* Do not create fake history.

---

# 26. Sync Queue Table

Table name:

```txt id="i1n008"
sync_queue
```

Purpose:

Stores local records waiting for cloud sync.

Fields:

```txt id="21yhv3"
id TEXT PRIMARY KEY
business_id TEXT NOT NULL
local_record_id TEXT NOT NULL
server_record_id TEXT NULL
record_type TEXT NOT NULL
operation_type TEXT NOT NULL
payload_json TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
attempt_count INTEGER NOT NULL DEFAULT 0
last_attempt_at TEXT NULL
next_retry_at TEXT NULL
sync_error TEXT NULL
idempotency_key TEXT NOT NULL UNIQUE
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

Allowed operation types:

```txt id="jz9i82"
create
update
delete_soft
reverse
sync_bundle
reconcile
```

Rules:

* Sync queue must persist after restart.
* Do not clear queue before backend confirmation.
* Idempotency key prevents duplicate sync.

---

# 27. Subscription Records Table

Table name:

```txt id="a1b2yu"
subscription_records
```

Purpose:

Stores subscription periods and access status.

Fields:

```txt id="2spfv1"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
plan_name TEXT NOT NULL
plan_price_cents INTEGER NOT NULL
status TEXT NOT NULL
subscription_start_at TEXT NOT NULL
subscription_end_at TEXT NOT NULL
grace_until TEXT NOT NULL
payment_reconciliation_id TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed statuses:

```txt id="ghcsvv"
active
grace
expired
suspended
reactivated
```

Rules:

* Base plan is KSh 1,500/month.
* Billing period is 30 days.
* Grace period is 3 days.
* Subscription activation must happen after valid payment reconciliation or approved admin correction.
* Subscription record does not mean Buzz Duka holds money.

---

# 28. Subscription Payment Reconciliations Table

Table name:

```txt id="c81lki"
subscription_payment_reconciliations
```

Purpose:

Stores subscription payment reconciliation records.

This table does not store actual money.

It stores proof/checking information that a shop paid to the official Buzz Duka Till number and that the payment was matched.

Fields:

```txt id="ncyvtk"
id TEXT PRIMARY KEY
server_id TEXT NULL
business_id TEXT NOT NULL
user_id TEXT NOT NULL
plan_name TEXT NOT NULL
amount_expected_cents INTEGER NOT NULL
amount_paid_cents INTEGER NULL
currency TEXT NOT NULL DEFAULT 'KES'
till_number TEXT NOT NULL
payment_reference TEXT NULL
transaction_id TEXT NULL
payment_provider TEXT NULL
reconciliation_status TEXT NOT NULL DEFAULT 'pending'
payment_received_at TEXT NULL
reconciled_at TEXT NULL
subscription_start_at TEXT NULL
subscription_end_at TEXT NULL
grace_until TEXT NULL
failure_reason TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
sync_status TEXT NOT NULL DEFAULT 'pending'
idempotency_key TEXT UNIQUE
```

Allowed reconciliation statuses:

```txt id="vj28n5"
pending
checking
matched
unmatched
confirmed
rejected
duplicate
failed
```

Rules:

* Money goes to the official Buzz Duka Till/M-Pesa.
* Buzz Duka only reconciles the payment.
* Payment reference alone must not activate subscription.
* Correct Till number must be verified.
* Correct amount must be verified.
* Duplicate transaction must not activate subscription twice.
* Wrong amount must not activate automatically.
* Till number must come from configuration.
* Do not hardcode a fake Till number.

Constraints:

```txt id="f6r2sl"
UNIQUE(transaction_id)
UNIQUE(payment_reference)
```

If the provider does not supply both values, use the strongest available unique transaction identifier.

---

# 29. Offline License State Table

Table name:

```txt id="wjfv8f"
offline_license_state
```

Purpose:

Allows temporary offline use after online subscription verification.

Fields:

```txt id="q0vr4i"
id TEXT PRIMARY KEY
business_id TEXT NOT NULL
device_id TEXT NOT NULL
subscription_status TEXT NOT NULL
subscription_end_at TEXT NOT NULL
grace_until TEXT NOT NULL
last_verified_at TEXT NOT NULL
offline_license_valid_until TEXT NOT NULL
license_signature TEXT NOT NULL
plan_name TEXT NOT NULL
plan_price_cents INTEGER NOT NULL
max_active_devices INTEGER NOT NULL DEFAULT 2
max_sales_enabled_devices INTEGER NOT NULL DEFAULT 1
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

Rules:

```txt id="j6a2wg"
offline_license_valid_until = earlier of:
last_verified_at + 7 days
grace_until
```

Offline license must not allow unlimited expired use.

---

# 30. Admin Users Table

Cloud only.

Table name:

```txt id="b8sthp"
admin_users
```

Fields:

```txt id="cxiy6x"
id UUID PRIMARY KEY
full_name TEXT NOT NULL
email TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
role TEXT NOT NULL
status TEXT NOT NULL DEFAULT 'active'
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL
```

Rules:

* Admin users are separate from shop users.
* Shop Owner is not platform admin.
* Admin passwords must be hashed.

---

# 31. Admin Audit Logs Table

Cloud only.

Table name:

```txt id="5d9x7u"
admin_audit_logs
```

Fields:

```txt id="755vb2"
id UUID PRIMARY KEY
admin_user_id UUID NOT NULL
business_id UUID NULL
action_type TEXT NOT NULL
entity_type TEXT NULL
entity_id UUID NULL
description TEXT NOT NULL
metadata_json JSONB NULL
created_at TIMESTAMPTZ NOT NULL
```

Required for:

* Subscription manual correction
* Payment reconciliation correction
* Suspension/reactivation
* Device reset
* Payment dispute handling
* Support action

---

# 32. Required SQLite Indexes

Antigravity must add indexes for performance.

Recommended indexes:

```txt id="t5b5a7"
CREATE INDEX idx_products_business_active ON products(business_id, is_active);
CREATE INDEX idx_products_name ON products(product_name);
CREATE INDEX idx_sales_business_created ON sales(business_id, created_at);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id, created_at);
CREATE INDEX idx_debts_business_status ON debts(business_id, debt_status);
CREATE INDEX idx_expenses_business_date ON expenses(business_id, expense_date);
CREATE INDEX idx_activity_logs_business_date ON activity_logs(business_id, created_at);
CREATE INDEX idx_sync_queue_status ON sync_queue(sync_status, next_retry_at);
CREATE INDEX idx_devices_business_status ON devices(business_id, status);
CREATE INDEX idx_subscription_reconciliation_status ON subscription_payment_reconciliations(reconciliation_status, created_at);
```

Do not ignore indexes because product search, reports, and sync status must stay fast.

---

# 33. Required PostgreSQL Unique Constraints

Cloud database must prevent duplicates.

Required unique constraints:

```txt id="b98s9k"
UNIQUE(business_id, idempotency_key)
UNIQUE(business_id, sale_number)
UNIQUE(business_id, receipt_number)
UNIQUE(business_id, device_fingerprint)
UNIQUE(transaction_id)
UNIQUE(payment_reference)
```

For sync:

```txt id="flm8pj"
UNIQUE(business_id, record_type, idempotency_key)
```

For subscription reconciliation:

```txt id="5gj2pn"
UNIQUE(transaction_id)
```

Duplicate sync or duplicate payment reconciliation must return existing record, not create a duplicate.

---

# 34. Transaction Rules

Use database transactions for operations affecting many tables.

Required transactions:

```txt id="llk4h2"
Create product with initial stock
Stock-in
Complete sale
Debt sale
Debt payment
Expense record
Sale reversal
Subscription activation after confirmed reconciliation
Device enable/disable
```

Example sale transaction must include:

```txt id="51ag82"
Create sale
Create sale items
Reduce product stock
Create stock movements
Create receipt
Create debt if payment method is debt
Create activity log
Create sync queue item
```

Example subscription reconciliation transaction must include:

```txt id="fz6gz2"
Create/update payment reconciliation record
Verify duplicate transaction
Verify amount
Verify Till number
Create subscription record
Update subscription status
Refresh offline license data
Create activity log
Create admin/support audit log if manual correction
```

If one part fails, rollback the whole operation.

---

# 35. Data Accuracy Rules

The database must support these formulas.

## Stock value

```txt id="ivx6tp"
stock_value_cents = current_stock_quantity × average_unit_cost_cents
```

## Sale item revenue

```txt id="l4xp43"
line_revenue_cents = quantity_sold × unit_selling_price_at_sale_cents
```

## Sale item cost

```txt id="cqdymw"
line_cost_cents = quantity_sold × unit_cost_at_sale_cents
```

## Sale item profit

```txt id="8nuj3k"
line_profit_cents = line_revenue_cents - line_cost_cents
```

## Gross profit

```txt id="xplt5u"
gross_profit_cents = SUM(line_profit_cents)
```

## Net profit

```txt id="trfitm"
net_profit_cents = gross_profit_cents - expenses_cents
```

## Debt balance

```txt id="4lz7f5"
balance_cents = original_amount_cents - amount_paid_cents
```

These formulas create business reports only.

They do not mean Buzz Duka is holding money.

---

# 36. Moving Weighted Average Cost Formula

When stock is added:

```txt id="hmq2y4"
new_average_cost =
((old_quantity × old_average_cost) + (added_quantity × added_buying_price))
÷ (old_quantity + added_quantity)
```

Stored in cents with controlled rounding.

Required test:

```txt id="r6saa3"
Old quantity: 6
Old average cost: KSh 250
Added quantity: 10
Added buying price: KSh 300

Expected:
New quantity = 16
New stock value = KSh 4,500
New average cost = KSh 281.25
Stored average cost cents = 28125
```

---

# 37. Do Not Recalculate Old Sales Rule

Old sale reports must use:

```txt id="d2xae3"
sale_items.unit_cost_at_sale_cents
sale_items.unit_selling_price_at_sale_cents
sale_items.line_profit_cents
```

Do not use current product table price for old reports.

Wrong:

```txt id="7r994e"
Historical profit = current selling price - current average cost
```

Correct:

```txt id="kv7lpp"
Historical profit = SUM(sale_items.line_profit_cents)
```

---

# 38. Payment Method Recording Rule

For shop sales, Buzz Duka records the payment method only.

Approved payment methods:

```txt id="vn21jo"
cash
mpesa
bank
debt
```

Buzz Duka does not verify shop customer M-Pesa payments in the core POS.

Buzz Duka does not reconcile shop customer sales payments in MVP.

Owner compares Buzz Duka M-Pesa sales totals with external M-Pesa/Till/PayBill/Pochi records outside the app.

Do not add:

```txt id="8lc5y6"
M-Pesa code fields
M-Pesa verification fields
Daraja shop payment fields
STK push fields
Customer payment reconciliation fields
```

Only Buzz Duka subscription payment uses reconciliation.

---

# 39. Subscription Payment Reconciliation Rule

Subscription payment reconciliation is different from shop sale payment recording.

For subscription:

```txt id="w4ivwp"
Shop Owner pays KSh 1,500 to official Buzz Duka Till.
Money goes directly to Buzz Duka owner's M-Pesa.
Backend checks/reconciles the transaction.
Subscription activates only after valid reconciliation.
```

Buzz Duka may store:

```txt id="3r701z"
amount expected
amount paid
Till number
transaction ID
payment reference
reconciliation status
subscription dates
```

Buzz Duka must not claim to store or hold the actual money.

---

# 40. Soft Delete Rule

Do not hard delete important records.

Use status fields:

```txt id="1pt00z"
products.is_active = 0
sales.sale_status = reversed/voided
expenses.expense_status = voided
users.status = blocked/removed
devices.status = blocked/removed
debts.debt_status = reversed/cancelled
```

Hard delete is dangerous for business history.

---

# 41. Migration Rules

Every schema change must be a migration.

Migration file must include:

```txt id="tuae7s"
Migration name
Tables created
Columns added
Indexes added
Default values
Backfill if needed
Rollback note
```

Do not manually change database without migration.

---

# 42. Seed Data Rule

Development seed data may be used only in development.

Production must not include fake:

* Products
* Sales
* Profit
* Debts
* Expenses
* Subscription records
* Payment reconciliations
* Admin metrics

If seed data exists, it must be clearly marked as development-only.

---

# 43. Prisma Implementation Direction

Cloud Prisma models should follow the same structure.

Example direction:

```txt id="vzj6e5"
model Business {
  id            String   @id @default(uuid())
  businessName  String
  status        String   @default("active")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  users         User[]
  devices       Device[]
  products      Product[]
  sales         Sale[]
  expenses      Expense[]
}
```

Important:

* Use `@map` if database names are snake_case.
* Use relations carefully.
* Use indexes for business/date queries.
* Use unique idempotency constraints.
* Use unique transaction ID constraints for subscription reconciliation.

---

# 44. Minimum Prisma Models Required

Backend Prisma schema must include at least:

```txt id="a8p0cq"
Business
User
Device
Category
Product
StockMovement
PriceHistory
Sale
SaleItem
Receipt
Customer
Debt
DebtPayment
Expense
SaleReversal
ActivityLog
SubscriptionRecord
SubscriptionPaymentReconciliation
AdminUser
AdminAuditLog
```

Sync queue may remain local-first, but backend must support synced record metadata and idempotency.

---

# 45. Local SQLite Creation Order

Tables should be created in safe order:

```txt id="3wfw6l"
1. businesses
2. users
3. devices
4. categories
5. products
6. stock_movements
7. price_history
8. customers
9. sales
10. sale_items
11. receipts
12. debts
13. debt_payments
14. expenses
15. sale_reversals
16. activity_logs
17. sync_queue
18. subscription_records
19. subscription_payment_reconciliations
20. offline_license_state
```

This avoids relationship problems.

---

# 46. Required Manual Database Verification

Antigravity must run this test:

```txt id="mxjml9"
1. Create business.
2. Create Owner user.
3. Create product Lotion with stock 10, buying price KSh 250, selling price KSh 400.
4. Confirm product exists in products table.
5. Confirm stock movement exists.
6. Sell 4 units.
7. Confirm sale exists.
8. Confirm sale_items exist.
9. Confirm product stock is now 6.
10. Confirm receipt exists.
11. Confirm activity log exists.
12. Confirm sync_queue has pending records.
13. Restart app.
14. Confirm all records still exist.
```

If data disappears after restart, database is not complete.

---

# 47. Required Data Accuracy Verification

Run this exact test:

```txt id="82aq98"
1. Product Lotion:
   Stock = 10
   Buying price = KSh 250
   Selling price = KSh 400

2. Sell 4 units using M-Pesa.

Expected:
Stock = 6
Revenue record = KSh 1,600
Cost record = KSh 1,000
Profit record = KSh 600

3. Add 10 units at KSh 300.

Expected:
Stock = 16
Stock value record = KSh 4,500
Average cost = KSh 281.25

4. Change selling price to KSh 450.
5. Sell 2 units using Cash.

Expected:
Revenue record = KSh 900
Cost record = KSh 562.50
Profit record = KSh 337.50

6. Confirm old M-Pesa sale still used KSh 400.
```

These are records for reporting. They are not money held by Buzz Duka.

---

# 48. Required Subscription Reconciliation Verification

Run this test:

```txt id="pxvm7v"
1. Configure official Buzz Duka Till number.
2. Create expired business subscription.
3. Create reconciliation check for KSh 1,500 payment.
4. Confirm Till number matches configured Till.
5. Confirm transaction ID is unique.
6. Confirm amount is KSh 1,500.
7. Mark reconciliation as confirmed.
8. Confirm subscription becomes active/reactivated.
9. Confirm subscription_end_at is set correctly.
10. Confirm offline license refreshes.
11. Try same transaction again.
12. Confirm subscription is not activated twice.
13. Try wrong amount.
14. Confirm subscription does not activate automatically.
```

---

# 49. Required Database Tests

Antigravity must test:

```txt id="almpyx"
Tables are created
Indexes are created
Product persists after restart
Stock movement persists after restart
Sale persists after restart
Sale items persist after restart
Receipt persists after restart
Debt persists after restart
Expense persists after restart
Sync queue persists after restart
Amount values stored as integer cents
Sale item snapshots do not change after product edit
Business ID exists on business-owned records
Sales user cannot query owner-only records through app logic
Duplicate idempotency key is rejected or handled safely
Duplicate subscription transaction is rejected or handled safely
Subscription reconciliation does not activate from fake reference only
```

---

# 50. What Antigravity Must Not Do

Antigravity must not:

* Say Buzz Duka stores actual money
* Say Buzz Duka holds funds
* Build wallet logic
* Build escrow logic
* Store money as floating-point values
* Store sales only in React state
* Use fake local arrays as database
* Recalculate old sale profit from current product price
* Change sale item snapshots after sale
* Hard delete sales
* Hard delete debt records
* Hard delete expenses casually
* Skip business_id
* Skip sync metadata
* Skip idempotency keys
* Fake subscription payment reconciliation
* Hardcode fake Till number
* Activate subscription from user-entered reference alone
* Mark sync complete without backend confirmation

---

# 51. Antigravity Completion Report

After implementing database, Antigravity must report:

```txt id="5jwld5"
Module name:
Database used:
Tables created:
Indexes created:
Migrations created:
Amount value storage method:
Quantity storage method:
Sync metadata added:
Idempotency keys added:
Business ID isolation added:
Subscription reconciliation table added:
Duplicate payment prevention added:
Tests added:
Manual verification completed:
Data accuracy test result:
Subscription reconciliation test result:
Known limitations:
No fake data confirmation:
No money-holding logic confirmation:
```

---

# 52. Final Rule

Buzz Duka’s database is the foundation of trust.

If the database is wrong, everything becomes wrong:

```txt id="p5ydo6"
Stock becomes wrong.
Profit reports become wrong.
Debt records become wrong.
Expense records become wrong.
Sales history becomes wrong.
Sync becomes wrong.
Subscription reconciliation becomes wrong.
```

Therefore, the database must store real records, preserve historical sale snapshots, protect business data, support offline use, prevent duplicate sync, and reconcile subscription payments safely.

Buzz Duka does not hold money.

Buzz Duka records business activity and reconciles subscription payments made to the official Till number.

Do not build beautiful screens on a weak database.
