# DOCUMENT 4: INVENTORY, PRICING & COSTING ENGINE SPECIFICATION

## Buzz Duka — Product, Stock, Buying Price, Selling Price & Cost Accuracy

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Engine specification master document
**Purpose:** Define how Buzz Duka must handle products, stock, stock-in, buying price changes, selling price changes, moving weighted average cost, stock value, price history, and sale price snapshots.
**Core Rule:** Inventory and costing must be accurate because sales, profit, analytics, and owner decisions depend on them.

---

# 1. Purpose of This Document

This document defines the required behavior for Buzz Duka’s inventory, pricing, and costing system.

Antigravity must use this document when building:

* Product creation
* Product editing
* Product search
* Category management
* Stock-in
* Stock adjustment
* Stock movement history
* Buying price changes
* Selling price changes
* Moving weighted average cost
* Stock value
* Current expected profit
* Sale item price snapshots
* Cost correction/revaluation
* Inventory-related analytics

This engine must be built before advanced dashboard analytics because most analytics depend on accurate product and stock data.

---

# 2. Core Inventory Principle

Buzz Duka must treat inventory as the foundation of the app.

Every normal sellable item should be registered as a product.

A sale should normally come from a registered product so that Buzz Duka can:

* Reduce stock
* Save sale item details
* Save cost at sale
* Save selling price at sale
* Calculate profit/loss
* Track best sellers
* Track low stock
* Track stock value
* Produce accurate analytics

Do not build Buzz Duka as a simple calculator that only records totals.

---

# 3. Product Record Specification

Each product must have these fields:

```txt id="yz58qr"
product_id
local_id
server_id
business_id
product_name
category_id
sku_optional
barcode_optional
description_optional
current_stock_quantity
low_stock_level
default_buying_price
current_selling_price
average_unit_cost
stock_value
status
created_by
created_at
updated_at
```

## Required fields

The following must be required:

```txt id="u3flgv"
business_id
product_name
current_stock_quantity
current_selling_price
average_unit_cost
stock_value
status
created_at
updated_at
```

## Optional fields

The following may be optional:

```txt id="23g13w"
category_id
sku
barcode
description
low_stock_level
default_buying_price
```

If low stock level is not provided, Buzz Duka may use a sensible default such as zero or ask Owner to set it later.

---

# 4. Product Status Rules

A product may have these statuses:

```txt id="iq9293"
active
inactive
archived
```

## active

Product appears in selling search and product list.

## inactive

Product does not appear in normal selling search, but historical sale records remain.

## archived

Product is hidden from normal management screens but old records remain available.

Do not hard delete products casually because old sales and analytics may depend on them.

---

# 5. Product Creation Rules

When Owner creates a product, Buzz Duka must:

1. Validate required fields.
2. Save product to local database.
3. Set initial stock quantity.
4. Set current selling price.
5. Set default buying price if provided.
6. Set average unit cost.
7. Calculate stock value.
8. Create stock movement if initial stock is greater than zero.
9. Create activity log.
10. Create sync queue item where applicable.

If initial stock is greater than zero, Buzz Duka must know the initial buying cost.

Initial stock should not exist with unknown cost unless explicitly allowed with a warning.

---

# 6. Product Creation Example

Example:

```txt id="hdk9zp"
Product name: Lotion
Initial stock: 10
Buying price: KSh 250
Selling price: KSh 400
Low stock level: 3
```

Expected result:

```txt id="spl4rs"
current_stock_quantity = 10
default_buying_price = 250
current_selling_price = 400
average_unit_cost = 250
stock_value = 2,500
status = active
```

A stock movement must be created:

```txt id="3sqha6"
movement_type = stock_in
quantity_change = +10
quantity_before = 0
quantity_after = 10
unit_cost = 250
stock_value_before = 0
stock_value_after = 2,500
average_cost_before = 0
average_cost_after = 250
```

---

# 7. Product Editing Rules

