# DOCUMENT 0.6: MODULE-BY-MODULE BUILD PROMPT DOCUMENT

## Buzz Duka — Antigravity Development Control Document

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Antigravity execution prompt guide
**Purpose:** Provide strict copy-paste build prompts for Antigravity so Buzz Duka is developed one module at a time with real logic, real data, tests, and manual verification.
**Primary Rule:** Do not give Antigravity one huge prompt to build the entire app. Use these prompts one by one.

---

# 1. Purpose of This Document

This document gives controlled prompts for building Buzz Duka in small, verifiable modules.

Antigravity must not be asked to build everything at once because that increases the risk of:

* Fake UI
* Hardcoded data
* Missing database logic
* Broken stock calculations
* Wrong profit analytics
* Weak offline behavior
* Unclear architecture
* Uncontrolled feature creep

Each prompt in this document should be used separately.

After Antigravity completes one prompt, it must provide:

* Files created
* Files modified
* Database tables affected
* Business logic added
* Tests added
* Manual verification steps
* Known limitations
* Confirmation that no fake data was used

Do not move to the next prompt until the current module is working.

---

# 2. Universal Instruction to Include in Every Prompt

Use this instruction at the top of every Antigravity task.

```txt id="i3f4yu"
You are building Buzz Duka, a simple offline-first smart POS for Kenyan shops.

Follow the approved documentation exactly.

Do not invent features.
Do not add M-Pesa code entry, M-Pesa verification, M-Pesa reconciliation, Daraja integration, STK Push, Till/PayBill/Pochi API setup, or payment matching.
Buzz Duka records payment method only: Cash, M-Pesa, Bank, or Debt.

Do not use fake production data.
Do not hardcode dashboard totals, products, sales, profit, debts, expenses, subscriptions, or analytics.
Do not create UI-only features.

Build real logic with real persistence.
Core shop data must persist after app restart.
Core offline data must be stored locally.
Use business_id for multi-tenant separation.

Build only the requested module.
Do not rewrite unrelated modules.
Do not change the approved tech stack.

After finishing, report:
1. Files created
2. Files modified
3. Database/local tables affected
4. Business logic added
5. Tests added
6. Manual verification steps
7. Known limitations
8. Confirmation that no fake or hardcoded production data was used
```

---

# 3. Prompt 1: Project Foundation

```txt id="q6j4q8"
Build the Buzz Duka project foundation only.

Use the approved stack:
- React Native + Expo + TypeScript for the mobile app
- SQLite for local database
- Node.js + NestJS + TypeScript for backend later
- PostgreSQL + Prisma for cloud backend later
- Next.js + TypeScript for admin dashboard later

For this task, build only the mobile app foundation.

Create:
- Clean folder structure
- TypeScript configuration
- Basic navigation shell
- Shared components folder
- Screens folder
- Database folder
- Engines folder
- Services folder
- Sync folder
- Auth folder
- Types folder
- Tests folder
- Basic app theme structure

Do not build real business features yet.
Do not add fake products, fake sales, fake dashboard numbers, or sample analytics.

Create placeholder screens only if needed for navigation, but clearly keep them empty and not marked as complete features.

Acceptance criteria:
- App runs without errors.
- Navigation shell works.
- Folder structure is clean.
- TypeScript works.
- No fake business data exists.
- No unapproved features are added.

After completion, provide the required module report.
```

---

# 4. Prompt 2: Local Database Foundation

```txt id="rx7gfz"
Build the Buzz Duka local database foundation using SQLite.

Do not build UI features yet except minimal internal testing if necessary.

Create local database setup and migration structure for these tables:
- businesses
- users
- devices
- categories
- products
- stock_movements
- sales
- sale_items
- debts
- debt_payments
- expenses
- receipts
- activity_logs
- sync_queue
- subscription_license_state

Every table that belongs to a shop must include business_id.

Every syncable table should support:
- local_id
- server_id where applicable
- sync_status
- created_at
- updated_at

Create database helper functions for:
- initialize database
- run migrations
- insert record
- read record
- update record
- basic transaction support

Do not use AsyncStorage as the main store for products, sales, stock, debts, expenses, or analytics.
Do not add fake data.

Acceptance criteria:
- SQLite initializes successfully.
- Tables are created.
- Data can be inserted and read back.
- Data remains after app restart.
- A basic database test exists.
- No production feature uses fake data.

After completion, provide the required module report.
```

