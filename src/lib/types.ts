/**
 * Shared TypeScript types for the Squad Grid payment platform
 * These types match the frontend component expectations
 */

export type Currency = 'USDC' | 'USDT' | 'PYUSD';
export type PaymentLinkStatus = 'active' | 'completed' | 'expired' | 'paused';
export type TransactionStatus = 'completed' | 'pending' | 'processing' | 'failed' | 'cancelled';
export type PaymentMethod = 'wallet' | 'ramp' | 'card';
export type TransactionType = 'payment' | 'send' | 'receive' | 'deposit' | 'withdrawal' | 'transfer' | 'yield';
export type AccountStatus = 'active' | 'inactive' | 'suspended' | 'closed';
export type AccountType = 'business' | 'personal' | 'savings' | 'yield';
export type TransferType = 'domestic' | 'cross_border' | 'internal';

/**
 * Payment Link entity
 */
export interface PaymentLink {
  id: string;
  linkId: string;
  userId?: string;
  amount: string;
  currency: Currency;
  description: string;
  status: PaymentLinkStatus;
  createdAt: string;
  updatedAt?: string;
  transactionCount: number;
  completedCount: number;
  successUrl?: string;
  cancelUrl?: string;
  merchantWallet: string;
}

/**
 * Virtual Account entity - Programmable non-custodial accounts
 */
export interface VirtualAccount {
  id: string;
  accountId: string; // Short account identifier
  userId?: string;
  accountName: string;
  accountType: AccountType;
  status: AccountStatus;
  walletAddress: string; // Solana wallet address
  balances: Record<Currency, string>; // Balance for each currency
  totalBalance: string; // Total in USD equivalent
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, string>; // Additional account metadata
  isYieldEnabled?: boolean; // If account earns yield
  yieldRate?: number; // Annual percentage yield (APY)
}

/**
 * Account Balance entity
 */
export interface AccountBalance {
  accountId: string;
  currency: Currency;
  available: string; // Available balance
  pending: string; // Pending transactions
  locked: string; // Locked for yield or other reasons
  lastUpdated: string;
}

/**
 * Transaction entity - Expanded with more transaction types
 */
export interface Transaction {
  id: string;
  paymentLinkId?: string; // Optional for non-payment-link transactions
  userId?: string;
  accountId?: string; // Virtual account ID
  transactionType: TransactionType;
  amount: string;
  currency: Currency;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  customerWallet?: string;
  customerEmail?: string;
  fromAccount?: string; // Source account ID
  toAccount?: string; // Destination account ID
  recipientName?: string;
  recipientEmail?: string;
  recipientWallet?: string;
  transferType?: TransferType; // For cross-border payments
  exchangeRate?: number; // For cross-border with currency conversion
  fees?: string; // Transaction fees
  createdAt: string;
  completedAt?: string;
  solanaSignature?: string;
  gridTransferId?: string;
  memo?: string; // Transaction memo/note
}

/**
 * Widget types (similar to Stripe)
 */
export type WidgetType = 
  | 'button'      // Simple payment button
  | 'card'        // Product card with image
  | 'inline'      // Inline payment form
  | 'checkout'    // Embedded checkout
  | 'donation'    // Donation widget
  | 'subscription'; // Subscription widget

/**
 * Widget styles
 */
export type WidgetStyle = 
  | 'default'     // Standard style
  | 'outline'     // Outlined style
  | 'ghost'       // Ghost style
  | 'pill'        // Rounded pill style
  | 'minimal';    // Minimal style

/**
 * Widget size
 */
export type WidgetSize = 'sm' | 'md' | 'lg';

/**
 * Widget entity
 */
export interface Widget {
  id: string;
  userId?: string;
  name: string;
  type?: WidgetType; // Optional for backward compatibility
  style?: WidgetStyle; // Optional for backward compatibility
  size?: WidgetSize; // Optional for backward compatibility
  buttonText: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  embedCode: string;
  paymentLinkId: string;
  // Additional customization
  primaryColor?: string;
  borderRadius?: number;
  showAmount?: boolean;
  showCurrency?: boolean;
}

/**
 * Yield/Earning entity
 */