Owner may edit:

* Product name
* Category
* Low-stock level
* Current selling price
* Default buying price for future stock-in
* Description
* SKU/barcode if available
* Status

Owner must not casually edit:

* Historical sale item cost
* Historical sale item selling price
* Old stock movement records
* Old profit reports

Changing product details must not corrupt old sales.

Old sale records should keep product name snapshot and price snapshots.

---

# 8. Product Search Rules

Product search must be fast and local-first.

Search should support:

* Product name
* Category
* SKU/barcode if available
* Recently sold products if implemented
* Active products only by default

Sales user should see simple product availability.

Owner may see more information such as cost, profit, and stock value.

Sales user should not see sensitive profit/cost fields unless explicitly allowed.

---

# 9. Category Rules

Categories help organize products.

Category record should include:

```txt id="o0vknd"
category_id
business_id
category_name
status
created_at
updated_at
```

Category changes should not affect old sale item snapshots.

If a category is deleted or archived, products should not break.

---

# 10. Stock Quantity Rule

Product stock quantity must represent the current available quantity.

Stock quantity must only change through approved stock movements:

```txt id="08x11x"
stock_in
sale
debt_sale
adjustment
damage
loss
reversal
cost_correction
```

Do not silently update stock without a stock movement.

Every stock change must be auditable.

---

# 11. Stock Movement Record Specification

Every stock movement must include:

```txt id="n3cixv"
stock_movement_id
local_id
server_id
business_id
product_id
movement_type
quantity_change
quantity_before
quantity_after
unit_cost
stock_value_before
stock_value_after
average_cost_before
average_cost_after
reason
reference_type
reference_id
created_by
created_at
sync_status
```

## Reference type examples

```txt id="i2n66v"
product_creation
stock_in
sale
debt_sale
adjustment
damage
loss
reversal
cost_correction
```

This allows stock movement to link back to the action that caused it.

---

# 12. Stock-In Rules

Stock-in means adding new stock.

When adding stock, Owner must enter:

```txt id="jqom90"
product
quantity_added
unit_buying_price
```

Optional:

```txt id="30w4wi"
supplier_name
note
stock_in_date
```

Stock-in must:

* Increase product quantity
* Update stock value
* Recalculate average unit cost
* Save stock movement
* Save cost history
* Create activity log
* Queue sync if sync is enabled

---

# 13. Stock-In Formula

When new stock is added, calculate:

```txt id="k35m20"
added_stock_value = added_quantity × unit_buying_price
old_stock_value = old_quantity × old_average_unit_cost
new_stock_value = old_stock_value + added_stock_value
new_quantity = old_quantity + added_quantity
new_average_unit_cost = new_stock_value ÷ new_quantity
```

Same formula written directly:

```txt id="t8gnvq"
New Average Unit Cost =
((Old Quantity × Old Average Cost) + (Added Quantity × Added Buying Price))
÷
(Old Quantity + Added Quantity)
```

---

# 14. Stock-In Example

Before stock-in:

```txt id="b495a3"
Product: Lotion
Remaining stock: 6
Average unit cost: KSh 250
Stock value: KSh 1,500
```

New stock:

```txt id="bgkb53"
Added quantity: 10
Buying price: KSh 300
Added stock value: KSh 3,000
```

Expected result:

```txt id="lh3vn5"
New stock quantity = 16
New stock value = 4,500
New average unit cost = 281.25
```

Calculation:

```txt id="hm06mq"
((6 × 250) + (10 × 300)) ÷ 16
= (1,500 + 3,000) ÷ 16
= 4,500 ÷ 16
= 281.25
```

---

# 15. Buying Price Rules

Buying price is not just one simple fixed number.

Buzz Duka must understand that the same product can be bought at different prices over time.

Rules:

* Buying price changes mainly when stock is added.
* Default buying price is only a suggested price for future stock-in.
* Changing default buying price must not rewrite current stock cost.
* Historical stock-in records must remain.
* Historical sales must remain unchanged.
* Average unit cost must represent the average cost of remaining stock.

