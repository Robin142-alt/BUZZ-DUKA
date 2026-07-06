# DOCUMENT 9: UI/UX & USER FLOW MASTER DOCUMENT

## Buzz Duka — Screens, Navigation, Checkout UX, Dashboards & User Experience

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** UI/UX and user flow master document
**Purpose:** Define how Buzz Duka should look, feel, navigate, and behave for Owner and Sales users.
**Core Rule:** Buzz Duka must be simple, fast, clear, mobile-first, and easy for real shopkeepers to use.

---

# 1. Purpose of This Document

This document defines the user experience for Buzz Duka.

Antigravity must use this document when building:

* App navigation
* Login flow
* Business setup flow
* Owner dashboard
* Sales dashboard
* Fast selling screen
* Product setup screens
* Stock-in screens
* Debt screens
* Expense screens
* Receipt screens
* Subscription screens
* Device screens
* Empty states
* Error messages
* Offline/sync messages

Buzz Duka should not feel like complicated accounting software.

It should feel like a simple shop assistant.

---

# 2. Main UX Principle

Buzz Duka must be designed for busy shop environments.

The app should be usable when:

* A customer is waiting
* The shop is crowded
* Internet is poor
* The seller is in a hurry
* The user is not technical
* The phone screen is small
* The owner needs quick answers

Main UX rule:

```txt id="cj29rx"
Selling must be fast. Management must be clear. Reports must be simple.
```

---

# 3. Target Device Experience

Buzz Duka is Android-first and mobile-first.

The app must work well on normal Android phones.

UI must use:

* Large buttons
* Clear text
* Simple icons
* Fast search
* Short forms
* Clear totals
* Minimal typing during checkout
* Simple error messages
* Offline confidence messages

Do not design the first version as a desktop-first system.

---

# 4. App Tone and Language

Buzz Duka should use simple shopkeeper language.

Use:

```txt id="yc2m34"
This item is almost finished.
```

Instead of:

```txt id="z7mie6"
Inventory threshold reached.
```

Use:

```txt id="bpuqoo"
This product gives low profit.
```

Instead of:

```txt id="m5k6to"
Gross margin is below benchmark.
```

Use:

```txt id="hpdsm9"
Sale saved on this phone. It will sync when internet returns.
```

Instead of:

```txt id="xwvgyo"
Offline transaction queued for synchronization.
```

The user should understand the app without training.

---

# 5. Main Navigation Structure

Buzz Duka should have role-based navigation.

## Owner navigation

Owner may access:

```txt id="yegxpd"
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

Sales user may access:

```txt id="158a92"
Sell
Recent Sales
Basic Stock
Sync Status
Receipt
```

Sales user must not see Owner-only areas such as expenses, profit reports, subscription management, device settings, or business settings.

---

# 6. First-Time Owner Flow

When Owner opens Buzz Duka for the first time:

```txt id="3kvyqd"
Open app
Create account / login
Create business
Set business name
Confirm device
Create first product
Add stock
Start selling
```

The setup flow should be short.

Do not force the owner to configure complicated accounting settings before using the app.

---

# 7. Business Setup Screen

Business setup should ask for only essential information.

Required:

```txt id="8em3se"
Business name
Owner name
Phone/email login details depending on auth method
Password
```

Optional:

```txt id="czpacf"
Location
Business category
```

After business setup, the app should guide the Owner to add the first product.

---

# 8. Login Screen

Login screen should be simple.

Fields:

```txt id="42m0q0"
Phone or email
Password
```

Actions:

```txt id="gexggs"
Login
Create account
Forgot password later
```

Login must not be fake.

After login, app must load:

* User role
* Business ID
* Device status
* Subscription/license status
* Permissions

---

# 9. Owner Dashboard UX

Owner dashboard should give quick business visibility.

It should show real data only.

Recommended cards:

```txt id="361796"
Today’s sales
Gross profit
Net profit
Expenses
Debt total
Cash total
M-Pesa total
Bank total
Low stock
Pending sync
Subscription status
```

Recommended sections:

```txt id="xt5aql"
Best-selling products
Low-margin products
Loss-making products
Restock suggestions
Price review alerts
Recent activity
```

If no data exists, show empty states.

Do not use fake dashboard numbers.

---

# 10. Owner Dashboard Rules

Owner dashboard must:

* Use real analytics engine data
* Respect selected date range
* Load quickly
* Show simple explanations
* Show empty states when no data exists
* Show pending sync clearly
* Show subscription warning if needed

Owner dashboard must not:

* Use hardcoded values
* Show fake charts
* Slow checkout
* Confuse user with accounting terms
* Expose data across businesses

---

# 11. Sales Dashboard UX

Sales dashboard should be focused on selling.

Recommended items:

```txt id="gw8jri"
Big Sell button
Product search shortcut
Recent sales
Basic stock availability
Pending sync count
Subscription warning if selling is affected
```

Sales dashboard should not show:

* Gross profit
* Net profit
* Expense totals
* Product cost
* Stock value
* Owner reports
* Subscription management
* Device management

Sales user experience should be simple and limited.

---

# 12. Fast Selling Screen UX

The Fast Selling screen is the most important screen.

It must support the approved flow:

```txt id="s4ev6g"
Select product → Add to cart → Choose payment method → Complete sale → Next customer
```

The screen should include:

* Product search bar
* Product list
* Quick/frequent products if available
* Cart summary
* Quantity controls
* Payment method buttons
* Complete sale button
* Optional receipt button after sale

The user should not need to open many pages to complete one sale.

---

# 13. Product Search UX

Product search must be fast.

Search should allow:

* Typing product name
* Searching by category
* Searching SKU/barcode later if available
* Showing active products only by default

Product list item should show Sales user:

```txt id="d032qw"
Product name
Selling price
Available stock
```

Owner may see extra information:

```txt id="0zlur7"
Average cost
Expected profit
Low stock warning
```

Sales user should not see cost/profit by default.

---

# 14. Cart UX

Cart should be simple.

Each cart item should show:

```txt id="hp49wv"
Product name
Quantity
Unit selling price
Line total
Remove button
Quantity + and - buttons
```

Cart summary should show:

```txt id="8gfvt9"
Total amount
Selected payment method
Complete sale button
```

Do not show cost/profit in Sales user cart.

---

# 15. Payment Method UX

Payment method buttons should be large and clear.

Allowed methods:

```txt id="kbg6bh"
Cash
M-Pesa
Bank
Debt
```

Do not ask for:

* M-Pesa code
* M-Pesa confirmation
* Till number
* PayBill number
* Daraja setup
* STK push details

Buzz Duka records payment method only.

---

# 16. Complete Sale UX

When sale is completed successfully:

Show simple success message:

```txt id="2ap4al"
Sale completed.
```

If offline:

```txt id="4rc1g7"
Sale saved on this phone. It will sync when internet returns.
```

After sale completion:

* Clear cart
* Update stock
* Create receipt in background
* Show optional receipt button
* Return user to next sale quickly

Do not force receipt sharing.

Do not wait for cloud sync.

---

# 17. Debt Sale UX

When payment method is Debt, ask for customer details.

Required:

```txt id="ma1oc5"
Customer name
```

Optional:

```txt id="nrwfp8"
Phone number
Due date
Short note
```

Debt sale must still be fast.

Do not add long customer profile forms in checkout.

After debt sale:

```txt id="wft5tq"
Debt sale saved.
Customer balance created.
```

---

# 18. Receipt UX

Receipt should be optional after sale.

Receipt screen should show:

```txt id="7g6wji"
Business name
Receipt number
Date/time
Sold by
Product names
Quantities
Unit prices
Line totals
Total amount
Payment method
Customer name if debt sale
```

Receipt must not show:

* Product cost
* Profit
* Owner analytics

Receipt sharing may be added if simple, but it must not block checkout.

---

# 19. Product Management UX

Product management is mainly for Owner.

Product list should show:

```txt id="4voyk0"
Product name
Category
Selling price
Stock quantity
Low-stock status
Active/inactive status
```

Owner product detail may show:

```txt id="cixssh"
Current selling price
Default buying price
Average unit cost
Current expected profit
Stock value
Price history
Stock movement history
```

Sales user should not see cost/profit fields by default.

---

# 20. Add Product UX

Add product form should be short.

Required fields:

```txt id="k3oxbr"
Product name
Selling price
Initial stock quantity
Buying price if initial stock is greater than zero
```

Recommended fields:

```txt id="crbqkg"
Category
Low-stock level
Default buying price
```

Optional later:

```txt id="7y9eiz"
SKU
Barcode
Description
```

If initial stock is greater than zero, buying price is required so stock value and average cost are accurate.

---

# 21. Stock-In UX

Stock-in screen should be simple.

Fields:

```txt id="3n79ie"
Product
Quantity added
Buying price per unit
Optional note
```

Show calculated preview:

```txt id="wc0sdj"
New stock quantity
New stock value
New average unit cost
```

Example preview:

```txt id="2q58g1"
New average cost will be KSh 281.25.
```

This helps Owner understand cost changes.

---

# 22. Selling Price Change UX

Owner should be able to change selling price easily.

Fields:

```txt id="a87nvc"
Current selling price
New selling price
Optional reason
```

After change, show:

```txt id="nu3ars"
Selling price updated. New sales will use the new price.
```

Important reminder:

```txt id="ev2kh3"
Old sales will not change.
```

This protects user trust.

---

# 23. Debt Management UX

Debt screen should show:

```txt id="4x1152"
Customer name
Original debt
Amount paid
Balance
Status
Due date if available
```

Debt detail should show:

```txt id="5nexj7"
Sale items
Debt history
Payments received
Remaining balance
Record payment button
```

Debt payment form:

```txt id="tgx0v4"
Amount paid
Payment method: Cash, M-Pesa, Bank
Optional note
```

Do not allow payment greater than balance unless overpayment is approved later.

---

# 24. Expense UX

Expense management is Owner-only by default.

Expense form should include:

```txt id="8w6eep"
Amount
Category
Date
Optional description
```

Default categories:

```txt id="qtr8p7"
Rent
Salary
Transport
Electricity
Water
Internet
Airtime
Packaging
Repairs
County charges
Other
```

Expense list should show:

```txt id="pesyjw"
Date
Category
Amount
Description
```

Expense screen should explain:

```txt id="vp0c3p"
Expenses reduce net profit.
```

---

# 25. Reports UX

Reports should be simple.

Recommended date filters:

```txt id="4ehin5"
Today
Yesterday
This week
This month
Custom later
```

Reports should include:

* Sales report
* Profit report
* Product report
* Debt report
* Expense report
* Payment method report
* Stock report

Reports must use real records.

---

# 26. Activity History UX

Activity history helps Owner see what happened.

Show:

```txt id="gsn870"
Action
User
Device
Time
Short description
```

Examples:

```txt id="sbsgf1"
Sales user completed sale of KSh 1,600.
Owner added 10 Lotion at KSh 300 each.
Owner changed Lotion selling price from KSh 400 to KSh 450.
Debt payment received from Mary: KSh 500.
```

Do not show fake activity logs.

---

# 27. Device Management UX

Device management is Owner-only.

Device screen should show:

```txt id="rx1sqv"
Device name
User
Status
Sales-enabled Yes/No
Last seen
Action buttons
```

Actions:

```txt id="o30qda"
Approve device
Block device
Remove device
Enable sales
Disable sales
Transfer device
```

If trying to enable second sales device, show:

```txt id="52hg69"
Only one sales-enabled device is allowed on this plan.
```

---

# 28. Subscription UX

Subscription screen should be simple.

Show:

```txt id="rn299s"
Current plan
Monthly amount
Status
Expiry date
Grace period if active
Renew/reactivate action
```

Main plan:

```txt id="6sk8n9"
Buzz Duka Smart Plan — KSh 1,500/month
```

Messages:

```txt id="v1d6w4"
Subscription active.
```

```txt id="vmb779"
Your subscription is in grace period. Renew soon.
```

```txt id="x8u0e0"
Your subscription has ended. Pay KSh 1,500 to continue using Buzz Duka.
```

Do not fake subscription status.

---

# 29. Offline UX

Buzz Duka should give confidence when offline.

Offline banner examples:

```txt id="693eq8"
You are offline. Sales will be saved on this phone.
```

```txt id="qez4sk"
5 records waiting to sync.
```

```txt id="k620th"
Sync failed. Tap to retry.
```

Do not scare the user if offline saving is working.

Do not block checkout because of internet.

---

# 30. Sync UX

Sync status must be real.

Show:

```txt id="0fffoa"
All records synced.
```

only when sync queue is clear and backend confirmed.

Show:

```txt id="4st1lc"
3 records waiting to sync.
```

when pending records exist.

Show:

```txt id="msbejx"
Some records could not sync. Tap to retry.
```

when failed records exist.

Do not show fake synced status.

---

# 31. Error Message UX

Error messages must be specific and helpful.

Good examples:

```txt id="rhn3ze"
Stock is not enough for this sale.
```

```txt id="h2cvr2"
Choose a payment method before completing the sale.
```

```txt id="qfl6y0"
Add at least one product before completing the sale.
```

```txt id="9hxcuq"
Only the Owner can record expenses.
```

```txt id="g5ohfw"
This device is not allowed to make sales.
```

```txt id="3v27mz"
Sale was saved on this phone but has not synced yet.
```

Avoid:

```txt id="b2y21k"
Something went wrong.
```

unless followed by a clear next step.

---

# 32. Empty State UX

Use empty states instead of fake data.

Examples:

```txt id="8xyu95"
No products yet. Add your first product to start selling.
```

```txt id="qu13k6"
No sales recorded today.
```

```txt id="9x1ylo"
No expenses recorded this month.
```

```txt id="8dx0ga"
No customer debts yet.
```

```txt id="i3e2mb"
No low-stock products right now.
```

Empty states should guide the user to the next action.

---

# 33. Loading State UX

Loading states should be clear.

Examples:

```txt id="vzu643"
Loading products...
```

```txt id="1f18sk"
Saving sale...
```

```txt id="4xkj40"
Checking subscription...
```

Do not leave users staring at blank screens.

If loading fails, show a useful error.

---

# 34. Form UX Rules

Forms should be short.

Use:

* Clear labels
* Required field markers
* Helpful validation
* Numeric keyboard for money/quantity
* Default values where safe
* Save button fixed near bottom if useful

Avoid:

* Too many fields
* Technical labels
* Long descriptions
* Hidden required fields
* Unclear errors

---

# 35. Money Display UX

Money should be shown clearly.

Examples:

```txt id="n60kb2"
KSh 400
KSh 281.25
KSh 1,600
```

Use consistent formatting.

Profit/loss should be clear.

Examples:

```txt id="8vzq1v"
Profit: KSh 600
Loss: KSh 50
```

Sales user should not see profit by default.

---

# 36. Stock Display UX

Stock should be easy to understand.

Examples:

```txt id="86x1dr"
In stock: 14
Low stock: 2 left
Out of stock
```

If stock is not enough during sale:

```txt id="1bmbyw"
Only 2 left in stock.
```

This is better than a generic error.

---

# 37. Role-Based UI Rule

The UI must change based on role.

Owner sees:

* Profit
* Expenses
* Analytics
* Device settings
* Subscription
* Business settings

Sales user sees:

* Sell screen
* Basic recent sales
* Basic stock
* Receipt
* Sync status

The app must not only hide buttons.
Actions must also be blocked by permission logic.

---

# 38. Screen List

Minimum first-version screens:

```txt id="q22p0j"
Splash/loading screen
Login screen
Business setup screen
Owner dashboard
Sales dashboard
Fast selling screen
Cart/checkout screen
Receipt screen
Product list screen
Add/edit product screen
Stock-in screen
Stock movement history screen
Debt list screen
Debt detail screen
Debt payment screen
Expense list screen
Add expense screen
Reports screen
Activity history screen
Device management screen
Subscription screen
Settings screen
Sync status screen
```

Do not build unnecessary screens before core functionality works.

---

# 39. Navigation Flow Summary

Owner flow:

```txt id="l4065d"
Login → Owner Dashboard → Products/Stock/Sell/Debts/Expenses/Reports/Devices/Subscription
```

Sales flow:

```txt id="3m2o9f"
Login → Sales Dashboard → Sell → Complete Sale → Next Customer
```

Debt sale flow:

```txt id="vv173d"
Sell → Select products → Choose Debt → Enter customer name → Complete sale → Debt record created
```

Expense flow:

```txt id="4fq243"
Owner Dashboard → Expenses → Add Expense → Save → Net profit updates
```

Stock-in flow:

```txt id="zhmqno"
Products/Stock → Select product → Add stock → Enter quantity and buying price → Save → Average cost updates
```

---

# 40. UX Performance Rules

The app must feel fast.

Rules:

* Product search should respond quickly.
* Checkout should not wait for cloud sync.
* Dashboard should not freeze.
* Heavy analytics should not run during sale completion.
* Offline state should not slow core actions.
* Navigation should feel smooth.

Fast selling matters more than fancy animations.

---

# 41. Accessibility and Readability Rules

Use:

* Readable font size
* Clear contrast
* Large tap targets
* Simple icons with text labels
* Clear button states
* Easy-to-read totals

Avoid small crowded text, especially on checkout.

The seller should be able to use the app quickly with one hand if possible.

---

# 42. What Antigravity Must Not Do

Antigravity must not:

* Build fake dashboards
* Add M-Pesa code entry
* Add payment verification
* Force receipt sharing
* Make checkout require internet
* Expose Owner profit to Sales user
* Use complicated accounting language
* Add many unnecessary screens
* Add multi-branch UI early
* Add supplier/customer loyalty UI early
* Build UI before real engines where logic is required
* Mark screens complete if buttons do nothing

---

# 43. Required UX Tests

Antigravity must test:

```txt id="b8u36f"
Owner can login and see dashboard
Sales user can login and see sales dashboard
Sales user cannot access Owner dashboard
Product search works
Product can be added to cart
Quantity controls work
Payment method selection works
Sale completes without internet
Cart clears after sale
Optional receipt opens after sale
Debt sale asks for customer name
Expense screen is Owner-only
Subscription warning displays correctly
Offline banner displays correctly
Empty states show when no data exists
Dashboard shows real data only
```

---

# 44. Manual UX Verification

Manual test:

```txt id="it7ku7"
1. Login as Owner.
2. Add product Lotion with stock 10, cost 250, selling price 400.
3. Go to Sell screen.
4. Search Lotion.
5. Add 4 units to cart.
6. Select M-Pesa.
7. Complete sale.
8. Confirm success message appears.
9. Confirm cart clears.
10. Confirm user can start next sale immediately.
11. Open receipt optionally.
12. Confirm receipt does not show profit/cost.
13. Login as Sales user.
14. Confirm Sales user can sell.
15. Confirm Sales user cannot see expenses or profit.
16. Turn off internet.
17. Complete another sale.
18. Confirm offline save message appears.
19. Confirm pending sync count appears.
20. Confirm no fake dashboard numbers appear.
```

If this test fails, UX is not complete.

---

# 45. Antigravity Completion Report

After building UI/UX module, Antigravity must report:

```txt id="qgfnzk"
Module name:
Screens created:
Screens modified:
Components created:
Navigation added:
Role-based UI rules added:
Engine connections added:
Offline/sync messages added:
Tests added:
Manual verification steps:
Known limitations:
No fake UI/data confirmation:
```

---

# 46. Final UX Rule

Buzz Duka must be easy enough for a real shopkeeper to use during a busy day.

The app should help users:

```txt id="4jsdq0"
Sell quickly
Find products fast
Know stock clearly
Record debts simply
Record expenses easily
Understand profit safely
Work offline confidently
Avoid confusion
```

Do not make Buzz Duka look powerful but feel difficult.

A simple working app is better than a beautiful confusing one.

Buzz Duka must be fast, clear, and trustworthy.