---

# 5. Prompt 3: Product and Inventory Engine

```txt id="g3j9xa"
Build the Product and Inventory Engine for Buzz Duka.

Build engine logic only first. Add minimal UI only if needed for manual testing, but do not build the final product screens yet.

Implement product logic with these fields:
- product_id/local_id
- server_id optional
- business_id
- product_name
- category_id
- current_stock_quantity
- low_stock_level
- default_buying_price
- current_selling_price
- average_unit_cost
- stock_value
- status
- created_at
- updated_at

Implement:
- create product
- edit product
- deactivate product
- search products locally
- create category
- assign category
- stock-in
- stock adjustment
- low-stock detection
- activity log for product and stock actions

Stock-in must create a stock_movement record.

Stock movement types:
- stock_in
- sale
- debt_sale
- adjustment
- damage
- loss
- reversal
- cost_correction

Do not fake stock changes.
Do not store products only in React state.
Do not add M-Pesa features.

Acceptance criteria:
- Product can be created and saved to SQLite.
- Product persists after app restart.
- Stock-in increases stock.
- Stock-in creates stock_movement record.
- Stock adjustment requires a reason.
- Low-stock detection works.
- Activity log is created.
- Unit/manual tests prove the logic works.

After completion, provide the required module report.
```

---

# 6. Prompt 4: Pricing and Costing Engine

```txt id="tdixnt"
Build the Buzz Duka Pricing and Costing Engine.

This engine is critical. Do not simplify it incorrectly.

Rules:
- Buying price changes only through stock-in or audited cost correction.
- Selling price can change at any time.
- Selling price changes affect new sales only.
- Old sales must never change after product prices are edited.
- Use Moving Weighted Average Cost for current inventory.

Implement:
- moving weighted average cost calculation
- stock value calculation
- stock-in cost update
- selling price change
- default buying price update for future stock-in
- price history records
- current expected profit calculation
- average buying price from current stock
- average selling price from sale records when sales engine exists
- owner-only cost correction structure, if possible

Formula:
New Average Unit Cost =
((Old Quantity × Old Average Cost) + (Added Quantity × Added Buying Price))
÷
(Old Quantity + Added Quantity)

Do not calculate historical profit from current product prices.
Do not overwrite existing stock cost just because default buying price changed.

Acceptance test:
1. Product has 10 units at buying price 250, selling price 400.
2. Average cost is 250.
3. Simulate remaining stock of 6 units.
4. Add 10 units at buying price 300.
5. New average cost must be 281.25.
6. Stock value must be 4,500.
7. Change selling price to 450.
8. Current expected profit must be 168.75.
9. Price history must record selling price change.
10. Old cost history must remain available.

Add unit tests for these calculations.

After completion, provide the required module report.
```

---

# 7. Prompt 5: Price Snapshot Engine

```txt id="tqk2pl"
Build the Buzz Duka Price Snapshot Engine.

This module must prepare immutable sale item snapshots that will later be used by the Sales Engine and Analytics Engine.

Every sale item snapshot must include:
- product_id
- product_name_snapshot
- quantity_sold
- unit_cost_at_sale
- unit_selling_price_at_sale
- line_revenue
- line_cost
- line_profit_or_loss
- margin_percentage
- stock_quantity_before_sale
- stock_quantity_after_sale
- average_cost_at_sale
- selling_price_source
- created_at

Rules:
- Snapshot values must be copied at sale time.
- Snapshot values must not change when product prices change later.
- Profit/loss must support negative numbers.
- Margin must be calculated from actual snapshot revenue and profit.
- Do not use current prices for historical reports.

Acceptance criteria:
- Snapshot can be generated from a real product.
- Snapshot stores current average unit cost as unit_cost_at_sale.
- Snapshot stores current selling price as unit_selling_price_at_sale.
- Snapshot calculates revenue, cost, profit/loss, and margin correctly.
- Snapshot remains unchanged after product selling price changes.
- Unit tests exist.

After completion, provide the required module report.
```