export interface YieldEarning {
  id: string;
  accountId: string;
  userId?: string;
  currency: Currency;
  principal: string; // Amount earning yield
  earned: string; // Total yield earned
  currentRate: number; // Current APY
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastPayment: string; // Last yield payment date
  nextPayment: string; // Next yield payment date
  createdAt: string;
}

/**
 * Cross-border payment entity
 */
export interface CrossBorderPayment {
  id: string;
  fromAccount: string;
  toAccount: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: string;
  convertedAmount: string;
  exchangeRate: number;
  fees: string;
  recipientName: string;
  recipientCountry: string;
  recipientBank?: string;
  status: TransactionStatus;
  estimatedArrival: string;
  createdAt: string;
  completedAt?: string;
}

/**
 * Analytics statistics - Expanded
 */
export interface AnalyticsStats {
  totalRevenue: number;
  transactionCount: number;
  successRate: number;
  avgTransactionValue: number;
  totalCompletedTransactions: number;
  totalPendingTransactions: number;
  totalFailedTransactions: number;
  revenueByCurrency: Record<Currency, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    transactionCount: number;
  }>;
  paymentMethodDistribution: Array<{
    method: PaymentMethod;
    count: number;
    percentage: number;
  }>;
  // New Grid features analytics
  totalAccounts: number;
  activeAccounts: number;
  totalYieldEarned: number;
  crossBorderTransactions: number;
  accountsByType: Record<AccountType, number>;
  yieldByCurrency: Record<Currency, number>;
}

/**
 * API Request/Response types
 */
export interface CreatePaymentLinkRequest {
  amount: string;
  currency: Currency;
  description?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreatePaymentLinkResponse {
  success: boolean;
  paymentLink: PaymentLink;
}

export interface GetPaymentLinksResponse {
  success: boolean;
  paymentLinks: PaymentLink[];
}

export interface GetTransactionsResponse {
  success: boolean;
  transactions: Transaction[];
}

export interface GetAnalyticsResponse {
  success: boolean;
  stats: AnalyticsStats;
}

export interface CreateWidgetRequest {
  name: string;
  type: WidgetType;
  style?: WidgetStyle;
  size?: WidgetSize;
  buttonText: string;
  description?: string;
  imageUrl?: string;
  paymentLinkId: string;
  primaryColor?: string;
  borderRadius?: number;
  showAmount?: boolean;
  showCurrency?: boolean;
}

export interface CreateWidgetResponse {
  success: boolean;
  widget: Widget;
}

export interface GetWidgetsResponse {
  success: boolean;
  widgets: Widget[];
}

export interface PaymentRequest {
  paymentLinkId: string;
  paymentMethod: PaymentMethod;
  customerWallet?: string;
  customerEmail?: string;
  solanaSignature?: string;
}

export interface PaymentResponse {
  success: boolean;
  transaction: Transaction;
  signature?: string;
  gridTransferId?: string;
}

export interface CheckoutResponse {
  success: boolean;
  paymentLink: PaymentLink;
}

/**
 * Error response type
 */
export interface ApiError {
  success: false;
  error: string;
  message?: string;
}

/**
 * API Request/Response types for Virtual Accounts
 */
export interface CreateVirtualAccountRequest {
  accountName: string;
  accountType: AccountType;
  defaultCurrency?: Currency;
  enableYield?: boolean;
}

export interface CreateVirtualAccountResponse {
  success: boolean;
  account: VirtualAccount;
}

export interface GetVirtualAccountsResponse {
  success: boolean;
  accounts: VirtualAccount[];
}

export interface TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: string;
  currency: Currency;
  memo?: string;
}

export interface TransferResponse {
  success: boolean;
  transaction: Transaction;
  signature?: string;
}

export interface CrossBorderPaymentRequest {
  fromAccount: string;
  toAccount: string;
  amount: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  recipientName: string;
  recipientCountry: string;
  recipientBank?: string;
  memo?: string;
}

export interface CrossBorderPaymentResponse {
  success: boolean;
  payment: CrossBorderPayment;
  transaction: Transaction;
}

export interface GetYieldEarningsResponse {
  success: boolean;
  earnings: YieldEarning[];
  totalEarned: Record<Currency, string>;
}

