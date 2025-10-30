/**
 * Payments API Route Handler
 * POST: Process a payment transaction
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockStore, generateSolanaSignature, generateGridTransferId } from '@/lib/mock-data';
import type {
  PaymentRequest,
  PaymentResponse,
  ApiError,
  TransactionStatus,
} from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    // Validate required fields
    if (!body.paymentLinkId || !body.paymentMethod) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Missing required fields',
        message: 'Payment link ID and payment method are required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find payment link
    const paymentLink = mockStore.getPaymentLinkByLinkId(body.paymentLinkId);
    if (!paymentLink) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Payment link not found',
        message: 'The specified payment link does not exist',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check if payment link is active
    if (paymentLink.status !== 'active') {
      const errorResponse: ApiError = {
        success: false,
        error: 'Payment link not available',
        message: `This payment link is ${paymentLink.status}`,
      };
      return NextResponse.json(errorResponse, { status: 410 }); // 410 Gone
    }

    // Validate payment method specific requirements
    if (body.paymentMethod === 'wallet' && !body.customerWallet && !body.solanaSignature) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Invalid payment data',
        message: 'Customer wallet and transaction signature are required for wallet payments',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Generate transaction signature if not provided (for mock/testing)
    const transactionSignature = body.solanaSignature || generateSolanaSignature();
    const gridTransferId = generateGridTransferId();

    // Determine transaction status (mock - in production this would check blockchain)
    // Check for failure BEFORE creating the transaction to avoid inconsistency
    const willFail = Math.random() < 0.05; // Simulate occasional failures for testing (5% failure rate)
    
    // If transaction will fail, return error immediately without persisting
    if (willFail) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Payment failed',
        message: 'Transaction could not be processed. Please try again.',
      };
      return NextResponse.json(errorResponse, { status: 402 }); // 402 Payment Required (retry)
    }

    // Transaction will succeed - proceed with creating the record
    const transactionStatus: TransactionStatus = 'completed';

    // Create transaction record (only successful transactions reach here)
    const transaction = mockStore.createTransaction({
      paymentLinkId: body.paymentLinkId,
      transactionType: 'payment',
      amount: paymentLink.amount,
      currency: paymentLink.currency,
      status: transactionStatus,
      paymentMethod: body.paymentMethod,
      customerWallet: body.customerWallet,
      customerEmail: body.customerEmail,
      solanaSignature: transactionSignature,
      gridTransferId: gridTransferId,
    });

    // Update payment link stats (only completed transactions are counted)
    const linkTransactions = mockStore.getTransactionsByPaymentLinkId(body.paymentLinkId);
    const completedTransactions = linkTransactions.filter(tx => tx.status === 'completed');
    mockStore.updatePaymentLinkStats(
      body.paymentLinkId,
      linkTransactions.length,
      completedTransactions.length
    );

    const response: PaymentResponse = {
      success: true,
      transaction,
      signature: transactionSignature,
      gridTransferId: gridTransferId,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to process payment',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

