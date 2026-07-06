export const PAYMENT_CASH = 'cash';
export const PAYMENT_MPESA = 'mpesa';
export const PAYMENT_BANK = 'bank';
export const PAYMENT_DEBT = 'debt';

export type PaymentMethod = 
  | typeof PAYMENT_CASH 
  | typeof PAYMENT_MPESA 
  | typeof PAYMENT_BANK 
  | typeof PAYMENT_DEBT;
