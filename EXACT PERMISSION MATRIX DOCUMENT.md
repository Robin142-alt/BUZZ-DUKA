# DOCUMENT 13: EXACT PERMISSION MATRIX DOCUMENT

## Buzz Duka — Owner and Sales User Access Rules

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Permission and access control document
**Purpose:** Define exactly what Owner and Sales users can and cannot do in Buzz Duka.
**Core Rule:** Owner controls the business. Sales user sells only.

---

# 1. Purpose of This Document

This document gives Antigravity an exact permission matrix.

It prevents mistakes such as:

* Sales user seeing profit
* Sales user seeing expenses
* Sales user changing product costs
* Sales user managing subscription
* Sales user managing devices
* Sales user accessing owner dashboard through direct navigation
* UI hiding buttons but still allowing restricted actions in logic

Buzz Duka permissions must be enforced in:

```txt id="vrv6js"
Navigation
Screens
Buttons
Local actions
Engines
Database queries
Backend APIs
Reports
Settings
```

---

# 2. Approved Roles

Buzz Duka starts with only two roles:

```txt id="c9cq2x"
Owner
Sales
```

Do not add extra roles in the MVP.

Extra roles such as Manager, Cashier, Accountant, Stock Manager, Branch Manager, and Auditor are future features.

---

# 3. Permission Principle

The permission principle is:

```txt id="m41gqt"
Owner = business control
Sales = selling only
```

The Owner can manage and understand the business.

The Sales user can sell quickly but should not see sensitive business information.

---

# 4. Permission Matrix Summary

| Feature / Action            |                  Owner |                          Sales |
| --------------------------- | ---------------------: | -----------------------------: |
| Login                       |                    Yes |                            Yes |
| Create business             |                    Yes |                             No |
| View Owner dashboard        |                    Yes |                             No |
| View Sales dashboard        |                    Yes |                            Yes |
| Add product                 |                    Yes |                             No |
| Edit product                |                    Yes |                             No |
| Deactivate product          |                    Yes |                             No |
| Search products             |                    Yes |                            Yes |
| View basic product stock    |                    Yes |                            Yes |
| View product cost           |                    Yes |                             No |
| View product profit         |                    Yes |                             No |
| Add stock                   |                    Yes |                             No |
| Adjust stock                |                    Yes |                             No |
| Record damage/loss          |                    Yes |                             No |
| Change selling price        |                    Yes |                             No |
| Change default buying price |                    Yes |                             No |
| Cost correction/revaluation |                    Yes |                             No |
| Sell products               | Yes, if device allowed |         Yes, if device allowed |
| Select payment method       |                    Yes |                            Yes |
| Complete sale               | Yes, if device allowed |         Yes, if device allowed |
| View receipt                |                    Yes |                            Yes |
| View recent sales           |                    Yes |                        Limited |
| Reverse sale                |                    Yes |                  No by default |
| Create debt sale            |                    Yes |                Yes, if allowed |
| View debt list              |                    Yes |          Limited/No by default |
| Record debt payment         |                    Yes |                  No by default |
| Add expense                 |                    Yes |                             No |
| View expenses               |                    Yes |                             No |
| View gross profit           |                    Yes |                             No |
| View net profit             |                    Yes |                             No |
| View product analytics      |                    Yes |                             No |
| View stock value            |                    Yes |                             No |
| View low stock              |                    Yes |                     Basic only |
| View payment method totals  |                    Yes |                             No |
| View activity history       |                    Yes |          Limited/No by default |
| Manage devices              |                    Yes |                             No |
| Manage subscription         |                    Yes |                             No |
| Manage business settings    |                    Yes |                             No |
| Sync data                   |                    Yes | Yes, for allowed local records |
| View sync status            |                    Yes |                            Yes |
| Access admin dashboard      |                     No |                             No |

---

# 5. Authentication Permissions

| Action                     |     Owner | Sales |
| -------------------------- | --------: | ----: |
| Register new business      |       Yes |    No |
| Login to existing business |       Yes |   Yes |
| Logout                     |       Yes |   Yes |
| Reset password             |       Yes |   Yes |
| Change own password        |       Yes |   Yes |
| Create Sales user          |       Yes |    No |
| Remove/block Sales user    |       Yes |    No |
| Change user role           | No in MVP |    No |