Do not calculate profit using default buying price if average unit cost is available.

---

# 16. Default Buying Price Rule

Default buying price helps the Owner enter future stock faster.

Example:

```txt id="pjk0vb"
Default buying price = KSh 300
```

When Owner opens stock-in screen, Buzz Duka may prefill buying price with KSh 300.

But if Owner changes default buying price:

* Current stock value should not change automatically.
* Old stock movements should not change.
* Old sales should not change.
* Future stock-in may use the new default value.

Default buying price is not the same as historical cost.

---

# 17. Average Unit Cost Rule

Average unit cost represents the estimated cost of one unit in current remaining stock.

Formula:

```txt id="ml5h1l"
average_unit_cost = stock_value ÷ current_stock_quantity
```

If stock quantity is zero:

```txt id="4wenbk"
average_unit_cost may remain as last known cost or become zero based on approved implementation,
but the app must avoid division by zero.
```

Recommended rule:

* If stock quantity is zero, keep last known average cost for reference.
* Set stock value to zero.
* Next stock-in recalculates based on new stock.

---

# 18. Stock Value Rule

Stock value represents the estimated value of remaining inventory.

Formula:

```txt id="dp6s45"
stock_value = current_stock_quantity × average_unit_cost
```

When stock is added:

```txt id="lem0rj"
stock_value increases by quantity_added × unit_buying_price
```

When stock is sold:

```txt id="aiwfbw"
stock_value decreases by quantity_sold × unit_cost_at_sale
```

Stock value must never be hardcoded.

---

# 19. Selling Price Rules

Selling price can change at any time.

Owner may change current selling price because:

* Supplier cost changed
* Market price changed
* Competition changed
* Owner wants more profit
* Owner wants to clear stock

When selling price changes:

* Product current selling price updates.
* Price history record is created.
* New sales use new selling price.
* Old sales remain unchanged.

Do not recalculate old sale revenue after selling price changes.

---

# 20. Selling Price Change Example

Before change:

```txt id="g4k5z1"
Product: Lotion
Current selling price: KSh 400
```

Owner changes selling price:

```txt id="ol7jzq"
New selling price: KSh 450
```

Expected result:

```txt id="cpwthq"
Old sales remain at KSh 400
New sales use KSh 450
Current expected profit updates
Price history saves the change
```

---

# 21. Price History Specification

Price history should record important price changes.

Record fields:

```txt id="hfd1vv"
price_history_id
business_id
product_id
price_type
old_value
new_value
reason_optional
changed_by
changed_at
```

Price types:

```txt id="do533n"
selling_price
default_buying_price
average_cost_correction
```

Price history helps the Owner understand why profit changed.

---

# 22. Current Expected Profit Rule

Current expected profit shows expected profit if the product sells now.

Formula:

```txt id="hd7ufq"
current_expected_profit = current_selling_price - average_unit_cost
```

Example:

```txt id="eer0ak"
Current selling price = KSh 450
Average unit cost = KSh 281.25

Current expected profit = 450 - 281.25
= KSh 168.75
```

This is not historical profit.

Historical profit comes from sale item snapshots.

---

# 23. Current Expected Margin Rule

Current expected margin may be calculated as:

```txt id="74o3fs"
current_expected_margin =
(current_expected_profit ÷ current_selling_price) × 100
```

If selling price is zero, avoid division by zero.

This value helps identify low-margin products.

---

# 24. Sale Item Snapshot Preparation Rule

When a sale happens, the Sales Engine must get product cost and price from the Inventory/Pricing Engine.

Every sale item must capture:

```txt id="3n7ky6"
product_id
product_name_snapshot
quantity_sold
unit_cost_at_sale
unit_selling_price_at_sale
line_revenue
line_cost
line_profit_or_loss
margin_percentage
stock_quantity_before_sale
stock_quantity_after_sale
average_cost_at_sale
created_at
```

