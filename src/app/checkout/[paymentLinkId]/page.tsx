/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePayment } from '@/hooks/use-payment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentCard } from '@/components/payment-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Wallet, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function CheckoutPage() {
  const params = useParams();
  const paymentLinkId = params.paymentLinkId as string;
  const { connected, connect, publicKey } = useWallet();
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'ramp'>('wallet');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const { processWalletPayment, isProcessing } = usePayment();

  // Fetch payment link details
  const { data: paymentLinkData, isLoading, error } = useQuery({
    queryKey: ['payment-link', paymentLinkId],
    queryFn: async () => {
      const response = await fetch(`/api/checkout/${paymentLinkId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || result.error || 'Payment link not found');
      }
      
      return result;
    },
    retry: false,
  });

  const paymentLink = paymentLinkData?.paymentLink;

  const handlePayment = async () => {
    if (!paymentLink || !paymentLink.merchantWallet) {
      toast.error('Invalid payment link configuration');
      setPaymentStatus('error');
      return;
    }

    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setPaymentStatus('processing');

    try {
      const result = await processWalletPayment(
        paymentLinkId,
        paymentLink.merchantWallet,
        paymentLink.amount
      );

      if (result.success) {
        setPaymentStatus('success');
        toast.success('Payment successful!', {
          description: 'Redirecting to success page...',
        });
        // Redirect to success page
        const successUrl = paymentLink.successUrl || `/checkout/success?tx=${result.signature}`;
        setTimeout(() => {
          window.location.href = successUrl;
        }, 1500);
      }
    } catch (err: any) {
      setPaymentStatus('error');
      toast.error('Payment failed', {
        description: err.message || 'An unexpected error occurred',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !paymentLink) {
    const errorMessage = error instanceof Error ? error.message : 'Payment link not found';
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Payment Link Not Found</CardTitle>
            </div>
            <CardDescription>
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/magic-links">
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-4">
        {/* Payment Details Card */}
        <PaymentCard
          amount={paymentLink.amount}
          currency={paymentLink.currency}
          description={paymentLink.description}
          merchantName="SkyAgent"
        />

        {/* Payment Methods Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Choose how you&apos;d like to pay
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="wallet">
                  <Wallet className="mr-2 h-4 w-4" />
                  Crypto Wallet
                </TabsTrigger>
                <TabsTrigger value="ramp">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit Card
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-4 pt-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Pay directly from your Solana wallet with instant settlement
                  </p>
                </div>

                {!connected ? (
                  <Button className="w-full h-12" size="lg" onClick={() => connect()}>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet to Pay
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Connected Wallet</span>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                          Connected
                        </Badge>
                      </div>
                      <p className="font-mono text-sm text-muted-foreground">
                        {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {paymentStatus === 'success' ? (
                        <div className="w-full h-12 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="text-green-700 dark:text-green-300 font-medium">
                            Payment Successful!
                          </span>
                        </div>
                      ) : (
                        <>
                          <Button
                            className="w-full h-12 text-lg"
                            size="lg"
                            onClick={handlePayment}
                            disabled={isProcessing || paymentStatus === 'processing'}
                          >
                            {isProcessing || paymentStatus === 'processing' ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing Payment...
                              </>
                            ) : paymentStatus === 'error' ? (
                              <>
                                <AlertCircle className="mr-2 h-5 w-5" />
                                Try Again
                              </>
                            ) : (
                              <>
                                Pay {paymentLink.amount} {paymentLink.currency}
                              </>
                            )}
                          </Button>
                          
                          <p className="text-xs text-center text-muted-foreground">
                            {paymentStatus === 'processing' 
                              ? 'Please approve the transaction in your wallet'
                              : 'You\'ll be prompted to approve in your wallet'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ramp" className="space-y-4 pt-4">
                <div className="bg-muted/50 border border-dashed rounded-lg p-12 text-center space-y-4">
                  <div className="flex justify-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Credit Card Payments Coming Soon</p>
                    <p className="text-sm text-muted-foreground">
                      Grid Ramp will enable credit card to crypto conversion
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    Pay with Card
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Security Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Secured by Squads Grid Protocol • Settlement in &lt; 2 seconds
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <Link href="/" className="hover:text-foreground transition-colors text-muted-foreground">
              Terms
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/" className="hover:text-foreground transition-colors text-muted-foreground">
              Privacy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/" className="hover:text-foreground transition-colors text-muted-foreground">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