---

# 8. Prompt 6: Sales Engine

```txt id="rum6pt"
Build the Buzz Duka Sales Engine.

Do not build final checkout UI yet. Build the real sale creation logic first.

A completed sale must create:
- sale record
- sale item records
- payment method value
- stock movement records
- receipt number
- immutable price snapshots
- profit/loss values
- activity log
- sync queue item if sync queue exists

Allowed payment methods:
- Cash
- M-Pesa
- Bank
- Debt

Do not add M-Pesa code entry.
Do not add M-Pesa verification.
Do not add M-Pesa reconciliation.
Do not add Daraja/STK/Till/PayBill/Pochi integration.

Sale rules:
- Empty cart cannot be sold.
- Quantity must be greater than zero.
- Stock must reduce after sale.
- Sale item must save unit_cost_at_sale and unit_selling_price_at_sale.
- Old sale profit must not change after product prices are edited.
- Sale must persist after app restart.
- Sale must be connected to business_id and user_id.
- Completed sales should not be hard deleted.

Acceptance test:
1. Create product: Lotion, stock 10, average cost 250, selling price 400.
2. Sell 4 units using payment method M-Pesa.
3. Confirm stock becomes 6.
4. Confirm revenue is 1,600.
5. Confirm cost is 1,000.
6. Confirm profit is 600.
7. Confirm sale item snapshot saved.
8. Change selling price to 450.
9. Confirm old sale still shows selling price 400 and profit 600.
10. Confirm sale persists after app restart.

Add tests for sales creation, stock reduction, price snapshots, and profit/loss.

After completion, provide the required module report.
```

---

# 9. Prompt 7: Receipt Engine

```txt id="huj5ea"
Build the Buzz Duka Receipt Engine.

The receipt engine must generate receipt records from real completed sales.

Receipt must include:
- receipt_id
- business_id
- sale_id
- receipt_number
- business name
- date/time
- sold by user
- sale items
- quantity
- unit selling price at sale
- line totals
- total amount
- payment method
- debt customer name if debt sale
- created_at

Rules:
- Receipt must be created from real sale records.
- Receipt number must be unique per business.
- Receipt must not use fake sale data.
- Receipt view/share should be optional and must not block checkout.
- Receipt should remain available after app restart.

Do not add printer dependency in the first version.

Acceptance criteria:
- Receipt is created automatically after sale.
- Receipt uses real sale and sale_item data.
- Receipt number is unique.
- Receipt persists after restart.
- Receipt can be viewed from sale history.
- Checkout can return to next sale without forcing receipt view.

After completion, provide the required module report.
```

---

# 10. Prompt 8: Fast Selling UI

```txt id="ac2nng"
Build the Buzz Duka Fast Selling UI using the real Product Engine and Sales Engine.

The selling screen must be fast and simple.

Required flow:
Select product → Add to cart → Choose payment method → Complete sale → Next customer

Build:
- Product search
- Product list
- Quick/frequent items if simple
- Cart
- Quantity controls
- Payment method buttons
- Complete sale button
- Sale success state
- Optional receipt view
- Immediate return to new sale

Allowed payment methods:
- Cash
- M-Pesa
- Bank
- Debt

Do not add:
- M-Pesa code entry
- M-Pesa verification
- Payment reconciliation
- Forced customer details except debt sale
- Forced receipt sharing
- Cloud sync wait
- Batch selection
- Complex discounts

Acceptance criteria:
- User can search/select real products.
- User can add products to cart.
- Cart total calculates correctly.
- User can select payment method.
- Complete sale calls real Sales Engine.
- Sale saves locally.
- Stock reduces.
- Cart clears after sale.
- User can immediately serve next customer.
- No fake product or sale data is used.

After completion, provide the required module report.
```

---

# 11. Prompt 9: Debt Engine

