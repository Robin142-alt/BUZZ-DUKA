# DOCUMENT 18: UI DESIGN SYSTEM MASTER DOCUMENT

## Buzz Duka — Visual Style, Components, Layout, Mobile UX & Screen Consistency

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** UI design system document
**Purpose:** Define the visual design rules, component styles, spacing, layout, states, and mobile-first interface standards for Buzz Duka.
**Core Rule:** Buzz Duka must look clean, simple, trustworthy, and fast for real shopkeepers.

---

# 1. Purpose of This Document

This document defines how Buzz Duka should look and feel.

Antigravity must use this document when building:

* Buttons
* Cards
* Forms
* Inputs
* Dashboards
* Navigation
* Product lists
* Cart screen
* Receipts
* Debt screens
* Expense screens
* Reports
* Empty states
* Loading states
* Error states
* Offline/sync banners
* Subscription screens
* Admin dashboard basics

The app must not look random from screen to screen.

---

# 2. Design Principle

Buzz Duka should feel like:

```txt id="nkqf8s"
Simple
Fast
Clean
Clear
Trustworthy
Mobile-first
Shopkeeper-friendly
```

Buzz Duka should not feel like:

```txt id="vp7q0q"
Complicated accounting software
A fake SaaS dashboard
A crowded admin panel
A confusing enterprise ERP
A design experiment
```

The seller should understand the screen quickly.

---

# 3. Brand Feel

Buzz Duka brand should feel:

```txt id="ashmte"
Practical
Local
Modern
Reliable
Business-focused
Friendly
```

The app should help the user feel:

```txt id="xomgxz"
I can sell fast.
I know my stock.
I understand my profit.
My data is safe.
```

---

# 4. Color System

Use a simple color system.

Recommended base colors:

```txt id="u5igvv"
Primary: Deep green
Secondary: Warm yellow/gold
Background: Light neutral
Surface/card: White
Text primary: Dark charcoal
Text secondary: Muted gray
Success: Green
Warning: Orange/yellow
Danger: Red
Info: Blue
```

Exact color values can be adjusted later, but Antigravity must keep usage consistent.

Suggested values:

```txt id="xdr9fa"
Primary green: #0F7A3B
Primary dark: #075C2B
Accent gold: #F4B400
Background: #F7F8FA
Card surface: #FFFFFF
Text primary: #1F2933
Text secondary: #6B7280
Border: #E5E7EB
Success: #16A34A
Warning: #F59E0B
Danger: #DC2626
Info: #2563EB
```

Do not use many random colors.

---

# 5. Color Usage Rules

Use colors with meaning.

```txt id="v8c6xd"
Green = success, active, allowed, completed
Gold/orange = warning, grace period, low stock
Red = danger, blocked, expired, reversed, error
Blue = information, sync, link, neutral action
Gray = disabled, secondary text, inactive
```

Examples:

* Active subscription: green
* Grace subscription: orange
* Expired subscription: red
* Low stock: orange
* Out of stock: red
* Synced: green
* Pending sync: blue/orange
* Failed sync: red

---

# 6. Typography Rules

Use readable text sizes.

Recommended mobile sizes:

```txt id="0gitm7"
Screen title: 22–26px
Section title: 18–20px
Card title: 16–18px
Body text: 14–16px
Secondary text: 12–14px
Button text: 15–16px
Small labels: 12px minimum
```

Rules:

* Do not use tiny text on checkout.
* Important totals must be large.
* Button labels must be clear.
* Avoid long technical labels.

---

# 7. Spacing Rules

Use consistent spacing.

Recommended spacing scale:

```txt id="dlfv8k"
4px
8px
12px
16px
20px
24px
32px
```

Default screen padding:

```txt id="mz2rau"
16px
```

Card padding:

```txt id="hhdg3w"
12px to 16px
```

Button height:

```txt id="z3te3i"
48px minimum
```

Important tap targets:

```txt id="4mb8u0"
44px minimum
```

Do not make checkout buttons small.

---

# 8. Layout Principle

Buzz Duka is mobile-first.

Main layout rules:

* Keep important actions visible.
* Reduce scrolling on Sell screen.
* Make totals easy to see.
* Use cards for summaries.
* Use lists for products, sales, debts, expenses.
* Avoid too many columns on phone.
* Keep Owner dashboard scannable.
* Keep Sales dashboard focused.

---

# 9. Navigation Design

MVP navigation should use role-based tabs or drawer.

