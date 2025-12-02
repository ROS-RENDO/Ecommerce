// types/payment.ts
export interface Payment {
  method: "Card" | "PayPal" | "Crypto" | "COD";
  paymentstatus: "Pending" | "Processing" | "Paid" | "Failed" | "Refunded";
  cardNumber?: string;
  expiry?: string;
  cardHolder?: string;
  PayPalEmail?: string;
  txHash?: string;
  walletAddress?: string;
  amount: number;
  currency?: string;
  paidAt?: string;
}
