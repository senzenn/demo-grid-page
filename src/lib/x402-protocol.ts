/**
 * x402 Protocol Implementation
 * HTTP 402 Payment Required standard for internet-native payments
 * 
 * Spec: https://www.x402.org
 * Docs: https://docs.cdp.coinbase.com/x402/welcome
 */

import { v4 as uuidv4 } from 'uuid';

export interface PaymentRequirement {
  maxAmountRequired: string;
  paymentAddress: string;
  asset: 'USDC' | 'USDT' | 'PYUSD';
  network: 'solana' | 'ethereum';
  nonce: string;
  endpoint: string;
  description?: string;
}

export interface PaymentProof {
  signature: string;
  paymentAddress: string;
  amount: string;
  nonce: string;
  timestamp: number;
}

export interface X402Headers {
  'X-Payment-Required': 'true';
  'X-Payment-Amount': string;
  'X-Payment-Currency': string;
  'X-Payment-Address': string;
  'X-Payment-Network': string;
  'X-Payment-Nonce': string;
}

/**
 * Create 402 Payment Required response
 * Used when a resource requires payment
 */
export function create402Response(requirement: PaymentRequirement) {
  const headers: X402Headers = {
    'X-Payment-Required': 'true',
    'X-Payment-Amount': requirement.maxAmountRequired,
    'X-Payment-Currency': requirement.asset,
    'X-Payment-Address': requirement.paymentAddress,
    'X-Payment-Network': requirement.network,
    'X-Payment-Nonce': requirement.nonce,
  };

  const body = {
    statusCode: 402,
    message: 'Payment Required',
    paymentRequired: true,
    maxAmountRequired: requirement.maxAmountRequired,
    paymentAddress: requirement.paymentAddress,
    asset: requirement.asset,
    network: requirement.network,
    nonce: requirement.nonce,
    endpoint: requirement.endpoint,
    description: requirement.description || 'Payment required to access this resource',
  };

  return {
    status: 402,
    headers,
    body,
  };
}

/**
 * Verify x402 payment proof
 * Validates signature and nonce from X-PAYMENT header
 */
export function verifyPaymentProof(
  proof: PaymentProof,
  expectedNonce: string,
  expectedAddress: string,
  minAmount: string
): boolean {
  try {
    // Verify nonce matches to prevent replay attacks
    if (proof.nonce !== expectedNonce) {
      console.error('Nonce mismatch');
      return false;
    }

    // Verify payment address matches
    if (proof.paymentAddress !== expectedAddress) {
      console.error('Payment address mismatch');
      return false;
    }

    // Verify amount is sufficient
    if (parseFloat(proof.amount) < parseFloat(minAmount)) {
      console.error('Insufficient payment amount');
      return false;
    }

    // Verify timestamp is recent (within 5 minutes)
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    if (now - proof.timestamp > maxAge) {
      console.error('Payment proof expired');
      return false;
    }

    // TODO: Verify cryptographic signature (EIP-712 or Solana equivalent)
    // This would check the signature against the payment proof data

    return true;
  } catch (error) {
    console.error('Error verifying payment proof:', error);
    return false;
  }
}

/**
 * Generate payment nonce
 * Unique identifier to prevent replay attacks
 */
export function generatePaymentNonce(): string {
  return uuidv4();
}

/**
 * Create X-PAYMENT header value
 * Client includes this when submitting payment
 */
export function createPaymentHeader(proof: PaymentProof): string {
  return JSON.stringify({
    signature: proof.signature,
    paymentAddress: proof.paymentAddress,
    amount: proof.amount,
    nonce: proof.nonce,
    timestamp: proof.timestamp,
  });
}

/**
 * Parse X-PAYMENT header from request
 */
export function parsePaymentHeader(headerValue: string): PaymentProof | null {
  try {
    const proof = JSON.parse(headerValue);
    
    if (!proof.signature || !proof.paymentAddress || !proof.amount || !proof.nonce) {
      return null;
    }

    return proof as PaymentProof;
  } catch (error) {
    console.error('Error parsing payment header:', error);
    return null;
  }
}

/**
 * Create X-PAYMENT-RESPONSE header
 * Server includes this after successful payment verification
 */
export function createPaymentResponseHeader(
  transactionHash: string,
  gridTransferId: string,
  status: 'confirmed' | 'pending' | 'failed'
) {
  return JSON.stringify({
    status,
    transactionHash,
    gridTransferId,
    timestamp: Date.now(),
    network: 'solana',
  });
}

/**
 * Payment middleware configuration
 * Example usage: paymentMiddleware(gridAccountAddress, {"/api/data": "$0.01"})
 */
export interface PaymentEndpointConfig {
  endpoint: string;
  amount: string;
  currency: 'USDC' | 'USDT' | 'PYUSD';
  description?: string;
}

export function createPaymentRequirement(
  config: PaymentEndpointConfig,
  merchantAddress: string
): PaymentRequirement {
  return {
    maxAmountRequired: config.amount,
    paymentAddress: merchantAddress,
    asset: config.currency,
    network: 'solana',
    nonce: generatePaymentNonce(),
    endpoint: config.endpoint,
    description: config.description,
  };
}

