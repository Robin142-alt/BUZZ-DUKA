# DOCUMENT 1: PRODUCT VISION & SCOPE MASTER DOCUMENT

## Buzz Duka — Product Foundation Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Product foundation master document
**Purpose:** Define what Buzz Duka is, who it is for, what problem it solves, what features belong in the first version, what features must be delayed, and how the product should make money.
**Core Promise:** Sell fast. Track stock. Know profit.

---

# 1. Product Vision

Buzz Duka is a simple offline-first smart POS and shop management app for small and medium Kenyan shops.

The vision is to help shop owners run their shops using a normal Android phone without needing expensive POS machines, complicated accounting software, or constant internet.

Buzz Duka should make it easy for a shopkeeper to:

* Sell products quickly
* Track stock automatically
* Know whether products are profitable
* Record debts
* Record expenses
* See simple business analytics
* Continue working offline
* Sync data later when internet returns
* Control sales users and devices
* Pay a simple monthly subscription

Buzz Duka should feel simple when selling and smart when reporting.

---

# 2. Product Mission

The mission of Buzz Duka is:

```txt id="brq6qx"
To help everyday shopkeepers sell faster, avoid stock confusion, and understand their real profit using a simple mobile-first app.
```

Buzz Duka must not overwhelm shopkeepers with complicated accounting language.

The app should speak in simple business language.

Example:

```txt id="b0h1ra"
This product gives low profit.
```

Instead of:

```txt id="3utdtq"
Gross margin variance below threshold.
```

---

# 3. Target Customers

Buzz Duka is designed for small and medium shop owners in Kenya.

Target customers include:

* Mini shops
* Cosmetic shops
* Small retail shops
* General shops
* Phone accessory shops
* Small electronics shops
* Boutique shops
* Agrovet-style shops
* Small wholesale/retail hybrid shops
* Single-shop businesses with one owner and one sales worker

The first version should focus on **one-shop businesses**, not complex multi-branch businesses.

---

# 4. Main User Types

Buzz Duka starts with two user types only:

## 4.1 Owner

The Owner is the person who owns or manages the shop.

The Owner needs to know:

* What was sold
* How much stock remains
* Which products are profitable
* Which products are almost finished
* Which customers owe money
* What expenses were recorded
* Whether the shop is making profit
* What the sales user did
* Whether the subscription is active

## 4.2 Sales User

The Sales user is the person selling at the counter.

The Sales user needs to:

* Search products quickly
* Add products to cart
* Complete sales fast
* Select payment method
* Create debt sale if allowed
* See basic stock availability
* Move to the next customer quickly

The Sales user should not see sensitive owner information such as net profit, expenses, subscription settings, or device controls.

---

# 5. Problem Statement

Many small shopkeepers struggle with:

* Forgetting what was sold
* Losing track of stock
* Not knowing real profit
* Mixing personal money and shop money
* Selling products without knowing cost changes
* Recording customer debts in books or memory
* Forgetting expenses
* Depending on manual notebooks
* Not knowing which products are slow-moving
* Not knowing when to restock
* Poor visibility when a sales person is operating the shop
* Lack of internet reliability
* Expensive or complicated POS systems

Buzz Duka solves these problems by giving shopkeepers a simple phone-based system for daily selling, stock control, and profit visibility.

---

# 6. Core Product Positioning

Buzz Duka should be positioned as:

```txt id="j3gsmm"
A simple smart POS for Kenyan shops that helps you sell fast, track stock, and know your profit.
```

Buzz Duka is not positioned as:

* A bank system
* An M-Pesa verification system
* A full accounting system
* A supermarket ERP
* A tax filing system
* A payroll system
* A complex enterprise platform

The app should be practical, fast, and easy to understand.

---

# 7. First Version Product Scope

The first version of Buzz Duka should include only the features needed to create real value quickly.

## Core first-version features

1. Business setup
2. Owner login
3. Sales user login
4. Product registration
5. Category registration
6. Stock-in
7. Stock adjustment
8. Fast selling screen
9. Cart
10. Payment method selection
11. Sale completion
12. Automatic stock reduction
13. Receipt generation
14. Debt sale
15. Debt payment
16. Expense recording
17. Product profit calculation
18. Gross profit calculation
19. Net profit calculation
20. Basic analytics
21. Owner dashboard
22. Sales user dashboard
23. Activity history
24. Role permissions
25. Device control
26. Offline local storage
27. Sync queue structure
28. Subscription/license control

---

# 8. Features That Must Be Excluded From First Version

Buzz Duka must not include unnecessary features in the first version.

Do not build:

* M-Pesa code entry
* M-Pesa verification
* M-Pesa reconciliation
* Daraja API setup
* STK Push for customer checkout
* Till/PayBill/Pochi integration
* Bank reconciliation
* Full accounting
* Payroll
* KRA/eTIMS integration
* Multi-branch management
* Supplier management
* Purchase orders
* Loyalty points
* Complex discounts
* AI chatbot
* Hardware dependency
* Receipt printer dependency
* Barcode scanner dependency
* Multiple cashiers
* Multiple sales-enabled devices
* Customer marketing campaigns
* Advanced tax reports

These may be future features, but they should not delay the first working app.

---

# 9. Core Selling Flow

Buzz Duka’s selling flow must be very fast.

Approved flow:

```txt id="8mi5r5"
Select product → Add to cart → Choose payment method → Complete sale → Next customer
```

The app must not force:

* M-Pesa transaction code
* Customer phone number except debt sale
* Long notes
* Receipt sharing
* Internet connection
* Online payment confirmation
* Batch selection
* Complex forms

The sale should save locally first and sync later.

---

# 10. Payment Scope

Buzz Duka records payment method only.

Allowed payment methods:

```txt id="4bquvc"
Cash
M-Pesa
Bank
Debt
```

Buzz Duka should not verify whether an M-Pesa payment actually arrived.

Buzz Duka should not connect to each shop’s M-Pesa account.

Buzz Duka should only record that the seller selected “M-Pesa” as the payment method.

The owner can compare Buzz Duka’s M-Pesa totals with external M-Pesa/Till/PayBill/Pochi records outside the app.

---

# 11. Inventory Scope

Every normal sellable item should be registered as a product.

Each product should support:

* Product name
* Category
* Stock quantity
* Low-stock level
* Default buying price
* Current selling price
* Average unit cost
* Stock value
* Active/inactive status

Inventory is the foundation of:

* Sales
* Stock reduction
* Profit calculation
* Low-stock alerts
* Product analytics
* Stock value

Buzz Duka must not treat inventory as optional for normal products.

---

# 12. Pricing and Costing Scope

Buzz Duka must support changing buying prices and changing selling prices.

## Buying price

Buying price changes mainly when stock is added.

Example:

```txt id="x0z59e"
A product was bought at KSh 250 last week.
This week the same product is bought at KSh 300.
Buzz Duka must handle both costs correctly.
```

The default costing method is Moving Weighted Average Cost.

## Selling price

Selling price can change anytime.

Example:

```txt id="hvn4sw"
A product was sold at KSh 400 yesterday.
Today the owner changes the selling price to KSh 450.
Old sales must still show KSh 400.
New sales should use KSh 450.
```

This protects historical profit accuracy.

---

# 13. Profit Scope

Buzz Duka must calculate profit accurately.

The app should support:

* Revenue
* Cost
* Gross profit
* Net profit
* Product profit
* Loss-making products
* Low-margin products
* Current expected profit
* Historical profit

Correct historical profit formula:

```txt id="1alyz0"
Historical profit = SUM(line_profit_or_loss from sale_items)
```

Correct net profit formula:

```txt id="yj3vot"
Net profit = Gross profit - Expenses
```

Buzz Duka must support negative profit.

If a product is sold below cost, the app should show that the shop made a loss on that product.

---

# 14. Debt Scope

Buzz Duka should support simple customer debt tracking.

Debt features:

* Debt sale
* Customer name
* Customer phone optional
* Debt amount
* Partial payment
* Remaining balance
* Paid/unpaid/partial status
* Debt history
* Owner debt report

Debt sale must still:

* Create a real sale
* Reduce stock
* Save sale item snapshots
* Save payment method as Debt
* Affect debt totals

Do not build interest, credit scoring, or loan management in the first version.

---

# 15. Expense Scope

Buzz Duka should support simple expense recording.

Expense features:

* Add expense
* Expense category
* Description optional
* Expense date
* Expense list
* Expense total
* Net profit effect
* Owner-only access

Default expense categories:

```txt id="1n3cct"
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

Expenses reduce net profit, not gross profit.

---

# 16. Analytics Scope

Buzz Duka analytics should be simple, useful, and based on real data.

Analytics should include:

* Today’s sales
* Gross profit
* Net profit
* Expenses
* Debt total
* Payment method totals
* Best-selling products
* Low-selling products
* Highest-profit products
* Lowest-profit products
* Low-margin products
* Loss-making products
* Low-stock products
* Dead stock
* Stock value
* Restock suggestions
* Price review alerts

Insights should be written in simple language.

Examples:

```txt id="lju9gv"
This product sells fast but gives low profit.
```

```txt id="jfjhwk"
This item is almost finished.
```

```txt id="ay9boh"
This product is selling below cost.
```

---

# 17. Offline Scope

Buzz Duka must be offline-first.

Core features that should work offline:

* Product search
* Selling
* Stock reduction
* Receipt creation
* Debt sale
* Debt payment
* Expense recording
* Basic sales history
* Basic dashboard
* Activity logging

Rule:

```txt id="uc3a6m"
Save locally first. Sync later.
```

The app must not block checkout because internet is unavailable.

---

# 18. Sync Scope

Sync should upload local records to the backend when internet is available.

Sync should support:

* Pending status
* Syncing status
* Synced status
* Failed status
* Retry
* Duplicate prevention
* Sync error messages
* Pending sync count

Sync must not create duplicate sales.

Sync must not allow one business to access another business’s records.

---

# 19. Roles and Device Scope

Buzz Duka starts with:

```txt id="0lf3b6"
Owner
Sales
```

Base plan device rule:

```txt id="n7blnn"
1 business
1 owner
1 sales user
Maximum 2 active devices
Only 1 sales-enabled device
```

This helps protect stock accuracy, offline behavior, and subscription value.

Do not add multiple sales devices in the first version.

---

# 20. Subscription Scope

Buzz Duka uses a simple monthly subscription.

Main plan:

```txt id="xst0bk"
Buzz Duka Smart Plan: KSh 1,500/month
```

Subscription states:

```txt id="6a74k8"
active
grace
expired
suspended
reactivated
```

The app should support offline license checking.

Buzz Duka must not allow unlimited offline use after subscription expiry.

---

# 21. Business Model

Buzz Duka’s main business model is monthly subscription.

Main revenue source:

```txt id="3hhdaw"
KSh 1,500/month per shop
```

Base plan includes:

* 1 business
* 1 owner
* 1 sales user
* Up to 2 active devices
* Only 1 sales-enabled device
* Inventory
* Sales
* Debts
* Expenses
* Profit analytics
* Offline usage
* Sync
* Subscription control

Possible future revenue options:

* Multi-branch plan
* Extra device add-on
* Advanced analytics
* Supplier management
* Tax/eTIMS tools
* Hardware support
* Setup/onboarding service

But the first version should stay focused on the monthly plan.

---

# 22. Target Product Experience

Buzz Duka should feel:

* Fast
* Simple
* Clear
* Reliable
* Shopkeeper-friendly
* Not technical
* Not crowded
* Not confusing

The app should prioritize:

* Large buttons
* Quick search
* Clear totals
* Few checkout steps
* Simple dashboards
* Useful alerts
* Friendly messages
* Offline confidence

Bad experience:

```txt id="7lg1sy"
The seller must fill many fields before completing a sale.
```

Good experience:

```txt id="uzp5gq"
The seller taps products, chooses payment method, completes sale, and serves the next customer.
```

---

# 23. Product Success Criteria

Buzz Duka is successful if:

* A shopkeeper can add products easily.
* A seller can complete sales quickly.
* Stock reduces automatically.
* Buying price changes are handled correctly.
* Selling price changes do not corrupt old sales.
* Owner can see real profit.
* Owner can see debts.
* Owner can see expenses.
* App works offline.
* App syncs later.
* Sales user cannot see owner-only information.
* Subscription control works.
* Dashboard uses real records.
* Shopkeeper trusts the numbers.

---

# 24. First Release Minimum Viable Product

The first release should include:

```txt id="xgbvbd"
Business setup
Owner login
Product setup
Stock-in
Fast selling
Payment method selection
Stock reduction
Sale item snapshots
Receipt record
Debt sale
Debt payment
Expense recording
Gross profit
Net profit
Basic analytics
Owner dashboard
Sales user mode
Offline local storage
Sync queue
Subscription/license status
```

This is enough to deliver real value.

---

# 25. Future Features

Future features may include:

* Multi-branch
* Extra sales devices
* Supplier management
* Purchase orders
* Barcode scanning
* Receipt printer support
* Advanced discounts
* Customer loyalty
* Tax/eTIMS support
* Daraja/M-Pesa integrations
* Advanced AI insights
* Web dashboard for shop owners

These should come only after the first version is stable.

---

# 26. Antigravity Product Scope Rules

Antigravity must follow these product scope rules:

1. Do not build unapproved features.
2. Do not add M-Pesa verification.
3. Do not slow down checkout.
4. Do not build full accounting.
5. Do not add multi-branch early.
6. Do not add many roles early.
7. Do not add unlimited devices.
8. Do not add fake dashboard data.
9. Do not replace offline-first behavior.
10. Do not change pricing/costing logic without approval.

---

# 27. Final Product Direction

Buzz Duka must be built as a real, simple, offline-first smart POS for Kenyan shops.

The app must help shopkeepers:

```txt id="1k7gpv"
Sell fast.
Track stock.
Know profit.
Manage debts.
Record expenses.
Work offline.
Stay in control.
```

If a feature does not support these goals, it should not be built in the first version.