Rule:

Sales user cannot create another Sales user.

---

# 6. Business Setup Permissions

| Action                  |             Owner | Sales |
| ----------------------- | ----------------: | ----: |
| Create business profile |               Yes |    No |
| Edit business name      |               Yes |    No |
| Edit business location  |               Yes |    No |
| View business settings  |               Yes |    No |
| Archive business        | Future/Admin only |    No |

Sales user must not access business settings.

---

# 7. Product Permissions

| Action                       | Owner |                     Sales |
| ---------------------------- | ----: | ------------------------: |
| View product list            |   Yes | Yes, active products only |
| Search products              |   Yes |                       Yes |
| Add product                  |   Yes |                        No |
| Edit product name            |   Yes |                        No |
| Edit product category        |   Yes |                        No |
| Edit low-stock level         |   Yes |                        No |
| Deactivate product           |   Yes |                        No |
| Archive product              |   Yes |                        No |
| View product cost            |   Yes |                        No |
| View product expected profit |   Yes |                        No |
| View product stock value     |   Yes |                        No |
| View product selling price   |   Yes |                       Yes |
| View product available stock |   Yes |                       Yes |

Sales user sees product information needed for selling only.

---

# 8. Stock Permissions

| Action                      | Owner |         Sales |
| --------------------------- | ----: | ------------: |
| View stock quantity         |   Yes |    Basic only |
| Add stock / stock-in        |   Yes |            No |
| Adjust stock                |   Yes |            No |
| Record damage               |   Yes |            No |
| Record loss                 |   Yes |            No |
| View stock movement history |   Yes | No by default |
| View stock value            |   Yes |            No |
| View average cost           |   Yes |            No |
| View low-stock alert        |   Yes |    Basic only |
| Perform cost correction     |   Yes |            No |

Sales user should not manage stock because stock actions affect cost and profit.

---

# 9. Pricing and Costing Permissions

| Action                       | Owner | Sales |
| ---------------------------- | ----: | ----: |
| View selling price           |   Yes |   Yes |
| Change selling price         |   Yes |    No |
| View default buying price    |   Yes |    No |
| Change default buying price  |   Yes |    No |
| View average unit cost       |   Yes |    No |
| View current expected profit |   Yes |    No |
| View price history           |   Yes |    No |
| Perform cost correction      |   Yes |    No |

Sales user must not see buying cost or expected profit by default.

---

# 10. Selling Permissions

| Action                          |                     Owner |                  Sales |
| ------------------------------- | ------------------------: | ---------------------: |
| Open Sell screen                |    Yes, if device allowed | Yes, if device allowed |
| Search product during sale      |                       Yes |                    Yes |
| Add product to cart             |                       Yes |                    Yes |
| Change quantity                 |                       Yes |                    Yes |
| Remove item from cart           |                       Yes |                    Yes |
| Select Cash                     |                       Yes |                    Yes |
| Select M-Pesa                   |                       Yes |                    Yes |
| Select Bank                     |                       Yes |                    Yes |
| Select Debt                     |                       Yes |        Yes, if allowed |
| Complete sale                   |    Yes, if device allowed | Yes, if device allowed |
| View sale success               |                       Yes |                    Yes |
| View optional receipt           |                       Yes |                    Yes |
| See sale profit during checkout |              Yes optional |                     No |
| Override selling price          | No in MVP unless approved |                     No |

Device rule still applies:

```txt id="9adf6s"
User must have selling permission AND device must be sales-enabled.
```

---

# 11. Payment Method Permissions

Allowed payment methods:

```txt id="1w8xy6"
Cash
M-Pesa
Bank
Debt
```

| Action                     | Owner |                     Sales |
| -------------------------- | ----: | ------------------------: |
| Select Cash                |   Yes |                       Yes |
| Select M-Pesa              |   Yes |                       Yes |
| Select Bank                |   Yes |                       Yes |
| Select Debt                |   Yes | Yes, if debt sale allowed |
| Enter M-Pesa code          |    No |                        No |
| Verify M-Pesa payment      |    No |                        No |
| Reconcile M-Pesa           |    No |                        No |
| View payment method totals |   Yes |                        No |