These fields must not change after the sale.

---

# 25. Sale Snapshot Formula

For each sale item:

```txt id="wmel5h"
unit_cost_at_sale = product.average_unit_cost at sale time
unit_selling_price_at_sale = product.current_selling_price at sale time
line_revenue = quantity_sold × unit_selling_price_at_sale
line_cost = quantity_sold × unit_cost_at_sale
line_profit_or_loss = line_revenue - line_cost
```

Margin:

```txt id="coq91e"
margin_percentage = (line_profit_or_loss ÷ line_revenue) × 100
```

If line revenue is zero, avoid division by zero.

---

# 26. Sale Stock Reduction Rule

When a product is sold:

* Stock quantity decreases by quantity sold.
* Stock value decreases by quantity sold × unit cost at sale.
* Average unit cost normally remains the same.
* Stock movement is created.
* Sale item snapshot is saved.

Example:

```txt id="ic2i9a"
Current stock: 16
Average unit cost: KSh 281.25
Selling price: KSh 450
Quantity sold: 2

Revenue = 900
Cost = 562.50
Profit = 337.50
New stock = 14
Stock value decrease = 562.50
```

---

# 27. Low Stock Rule

A product is low stock if:

```txt id="20k56w"
current_stock_quantity <= low_stock_level
```

Low-stock alerts must come from real product stock.

Do not hardcode low-stock products.

If low stock level is not set, either:

* Do not show low-stock alert for that product, or
* Use a default threshold based on approved settings.

---

# 28. Dead Stock Rule

A product may be considered dead stock if it has not sold for a selected number of days.

Example:

```txt id="9nmg3e"
dead_stock_days = 30
```

Dead stock should be calculated from real sale item records.

Do not mark products as dead stock using fake examples.

---

# 29. Stock Adjustment Rules

Stock adjustment is used when physical stock differs from app stock.

Examples:

* Counting error
* Damaged items
* Lost items
* Found items
* Correction after manual count

Stock adjustment must:

* Be Owner-only by default
* Require reason
* Save before/after quantity
* Save stock movement
* Update stock value
* Create activity log

Do not allow silent adjustment.

---

# 30. Damage and Loss Rules

Damage/loss reduces stock.

Damage/loss must:

* Reduce stock quantity
* Reduce stock value using current average unit cost
* Save stock movement
* Require reason
* Create activity log
* Affect inventory reports

Damage/loss should not create a sale.

It reduces stock but does not increase revenue.

---

# 31. Reversal Rules

If a sale is reversed, stock may need to be restored.

Reversal must:

* Mark original sale as reversed/cancelled
* Create reversal stock movement
* Restore stock where appropriate
* Exclude reversed sale from active analytics
* Preserve original sale history
* Create activity log

Do not delete original sale records.

---

# 32. Cost Correction/Revaluation Rules

Cost correction is used only when current remaining stock cost is wrong.

It must be:

* Owner-only
* Reason-required
* Audited
* Recorded in price/cost history
* Applied to remaining stock only
* Not applied to old sale item snapshots

Cost correction may update:

```txt id="wi00fg"
average_unit_cost
stock_value
```

It must not rewrite:

```txt id="55xdlp"
old sale item unit_cost_at_sale
old line_cost
old line_profit_or_loss
old reports for past sales
```

---

# 33. Negative Stock Rule

Default first version rule:

```txt id="cnx4gq"
Do not allow negative stock.
```

If quantity requested is greater than available stock, show:

```txt id="xxjxwe"
Stock is not enough for this sale.
```

Future versions may allow controlled negative stock, but not in the first version unless explicitly approved.

---

# 34. Fractional Quantity Rule

First version should focus on whole-number quantities for normal shop products.

Examples:

```txt id="aouj9d"
1 lotion
2 chargers
3 bottles
```