## Owner navigation

Owner should access:

```txt id="pnt6bj"
Dashboard
Sell
Products
Stock
Debts
Expenses
Reports
Activity
Subscription
Devices
Settings
```

## Sales navigation

Sales user should access:

```txt id="4ku41s"
Sell
Recent Sales
Basic Stock
Sync Status
Settings
```

Sales user must not see hidden Owner-only navigation items.

---

# 10. Button System

Use clear button types.

## Primary button

Used for main action.

Examples:

```txt id="5w7lqb"
Complete Sale
Save Product
Add Stock
Record Payment
Renew Subscription
```

Style:

```txt id="3ngy43"
Filled primary green
White text
Rounded corners
Height 48px minimum
```

## Secondary button

Used for less important action.

Examples:

```txt id="hizdfv"
View Receipt
Cancel
Back
```

Style:

```txt id="9od8w7"
White or light background
Border
Dark text
```

## Danger button

Used for destructive or risky actions.

Examples:

```txt id="l0h338"
Reverse Sale
Block Device
Void Expense
```

Style:

```txt id="lfitjh"
Red background or red border
Clear warning text
Confirmation required
```

---

# 11. Button Rules

Buttons must:

* Have clear labels
* Show loading state when saving
* Be disabled when action is not allowed
* Show reason when disabled if needed
* Not do nothing
* Not fake success

Wrong:

```txt id="w5vd9w"
Button changes screen but does not save data.
```

Correct:

```txt id="6qg6jc"
Button calls real engine/API, saves data, then shows result.
```

---

# 12. Card System

Use cards for dashboard summaries and grouped information.

Card examples:

```txt id="ioy1ev"
Today’s Sales
Gross Profit
Net Profit
Expenses
Debt Total
Low Stock
Pending Sync
Subscription Status
```

Card rules:

* One main value per card
* Short label
* Optional small explanation
* Use color badges for status
* Do not crowd too much data

Example:

```txt id="tipac7"
Today’s Sales
KSh 4,500
12 sales
```

---

# 13. Form System

Forms must be short and clear.

Input fields should have:

```txt id="a2s70r"
Label
Placeholder
Validation message
Correct keyboard type
Required indicator where needed
```

Examples:

Product form:

```txt id="b7snyd"
Product name
Category
Initial stock
Buying price
Selling price
Low-stock level
```

Expense form:

```txt id="i0y9aq"
Amount
Category
Date
Description optional
```

Rules:

* Money fields use numeric keyboard.
* Quantity fields use numeric keyboard.
* Required fields show clear errors.
* Do not overload users with too many fields.

---

# 14. Input Validation Design

Validation messages should appear near the field.

Good messages:

```txt id="fjczy4"
Product name is required.
Selling price is required.
Stock cannot be negative.
Choose a payment method.
Buying price is required when adding stock.
```

Bad messages:

```txt id="jmn1am"
Invalid input.
Error.
Something went wrong.
```

---

# 15. Status Badge System

Use badges for statuses.

Examples:

```txt id="3w4mvv"
Active
Grace
Expired
Suspended
Synced
Pending
Failed
Low Stock
Out of Stock
Completed
Reversed
Paid
Partial
Unpaid
```

Badge colors:

```txt id="qsm6fq"
Active / Paid / Synced / Completed = green
Grace / Pending / Low Stock / Partial = orange or blue
Expired / Suspended / Failed / Out of Stock / Reversed = red
Inactive / Removed = gray
```

---

# 16. Sell Screen Design

The Sell screen is the most important UI.

It should prioritize:

```txt id="byv28q"
Search product
Add to cart
Change quantity
Choose payment method
Complete sale
Start next customer
```

Recommended layout:

```txt id="rkpoou"
Top: Search bar
Middle: Product results / quick products
Bottom: Cart summary and Complete Sale button
```

Cart summary should stay easy to access.

Complete Sale button should be obvious.

Do not bury payment method selection.

---

# 17. Product List Item Design

Product item should show:

For Sales user:

```txt id="0a11e9"
Product name
Selling price
Available stock
Add button
```

For Owner:

```txt id="m83xpc"
Product name
Selling price
Stock quantity
Low-stock badge
Optional cost/profit info
```

Do not show buying cost to Sales user.

---

# 18. Cart Item Design

Cart item should show:

```txt id="gpsxbk"
Product name
Quantity
Unit price
Line total
Minus button
Plus button
Remove button
```

