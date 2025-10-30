/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';
import { toast } from 'sonner';

export function usePayment() {
  const { publicKey, signTransaction } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const processWalletPayment = async (
    paymentLinkId: string,
    merchantWallet: string,
    amount: string
  ) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected');
    }

    setIsProcessing(true);

    try {
      // Connect to Solana
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        'confirmed'
      );

      // Create a simple SOL transfer transaction as placeholder
      // In production, this would transfer USDC via Token Program
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(merchantWallet),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL / 1000, // Small amount for testing
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign transaction
      const signed = await signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(signed.serialize());

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      // Submit payment to backend
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentLinkId,
          paymentMethod: 'wallet',
          customerWallet: publicKey.toBase58(),
          solanaSignature: signature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment failed');
      }

      const result = await response.json();
      return {
        success: true,
        signature,
        ...result,
      };
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: error.message,
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processWalletPayment,
    isProcessing,
  };
}

