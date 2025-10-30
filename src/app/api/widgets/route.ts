/**
 * Widgets API Route Handler
 * GET: Fetch all widgets
 * POST: Create a new widget
 */

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-data';
import type {
  CreateWidgetRequest,
  CreateWidgetResponse,
  GetWidgetsResponse,
  ApiError,
} from '@/lib/types';

export async function GET() {
  try {
    const widgets = mockStore.getAllWidgets();

    const response: GetWidgetsResponse = {
      success: true,
      widgets,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to fetch widgets',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateWidgetRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.buttonText || !body.paymentLinkId || !body.type) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Missing required fields',
        message: 'Name, type, button text, and payment link ID are required',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate widget type
    const validTypes = ['button', 'card', 'inline', 'checkout', 'donation', 'subscription'];
    if (!validTypes.includes(body.type)) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Invalid widget type',
        message: `Widget type must be one of: ${validTypes.join(', ')}`,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Verify payment link exists
    const paymentLink = mockStore.getPaymentLinkByLinkId(body.paymentLinkId);
    if (!paymentLink) {
      const errorResponse: ApiError = {
        success: false,
        error: 'Payment link not found',
        message: 'The specified payment link does not exist',
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Create widget
    const widget = mockStore.createWidget({
      name: body.name,
      type: body.type,
      style: body.style || 'default',
      size: body.size || 'md',
      buttonText: body.buttonText,
      description: body.description,
      imageUrl: body.imageUrl,
      paymentLinkId: body.paymentLinkId,
      primaryColor: body.primaryColor,
      borderRadius: body.borderRadius,
      showAmount: body.showAmount,
      showCurrency: body.showCurrency,
    });

    const response: CreateWidgetResponse = {
      success: true,
      widget,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ApiError = {
      success: false,
      error: 'Failed to create widget',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