Buzz Duka records payment method only.

---

# 12. Receipt Permissions

| Action                      |  Owner |   Sales |
| --------------------------- | -----: | ------: |
| Generate receipt after sale |    Yes |     Yes |
| View receipt for own sale   |    Yes |     Yes |
| View receipt history        |    Yes | Limited |
| Share receipt if supported  |    Yes |     Yes |
| Print receipt               | Future |  Future |
| View cost/profit on receipt |     No |      No |

Customer receipts must not show cost or profit.

---

# 13. Debt Permissions

| Action                     | Owner |                 Sales |
| -------------------------- | ----: | --------------------: |
| Create debt sale           |   Yes |       Yes, if allowed |
| Enter debt customer name   |   Yes |                   Yes |
| Enter debt customer phone  |   Yes |                   Yes |
| View all debts             |   Yes |         No by default |
| View debt balance          |   Yes | Limited/No by default |
| Record debt payment        |   Yes |         No by default |
| Mark debt paid             |   Yes |                    No |
| Cancel debt                |   Yes |                    No |
| View overdue debts         |   Yes |                    No |
| View customer debt history |   Yes |         No by default |

Recommended MVP rule:

```txt id="n56t3d"
Sales user may create a debt sale, but Owner handles debt payment and debt management.
```

This protects money control.

---

# 14. Expense Permissions

| Action                            | Owner | Sales |
| --------------------------------- | ----: | ----: |
| Add expense                       |   Yes |    No |
| View expense list                 |   Yes |    No |
| View expense total                |   Yes |    No |
| Edit expense                      |   Yes |    No |
| Void expense                      |   Yes |    No |
| View expense categories           |   Yes |    No |
| View expense effect on net profit |   Yes |    No |

Sales user must not access expenses.

Expenses are owner-sensitive.

---

# 15. Profit and Analytics Permissions

| Action                     | Owner |                  Sales |
| -------------------------- | ----: | ---------------------: |
| View total sales           |   Yes | Limited own/basic only |
| View gross profit          |   Yes |                     No |
| View net profit            |   Yes |                     No |
| View expenses              |   Yes |                     No |
| View product profit        |   Yes |                     No |
| View stock value           |   Yes |                     No |
| View payment method totals |   Yes |                     No |
| View best sellers          |   Yes |      Limited/no profit |
| View low-margin products   |   Yes |                     No |
| View loss-making products  |   Yes |                     No |
| View restock suggestions   |   Yes |   Basic low-stock only |
| View price review alerts   |   Yes |                     No |
| View debt total            |   Yes |                     No |

Sales dashboard should remain simple and focused on selling.

---

# 16. Dashboard Permissions

| Dashboard Area       | Owner |                            Sales |
| -------------------- | ----: | -------------------------------: |
| Owner dashboard      |   Yes |                               No |
| Sales dashboard      |   Yes |                              Yes |
| Today’s sales amount |   Yes |                          Limited |
| Gross profit card    |   Yes |                               No |
| Net profit card      |   Yes |                               No |
| Expense card         |   Yes |                               No |
| Debt total card      |   Yes |                               No |
| Low stock card       |   Yes |                            Basic |
| Best sellers         |   Yes |               Basic if no profit |
| Activity summary     |   Yes |                          Limited |
| Subscription status  |   Yes | Warning only if selling affected |
| Sync status          |   Yes |                              Yes |

---

# 17. Activity History Permissions

| Action                       | Owner |                  Sales |
| ---------------------------- | ----: | ---------------------: |
| View full activity history   |   Yes |          No by default |
| View own recent sale actions |   Yes |                Limited |
| View product cost changes    |   Yes |                     No |
| View stock adjustments       |   Yes |                     No |
| View device changes          |   Yes |                     No |
| View subscription events     |   Yes |                     No |
| View sync failures           |   Yes | Basic sync status only |

Activity logs may expose sensitive business details, so Sales access should be limited.

---

# 18. Device Permissions

