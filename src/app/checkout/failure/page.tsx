"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

function FailureContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const paymentLinkId = searchParams.get('link');
  const merchantUrl = searchParams.get('return_url');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn&apos;t process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Common reasons for payment failure:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Insufficient funds in wallet</li>
              <li>Transaction was cancelled</li>
              <li>Network congestion</li>
              <li>Invalid payment link</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            {paymentLinkId && (
              <Button asChild className="w-full">
                <Link href={`/checkout/${paymentLinkId}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
            )}

            <Button variant="outline" className="w-full" asChild>
              <a href="mailto:support@skyagent.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </a>
            </Button>

            {merchantUrl ? (
              <Button variant="ghost" asChild className="w-full">
                <a href={merchantUrl}>Return to Merchant</a>
              </Button>
            ) : (
              <Button variant="ghost" asChild className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutFailurePage() {
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
      <FailureContent />
    </Suspense>
  );
}

