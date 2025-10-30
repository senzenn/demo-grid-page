/**
 * Mock Data Store - In-memory data management for MVP
 * Simulates database operations with Map/Array structures
 */

import { v4 as uuidv4 } from 'uuid';
import bs58 from 'bs58';
import type {
  PaymentLink,
  Transaction,
  Widget,
  Currency,
  TransactionStatus,
  PaymentMethod,
  VirtualAccount,
  YieldEarning,
  TransactionType,
  AccountType,
  TransferType,
} from './types';

/**
 * Generate a short ID for payment links (8 characters)
 */
export function generateShortId(): string {
  return uuidv4().replace(/-/g, '').substring(0, 8);
}

/**
 * Generate a mock Solana wallet address (base58 encoded)
 */
export function generateSolanaAddress(): string {
  // Generate random bytes (32 bytes for Solana address)
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  // Encode to base58
  return bs58.encode(randomBytes);
}

/**
 * Generate a mock Solana transaction signature (base58 encoded)
 */
export function generateSolanaSignature(): string {
  // Generate random bytes (64 bytes for Solana signature)
  const randomBytes = new Uint8Array(64);
  crypto.getRandomValues(randomBytes);
  // Encode to base58
  return bs58.encode(randomBytes);
}

/**
 * Generate a mock Grid transfer ID
 */
export function generateGridTransferId(): string {
  return `grid_${uuidv4().replace(/-/g, '')}`;
}

/**
 * Mock Data Stores
 */
class MockDataStore {
  private paymentLinks: Map<string, PaymentLink>;
  private transactions: Transaction[];
  private widgets: Widget[];
  private virtualAccounts: Map<string, VirtualAccount>;
  private yieldEarnings: YieldEarning[];

  constructor() {
    this.paymentLinks = new Map();
    this.transactions = [];
    this.widgets = [];
    this.virtualAccounts = new Map();
    this.yieldEarnings = [];
    
    // Initialize with some mock data
    this.initializeMockData();
  }

