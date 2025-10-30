"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink, Download } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const signature = searchParams.get('tx');
  const merchantUrl = searchParams.get('return_url');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {signature && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Transaction Details</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">
                  {signature.slice(0, 8)}...{signature.slice(-8)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>

            {merchantUrl ? (
              <Button asChild className="w-full">
                <a href={merchantUrl}>Return to Merchant</a>
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            A confirmation email has been sent to your registered address
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