Cart total should be large and clear.

Example:

```txt id="dza0xp"
Total: KSh 1,600
```

---

# 19. Payment Method Design

Payment methods should be large buttons:

```txt id="ki79dx"
Cash
M-Pesa
Bank
Debt
```

Selected method should be visually clear.

Do not add M-Pesa code entry.

Do not add payment verification to shop sale checkout.

Buzz Duka records method only for shop sales.

---

# 20. Success Message Design

After sale:

```txt id="5y5cxv"
Sale completed.
```

If offline:

```txt id="x09d66"
Sale saved on this phone. It will sync when internet returns.
```

Actions after sale:

```txt id="hs1jcu"
View Receipt
New Sale
```

New Sale should be quick.

---

# 21. Receipt Design

Receipt must be simple and customer-safe.

Receipt should show:

```txt id="mfn5ks"
Business name
Receipt number
Date/time
Sold by
Items
Quantity
Unit price
Line total
Total
Payment method
Status
```

Receipt must not show:

```txt id="yljm3b"
Buying price
Average cost
Profit
Margin
Owner analytics
```

If reversed:

```txt id="89tbs9"
This receipt was reversed.
```

---

# 22. Dashboard Design

Owner dashboard should use clean cards and sections.

Top cards:

```txt id="4wa5qe"
Today’s Sales
Gross Profit
Net Profit
Expenses
Debt Total
Pending Sync
```

Secondary sections:

```txt id="x1jjjf"
Low Stock
Best Sellers
Loss-Making Products
Recent Activity
Subscription Status
```

Rules:

* No fake numbers.
* Use empty states.
* Use date filters.
* Do not overload dashboard.

---

# 23. Sales Dashboard Design

Sales dashboard should be simple.

Show:

```txt id="5rd9fs"
Big Sell button
Recent sales
Basic stock warning
Sync status
```

Do not show:

```txt id="6xserk"
Gross profit
Net profit
Expenses
Stock value
Buying cost
Owner reports
```

---

# 24. Empty State Design

Empty states must guide the user.

Examples:

```txt id="4ww66m"
No products yet. Add your first product to start selling.
```

```txt id="5bssj5"
No sales today.
```

```txt id="vfrpyr"
No debts yet.
```

```txt id="se7pj7"
No expenses recorded this month.
```

Use one clear call-to-action where appropriate.

---

# 25. Loading State Design

Use visible loading states.

Examples:

```txt id="vd1u8r"
Loading products...
Saving sale...
Checking subscription...
Syncing records...
```

Do not show blank screens without explanation.

---

# 26. Error State Design

Error states should explain what happened.

Examples:

```txt id="6kgmob"
Stock is not enough for this sale.
```

```txt id="f7bp2p"
This device is not allowed to make sales.
```

```txt id="nvdrtg"
Your subscription has ended. Renew to continue selling.
```

```txt id="x6gybk"
Payment not confirmed yet. Tap Refresh after paying.
```

Avoid vague errors.

---

# 27. Offline and Sync Banner Design

Use a small but clear banner.

Offline valid:

```txt id="h4hco7"
You are offline. Sales will be saved on this phone.
```

Pending sync:

```txt id="6mz4bp"
3 records waiting to sync.
```

Failed sync:

```txt id="8pu9s5"
Sync failed. Tap to retry.
```

All synced:

```txt id="h2l3bq"
All records synced.
```

Never show “All synced” unless backend confirmed.

---

# 28. Subscription Screen Design

Show:

```txt id="2upvcu"
Plan name
Price: KSh 1,500/month
Status
Expiry date
Grace date
Official Till number
Payment instructions
Payment/reconciliation status
Refresh payment button
```

Messages:

```txt id="n8zcbo"
Pay KSh 1,500 to the Buzz Duka Till number.
```

```txt id="g8akqm"
Payment confirmed. Subscription activated.
```

```txt id="7dl2so"
Payment not confirmed yet. Tap Refresh after paying.
```

Important:

```txt id="r6hl7w"
Buzz Duka does not hold money. Payment goes directly to the official Till.
```

---

# 29. Device Screen Design

Device list should show:

```txt id="v2ehg4"
Device name
Status
Sales enabled Yes/No
Last seen
Actions
```

Actions:

```txt id="hl99a7"
Enable Sales
Block
Remove
Transfer
```

If sales device limit reached:

```txt id="v03oc6"
Only one sales-enabled device is allowed on this plan.
```

