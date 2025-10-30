"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { ProductConfig } from '@/app/dashboard/settings/page';

interface AmountEditorProps {
  config: ProductConfig;
  onUpdate: (updates: Partial<ProductConfig>) => void;
}

export function AmountEditor({ config, onUpdate }: AmountEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <CardDescription>
          Set the amount and currency for your product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="12.00"
              value={config.amount}
              onChange={(e) => onUpdate({ amount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={config.currency}
              onValueChange={(value: ProductConfig['currency']) =>
                onUpdate({ currency: value })
              }
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="PYUSD">PYUSD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="show-amount"
            checked={config.showAmount}
            onCheckedChange={(checked) =>
              onUpdate({ showAmount: checked === true })
            }
          />
          <Label
            htmlFor="show-amount"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Display amount on checkout
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