```txt id="8ocijw"
Build the Buzz Duka Debt Engine.

Debt must support real debt sales and payments.

Build:
- Create debt sale
- Customer name
- Customer phone optional
- Debt amount
- Debt balance
- Partial payment
- Paid/unpaid/partial/overdue status
- Debt history
- Activity log

Rules:
- Debt sale must reduce stock.
- Debt sale must create sale and sale_item records.
- Debt sale must save price snapshots.
- Debt sale payment method must be Debt.
- Partial payment reduces balance.
- Fully paid debt changes status to paid.
- Debt records must persist after restart.
- Sales user may create debt only if allowed by settings later.
- Owner can view debt balances.

Do not build loan management, interest, or credit scoring.

Acceptance criteria:
- Debt sale works from real products.
- Stock reduces after debt sale.
- Debt balance is created.
- Partial payment updates balance.
- Paid status works.
- Debt appears in Owner dashboard data.
- Debt persists after restart.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 12. Prompt 10: Expense Engine

```txt id="zwx695"
Build the Buzz Duka Expense Engine.

Build:
- Add expense
- Expense categories
- Expense list
- Expense totals
- Activity log
- Net profit effect

Default categories:
- Rent
- Salary
- Transport
- Electricity
- Water
- Internet
- Airtime
- Packaging
- Repairs
- County charges
- Other

Rules:
- Expense amount is required.
- Expense category is required.
- Expense belongs to business_id.
- Expense must persist after restart.
- Expense reduces net profit, not gross profit.
- Expense management is Owner-only by default.
- Sales user must not access expenses by default.

Acceptance criteria:
- Owner can add expense.
- Expense saves locally.
- Expense appears in list.
- Expense affects net profit calculation.
- Sales user cannot access expense management.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 13. Prompt 11: Profit and Loss Engine

```txt id="icgj13"
Build the Buzz Duka Profit and Loss Engine.

This engine must calculate profit from real sale item snapshots.

Do not calculate historical profit from current product prices.

Build calculations for:
- Sale revenue
- Sale cost
- Sale profit/loss
- Product revenue
- Product cost
- Product profit/loss
- Gross profit
- Expense total
- Net profit
- Current expected profit per product
- Loss-making products
- Low-margin products
- Payment method totals

Correct formulas:
Historical profit = SUM(line_profit_or_loss from sale_items)
Net profit = Gross profit - Expenses
Current expected profit = current_selling_price - average_unit_cost
Average selling price = total product revenue ÷ total quantity sold

Rules:
- Negative profit must be supported.
- Expenses reduce net profit.
- Debt sales count as sales/profit but affect cash flow differently.
- Cancelled/reversed sales must not count as active profit.
- All calculations must use real stored data.

Acceptance criteria:
- Profit changes after real sales.
- Net profit changes after expenses.
- Old profit does not change after price edits.
- Loss-making product is detected.
- Payment method totals are correct.
- Tests exist for all formulas.

After completion, provide the required module report.
```

---

# 14. Prompt 12: Analytics Engine

```txt id="0hud97"
Build the Buzz Duka Analytics Engine using real stored records.

Analytics must be calculated from:
- products
- stock_movements
- sales
- sale_items
- debts
- debt_payments
- expenses
- payment method fields

Build analytics for:
- total sales
- gross profit
- net profit
- payment method totals
- best-selling products
- low-selling products
- highest-profit products
- lowest-profit products
- low-margin products
- loss-making products
- average selling price
- average buying cost
- low-stock products
- dead stock
- stockout risk
- stock value
- debt totals
- expense totals
- restock suggestions
- price review alerts

Insight examples:
- Buying cost increased, but selling price stayed the same. Profit per item has reduced.
- This product is selling below cost.
- This product sells fast but gives low profit.
- This item is almost finished.
- This product has not sold recently.

Rules:
- No hardcoded dashboard values.
- No fake analytics.
- Analytics must update after real records change.
- Heavy analytics must not slow checkout.

Acceptance criteria:
- Best sellers come from real sale quantities.
- Product profit comes from sale item snapshots.
- Net profit includes expenses.
- Low stock comes from product stock.
- Dead stock uses real sale dates.
- Price review alerts use current selling price and average cost.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 15. Prompt 13: Owner Dashboard UI

```txt id="0t505j"
Build the Buzz Duka Owner Dashboard UI using the real Analytics Engine.

Do not use hardcoded dashboard numbers.