Fractional quantity support for items sold by weight may be future feature.

Do not add complex unit-of-measure logic early unless explicitly approved.

---

# 35. Inventory Engine Functions

Antigravity should implement reusable engine functions.

Suggested functions:

```txt id="fxz316"
createProduct(input)
updateProduct(productId, input)
deactivateProduct(productId)
searchProducts(query, businessId)
addStock(productId, quantity, buyingPrice, userId)
adjustStock(productId, newQuantity, reason, userId)
recordDamageOrLoss(productId, quantity, reason, userId)
calculateMovingAverageCost(oldQty, oldAvgCost, addedQty, addedCost)
calculateStockValue(quantity, averageUnitCost)
changeSellingPrice(productId, newSellingPrice, reason, userId)
calculateCurrentExpectedProfit(product)
generateSaleItemSnapshot(product, quantity)
reduceStockForSale(productId, quantity, saleId, userId)
```

Business logic must live in engines/services, not only inside UI components.

---

# 36. Validation Rules

Antigravity must validate:

```txt id="w90atv"
product_name is required
quantity cannot be negative
stock-in quantity must be greater than zero
buying price cannot be negative
selling price cannot be negative
low stock level cannot be negative
adjustment reason is required
cost correction reason is required
business_id is required
```

Do not remove validation to avoid errors.

---

# 37. Required Activity Logs

Inventory/pricing actions must create activity logs.

Required logs:

* Product created
* Product edited
* Product deactivated
* Category created
* Stock added
* Stock adjusted
* Damage/loss recorded
* Selling price changed
* Default buying price changed
* Average cost recalculated
* Cost correction performed
* Product reached low stock
* Sale reduced stock

Activity logs must show real actions.

---

# 38. Required Tests

Antigravity must test:

```txt id="n4p6k7"
Product creation
Initial stock creation
Stock-in
Moving weighted average cost
Stock value update
Selling price change
Default buying price change
Sale item snapshot generation
Stock reduction after sale
Low-stock detection
Stock adjustment
Damage/loss
Cost correction
Old sale snapshot unchanged after price change
```

---

# 39. Required Manual Verification Test

Use this test to verify inventory, pricing, and costing:

```txt id="lt2suj"
1. Create product: Lotion.
2. Initial quantity: 10.
3. Buying price: KSh 250.
4. Selling price: KSh 400.
5. Confirm average cost = KSh 250.
6. Confirm stock value = KSh 2,500.
7. Simulate or complete sale of 4 units.
8. Confirm remaining stock = 6.
9. Confirm stock value = KSh 1,500.
10. Add 10 units at buying price KSh 300.
11. Confirm new stock = 16.
12. Confirm stock value = KSh 4,500.
13. Confirm average unit cost = KSh 281.25.
14. Change selling price to KSh 450.
15. Confirm current expected profit = KSh 168.75.
16. Sell 2 units.
17. Confirm revenue = KSh 900.
18. Confirm cost = KSh 562.50.
19. Confirm profit = KSh 337.50.
20. Confirm remaining stock = 14.
21. Confirm old sale remains unchanged.
```

If this test fails, inventory/costing is not accurate.

---

# 40. Antigravity Completion Report

After building this module, Antigravity must report:

```txt id="qb72z2"
Module name:
Files created:
Files modified:
Database tables affected:
Engine functions added:
Business rules implemented:
Tests added:
Manual verification steps:
Known limitations:
No fake data confirmation:
```

---

# 41. Final Rule

Buzz Duka’s inventory and costing engine must protect the truth of the shop.

The app must always know:

```txt id="s1n4oy"
What product exists
How much stock remains
How stock changed
What the stock cost
What the product sells for now
What cost was used during each sale
What profit or loss was made
```

Do not fake inventory.

Do not hardcode costs.

Do not rewrite old sales.

Do not calculate historical profit from current prices.

Buzz Duka must remain accurate even when buying prices and selling prices change over time.