---

# 30. Reversal UI Design

Reversal must feel serious.

Before reversing, show:

```txt id="zrvuic"
Reverse this sale?

This will restore stock, update reports, and mark the receipt as reversed.
The original sale will remain in history.
```

Require:

```txt id="y6qe5k"
Reason
Confirmation tap
```

Danger button:

```txt id="2wpjuc"
Reverse Sale
```

Sales user must not see reversal action.

---

# 31. Mobile Responsiveness Rules

Buzz Duka must work well on small phones.

Rules:

* Avoid horizontal scrolling.
* Use single-column forms.
* Keep key checkout actions near bottom.
* Use sticky bottom cart summary if needed.
* Keep product search fast.
* Avoid overcrowded dashboards.
* Make tap targets large.

---

# 32. Admin Dashboard Design

Admin dashboard can be web-first.

Admin design should be simple and operational.

Screens:

```txt id="k7cm5u"
Admin login
Business list
Business detail
Subscription reconciliations
Devices
Sync issues
Admin audit logs
```

Admin dashboard must not show fake shop counts or fake revenue.

---

# 33. Component List

Antigravity should create reusable components:

```txt id="yf5o6b"
AppButton
AppInput
AppCard
StatusBadge
MoneyText
QuantityText
ScreenHeader
EmptyState
LoadingState
ErrorBanner
OfflineBanner
SyncStatusBadge
ProductListItem
CartItem
DashboardCard
PaymentMethodButton
ReceiptView
PermissionGate
ConfirmationDialog
```

Do not duplicate styles randomly.

---

# 34. Money Display Component

Use one component for amount display.

Name:

```txt id="0dgmff"
MoneyText
```

Rules:

* Accept amount in cents.
* Display as KSh.
* Format consistently.
* Never imply Buzz Duka holds money.
* Use for sales, expenses, debts, reports, subscription amount records.

Example:

```txt id="8hrug1"
KSh 1,500
KSh 281.25
```

---

# 35. Permission Gate Component

Use a central component/helper to hide or block restricted UI.

Name:

```txt id="yhayiw"
PermissionGate
```

Rules:

* Hide Owner-only actions from Sales.
* Block direct route access.
* Show friendly access denied message.
* Do not rely only on hidden buttons.
* Engine/backend must still enforce permissions.

---

# 36. Confirmation Dialog Rules

Use confirmation for risky actions:

```txt id="pa9h2y"
Reverse sale
Block device
Remove device
Void expense
Deactivate product
Suspend business
Manual subscription correction
```

Confirmation should include:

```txt id="lfuyec"
Action name
What will happen
Cancel button
Confirm button
```

Danger actions must not happen from one accidental tap.

---

# 37. Design System Tests

Antigravity must test:

```txt id="9sjelv"
Buttons trigger real actions
Disabled buttons do not perform action
Forms show validation errors
Sales user cannot see Owner-only UI
Sales user cannot access Owner-only route
Receipt does not show cost/profit
Offline banner appears when offline
Sync banner shows real pending count
Subscription screen shows configured Till number
Dashboard shows empty states when no data exists
Reversal requires confirmation
```

---

# 38. What Antigravity Must Not Do

Antigravity must not:

* Use random inconsistent colors
* Use tiny checkout buttons
* Hide important sale actions
* Show fake dashboard data
* Show fake sync status
* Show fake subscription active status
* Show Owner profit to Sales user
* Add M-Pesa code field for shop sales
* Make checkout visually complicated
* Build beautiful screens that do not save data
* Hardcode fake Till number
* Suggest Buzz Duka holds money

---

# 39. Antigravity Completion Report

After applying UI design system, Antigravity must report:

```txt id="90rm7n"
Design system module:
Components created:
Colors defined:
Typography defined:
Spacing rules added:
Buttons created:
Cards created:
Form components created:
Status badges created:
Offline/sync UI created:
Permission UI added:
Screens updated:
Tests added:
Known limitations:
No fake UI/data confirmation:
```

---

# 40. Final Rule

Buzz Duka must be simple enough for a shopkeeper to use quickly.

The design must support:

```txt id="4bfkpn"
Fast selling
Clear stock
Clear profit for Owner
Simple debt tracking
Simple expense recording
Offline confidence
Subscription clarity
Role privacy
```

A clean, working interface is better than a beautiful but confusing one.

Buzz Duka UI must be practical, consistent, and trustworthy.