Owner dashboard should show:
- Today’s sales
- Gross profit
- Net profit
- Expenses
- Debt total
- Cash total
- M-Pesa total
- Bank total
- Debt sales total
- Low stock count
- Best-selling products
- Low-margin products
- Loss-making products
- Restock suggestions
- Price review alerts
- Recent activity

Rules:
- Dashboard data must come from analytics engine.
- Empty state must show when no data exists.
- Sales user must not access Owner dashboard.
- Dashboard should use simple shopkeeper language.
- Dashboard must load quickly.

Acceptance criteria:
- Dashboard updates after real sale.
- Dashboard updates after real expense.
- Dashboard updates after debt payment.
- Dashboard shows low stock from real product data.
- No hardcoded values exist.
- Sales user cannot access Owner dashboard.

After completion, provide the required module report.
```

---

# 16. Prompt 14: Sales User UI

```txt id="7vob12"
Build the Buzz Duka Sales User UI.

Sales user interface should focus on selling only.

Build:
- Sales home screen
- Sell button
- Product search access
- Recent sales
- Basic stock availability
- Pending sync count if sync exists
- No sensitive owner analytics

Sales user can:
- Search products
- Add items to cart
- Complete sales
- Select payment method
- Create debt sale if allowed
- View basic recent sales

Sales user cannot see:
- Net profit
- Gross profit analytics
- Expenses
- Advanced reports
- Subscription settings
- Device management
- Business settings

Rules:
- Restrictions must be enforced in logic, not only hidden UI.
- Do not expose owner data through direct navigation.

Acceptance criteria:
- Sales user can sell.
- Sales user cannot open Owner dashboard.
- Sales user cannot access expenses.
- Sales user cannot access subscription settings.
- Sales user cannot access device settings.
- Role tests/manual verification exist.

After completion, provide the required module report.
```

---

# 17. Prompt 15: Roles and Permissions Engine

```txt id="ra1qxb"
Build the Buzz Duka Roles and Permissions Engine.

Approved roles:
- Owner
- Sales

Build permission checks for:
- Navigation
- Screens
- Local actions
- Backend API calls later
- Reports
- Settings
- Device management
- Subscription management

Owner can:
- Manage products
- Manage stock
- Sell if device allows
- View analytics and profit
- Manage debts
- Manage expenses
- Manage subscription
- Manage devices
- View activity history
- Access settings

Sales can:
- Sell
- Search products
- View basic stock
- View recent sales
- Create debt sales if allowed

Sales cannot:
- View net profit
- View expenses
- View advanced analytics
- Manage subscription
- Manage devices
- Manage business settings

Acceptance criteria:
- Permission checks exist in shared logic.
- UI uses permission checks.
- Restricted actions are blocked even if user navigates directly.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 18. Prompt 16: Device Rules Engine

```txt id="ou8azj"
Build the Buzz Duka Device Rules Engine.

Base plan device rules:
- 1 business
- 1 owner
- 1 sales user
- Maximum 2 active devices
- Only 1 sales-enabled device

Build:
- Device registration
- Device ID storage
- Device status
- Sales-enabled flag
- Owner approval flow
- Device removal
- Device transfer
- Activity logs for device changes

Rules:
- Do not allow two sales-enabled devices in the base plan.
- Sales actions must only work on a sales-enabled device.
- Device identity must persist securely.
- Device changes must be logged.

Acceptance criteria:
- First device can register.
- Owner can approve second device.
- Only one device can be sales-enabled.
- Attempting to enable second sales device is blocked.
- Device transfer works.
- Activity log records device actions.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 19. Prompt 17: Offline Sync Engine

```txt id="723g3k"
Build the Buzz Duka Offline Sync Engine.

Core rule:
Save locally first. Sync later.

Build:
- Sync queue table usage
- Pending/syncing/synced/failed statuses
- Add sync item after local changes
- Retry failed sync
- Batch upload structure
- Duplicate prevention using local_id/server_id/idempotency key
- Sync error storage
- Pending sync count
- Manual retry action

Syncable records:
- products
- categories
- stock_movements
- sales
- sale_items
- debts
- debt_payments
- expenses
- receipts
- activity_logs
- subscription/license events where applicable

Do not claim sync is complete unless backend storage exists later.
For now, build local sync queue and sync-ready structure.

