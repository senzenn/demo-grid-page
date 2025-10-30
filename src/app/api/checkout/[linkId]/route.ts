/**
 * Checkout API Route Handler
 * GET: Fetch payment link by linkId
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import type {
  CheckoutResponse,
  ApiError,
} from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params;

    if (!linkId) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Invalid link ID',
        message: 'Payment link ID is required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const paymentLink = mockStore.getPaymentLinkByLinkId(linkId);

    if (!paymentLink) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Payment link not found',
        message: 'The payment link you are looking for does not exist or has been deleted',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check if link is expired or paused
    if (paymentLink.status === 'expired' || paymentLink.status === 'paused') {
      const errorResponse: ApiError = {
        success: false,
        error: 'Payment link unavailable',
        message: `This payment link is ${paymentLink.status}`,
      };
      return NextResponse.json(errorResponse, { status: 410 }); // 410 Gone
    }

    const response: CheckoutResponse = {
      success: true,
      paymentLink,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to fetch payment link',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

