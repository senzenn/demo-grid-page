"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock } from 'lucide-react';

interface PaymentCardProps {
  amount: string;
  currency: string;
  description?: string;
  merchantName?: string;
}

export function PaymentCard({ amount, currency, description, merchantName = 'SkyAgent' }: PaymentCardProps) {
  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        {/* Merchant Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center text-white font-bold">
              {merchantName[0]}
            </div>
            <div>
              <p className="font-semibold">{merchantName}</p>
              <p className="text-xs text-muted-foreground">Powered by Grid</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secure
          </Badge>
        </div>

        {/* Payment Amount */}
        <div className="bg-muted/50 rounded-lg p-6 mb-6">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{amount}</span>
                <span className="text-xl font-semibold text-muted-foreground">{currency}</span>
              </div>
            </div>
          </div>
          {description && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">For</p>
              <p className="text-sm font-medium">{description}</p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Secured by Squads Grid Protocol on Solana</span>
        </div>
      </CardContent>
    </Card>
  );
}