Acceptance criteria:
- Offline sale creates sync queue item.
- Sync item persists after restart.
- Failed sync stores error.
- Retry can be triggered.
- Sync status is real, not just UI text.
- No duplicate local sync items for same record/action.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 20. Prompt 18: Backend Foundation

```txt id="fwcq12"
Build the Buzz Duka backend foundation using Node.js + NestJS + TypeScript.

Use PostgreSQL + Prisma.

Build:
- NestJS project structure
- Prisma setup
- Environment config
- Health check endpoint
- Auth module skeleton
- Business module skeleton
- User module skeleton
- Device module skeleton
- Product module skeleton
- Inventory module skeleton
- Sales module skeleton
- Debt module skeleton
- Expense module skeleton
- Analytics module skeleton
- Subscription module skeleton
- Sync module skeleton
- Admin module skeleton

Do not build fake API responses.
Do not return dummy production data.

Acceptance criteria:
- Backend starts successfully.
- Prisma connects to database.
- Health check works.
- Modules are structured.
- Environment variables are used.
- No production dummy data is used.

After completion, provide the required module report.
```

---

# 21. Prompt 19: Authentication API

```txt id="67lnj1"
Build the Buzz Duka Authentication API.

Build:
- Register owner/business
- Login
- Logout if applicable
- Refresh token if applicable
- Password hashing
- JWT issuance
- Role loading
- Business ID loading
- Device ID association

Rules:
- User credentials must be checked.
- Protected endpoints must require auth.
- Token must include user_id, business_id, role.
- Do not fake login success.
- Do not allow cross-business access.

Acceptance criteria:
- Owner can register business.
- User can login with real credentials.
- Invalid login fails.
- JWT is issued.
- Protected route rejects unauthenticated request.
- Role and business_id are available in request context.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 22. Prompt 20: Product and Inventory API

```txt id="8wwbat"
Build the Buzz Duka Product and Inventory API.

Build endpoints for:
- create product
- update product
- deactivate product
- list products by business
- search products
- create category
- stock-in
- stock adjustment
- list stock movements

Rules:
- Every request must check authentication.
- Every request must enforce business_id.
- Owner can manage products/stock.
- Sales user can read basic product/stock data but cannot manage product settings by default.
- Stock-in must update moving weighted average cost.
- Stock movement must be recorded.
- No fake API responses.

Acceptance criteria:
- Product is saved to PostgreSQL.
- Product belongs to correct business.
- Stock-in updates stock and average cost.
- Stock movement is created.
- Sales user cannot edit products.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 23. Prompt 21: Sales and Payment API

```txt id="f95oa7"
Build the Buzz Duka Sales and Payment API.

Build endpoints for:
- create sale
- list sales
- get sale details
- list sale items
- get receipt
- cancel/reverse sale if approved

Allowed payment methods:
- Cash
- M-Pesa
- Bank
- Debt

Do not add:
- M-Pesa code field
- M-Pesa verification
- M-Pesa reconciliation
- Daraja/STK/Till/PayBill/Pochi integration

Rules:
- Sale must create sale items.
- Sale must save price snapshots.
- Sale must reduce stock.
- Sale must create stock movements.
- Sale must calculate revenue, cost, profit/loss.
- Sale must generate receipt.
- Sale must enforce business_id.
- Sale must be idempotent to prevent duplicate sync uploads.

Acceptance criteria:
- Sale saves to PostgreSQL.
- Sale items save with snapshots.
- Stock reduces.
- Profit/loss is correct.
- Old sale is unchanged after price edit.
- Duplicate sync upload is prevented.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 24. Prompt 22: Sync API

```txt id="05nbxz"
Build the Buzz Duka Sync API.

Build:
- batch upload endpoint
- download changes endpoint if needed
- sync status response
- idempotency handling
- conflict detection structure
- failed record error response

Rules:
- Every synced record must include business_id.
- Backend must prevent duplicate records using local_id/idempotency key.
- Backend must enforce auth and business isolation.
- Sync must not allow one shop to write to another shop.
- Do not mark records synced unless backend stored them.

