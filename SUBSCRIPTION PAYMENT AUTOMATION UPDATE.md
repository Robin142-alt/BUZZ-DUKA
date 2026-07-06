# DOCUMENT 14 PATCH: SUBSCRIPTION PAYMENT AUTOMATION UPDATE

## Buzz Duka — Automated Subscription Payment Using Till Number

**Instruction:** Replace the manual-payment parts of Document 14 with this updated version.

---

# 1. Updated Payment Confirmation Model

Buzz Duka subscription payment should be automated using a Till number that will be provided by Buzz Duka.

The subscription flow should not depend mainly on manual admin confirmation.

Approved subscription payment model:

```txt
1. Owner opens Subscription screen.
2. App shows Buzz Duka Till number.
3. Owner pays KSh 1,500 to the provided Till number.
4. App receives/validates payment through the approved payment confirmation system.
5. Subscription becomes active/reactivated automatically after successful confirmation.
6. Offline license refreshes after successful confirmation.
7. Subscription event is saved.
8. Receipt/payment record is saved.
```

Core rule:

```txt
Payment confirmation should be automated where possible.
```

---

# 2. Till Number Rule

Buzz Duka will use one official Till number for subscription payments.

The Till number will be provided by the business owner/admin of Buzz Duka.

The app must not hardcode a fake Till number.

Until the real Till number is provided, Antigravity must use a placeholder configuration value only.

Example:

```txt
BUZZ_DUKA_SUBSCRIPTION_TILL_NUMBER = configured value
```

Do not write random Till numbers into the code.

---

# 3. Payment Screen Update

The Subscription screen should show:

```txt
Plan: Buzz Duka Smart Plan
Amount: KSh 1,500/month
Pay to Till Number: [configured Buzz Duka Till number]
Status: Active / Grace / Expired / Suspended
Expiry date
Payment status
Refresh payment/subscription button
```

If expired:

```txt
Your subscription has ended. Pay KSh 1,500 to the Buzz Duka Till number to continue.
```

If payment is being checked:

```txt
Checking payment...
```

If payment is confirmed:

```txt
Payment confirmed. Subscription activated.
```

If payment is not found:

```txt
Payment not confirmed yet. Please wait or tap Refresh.
```

---

# 4. Payment Verification Rule

Payment must not be activated just because the user says they paid.

The system must confirm the payment.

Approved rule:

```txt
Subscription activates only after the payment confirmation system verifies the payment.
```

The app may allow a user to enter a payment reference if needed, but reference entry alone must not activate subscription.

---

# 5. Payment Statuses

Use these payment statuses:

```txt
pending
checking
confirmed
failed
rejected
expired
```

## pending

User has not paid yet, or payment has not been checked.

## checking

System is checking payment status.

## confirmed

Payment was verified successfully.

## failed

Payment check failed due to technical issue.

## rejected

Payment was found but is invalid, wrong amount, duplicate, or not accepted.

## expired

Payment session/request expired before confirmation.

---

# 6. Subscription Activation Rule

When KSh 1,500 payment is confirmed:

```txt
Set subscription status to active/reactivated.
Set subscription_start_at.
Set subscription_end_at.
Set grace_until.
Create subscription payment record.
Create subscription event.
Refresh offline license.
```

Default billing logic remains:

```txt
Billing period: 30 days
Grace period: 3 days
```

---

# 7. Renewal Before Expiry

If payment is confirmed before the current subscription expires:

```txt
New 30 days should be added after the current subscription_end_at.
```

Example:

```txt
Current expiry: 10 August 2026
Payment confirmed: 5 August 2026
New expiry: 9 September 2026
```

---

# 8. Renewal After Expiry

If payment is confirmed after expiry:

```txt
New 30 days should start from the payment confirmation date.
```

Example:

```txt
Expired on: 10 August 2026
Payment confirmed: 15 August 2026
New expiry: 14 September 2026
```

---

# 9. Payment Record Fields

