/**
 * Transactions API Route Handler
 * GET: Fetch all transactions
 */

import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import type {
  GetTransactionsResponse,
  ApiError,
} from '@/lib/types';

export async function GET() {
  try {
    const transactions = mockStore.getAllTransactions();

    const response: GetTransactionsResponse = {
      success: true,
      transactions,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to fetch transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