Acceptance criteria:
- Batch upload stores real records.
- Duplicate upload does not duplicate sales.
- Invalid business access is blocked.
- Failed records return useful errors.
- Mobile app can mark records synced after backend confirmation.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 25. Prompt 23: Subscription and License Engine

```txt id="kj494n"
Build the Buzz Duka Subscription and License Engine.

Main plan:
Buzz Duka Smart Plan = KSh 1,500/month

Build:
- subscription status
- expiry date
- grace period
- suspended status
- reactivation status
- offline license token structure
- license validation
- license refresh
- restricted mode after expiry

Statuses:
- active
- grace
- expired
- suspended
- reactivated

Rules:
- App must not allow unlimited offline use after expiry.
- Subscription screen must remain accessible when restricted.
- License state must persist securely.
- Sales may be restricted after expiry/grace according to subscription rules.
- Use simple messages.

Do not build complex billing marketplace or enterprise plans.

Acceptance criteria:
- Active subscription allows use.
- Expired subscription enters grace.
- After grace, access is restricted.
- Offline license is checked.
- Reactivation restores access.
- Tests/manual verification exist.

After completion, provide the required module report.
```

---

# 26. Prompt 24: Admin Dashboard Foundation

```txt id="rfx8mf"
Build the Buzz Duka internal Admin Dashboard foundation using Next.js + TypeScript.

This dashboard is for Buzz Duka operator, not shop customers.

Build:
- Admin login structure
- Dashboard shell
- Shop list page
- Shop detail page
- Subscription status view
- Device view
- Sync issues view
- Admin audit log structure

Rules:
- Do not use fake shop data for production.
- Admin dashboard must read from backend APIs.
- Admin actions must be logged.
- Do not expose admin dashboard to normal shop users.

Acceptance criteria:
- Admin dashboard runs.
- Admin can view real shops from backend when available.
- Empty state appears if no shops exist.
- No hardcoded shop counts or fake revenue.
- Admin routes are protected.

After completion, provide the required module report.
```

---

# 27. Prompt 25: Final Testing and Hardening

```txt id="cqadv6"
Run final testing and hardening for Buzz Duka.

Test these flows:
1. Register business.
2. Add product.
3. Add stock.
4. Change buying price through stock-in.
5. Confirm moving weighted average cost.
6. Change selling price.
7. Make sale.
8. Confirm sale snapshots.
9. Confirm stock reduction.
10. Confirm profit/loss.
11. Add expense.
12. Confirm net profit changes.
13. Create debt sale.
14. Record partial debt payment.
15. Confirm debt balance.
16. Use Sales user and confirm restrictions.
17. Use app offline.
18. Make offline sale.
19. Confirm local persistence.
20. Sync when online.
21. Confirm no duplicate sale.
22. Test subscription expiry/grace/restriction.
23. Confirm dashboard uses real data only.

Fix bugs without rewriting unrelated modules.

After testing, provide:
- Tests run
- Pass/fail results
- Bugs found
- Bugs fixed
- Remaining known limitations
- Release readiness status
```

---

# 28. How to Use These Prompts

Use the prompts in order.

Do not combine many prompts into one huge prompt.

Recommended usage:

```txt id="1eua3y"
Step 1: Give Antigravity Prompt 1.
Step 2: Review output.
Step 3: Confirm no fake data.
Step 4: Run app/test.
Step 5: Fix issues.
Step 6: Move to Prompt 2.
```

Repeat until the app is complete.

---

# 29. Stop Rule

Stop Antigravity immediately if it:

* Adds M-Pesa verification
* Uses fake dashboard data
* Builds UI before data logic
* Skips SQLite
* Skips price snapshots
* Calculates profit from current product prices
* Does not persist data
* Does not provide manual verification
* Claims a module is complete without tests/checks
* Changes the tech stack without permission
* Rewrites working modules unnecessarily

---

# 30. Final Instruction

Buzz Duka must be built through controlled, verified modules.

Each Antigravity prompt should produce a real working piece of the app.

Do not chase many screens at once.

Build the engine first, connect the UI after, then test everything.

The goal is a real app that can handle real shop products, changing buying prices, changing selling prices, fast sales, stock reduction, debts, expenses, offline use, subscriptions, and accurate analytics.