Create a subscription payment record with:

```txt
id
business_id
user_id
plan_name
amount_expected
amount_paid
currency
till_number
payment_reference
payment_provider
payment_status
payment_confirmed_at
subscription_start_at
subscription_end_at
grace_until
created_at
updated_at
```

Do not store fake payment confirmations.

---

# 10. Backend Payment APIs

Backend should support:

```txt
GET /subscription/status
GET /subscription/payment-instructions
POST /subscription/payment/check
POST /subscription/payment/confirm-webhook
GET /subscription/payment/history
POST /subscription/refresh-license
```

Admin APIs may still exist for support:

```txt
GET /admin/subscription-payments
GET /admin/businesses/:id/subscription
POST /admin/businesses/:id/subscription/manual-correction
POST /admin/businesses/:id/subscription/suspend
POST /admin/businesses/:id/subscription/reactivate
```

Manual correction is for support only, not the main payment method.

---

# 11. Webhook Rule

If the payment provider supports webhooks, backend should use them.

Webhook must:

```txt
Verify request authenticity.
Confirm payment amount.
Confirm Till number.
Confirm reference/transaction ID.
Prevent duplicate confirmation.
Update subscription only once.
Create payment record.
Create audit/subscription event.
```

Do not trust unverified webhook payloads.

---

# 12. Duplicate Payment Rule

A payment transaction/reference must not activate subscription twice.

Backend must enforce:

```txt
Unique payment_reference / transaction_id
```

If the same payment is received again:

```txt
Return existing payment record.
Do not extend subscription twice.
```

---

# 13. Wrong Amount Rule

If the paid amount is less than KSh 1,500:

```txt
Do not activate subscription automatically.
Mark payment as rejected or under_review.
Show user a clear message.
```

Example:

```txt
Payment received, but the amount is below KSh 1,500. Contact support.
```

If amount is greater than KSh 1,500, MVP rule:

```txt
Activate one month only unless admin policy later supports multiple months.
```

Future rule may allow multiple months from overpayment.

---

# 14. Offline License After Payment

After payment is confirmed, app should refresh offline license.

Offline license should update:

```txt
subscription_status
subscription_end_at
grace_until
last_verified_at
offline_license_valid_until
license_signature
```

If payment is confirmed while app is offline, app updates when it reconnects.

---

# 15. Admin Role in Automated Payment

Admin still exists for:

```txt
Viewing payments
Handling failed confirmations
Handling wrong amount
Handling disputes
Suspending businesses
Manual correction in rare cases
Support notes
Audit review
```

But admin should not be required for every normal subscription activation.

---

# 16. Updated Anti-Abuse Rules

Buzz Duka must prevent:

```txt
Fake payment confirmation
Duplicate transaction activation
Wrong Till number activation
Wrong amount activation
Unlimited offline use after expiry
Frontend-only subscription activation
Manual subscription changes without audit
```

The backend must be the source of truth for confirmed subscription payments.

---

# 17. Updated Subscription Tests

Antigravity must test:

```txt
Subscription screen shows configured Till number.
User cannot activate subscription by typing fake reference only.
Payment check confirms valid payment.
Confirmed KSh 1,500 payment activates subscription.
Duplicate payment reference does not activate twice.
Wrong amount does not activate automatically.
Payment confirmation creates payment record.
Payment confirmation creates subscription event.
Payment confirmation refreshes offline license.
Expired subscription becomes active after confirmed payment.
Sales user cannot manage subscription.
Admin can view payment history.
Manual correction creates audit log.
```

---

# 18. Updated Final Rule

Buzz Duka subscription should be automated through the official Till number.

The user pays KSh 1,500/month to the Buzz Duka Till number, and the system confirms the payment before activating access.

Manual admin correction may exist for support, but it must not be the normal subscription process.

Do not activate subscription from fake data.

Do not hardcode a fake Till number.

Do not allow the same transaction to activate subscription twice.