  /**
   * Initialize with sample data for testing
   */
  private initializeMockData() {
    // Create a few sample payment links
    const sampleLink1: PaymentLink = {
      id: uuidv4(),
      linkId: generateShortId(),
      amount: '100.00',
      currency: 'USDC',
      description: 'Premium Subscription',
      status: 'active',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      transactionCount: 5,
      completedCount: 4,
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      merchantWallet: generateSolanaAddress(),
    };

    const sampleLink2: PaymentLink = {
      id: uuidv4(),
      linkId: generateShortId(),
      amount: '50.00',
      currency: 'USDT',
      description: 'One-time Payment',
      status: 'active',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      transactionCount: 2,
      completedCount: 2,
      merchantWallet: generateSolanaAddress(),
    };

    this.paymentLinks.set(sampleLink1.linkId, sampleLink1);
    this.paymentLinks.set(sampleLink2.linkId, sampleLink2);

    // Create virtual accounts
    const account1: VirtualAccount = {
      id: uuidv4(),
      accountId: generateShortId(),
      accountName: 'Business Operating Account',
      accountType: 'business',
      status: 'active',
      walletAddress: generateSolanaAddress(),
      balances: {
        USDC: '25430.50',
        USDT: '15200.00',
        PYUSD: '0.00',
      },
      totalBalance: '40630.50',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      isYieldEnabled: true,
      yieldRate: 4.2,
      metadata: {
        businessName: 'Acme Corp',
        taxId: '12-3456789',
      },
    };

    const account2: VirtualAccount = {
      id: uuidv4(),
      accountId: generateShortId(),
      accountName: 'Personal Savings',
      accountType: 'savings',
      status: 'active',
      walletAddress: generateSolanaAddress(),
      balances: {
        USDC: '12500.00',
        USDT: '0.00',
        PYUSD: '5000.00',
      },
      totalBalance: '17500.00',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      isYieldEnabled: true,
      yieldRate: 5.1,
    };

    const account3: VirtualAccount = {
      id: uuidv4(),
      accountId: generateShortId(),
      accountName: 'Yield Account',
      accountType: 'yield',
      status: 'active',
      walletAddress: generateSolanaAddress(),
      balances: {
        USDC: '50000.00',
        USDT: '25000.00',
        PYUSD: '10000.00',
      },
      totalBalance: '85000.00',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      isYieldEnabled: true,
      yieldRate: 6.5,
    };

    this.virtualAccounts.set(account1.accountId, account1);
    this.virtualAccounts.set(account2.accountId, account2);
    this.virtualAccounts.set(account3.accountId, account3);

    // Create yield earnings
    const yield1: YieldEarning = {
      id: uuidv4(),
      accountId: account1.accountId,
      currency: 'USDC',
      principal: '25000.00',
      earned: '287.50',
      currentRate: 4.2,
      period: 'monthly',
      lastPayment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      nextPayment: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: account1.createdAt,
    };

    const yield2: YieldEarning = {
      id: uuidv4(),
      accountId: account2.accountId,
      currency: 'USDC',
      principal: '12500.00',
      earned: '159.38',
      currentRate: 5.1,
      period: 'monthly',
      lastPayment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      nextPayment: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: account2.createdAt,
    };

    const yield3: YieldEarning = {
      id: uuidv4(),
      accountId: account3.accountId,
      currency: 'USDC',
      principal: '50000.00',
      earned: '812.50',
      currentRate: 6.5,
      period: 'monthly',
      lastPayment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      nextPayment: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: account3.createdAt,
    };

    this.yieldEarnings.push(yield1, yield2, yield3);

    // Create expanded sample transactions with various types
    const sampleTransactions: Transaction[] = [
      // Payment link transactions
      {
        id: uuidv4(),
        paymentLinkId: sampleLink1.linkId,
        transactionType: 'payment',
        amount: '100.00',
        currency: 'USDC',
        status: 'completed',
        paymentMethod: 'wallet',
        customerWallet: generateSolanaAddress(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 1000).toISOString(),
        solanaSignature: generateSolanaSignature(),
        gridTransferId: generateGridTransferId(),
        fees: '0.30',
      },
      {
        id: uuidv4(),
        paymentLinkId: sampleLink1.linkId,
        transactionType: 'payment',
        amount: '100.00',
        currency: 'USDC',
        status: 'completed',
        paymentMethod: 'wallet',
        customerWallet: generateSolanaAddress(),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45 * 1000).toISOString(),
        solanaSignature: generateSolanaSignature(),
        gridTransferId: generateGridTransferId(),
        fees: '0.30',
      },
      {
        id: uuidv4(),
        paymentLinkId: sampleLink2.linkId,
        transactionType: 'payment',
        amount: '50.00',
        currency: 'USDT',
        status: 'completed',
        paymentMethod: 'wallet',
        customerWallet: generateSolanaAddress(),
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 20 * 1000).toISOString(),
        solanaSignature: generateSolanaSignature(),
        gridTransferId: generateGridTransferId(),
        fees: '0.15',
      },
      // Send transactions
      {
        id: uuidv4(),
        accountId: account1.accountId,
        transactionType: 'send',
        amount: '500.00',
        currency: 'USDC',
        status: 'completed',
        paymentMethod: 'wallet',
        fromAccount: account1.accountId,
        toAccount: account2.accountId,
        recipientName: 'John Doe',
        recipientWallet: generateSolanaAddress(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 10 * 1000).toISOString(),
        solanaSignature: generateSolanaSignature(),
        gridTransferId: generateGridTransferId(),
        transferType: 'internal',
        fees: '0.00',
        memo: 'Monthly allowance',
      },
      // Receive transactions
      {
        id: uuidv4(),
        accountId: account2.accountId,
        transactionType: 'receive',
        amount: '250.00',
        currency: 'USDC',
        status: 'completed',
        paymentMethod: 'wallet',
        fromAccount: account1.accountId,
        toAccount: account2.accountId,
        recipientName: 'Jane Smith',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 5 * 1000).toISOString(),
        solanaSignature: generateSolanaSignature(),
        gridTransferId: generateGridTransferId(),
        transferType: 'internal',
        fees: '0.00',
      },
      // Cross-border payment
      {
        id: uuidv4(),
        accountId: account1.accountId,
        transactionType: 'transfer',
        amount: '1000.00',
        currency: 'USDC',
        status: 'completed',
        paymentMethod: 'wallet',
        fromAccount: account1.accountId,
        toAccount: generateShortId(),
        recipientName: 'Sarah Johnson',
        recipientEmail: 'sarah@example.com',
        recipientWallet: generateSolanaAddress(),
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        solanaSignature: generateSolanaSignature(),
        gridTransferId: generateGridTransferId(),
        transferType: 'cross_border',
        exchangeRate: 1.0,
        fees: '5.00',
        memo: 'International payment - Invoice #1234',
      },
      // Deposit
      {
        id: uuidv4(),
        accountId: account3.accountId,
        transactionType: 'deposit',
        amount: '10000.00',
        currency: 'USDC',
        status: 'completed',
        paymentMethod: 'ramp',
        toAccount: account3.accountId,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
        solanaSignature: generateSolanaSignature(),
        gridTransferId: generateGridTransferId(),
        fees: '25.00',
      },
      // Withdrawal
      {
        id: uuidv4(),
        accountId: account1.accountId,
        transactionType: 'withdrawal',
        amount: '2000.00',
        currency: 'USDT',
        status: 'completed',
        paymentMethod: 'wallet',
        fromAccount: account1.accountId,
        recipientWallet: generateSolanaAddress(),
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000).toISOString(),
        solanaSignature: generateSolanaSignature(),
        gridTransferId: generateGridTransferId(),
        fees: '2.00',
        memo: 'Withdrawal to external wallet',
      },
      // Yield payment
      {
        id: uuidv4(),
        accountId: account3.accountId,
        transactionType: 'yield',
        amount: '270.83',
        currency: 'USDC',
        status: 'completed',
        paymentMethod: 'wallet',
        toAccount: account3.accountId,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        gridTransferId: generateGridTransferId(),
        fees: '0.00',
        memo: 'Monthly yield payment',
      },
      // Pending transaction
      {
        id: uuidv4(),
        accountId: account2.accountId,
        transactionType: 'send',
        amount: '150.00',
        currency: 'USDC',
        status: 'pending',
        paymentMethod: 'wallet',
        fromAccount: account2.accountId,
        toAccount: account1.accountId,
        recipientName: 'Bob Wilson',
        createdAt: (new Date()).toISOString(),
        transferType: 'internal',
        fees: '0.00',
      },
    ];

    this.transactions.push(...sampleTransactions);

    // Create sample widget
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://squadgrid.xyz';
    const sampleWidget: Widget = {
      id: uuidv4(),
      name: 'Basic Payment Button',
      type: 'button',
      style: 'default',
      size: 'md',
      buttonText: 'Pay Now',
      isActive: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      embedCode: `<script src="${origin}/widget.js" data-widget-type="button" data-link-id="${sampleLink1.linkId}" data-button-text="Pay Now" data-style="default" data-size="md"></script>`,
      paymentLinkId: sampleLink1.linkId,
    };

    this.widgets.push(sampleWidget);
  }

  // Payment Links Methods
  getAllPaymentLinks(): PaymentLink[] {
    return Array.from(this.paymentLinks.values());
  }

  getPaymentLinkByLinkId(linkId: string): PaymentLink | undefined {
    return this.paymentLinks.get(linkId);
  }

  createPaymentLink(data: {
    amount: string;
    currency: Currency;
    description?: string;
    successUrl?: string;
    cancelUrl?: string;
    merchantWallet: string;
  }): PaymentLink {
    const linkId = generateShortId();
    const paymentLink: PaymentLink = {
      id: uuidv4(),
      linkId,
      amount: data.amount,
      currency: data.currency,
      description: data.description || '',
      status: 'active',
      createdAt: new Date().toISOString(),
      transactionCount: 0,
      completedCount: 0,
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
      merchantWallet: data.merchantWallet,
    };

    this.paymentLinks.set(linkId, paymentLink);
    return paymentLink;
  }

  updatePaymentLinkStats(linkId: string, transactionCount: number, completedCount: number): void {
    const link = this.paymentLinks.get(linkId);
    if (link) {
      link.transactionCount = transactionCount;
      link.completedCount = completedCount;
      link.updatedAt = new Date().toISOString();
    }
  }

  deletePaymentLink(linkId: string): boolean {
    return this.paymentLinks.delete(linkId);
  }

  // Transactions Methods
  getAllTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getTransactionsByPaymentLinkId(paymentLinkId: string): Transaction[] {
    return this.transactions.filter(tx => tx.paymentLinkId === paymentLinkId);
  }

  createTransaction(data: {
    paymentLinkId?: string;
    accountId?: string;
    transactionType: TransactionType;
    amount: string;
    currency: Currency;
    status: TransactionStatus;
    paymentMethod: PaymentMethod;
    customerWallet?: string;
    customerEmail?: string;
    fromAccount?: string;
    toAccount?: string;
    recipientName?: string;
    recipientEmail?: string;
    recipientWallet?: string;
    transferType?: TransferType;
    exchangeRate?: number;
    fees?: string;
    memo?: string;
    solanaSignature?: string;
    gridTransferId?: string;
  }): Transaction {
    const transaction: Transaction = {
      id: uuidv4(),
      paymentLinkId: data.paymentLinkId,
      accountId: data.accountId,
      transactionType: data.transactionType,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      paymentMethod: data.paymentMethod,
      customerWallet: data.customerWallet,
      customerEmail: data.customerEmail,
      fromAccount: data.fromAccount,
      toAccount: data.toAccount,
      recipientName: data.recipientName,
      recipientEmail: data.recipientEmail,
      recipientWallet: data.recipientWallet,
      transferType: data.transferType,
      exchangeRate: data.exchangeRate,
      fees: data.fees,
      memo: data.memo,
      createdAt: new Date().toISOString(),
      completedAt: data.status === 'completed' ? new Date().toISOString() : undefined,
      solanaSignature: data.solanaSignature,
      gridTransferId: data.gridTransferId || generateGridTransferId(),
    };

    this.transactions.push(transaction);

    // Update payment link stats if applicable
    if (data.paymentLinkId) {
      const link = this.paymentLinks.get(data.paymentLinkId);
      if (link) {
        const linkTransactions = this.getTransactionsByPaymentLinkId(data.paymentLinkId);
        const completedTransactions = linkTransactions.filter(tx => tx.status === 'completed');
        this.updatePaymentLinkStats(data.paymentLinkId, linkTransactions.length, completedTransactions.length);
      }
    }

    // Update account balances if applicable
    if (data.accountId && data.status === 'completed') {
      const account = this.virtualAccounts.get(data.accountId);
      if (account) {
        if (data.transactionType === 'deposit' || data.transactionType === 'receive' || data.transactionType === 'yield') {
          const currentBalance = parseFloat(account.balances[data.currency] || '0');
          account.balances[data.currency] = (currentBalance + parseFloat(data.amount)).toFixed(2);
        } else if (data.transactionType === 'withdrawal' || data.transactionType === 'send') {
          const currentBalance = parseFloat(account.balances[data.currency] || '0');
          account.balances[data.currency] = Math.max(0, currentBalance - parseFloat(data.amount)).toFixed(2);
        }
        // Recalculate total balance
        const total = Object.values(account.balances).reduce((sum, bal) => sum + parseFloat(bal), 0);
        account.totalBalance = total.toFixed(2);
        account.updatedAt = new Date().toISOString();
      }
    }

    return transaction;
  }

  // Widgets Methods
  getAllWidgets(): Widget[] {
    return [...this.widgets].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getWidgetById(id: string): Widget | undefined {
    return this.widgets.find(w => w.id === id);
  }

  createWidget(data: {
    name: string;
    type: import('./types').WidgetType;
    style?: import('./types').WidgetStyle;
    size?: import('./types').WidgetSize;
    buttonText: string;
    description?: string;
    imageUrl?: string;
    paymentLinkId: string;
    primaryColor?: string;
    borderRadius?: number;
    showAmount?: boolean;
    showCurrency?: boolean;
  }): Widget {
    const paymentLink = this.paymentLinks.get(data.paymentLinkId);
    if (!paymentLink) {
      throw new Error('Payment link not found');
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://squadgrid.xyz';
    
    // Generate embed code based on widget type
    // Use paymentLink.linkId (the public short ID) instead of data.paymentLinkId (internal UUID)
    const embedCode = this.generateEmbedCode({
      type: data.type,
      linkId: paymentLink.linkId,
      buttonText: data.buttonText,
      style: data.style || 'default',
      size: data.size || 'md',
      primaryColor: data.primaryColor,
      borderRadius: data.borderRadius,
      showAmount: data.showAmount,
      showCurrency: data.showCurrency,
      description: data.description,
      imageUrl: data.imageUrl,
      amount: paymentLink.amount,
      currency: paymentLink.currency,
      origin,
    });

    const widget: Widget = {
      id: uuidv4(),
      name: data.name,
      type: data.type,
      style: data.style || 'default',
      size: data.size || 'md',
      buttonText: data.buttonText,
      description: data.description,
      imageUrl: data.imageUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
      embedCode,
      paymentLinkId: data.paymentLinkId,
      primaryColor: data.primaryColor,
      borderRadius: data.borderRadius,
      showAmount: data.showAmount,
      showCurrency: data.showCurrency,
    };

    this.widgets.push(widget);
    return widget;
  }

  private generateEmbedCode(options: {
    type: import('./types').WidgetType;
    linkId: string;
    buttonText: string;
    style: import('./types').WidgetStyle;
    size: import('./types').WidgetSize;
    primaryColor?: string;
    borderRadius?: number;
    showAmount?: boolean;
    showCurrency?: boolean;
    description?: string;
    imageUrl?: string;
    amount: string;
    currency: string;
    origin: string;
  }): string {
    const { type, linkId, buttonText, style, size, primaryColor, borderRadius, showAmount, showCurrency, description, imageUrl, amount, currency, origin } = options;

    switch (type) {
      case 'button':
        return `<script src="${origin}/widget.js" data-widget-type="button" data-link-id="${linkId}" data-button-text="${buttonText}" data-style="${style}" data-size="${size}"${primaryColor ? ` data-color="${primaryColor}"` : ''}${borderRadius ? ` data-radius="${borderRadius}"` : ''}></script>`;
      
      case 'card':
        return `<div data-squadgrid-widget="card" data-link-id="${linkId}" data-button-text="${buttonText}" data-style="${style}" data-size="${size}"${description ? ` data-description="${description}"` : ''}${imageUrl ? ` data-image="${imageUrl}"` : ''}${showAmount ? ` data-amount="${amount}"` : ''}${showCurrency ? ` data-currency="${currency}"` : ''}${primaryColor ? ` data-color="${primaryColor}"` : ''}></div><script src="${origin}/widget.js"></script>`;
      
      case 'inline':
        return `<div data-squadgrid-widget="inline" data-link-id="${linkId}" data-button-text="${buttonText}" data-style="${style}" data-size="${size}"${showAmount ? ` data-amount="${amount}"` : ''}${showCurrency ? ` data-currency="${currency}"` : ''}${primaryColor ? ` data-color="${primaryColor}"` : ''}></div><script src="${origin}/widget.js"></script>`;
      
      case 'checkout':
        return `<iframe src="${origin}/checkout/${linkId}?embed=true" width="100%" height="600" frameborder="0" style="border-radius: ${borderRadius || 8}px;"></iframe>`;
      
      case 'donation':
        return `<div data-squadgrid-widget="donation" data-link-id="${linkId}" data-button-text="${buttonText}" data-style="${style}" data-size="${size}"${description ? ` data-description="${description}"` : ''}${primaryColor ? ` data-color="${primaryColor}"` : ''}></div><script src="${origin}/widget.js"></script>`;
      
      case 'subscription':
        return `<div data-squadgrid-widget="subscription" data-link-id="${linkId}" data-button-text="${buttonText}" data-style="${style}" data-size="${size}"${description ? ` data-description="${description}"` : ''}${primaryColor ? ` data-color="${primaryColor}"` : ''}></div><script src="${origin}/widget.js"></script>`;
      
      default:
        return `<script src="${origin}/widget.js" data-link-id="${linkId}" data-button-text="${buttonText}"></script>`;
    }
  }

  updateWidget(id: string, updates: Partial<Widget>): Widget | undefined {
    const widget = this.widgets.find(w => w.id === id);
    if (widget) {
      Object.assign(widget, updates, { updatedAt: new Date().toISOString() });
      return widget;
    }
    return undefined;
  }

  deleteWidget(id: string): boolean {
    const index = this.widgets.findIndex(w => w.id === id);
    if (index !== -1) {
      this.widgets.splice(index, 1);
      return true;
    }
    return false;
  }

  // Virtual Accounts Methods
  getAllVirtualAccounts(): VirtualAccount[] {
    return Array.from(this.virtualAccounts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getVirtualAccountByAccountId(accountId: string): VirtualAccount | undefined {
    return this.virtualAccounts.get(accountId);
  }

  createVirtualAccount(data: {
    accountName: string;
    accountType: AccountType;
    defaultCurrency?: Currency;
    enableYield?: boolean;
  }): VirtualAccount {
    const accountId = generateShortId();
    
    const account: VirtualAccount = {
      id: uuidv4(),
      accountId,
      accountName: data.accountName,
      accountType: data.accountType,
      status: 'active',
      walletAddress: generateSolanaAddress(),
      balances: {
        USDC: '0.00',
        USDT: '0.00',
        PYUSD: '0.00',
      },
      totalBalance: '0.00',
      createdAt: new Date().toISOString(),
      isYieldEnabled: data.enableYield || false,
      yieldRate: data.enableYield ? (data.accountType === 'yield' ? 6.5 : data.accountType === 'savings' ? 5.1 : 4.2) : undefined,
    };

    this.virtualAccounts.set(accountId, account);
    return account;
  }

  updateVirtualAccount(accountId: string, updates: Partial<VirtualAccount>): VirtualAccount | undefined {
    const account = this.virtualAccounts.get(accountId);
    if (account) {
      Object.assign(account, updates, { updatedAt: new Date().toISOString() });
      return account;
    }
    return undefined;
  }

  deleteVirtualAccount(accountId: string): boolean {
    return this.virtualAccounts.delete(accountId);
  }

  // Yield Earnings Methods
  getAllYieldEarnings(): YieldEarning[] {
    return [...this.yieldEarnings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getYieldEarningsByAccountId(accountId: string): YieldEarning[] {
    return this.yieldEarnings.filter(y => y.accountId === accountId);
  }

  createYieldEarning(data: {
    accountId: string;
    currency: Currency;
    principal: string;
    earned: string;
    currentRate: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }): YieldEarning {
    const earning: YieldEarning = {
      id: uuidv4(),
      accountId: data.accountId,
      currency: data.currency,
      principal: data.principal,
      earned: data.earned,
      currentRate: data.currentRate,
      period: data.period,
      lastPayment: new Date().toISOString(),
      nextPayment: new Date(Date.now() + (data.period === 'daily' ? 24 : data.period === 'weekly' ? 7 * 24 : data.period === 'monthly' ? 30 * 24 : 365 * 24) * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.yieldEarnings.push(earning);
    return earning;
  }

  // Cross-border Payment Methods
  getCrossBorderTransactions(): Transaction[] {
    return this.transactions.filter(tx => tx.transferType === 'cross_border');
  }

  getTransactionsByAccountId(accountId: string): Transaction[] {
    return this.transactions.filter(tx => tx.accountId === accountId || tx.fromAccount === accountId || tx.toAccount === accountId);
  }
}

// Singleton instance
export const mockStore = new MockDataStore();