| Action                  | Owner |          Sales |
| ----------------------- | ----: | -------------: |
| Register first device   |   Yes |             No |
| Request device access   |   Yes | Yes if invited |
| Approve device          |   Yes |             No |
| Block device            |   Yes |             No |
| Remove device           |   Yes |             No |
| Transfer device         |   Yes |             No |
| Enable sales on device  |   Yes |             No |
| Disable sales on device |   Yes |             No |
| View device list        |   Yes |             No |
| View own device status  |   Yes |            Yes |

Base plan:

```txt id="uj0i88"
Maximum 2 active devices.
Only 1 sales-enabled device.
```

---

# 19. Subscription Permissions

| Action                    | Owner |                Sales |
| ------------------------- | ----: | -------------------: |
| View subscription status  |   Yes | Limited warning only |
| View expiry date          |   Yes | Limited warning only |
| Renew subscription        |   Yes |                   No |
| Reactivate subscription   |   Yes |                   No |
| View payment instructions |   Yes |                   No |
| View subscription history |   Yes |                   No |
| Manage plan               |   Yes |                   No |

Sales user may see a warning if subscription blocks selling, but should not manage subscription.

---

# 20. Sync Permissions

| Action                     | Owner |                               Sales |
| -------------------------- | ----: | ----------------------------------: |
| View pending sync count    |   Yes |                                 Yes |
| Trigger sync retry         |   Yes |         Yes for own allowed records |
| View sync errors           |   Yes |                          Basic only |
| View detailed sync logs    |   Yes |                                  No |
| Sync sale records          |   Yes |                                 Yes |
| Sync product/stock changes |   Yes | No unless generated by allowed sale |
| Sync expenses              |   Yes |                                  No |
| Sync subscription records  |   Yes |                                  No |

Sales user should not access sensitive sync details.

---

# 21. Settings Permissions

| Setting            | Owner |                      Sales |
| ------------------ | ----: | -------------------------: |
| Business profile   |   Yes |                         No |
| User management    |   Yes |                         No |
| Device management  |   Yes |                         No |
| Subscription       |   Yes |                         No |
| Product settings   |   Yes |                         No |
| Expense categories |   Yes |                         No |
| Sync settings      |   Yes |                    Limited |
| App theme/language |   Yes | Yes, local preference only |

Sales user may change personal app preferences only if they do not affect business records.

---

# 22. Sale Reversal Permissions

MVP recommendation:

| Action                         |          Owner |     Sales |
| ------------------------------ | -------------: | --------: |
| Reverse completed sale         |            Yes |        No |
| Reverse own recent sale        | Future setting | No in MVP |
| View reversed sale history     |            Yes |        No |
| Restore stock through reversal |            Yes |        No |
| Reverse debt sale              |            Yes |        No |
| Void receipt                   |            Yes |        No |

Reason:

Sale reversal affects stock, profit, reports, and sometimes debt. It should be Owner-only in MVP.

---

# 23. Admin Access Rule

Shop users are not admin users.

| Action                                    | Owner | Sales |
| ----------------------------------------- | ----: | ----: |
| Access Buzz Duka internal admin dashboard |    No |    No |
| Suspend business                          |    No |    No |
| Activate subscription manually            |    No |    No |
| View all shops                            |    No |    No |
| View platform revenue                     |    No |    No |

Admin dashboard is for Buzz Duka internal operators only.

---

# 24. Direct Navigation Protection

Antigravity must block restricted screens even if user tries to access route directly.

Example:

```txt id="s7itgz"
Sales user manually opens /expenses
Expected result: Access denied
```

Example:

```txt id="nc9r1k"
Sales user manually opens /owner-dashboard
Expected result: Access denied
```

Example:

```txt id="9l7el2"
Sales user manually calls viewProfit()
Expected result: Permission denied
```

Do not rely only on hidden buttons.

---

# 25. Backend API Permission Rule

When backend APIs are built, permissions must also be enforced on the backend.

Examples:

```txt id="r68get"
POST /expenses → Owner only
GET /analytics/profit → Owner only
POST /devices/enable-sales → Owner only
POST /sales → Owner or Sales if device allowed
POST /debts/:id/payments → Owner only by default
```

