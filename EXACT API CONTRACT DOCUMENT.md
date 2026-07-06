# DOCUMENT 17: EXACT API CONTRACT DOCUMENT

## Buzz Duka — Backend Endpoints, Request Bodies, Response Bodies, Permissions & Reconciliation APIs

**Document Version:** 1.0
**Product Name:** Buzz Duka
**Document Type:** Exact API contract document
**Purpose:** Define the backend API endpoints Antigravity must build for authentication, business setup, users, devices, products, stock, sales, debts, expenses, analytics, sync, subscription payment reconciliation, and admin operations.
**Core Rule:** APIs must write and read real database records. No dummy responses, no fake success, no fake subscription activation, no cross-business data leaks.

---

# 1. Purpose of This Document

This document defines Buzz Duka backend API contracts.

Antigravity must use this document when building:

* NestJS backend controllers
* Backend services
* Prisma database logic
* Mobile app API client
* Admin dashboard API integration
* Sync API
* Subscription payment reconciliation API
* Security tests
* API integration tests

The API must not return fake production data.

---

# 2. API Architecture

Approved backend stack:

```txt id="yk9hrn"
Node.js
NestJS
TypeScript
PostgreSQL
Prisma
REST API
JWT authentication
```

Recommended API structure:

```txt id="ibw506"
/auth
/businesses
/users
/devices
/categories
/products
/inventory
/sales
/receipts
/debts
/expenses
/analytics
/sync
/subscription
/admin
```

---

# 3. Global API Rules

Every protected API must check:

```txt id="gvxspx"
1. Authentication
2. User status
3. Business ID
4. Role permission
5. Device status where required
6. Subscription/license status where required
7. Idempotency where mutation can duplicate records
```

APIs must never trust only frontend restrictions.

---

# 4. API Response Format

All API responses should follow a consistent format.

## Success response

