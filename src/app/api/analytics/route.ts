/**
 * Analytics API Route Handler
 * GET: Return computed analytics from transaction data
 */

import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import type {
  GetAnalyticsResponse,
  ApiError,
  AnalyticsStats,
  Currency,
  PaymentMethod,
  AccountType,
} from '@/lib/types';

function computeAnalytics(): AnalyticsStats {
  const transactions = mockStore.getAllTransactions();

  // Basic stats
  const completedTransactions = transactions.filter(tx => tx.status === 'completed');
  const totalRevenue = completedTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  const transactionCount = transactions.length;
  const totalCompletedTransactions = completedTransactions.length;
  const totalPendingTransactions = transactions.filter(tx => tx.status === 'pending' || tx.status === 'processing').length;
  const totalFailedTransactions = transactions.filter(tx => tx.status === 'failed' || tx.status === 'cancelled').length;
  const successRate = transactionCount > 0 ? (totalCompletedTransactions / transactionCount) * 100 : 0;
  const avgTransactionValue = totalCompletedTransactions > 0 ? totalRevenue / totalCompletedTransactions : 0;

  // Revenue by currency
  const revenueByCurrency: Record<Currency, number> = {
    USDC: 0,
    USDT: 0,
    PYUSD: 0,
  };

  completedTransactions.forEach(tx => {
    if (tx.currency in revenueByCurrency) {
      revenueByCurrency[tx.currency as Currency] += parseFloat(tx.amount);
    }
  });

  // Revenue by month (last 12 months)
  const revenueByMonth: Array<{ month: string; revenue: number; transactionCount: number }> = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthTransactions = completedTransactions.filter(tx => {
      const txDate = new Date(tx.createdAt);
      return txDate >= monthStart && txDate <= monthEnd;
    });
    
    const monthRevenue = monthTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    
    revenueByMonth.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: monthRevenue,
      transactionCount: monthTransactions.length,
    });
  }

  // Payment method distribution
  const methodCounts: Record<PaymentMethod, number> = {
    wallet: 0,
    ramp: 0,
    card: 0,
  };

  transactions.forEach(tx => {
    if (tx.paymentMethod in methodCounts) {
      methodCounts[tx.paymentMethod as PaymentMethod]++;
    }
  });

  const paymentMethodDistribution = Object.entries(methodCounts)
    .map(([method, count]) => ({
      method: method as PaymentMethod,
      count,
      percentage: transactionCount > 0 ? (count / transactionCount) * 100 : 0,
    }))
    .filter(item => item.count > 0);

  return {
    totalRevenue,
    transactionCount,
    successRate,
    avgTransactionValue,
    totalCompletedTransactions,
    totalPendingTransactions,
    totalFailedTransactions,
    revenueByCurrency,
    revenueByMonth,
    paymentMethodDistribution,
    // Additional properties with default values
    totalAccounts: 0,
    activeAccounts: 0,
    totalYieldEarned: 0,
    crossBorderTransactions: 0,
    accountsByType: {
      business: 0,
      personal: 0,
      savings: 0,
      yield: 0,
    } as Record<AccountType, number>,
    yieldByCurrency: {
      USDC: 0,
      USDT: 0,
      PYUSD: 0,
    },
  };
}

export async function GET() {
  try {
    const stats = computeAnalytics();

    const response: GetAnalyticsResponse = {
      success: true,
      stats,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