Frontend permissions improve user experience.

Backend permissions protect data.

Both are required.

---

# 26. Local Offline Permission Rule

Because Buzz Duka works offline, local app logic must enforce permissions too.

Sales user must not access Owner-only screens just because backend is unavailable.

Offline permission checks must use locally stored:

```txt id="129e0z"
user role
business_id
device status
sales_enabled flag
subscription/license status
```

---

# 27. Permission Engine Required Functions

Antigravity should implement a central permission engine.

Suggested functions:

```txt id="0qjpjw"
canViewOwnerDashboard(user)
canViewSalesDashboard(user)
canManageProducts(user)
canAddStock(user)
canAdjustStock(user)
canViewProductCost(user)
canChangeSellingPrice(user)
canPerformCostCorrection(user)
canCompleteSale(user, device, subscription)
canCreateDebtSale(user, settings)
canRecordDebtPayment(user)
canRecordExpense(user)
canViewExpenses(user)
canViewGrossProfit(user)
canViewNetProfit(user)
canViewAnalytics(user)
canManageDevices(user)
canManageSubscription(user)
canViewActivityLogs(user)
canReverseSale(user)
```

All screens and actions should use this shared logic.

---

# 28. Permission Error Messages

Use simple messages.

Examples:

```txt id="awq5mu"
Only the Owner can view profit.
```

```txt id="iekh2h"
Only the Owner can record expenses.
```

```txt id="97wlfm"
This device is not allowed to make sales.
```

```txt id="c03j3v"
You do not have permission to open this screen.
```

```txt id="49r53u"
Ask the Owner to enable sales on this device.
```

Avoid technical permission errors.

---

# 29. Permission Test Requirements

Antigravity must test:

```txt id="vqro0y"
Owner can open Owner dashboard
Owner can add product
Owner can add stock
Owner can view profit
Owner can add expense
Owner can manage devices
Owner can manage subscription
Sales user can open Sales dashboard
Sales user can search products
Sales user can complete sale if device allowed
Sales user cannot open Owner dashboard
Sales user cannot view net profit
Sales user cannot view expenses
Sales user cannot manage devices
Sales user cannot manage subscription
Sales user cannot perform cost correction
Direct route access is blocked
Backend restricted APIs reject Sales user
Offline permission checks still work
```

---

# 30. Manual Permission Verification

Use this test:

```txt id="89vdv7"
1. Login as Owner.
2. Confirm Owner can open dashboard.
3. Confirm Owner can add product.
4. Confirm Owner can add stock.
5. Confirm Owner can view gross profit and net profit.
6. Confirm Owner can add expense.
7. Confirm Owner can open device settings.
8. Confirm Owner can open subscription screen.
9. Logout.
10. Login as Sales user.
11. Confirm Sales user can open Sell screen.
12. Confirm Sales user can search products.
13. Confirm Sales user can complete sale if device is sales-enabled.
14. Try to open Owner dashboard.
15. Expected: blocked.
16. Try to open expenses.
17. Expected: blocked.
18. Try to open subscription settings.
19. Expected: blocked.
20. Try to open device settings.
21. Expected: blocked.
22. Try direct navigation to restricted route.
23. Expected: blocked.
```

---

# 31. Permission Completion Checklist

Permission system is complete only when:

```txt id="xio72r"
Owner role exists
Sales role exists
Permission engine exists
Navigation uses permission checks
Screens use permission checks
Actions use permission checks
Local offline permissions work
Backend API permissions work when backend exists
Sales user cannot access owner-only data
Device rule is checked before sale
Subscription rule is checked before sale
Tests/manual checks exist
No fake permission status is used
```

---

# 32. Final Rule

Buzz Duka must protect owner data.

Sales user should sell fast, but must not see or control sensitive business information.

Owner controls:

```txt id="hdy0fc"
Products
Stock
Costs
Profit
Expenses
Devices
Subscription
Business settings
```

Sales user controls:

```txt id="o2xdsw"
Product search
Cart
Payment method
Sale completion
Basic stock visibility
```

If Sales user can access Owner-only information, Buzz Duka is not safe for real shops.