```json id="oquun9"
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

## Error response

```json id="sakzq5"
{
  "success": false,
  "error_code": "ACCESS_DENIED",
  "message": "You do not have permission to perform this action.",
  "details": {}
}
```

Do not return unclear errors without useful messages.

---

# 5. Common Error Codes

Approved API error codes:

```txt id="d5d7ps"
UNAUTHENTICATED
ACCESS_DENIED
BUSINESS_NOT_FOUND
USER_BLOCKED
DEVICE_NOT_ALLOWED
DEVICE_LIMIT_REACHED
SALES_DEVICE_LIMIT_REACHED
SUBSCRIPTION_EXPIRED
SUBSCRIPTION_SUSPENDED
OFFLINE_LICENSE_EXPIRED
VALIDATION_ERROR
PRODUCT_NOT_FOUND
STOCK_NOT_ENOUGH
SALE_NOT_FOUND
SALE_ALREADY_REVERSED
DUPLICATE_RECORD
DUPLICATE_TRANSACTION
PAYMENT_NOT_CONFIRMED
PAYMENT_AMOUNT_INVALID
PAYMENT_TILL_MISMATCH
SYNC_FAILED
SERVER_ERROR
```

---

# 6. Authentication Header

Protected requests must use:

```txt id="gm0oy8"
Authorization: Bearer <access_token>
```

Where device validation is needed, request should also include:

```txt id="ixn7xk"
X-Device-Id: <device_id>
```

For idempotent mutation requests:

```txt id="i5v2yy"
Idempotency-Key: <unique_key>
```

---

# 7. Auth APIs

## 7.1 Register Owner and Business

Endpoint:

```txt id="kuxr20"
POST /auth/register-business
```

Purpose:

Create Owner account, business, first device, subscription/license foundation.

Permission:

```txt id="i0z3k2"
Public
```

Request:

```json id="g5y3vq"
{
  "owner_name": "Tabitha",
  "phone": "0712345678",
  "email": "owner@example.com",
  "password": "securePassword",
  "business_name": "Tabitha Shop",
  "business_category": "Retail",
  "location": "Nairobi",
  "device_name": "Samsung A12",
  "device_fingerprint": "unique-device-fingerprint"
}
```

Response:

```json id="dt6hth"
{
  "success": true,
  "data": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "business": {
      "id": "business_id",
      "business_name": "Tabitha Shop"
    },
    "user": {
      "id": "user_id",
      "role": "owner",
      "full_name": "Tabitha"
    },
    "device": {
      "id": "device_id",
      "status": "active",
      "is_sales_enabled": true
    },
    "subscription": {
      "status": "active",
      "plan_name": "Buzz Duka Smart Plan"
    }
  },
  "message": "Business registered successfully."
}
```

Rules:

* First user must be Owner.
* First device should be active.
* First device may be sales-enabled.
* Must not create duplicate business by accident.
* Password must be hashed.

---

## 7.2 Login

Endpoint:

```txt id="x3kcpv"
POST /auth/login
```

Permission:

```txt id="ydz8ih"
Public
```

Request:

```json id="7klm3k"
{
  "phone_or_email": "owner@example.com",
  "password": "securePassword",
  "device_fingerprint": "unique-device-fingerprint",
  "device_name": "Samsung A12"
}
```

Response:

```json id="krtme8"
{
  "success": true,
  "data": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "user": {
      "id": "user_id",
      "business_id": "business_id",
      "role": "owner",
      "status": "active"
    },
    "device": {
      "id": "device_id",
      "status": "active",
      "is_sales_enabled": true
    },
    "subscription": {
      "status": "active",
      "subscription_end_at": "2026-08-30T00:00:00.000Z",
      "grace_until": "2026-09-02T00:00:00.000Z"
    },
    "permissions": []
  },
  "message": "Login successful."
}
```

Rules:

* Block login for removed/blocked users.
* Device must be known or registered as pending depending policy.
* Do not return password hash.

---

## 7.3 Refresh Token

Endpoint:

```txt id="o7spvh"
POST /auth/refresh
```

Request:

```json id="7ynd6c"
{
  "refresh_token": "refresh_token"
}
```

Response:

```json id="7bn58a"
{
  "success": true,
  "data": {
    "access_token": "new_jwt_token"
  },
  "message": "Token refreshed."
}
```

---

## 7.4 Current User

Endpoint:

```txt id="cxva29"
GET /auth/me
```

Permission:

```txt id="fxf7px"
Authenticated user
```

Response:

```json id="5eaith"
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "business_id": "business_id",
      "role": "owner",
      "status": "active"
    },
    "business": {
      "id": "business_id",
      "business_name": "Tabitha Shop"
    },
    "device": {
      "id": "device_id",
      "status": "active",
      "is_sales_enabled": true
    },
    "subscription": {
      "status": "active"
    }
  },
  "message": "Current user loaded."
}
```

---

# 8. Business APIs

## 8.1 Get Business Profile

Endpoint:

```txt id="yo7v0y"
GET /businesses/current
```

Permission:

```txt id="fpq82k"
Owner
```

Response:

```json id="9l1z23"
{
  "success": true,
  "data": {
    "id": "business_id",
    "business_name": "Tabitha Shop",
    "business_category": "Retail",
    "location": "Nairobi",
    "status": "active"
  },
  "message": "Business profile loaded."
}
```

---

## 8.2 Update Business Profile

Endpoint:

```txt id="jz4cbg"
PATCH /businesses/current
```

Permission:

```txt id="fcxq95"
Owner
```

Request:

```json id="xszm8a"
{
  "business_name": "Tabitha Mini Shop",
  "business_category": "Retail",
  "location": "Nairobi"
}
```

Response:

```json id="ijhazj"
{
  "success": true,
  "data": {
    "id": "business_id",
    "business_name": "Tabitha Mini Shop"
  },
  "message": "Business profile updated."
}
```

---

# 9. User APIs

## 9.1 Create Sales User

Endpoint:

```txt id="nnhbme"
POST /users/sales
```

Permission:

```txt id="k1mdft"
Owner
```

Request:

```json id="d2sc8j"
{
  "full_name": "Jane",
  "phone": "0712345678",
  "email": "jane@example.com",
  "password": "temporaryPassword"
}
```

Response:

```json id="2i2dd5"
{
  "success": true,
  "data": {
    "id": "sales_user_id",
    "role": "sales",
    "status": "active"
  },
  "message": "Sales user created."
}
```

Rules:

* MVP allows one Sales user in base plan.
* Sales user cannot create another user.
* Password must be hashed.

---

## 9.2 List Users

Endpoint:

```txt id="lffdi0"
GET /users
```

Permission:

```txt id="w7c4r1"
Owner
```

Response:

```json id="i5lz54"
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "full_name": "Tabitha",
      "role": "owner",
      "status": "active"
    },
    {
      "id": "sales_user_id",
      "full_name": "Jane",
      "role": "sales",
      "status": "active"
    }
  ],
  "message": "Users loaded."
}
```

---

## 9.3 Block Sales User

Endpoint:

```txt id="h9dpm8"
PATCH /users/:id/block
```

Permission:

```txt id="kypasu"
Owner
```

Response:

```json id="lfqzsd"
{
  "success": true,
  "data": {
    "id": "sales_user_id",
    "status": "blocked"
  },
  "message": "User blocked."
}
```

---

# 10. Device APIs

## 10.1 Register Device

Endpoint:

```txt id="0dgvll"
POST /devices/register
```

Permission:

```txt id="pa1u7c"
Authenticated user
```

Request:

```json id="ovmho3"
{
  "device_name": "Samsung A12",
  "device_fingerprint": "unique-device-fingerprint"
}
```

Response:

```json id="2z5j89"
{
  "success": true,
  "data": {
    "id": "device_id",
    "status": "active",
    "is_sales_enabled": false
  },
  "message": "Device registered."
}
```

Rules:

* Base plan allows max 2 active devices.
* Device fingerprint must be unique per business.
* If limit exceeded, return `DEVICE_LIMIT_REACHED`.

---

## 10.2 List Devices

Endpoint:

```txt id="uzy79u"
GET /devices
```

Permission:

```txt id="55g6v3"
Owner
```

Response:

```json id="ir2tsx"
{
  "success": true,
  "data": [
    {
      "id": "device_id",
      "device_name": "Samsung A12",
      "status": "active",
      "is_sales_enabled": true,
      "last_seen_at": "2026-07-03T10:00:00.000Z"
    }
  ],
  "message": "Devices loaded."
}
```

---

## 10.3 Enable Sales on Device

Endpoint:

```txt id="w3rz2o"
PATCH /devices/:id/enable-sales
```

Permission:

```txt id="37in59"
Owner
```

Rules:

* Only one sales-enabled device allowed on base plan.
* Return `SALES_DEVICE_LIMIT_REACHED` if another device is already enabled.

Response:

```json id="3g8wss"
{
  "success": true,
  "data": {
    "id": "device_id",
    "is_sales_enabled": true
  },
  "message": "Sales enabled on device."
}
```

---

## 10.4 Block Device

Endpoint:

```txt id="2bmbum"
PATCH /devices/:id/block
```

Permission:

```txt id="lhbxi5"
Owner
```

Response:

```json id="gd78ze"
{
  "success": true,
  "data": {
    "id": "device_id",
    "status": "blocked"
  },
  "message": "Device blocked."
}
```

---

# 11. Category APIs

## 11.1 Create Category

Endpoint:

```txt id="dth07c"
POST /categories
```

Permission:

```txt id="sjmsk1"
Owner
```

Request:

```json id="5suhd6"
{
  "name": "Cosmetics"
}
```

Response:

```json id="3no82i"
{
  "success": true,
  "data": {
    "id": "category_id",
    "name": "Cosmetics",
    "is_active": true
  },
  "message": "Category created."
}
```

---

## 11.2 List Categories

Endpoint:

```txt id="n0nn5x"
GET /categories
```

Permission:

```txt id="z1ssvm"
Owner or Sales
```

Response:

```json id="ictfvz"
{
  "success": true,
  "data": [
    {
      "id": "category_id",
      "name": "Cosmetics",
      "is_active": true
    }
  ],
  "message": "Categories loaded."
}
```

---

# 12. Product APIs

## 12.1 Create Product

Endpoint:

```txt id="k6ml1e"
POST /products
```

Permission:

```txt id="p0arw0"
Owner
```

Request:

```json id="y3qdcy"
{
  "product_name": "Lotion",
  "category_id": "category_id",
  "initial_stock_quantity": 10,
  "buying_price_cents": 25000,
  "selling_price_cents": 40000,
  "low_stock_level": 2
}
```

Response:

```json id="35f2qc"
{
  "success": true,
  "data": {
    "id": "product_id",
    "product_name": "Lotion",
    "current_stock_quantity": 10,
    "average_unit_cost_cents": 25000,
    "current_selling_price_cents": 40000,
    "stock_value_cents": 250000
  },
  "message": "Product created."
}
```

Rules:

* If initial stock is greater than zero, buying price is required.
* Must create stock movement for initial stock.
* Must use transaction.

---

## 12.2 List Products

Endpoint:

```txt id="ctvlve"
GET /products
```

Permission:

```txt id="b7g94w"
Owner or Sales
```

Query parameters:

```txt id="795plq"
?search=Lotion&active=true
```

Sales response must not expose cost/profit fields.

Sales response:

```json id="hfjw4g"
{
  "success": true,
  "data": [
    {
      "id": "product_id",
      "product_name": "Lotion",
      "current_stock_quantity": 10,
      "current_selling_price_cents": 40000,
      "is_active": true
    }
  ],
  "message": "Products loaded."
}
```

Owner response may include cost fields:

```json id="c2ckqr"
{
  "success": true,
  "data": [
    {
      "id": "product_id",
      "product_name": "Lotion",
      "current_stock_quantity": 10,
      "average_unit_cost_cents": 25000,
      "current_selling_price_cents": 40000,
      "stock_value_cents": 250000,
      "is_active": true
    }
  ],
  "message": "Products loaded."
}
```

---

## 12.3 Update Product

Endpoint:

```txt id="tcj9rz"
PATCH /products/:id
```

Permission:

```txt id="l7kvq6"
Owner
```

Request:

```json id="v06dm3"
{
  "product_name": "Body Lotion",
  "category_id": "category_id",
  "low_stock_level": 3
}
```

Response:

```json id="9pnois"
{
  "success": true,
  "data": {
    "id": "product_id",
    "product_name": "Body Lotion"
  },
  "message": "Product updated."
}
```

Rules:

* Product edit must not rewrite old sale items.
* Cost changes must not happen through normal product edit.

---

## 12.4 Change Selling Price

Endpoint:

```txt id="jhkvkr"
POST /products/:id/change-selling-price
```

Permission:

```txt id="s19qin"
Owner
```

Request:

```json id="r5ck03"
{
  "new_selling_price_cents": 45000,
  "reason": "Supplier price changed"
}
```

Response:

```json id="2ou0az"
{
  "success": true,
  "data": {
    "id": "product_id",
    "old_selling_price_cents": 40000,
    "new_selling_price_cents": 45000
  },
  "message": "Selling price updated. Old sales will not change."
}
```

Rules:

* Must create price history.
* Affects new sales only.

---

## 12.5 Deactivate Product

Endpoint:

```txt id="rapdct"
PATCH /products/:id/deactivate
```

Permission:

```txt id="sredwp"
Owner
```

Response:

```json id="z88jwo"
{
  "success": true,
  "data": {
    "id": "product_id",
    "is_active": false
  },
  "message": "Product deactivated."
}
```

---

# 13. Inventory APIs

## 13.1 Stock-In

Endpoint:

```txt id="fd4z71"
POST /inventory/stock-in
```

Permission:

```txt id="v9xvq8"
Owner
```

Request:

```json id="zlwi40"
{
  "product_id": "product_id",
  "quantity_added": 10,
  "buying_price_cents": 30000,
  "note": "New stock"
}
```

Response:

```json id="lgl2l0"
{
  "success": true,
  "data": {
    "product_id": "product_id",
    "old_quantity": 6,
    "new_quantity": 16,
    "old_average_cost_cents": 25000,
    "new_average_cost_cents": 28125,
    "new_stock_value_cents": 450000
  },
  "message": "Stock added."
}
```

Rules:

* Must use moving weighted average.
* Must create stock movement.
* Must create price history if average cost changes.
* Must use transaction.

---

## 13.2 Stock Adjustment

Endpoint:

```txt id="v4hl7d"
POST /inventory/adjust
```

Permission:

```txt id="h798ng"
Owner
```

Request:

```json id="3z77fk"
{
  "product_id": "product_id",
  "quantity_change": -2,
  "reason": "Damaged items"
}
```

Response:

```json id="11ndc4"
{
  "success": true,
  "data": {
    "product_id": "product_id",
    "quantity_before": 16,
    "quantity_after": 14
  },
  "message": "Stock adjusted."
}
```

Rules:

* Reason is required.
* Must create stock movement.
* Must not allow negative stock unless future policy approves.

---

## 13.3 Stock Movement History

Endpoint:

```txt id="45418j"
GET /inventory/products/:productId/movements
```

Permission:

```txt id="vjk7g4"
Owner
```

Response:

```json id="tptqe6"
{
  "success": true,
  "data": [
    {
      "id": "movement_id",
      "movement_type": "stock_in",
      "quantity_change": 10,
      "quantity_before": 6,
      "quantity_after": 16,
      "created_at": "2026-07-03T10:00:00.000Z"
    }
  ],
  "message": "Stock movements loaded."
}
```

---

# 14. Sales APIs

## 14.1 Create Sale

Endpoint:

```txt id="x02i7g"
POST /sales
```

Permission:

```txt id="u41oqp"
Owner or Sales if device is sales-enabled and subscription allows selling
```

Headers:

```txt id="ujvrhz"
Authorization: Bearer <token>
X-Device-Id: <device_id>
Idempotency-Key: <unique_sale_key>
```

Request:

```json id="yze0kp"
{
  "payment_method": "mpesa",
  "items": [
    {
      "product_id": "product_id",
      "quantity": 4
    }
  ],
  "customer": null
}
```

Debt sale request:

```json id="xatf8n"
{
  "payment_method": "debt",
  "items": [
    {
      "product_id": "product_id",
      "quantity": 3
    }
  ],
  "customer": {
    "customer_name": "Mary",
    "phone": "0712345678",
    "due_date": "2026-08-01"
  }
}
```

Response:

```json id="hvm0nf"
{
  "success": true,
  "data": {
    "sale": {
      "id": "sale_id",
      "sale_number": "S-0001",
      "payment_method": "mpesa",
      "total_amount_cents": 160000,
      "total_cost_cents": 100000,
      "gross_profit_cents": 60000,
      "sale_status": "completed"
    },
    "items": [
      {
        "id": "sale_item_id",
        "product_id": "product_id",
        "product_name_snapshot": "Lotion",
        "quantity_sold": 4,
        "unit_cost_at_sale_cents": 25000,
        "unit_selling_price_at_sale_cents": 40000,
        "line_revenue_cents": 160000,
        "line_cost_cents": 100000,
        "line_profit_cents": 60000
      }
    ],
    "receipt": {
      "id": "receipt_id",
      "receipt_number": "R-0001"
    }
  },
  "message": "Sale completed."
}
```

Rules:

* Sale must use real products.
* Must check stock.
* Must reduce stock.
* Must create sale items with snapshots.
* Must create receipt.
* Must create debt if payment method is debt.
* Must create stock movement.
* Must create activity log.
* Must prevent duplicate sale using idempotency key.
* Do not ask for M-Pesa code.
* Do not verify shop customer M-Pesa payment.
* Sale amount is a record, not money held by Buzz Duka.

---

## 14.2 List Sales

Endpoint:

```txt id="nbhvm5"
GET /sales
```

Permission:

```txt id="q7n9r0"
Owner full access, Sales limited access
```

Query parameters:

```txt id="mvd01t"
?from=2026-07-01&to=2026-07-03&status=completed
```

Response:

```json id="mk6d6e"
{
  "success": true,
  "data": [
    {
      "id": "sale_id",
      "sale_number": "S-0001",
      "payment_method": "mpesa",
      "total_amount_cents": 160000,
      "sale_status": "completed",
      "created_at": "2026-07-03T10:00:00.000Z"
    }
  ],
  "message": "Sales loaded."
}
```

Sales user response must not include profit fields.

---

## 14.3 Get Sale Detail

Endpoint:

```txt id="7d3fgf"
GET /sales/:id
```

Permission:

```txt id="kvvy5u"
Owner full access, Sales limited access
```

Response:

```json id="5zzpc9"
{
  "success": true,
  "data": {
    "sale": {
      "id": "sale_id",
      "sale_number": "S-0001",
      "payment_method": "mpesa",
      "total_amount_cents": 160000,
      "sale_status": "completed"
    },
    "items": [
      {
        "product_name_snapshot": "Lotion",
        "quantity_sold": 4,
        "unit_selling_price_at_sale_cents": 40000,
        "line_revenue_cents": 160000
      }
    ],
    "receipt": {
      "receipt_number": "R-0001",
      "receipt_status": "active"
    }
  },
  "message": "Sale loaded."
}
```

Sales user must not receive cost/profit fields.

---

## 14.4 Reverse Sale

Endpoint:

```txt id="fobtvh"
POST /sales/:id/reverse
```

Permission:

```txt id="hdra6y"
Owner
```

Headers:

```txt id="r6tu3v"
Idempotency-Key: <unique_reversal_key>
```

Request:

```json id="ykxq4a"
{
  "reason": "Sale entered twice",
  "note": "Duplicate sale",
  "refund_required": true,
  "refund_method": "mpesa",
  "refund_note": "Refund handled outside Buzz Duka"
}
```

Response:

```json id="08eig3"
{
  "success": true,
  "data": {
    "sale_id": "sale_id",
    "sale_status": "reversed",
    "reversal_id": "reversal_id"
  },
  "message": "Sale reversed."
}
```

Rules:

* Original sale must not be deleted.
* Sale cannot be reversed twice.
* Stock must restore.
* Receipt must be marked reversed.
* Debt must be reversed/cancelled if debt sale.
* Refund note is informational only.
* Buzz Duka does not send or hold refund money.

---

# 15. Receipt APIs

## 15.1 Get Receipt

Endpoint:

```txt id="yoi76y"
GET /receipts/:id
```

Permission:

```txt id="5vi6yi"
Owner or Sales with allowed access
```

Response:

```json id="z4f9sz"
{
  "success": true,
  "data": {
    "receipt_number": "R-0001",
    "business_name": "Tabitha Shop",
    "receipt_status": "active",
    "total_amount_cents": 160000,
    "payment_method": "mpesa",
    "items": [
      {
        "product_name": "Lotion",
        "quantity": 4,
        "unit_price_cents": 40000,
        "line_total_cents": 160000
      }
    ]
  },
  "message": "Receipt loaded."
}
```

Rules:

* Receipt must not expose cost or profit.
* Reversed receipt must show reversed status.

---

# 16. Debt APIs

## 16.1 List Debts

Endpoint:

```txt id="a09hgj"
GET /debts
```

Permission:

```txt id="d4ejhz"
Owner
```

Response:

```json id="gd7pg2"
{
  "success": true,
  "data": [
    {
      "id": "debt_id",
      "customer_name": "Mary",
      "original_amount_cents": 120000,
      "amount_paid_cents": 50000,
      "balance_cents": 70000,
      "debt_status": "partial"
    }
  ],
  "message": "Debts loaded."
}
```

---

## 16.2 Get Debt Detail

Endpoint:

```txt id="d4b5d9"
GET /debts/:id
```

Permission:

```txt id="0o9vga"
Owner
```

Response:

```json id="r8a8hv"
{
  "success": true,
  "data": {
    "id": "debt_id",
    "customer": {
      "customer_name": "Mary",
      "phone": "0712345678"
    },
    "original_amount_cents": 120000,
    "amount_paid_cents": 50000,
    "balance_cents": 70000,
    "debt_status": "partial",
    "payments": []
  },
  "message": "Debt loaded."
}
```

---

## 16.3 Record Debt Payment

Endpoint:

```txt id="s8dehy"
POST /debts/:id/payments
```

Permission:

```txt id="bnso64"
Owner
```

Request:

```json id="3we05v"
{
  "amount_paid_cents": 50000,
  "payment_method": "cash",
  "note": "Paid today"
}
```

Response:

```json id="4g7u8a"
{
  "success": true,
  "data": {
    "debt_id": "debt_id",
    "payment_id": "payment_id",
    "amount_paid_cents": 50000,
    "new_balance_cents": 70000,
    "debt_status": "partial"
  },
  "message": "Debt payment recorded."
}
```

Rules:

* Payment cannot exceed balance unless future overpayment support exists.
* Debt payment record does not mean Buzz Duka holds money.

---

# 17. Expense APIs

## 17.1 Create Expense

Endpoint:

```txt id="jnl9e1"
POST /expenses
```

Permission:

```txt id="86ggmk"
Owner
```

Request:

```json id="nxr9s1"
{
  "amount_cents": 20000,
  "category": "transport",
  "description": "Delivery transport",
  "expense_date": "2026-07-03"
}
```

Response:

```json id="c9kqp1"
{
  "success": true,
  "data": {
    "id": "expense_id",
    "amount_cents": 20000,
    "category": "transport",
    "expense_status": "active"
  },
  "message": "Expense recorded."
}
```

Rules:

* Sales user cannot create expense.
* Expense amount is a record for net profit reports.
* Buzz Duka does not hold expense money.

---

## 17.2 List Expenses

Endpoint:

```txt id="07p094"
GET /expenses
```

Permission:

```txt id="yokbwn"
Owner
```

Query parameters:

```txt id="81pcfh"
?from=2026-07-01&to=2026-07-31
```

Response:

```json id="sapgrm"
{
  "success": true,
  "data": [
    {
      "id": "expense_id",
      "amount_cents": 20000,
      "category": "transport",
      "expense_date": "2026-07-03"
    }
  ],
  "message": "Expenses loaded."
}
```

---

## 17.3 Void Expense

Endpoint:

```txt id="5h11eu"
PATCH /expenses/:id/void
```

Permission:

```txt id="m3yig4"
Owner
```

Request:

```json id="8i6t0d"
{
  "reason": "Entered by mistake"
}
```

Response:

```json id="9gwdo2"
{
  "success": true,
  "data": {
    "id": "expense_id",
    "expense_status": "voided"
  },
  "message": "Expense voided."
}
```

---

# 18. Analytics APIs

## 18.1 Dashboard Summary

Endpoint:

```txt id="wzaxwr"
GET /analytics/dashboard
```

Permission:

```txt id="4ni8zy"
Owner
```

Query parameters:

```txt id="4cfpua"
?from=2026-07-03&to=2026-07-03
```

Response:

```json id="tsfenb"
{
  "success": true,
  "data": {
    "total_sales_cents": 250000,
    "gross_profit_cents": 93750,
    "expenses_cents": 10000,
    "net_profit_cents": 83750,
    "debt_total_cents": 70000,
    "payment_totals": {
      "cash_cents": 90000,
      "mpesa_cents": 160000,
      "bank_cents": 0,
      "debt_cents": 70000
    },
    "low_stock_count": 2,
    "pending_sync_count": 3
  },
  "message": "Dashboard summary loaded."
}
```

Rules:

* Must use real records.
* Must exclude reversed sales from active totals.
* Must use sale item snapshots for profit.
* Sales user cannot access owner analytics.

---

## 18.2 Product Performance

Endpoint:

```txt id="l1u6f3"
GET /analytics/products
```

Permission:

```txt id="l7p09r"
Owner
```

Response:

```json id="97twtt"
{
  "success": true,
  "data": [
    {
      "product_id": "product_id",
      "product_name": "Lotion",
      "quantity_sold": 6,
      "revenue_cents": 250000,
      "gross_profit_cents": 93750
    }
  ],
  "message": "Product analytics loaded."
}
```

---

# 19. Sync APIs

## 19.1 Batch Upload

Endpoint:

```txt id="tqo2uq"
POST /sync/batch-upload
```

Permission:

```txt id="gbxny0"
Authenticated allowed device
```

Request:

```json id="i2psqf"
{
  "business_id": "business_id",
  "device_id": "device_id",
  "records": [
    {
      "record_type": "sale_bundle",
      "operation_type": "create",
      "local_id": "local_sale_id",
      "idempotency_key": "business-device-local-sale",
      "payload": {
        "sale": {},
        "sale_items": [],
        "stock_movements": [],
        "receipt": {},
        "debt": null,
        "activity_logs": []
      },
      "created_at": "2026-07-03T10:00:00.000Z",
      "updated_at": "2026-07-03T10:00:00.000Z"
    }
  ]
}
```

Response:

```json id="70tfk1"
{
  "success": true,
  "data": {
    "success_records": [
      {
        "local_id": "local_sale_id",
        "server_id": "server_sale_id",
        "record_type": "sale_bundle",
        "idempotency_key": "business-device-local-sale"
      }
    ],
    "failed_records": []
  },
  "message": "Sync completed."
}
```

Rules:

* Must use idempotency.
* Duplicate upload must not duplicate sale.
* Business ID must be enforced.
* Removed device cannot sync new sales.
* Failed records must return clear errors.

---

## 19.2 Download Changes

Endpoint:

```txt id="c6lctg"
GET /sync/changes
```

Permission:

```txt id="sqexim"
Authenticated allowed device
```

Query parameters:

```txt id="o5bnj6"
?since=2026-07-03T00:00:00.000Z
```

Response:

```json id="61rgdo"
{
  "success": true,
  "data": {
    "server_time": "2026-07-03T10:00:00.000Z",
    "changes": {
      "products": [],
      "devices": [],
      "subscription": {}
    }
  },
  "message": "Changes loaded."
}
```

---

# 20. Subscription APIs

Important rule:

```txt id="qj9tcs"
Buzz Duka does not hold money. Subscription money paid to the official Till goes directly to the Buzz Duka owner's M-Pesa. The backend only reconciles payment records.
```

---

## 20.1 Get Subscription Status

Endpoint:

```txt id="2cjbut"
GET /subscription/status
```

Permission:

```txt id="vizvd0"
Owner
```

Response:

```json id="83xbn4"
{
  "success": true,
  "data": {
    "plan_name": "Buzz Duka Smart Plan",
    "plan_price_cents": 150000,
    "status": "active",
    "subscription_end_at": "2026-08-30T00:00:00.000Z",
    "grace_until": "2026-09-02T00:00:00.000Z",
    "offline_license_valid_until": "2026-07-10T00:00:00.000Z"
  },
  "message": "Subscription status loaded."
}
```

---

## 20.2 Get Payment Instructions

Endpoint:

```txt id="37imnj"
GET /subscription/payment-instructions
```

Permission:

```txt id="l5d6qm"
Owner
```

Response:

```json id="12jua2"
{
  "success": true,
  "data": {
    "plan_name": "Buzz Duka Smart Plan",
    "amount_cents": 150000,
    "currency": "KES",
    "till_number": "CONFIGURED_TILL_NUMBER",
    "instructions": "Pay KSh 1,500 to the Buzz Duka Till number."
  },
  "message": "Payment instructions loaded."
}
```

Rules:

* Till number must come from secure configuration.
* Do not hardcode fake Till number.
* Do not expose private credentials.

---

## 20.3 Start Payment Reconciliation Check

Endpoint:

```txt id="ds8qhx"
POST /subscription/payment/check
```

Permission:

```txt id="09bssg"
Owner
```

Request:

```json id="t6dg90"
{
  "payment_reference": "MPESA_REFERENCE",
  "amount_expected_cents": 150000
}
```

Response if still checking:

```json id="n78s0v"
{
  "success": true,
  "data": {
    "reconciliation_id": "reconciliation_id",
    "reconciliation_status": "checking"
  },
  "message": "Payment is being checked."
}
```

Response if confirmed:

```json id="u0vl9s"
{
  "success": true,
  "data": {
    "reconciliation_id": "reconciliation_id",
    "reconciliation_status": "confirmed",
    "subscription": {
      "status": "active",
      "subscription_end_at": "2026-08-30T00:00:00.000Z"
    }
  },
  "message": "Payment confirmed. Subscription activated."
}
```

Rules:

* User-entered reference alone must not activate subscription.
* Backend must verify transaction.
* Must check correct amount.
* Must check correct Till number.
* Must prevent duplicate transaction activation.

---

## 20.4 Payment Provider Callback / Webhook

Endpoint:

```txt id="8n1x96"
POST /subscription/payment/confirm-webhook
```

Permission:

```txt id="18dt32"
Payment provider / protected webhook secret
```

Request shape depends on provider, but backend must normalize it into:

```json id="h3l4ao"
{
  "transaction_id": "provider_transaction_id",
  "payment_reference": "MPESA_REFERENCE",
  "amount_paid_cents": 150000,
  "currency": "KES",
  "till_number": "CONFIGURED_TILL_NUMBER",
  "payment_received_at": "2026-07-03T10:00:00.000Z"
}
```

Response:

```json id="h0qsnj"
{
  "success": true,
  "data": {
    "reconciliation_status": "confirmed"
  },
  "message": "Payment reconciled."
}
```

Rules:

* Verify webhook authenticity.
* Reject wrong Till number.
* Reject wrong amount.
* Prevent duplicate transaction activation.
* Activate subscription only after valid reconciliation.
* Create subscription record.
* Refresh offline license data.

---

## 20.5 Payment History

Endpoint:

```txt id="q2d9k4"
GET /subscription/payment-history
```

Permission:

```txt id="5esiaq"
Owner
```

Response:

```json id="eeojb1"
{
  "success": true,
  "data": [
    {
      "id": "reconciliation_id",
      "amount_expected_cents": 150000,
      "amount_paid_cents": 150000,
      "payment_reference": "MPESA_REFERENCE",
      "reconciliation_status": "confirmed",
      "reconciled_at": "2026-07-03T10:00:00.000Z"
    }
  ],
  "message": "Payment history loaded."
}
```

---

## 20.6 Refresh Offline License

Endpoint:

```txt id="txsl8r"
POST /subscription/refresh-license
```

Permission:

```txt id="r7lfeh"
Owner or Sales authenticated device
```

Request:

```json id="3m9d38"
{
  "device_id": "device_id"
}
```

Response:

```json id="mevpq0"
{
  "success": true,
  "data": {
    "business_id": "business_id",
    "device_id": "device_id",
    "subscription_status": "active",
    "subscription_end_at": "2026-08-30T00:00:00.000Z",
    "grace_until": "2026-09-02T00:00:00.000Z",
    "last_verified_at": "2026-07-03T10:00:00.000Z",
    "offline_license_valid_until": "2026-07-10T10:00:00.000Z",
    "license_signature": "signed_license"
  },
  "message": "Offline license refreshed."
}
```

Rules:

* Offline license validity must not exceed grace_until.
* Suspended business must not receive active license.

---

# 21. Admin APIs

Admin users are not shop users.

Admin APIs must use separate admin authentication and audit logs.

---

## 21.1 Admin Login

Endpoint:

```txt id="egciq9"
POST /admin/auth/login
```

Permission:

```txt id="nx2xod"
Admin public login
```

Request:

```json id="4ps8ej"
{
  "email": "admin@buzzduka.com",
  "password": "securePassword"
}
```

Response:

```json id="4j4f1a"
{
  "success": true,
  "data": {
    "admin_access_token": "admin_jwt_token",
    "admin_user": {
      "id": "admin_id",
      "role": "admin"
    }
  },
  "message": "Admin login successful."
}
```

---

## 21.2 List Businesses

Endpoint:

```txt id="kkbs83"
GET /admin/businesses
```

Permission:

```txt id="8493s1"
Admin
```

Response:

```json id="dl1sf0"
{
  "success": true,
  "data": [
    {
      "id": "business_id",
      "business_name": "Tabitha Shop",
      "status": "active",
      "subscription_status": "active",
      "active_devices": 2,
      "last_sync_at": "2026-07-03T10:00:00.000Z"
    }
  ],
  "message": "Businesses loaded."
}
```

No fake shop counts.

---

## 21.3 Admin View Subscription Reconciliations

Endpoint:

```txt id="nxq2iy"
GET /admin/subscription-reconciliations
```

Permission:

```txt id="1cnmqh"
Admin
```

Query parameters:

```txt id="ymjgah"
?status=pending
```

Response:

```json id="zvx82b"
{
  "success": true,
  "data": [
    {
      "id": "reconciliation_id",
      "business_id": "business_id",
      "amount_expected_cents": 150000,
      "amount_paid_cents": 150000,
      "payment_reference": "MPESA_REFERENCE",
      "transaction_id": "transaction_id",
      "reconciliation_status": "confirmed",
      "reconciled_at": "2026-07-03T10:00:00.000Z"
    }
  ],
  "message": "Subscription reconciliations loaded."
}
```

---

## 21.4 Admin Manual Subscription Correction

Endpoint:

```txt id="64heae"
POST /admin/businesses/:id/subscription/manual-correction
```

Permission:

```txt id="t0a2bu"
Admin
```

Request:

```json id="6ejv4s"
{
  "new_status": "active",
  "subscription_end_at": "2026-08-30T00:00:00.000Z",
  "reason": "Payment confirmed manually after reconciliation issue"
}
```

Response:

```json id="1s226w"
{
  "success": true,
  "data": {
    "business_id": "business_id",
    "subscription_status": "active"
  },
  "message": "Subscription corrected."
}
```

Rules:

* Manual correction is for support only.
* Must create admin audit log.
* Must not be normal payment flow.

---

## 21.5 Suspend Business

Endpoint:

```txt id="b4l7ui"
POST /admin/businesses/:id/suspend
```

Permission:

```txt id="0x7g3a"
Admin
```

Request:

```json id="c8qtia"
{
  "reason": "Payment dispute"
}
```

Response:

```json id="v1bekm"
{
  "success": true,
  "data": {
    "business_id": "business_id",
    "status": "suspended"
  },
  "message": "Business suspended."
}
```

Rules:

* Must create admin audit log.
* Suspended business must be restricted.

---

# 22. Business ID Isolation Rule

Every API query must filter by business ID.

Wrong:

```txt id="h6yefi"
Find sale by sale_id only.
```

Correct:

```txt id="83qn2w"
Find sale by sale_id AND current_user.business_id.
```

This applies to:

```txt id="y0ukqj"
products
sales
sale_items
receipts
customers
debts
debt_payments
expenses
activity_logs
devices
subscription records
sync records
```

One shop must never access another shop’s data.

---

# 23. Permission Summary by API Group

| API Group        | Owner |                            Sales |        Admin |
| ---------------- | ----: | -------------------------------: | -----------: |
| Auth login       |   Yes |                              Yes |     Separate |
| Business profile |   Yes |                               No | View/support |
| Users            |   Yes |                               No |      Support |
| Devices          |   Yes |                  Own status only |      Support |
| Products         |  Full |                     Read limited |      Support |
| Inventory        |  Full |                               No |      Support |
| Sales            |  Full |              Create/list limited |      Support |
| Receipts         |  Full |                          Limited |      Support |
| Debts            |  Full | Create debt sale only if allowed |      Support |
| Expenses         |  Full |                               No |      Support |
| Analytics        |  Full |               No owner analytics |      Support |
| Sync             |   Yes |                          Limited |      Monitor |
| Subscription     |  Full |   Status warning/license refresh |      Support |
| Admin            |    No |                               No |          Yes |

---

# 24. Idempotency Rule

These APIs must use idempotency keys:

```txt id="o4hu5b"
POST /products
POST /inventory/stock-in
POST /sales
POST /sales/:id/reverse
POST /debts/:id/payments
POST /expenses
POST /sync/batch-upload
POST /subscription/payment/check
POST /subscription/payment/confirm-webhook
```

If duplicate idempotency key is received:

```txt id="51buhb"
Return existing result.
Do not create duplicate record.
```

---

# 25. API Tests Required

Antigravity must test:

```txt id="44g64b"
Owner registration works
Login works
Blocked user cannot login
Business ID isolation works
Sales user cannot access expenses API
Sales user cannot access profit API
Owner can create product
Stock-in updates weighted average cost
Sale API reduces stock
Sale API creates sale item snapshots
Duplicate sale idempotency does not duplicate sale
Debt sale creates debt
Debt payment updates balance
Expense affects net profit
Sale reversal restores stock
Subscription payment reference alone does not activate subscription
Valid Till payment reconciliation activates subscription
Duplicate transaction does not activate subscription twice
Wrong Till number is rejected
Wrong amount is rejected
Admin manual correction creates audit log
Removed device cannot sync new sales
```

---

# 26. What Antigravity Must Not Do

Antigravity must not:

* Return fake API success
* Return fake dashboard values
* Return fake subscription active status
* Activate subscription from typed reference alone
* Hardcode fake Till number
* Skip payment reconciliation
* Create duplicate sale on retry
* Create duplicate subscription activation from same transaction
* Expose Owner profit to Sales user
* Expose one business data to another business
* Store passwords as plain text
* Skip backend role checks
* Skip device checks
* Add M-Pesa verification for shop sales
* Treat Buzz Duka as a wallet or money-holding platform

---

# 27. Antigravity Completion Report

After building API module, Antigravity must report:

```txt id="ct48un"
Module name:
API groups created:
Endpoints created:
Controllers created:
Services created:
Prisma models used:
Auth checks added:
Role checks added:
Business ID isolation added:
Device checks added:
Subscription checks added:
Idempotency added:
Payment reconciliation endpoints added:
Tests added:
Manual verification completed:
Known limitations:
No fake API confirmation:
No money-holding logic confirmation:
```

---

# 28. Final Rule

Buzz Duka APIs must protect real shop data.

The backend must:

```txt id="kugsqf"
Authenticate users
Enforce business isolation
Enforce roles
Enforce devices
Enforce subscription/license rules
Save real records
Prevent duplicate sales
Preserve sale snapshots
Reconcile subscription payments safely
Avoid fake responses
```

Buzz Duka does not hold money.

Buzz Duka records shop activity and reconciles subscription payments made to the official Till number.

If APIs are fake, the whole app becomes fake.
