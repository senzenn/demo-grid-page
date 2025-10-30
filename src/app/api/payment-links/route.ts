/**
 * Payment Links API Route Handler
 * GET: Fetch all payment links
 * POST: Create a new payment link
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockStore, generateSolanaAddress } from '@/lib/mock-data';
import type {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  GetPaymentLinksResponse,
  ApiError,
} from '@/lib/types';

export async function GET() {
  try {
    const paymentLinks = mockStore.getAllPaymentLinks();

    const response: GetPaymentLinksResponse = {
      success: true,
      paymentLinks,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to fetch payment links',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentLinkRequest = await request.json();

    // Validate required fields
    if (!body.amount || !body.currency) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Missing required fields',
        message: 'Amount and currency are required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate amount is positive
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Invalid amount',
        message: 'Amount must be a positive number',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate currency
    const validCurrencies = ['USDC', 'USDT', 'PYUSD'];
    if (!validCurrencies.includes(body.currency)) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Invalid currency',
        message: `Currency must be one of: ${validCurrencies.join(', ')}`,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Generate merchant wallet address (in production, this would come from authenticated user)
    const merchantWallet = generateSolanaAddress();

    // Create payment link
    const paymentLink = mockStore.createPaymentLink({
      amount: body.amount,
      currency: body.currency,
      description: body.description,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
      merchantWallet,
    });

    const response: CreatePaymentLinkResponse = {
      success: true,
      paymentLink,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to create payment link',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

