"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ProductConfig } from '@/app/dashboard/settings/page';

interface ProductDetailsEditorProps {
  config: ProductConfig;
  onUpdate: (updates: Partial<ProductConfig>) => void;
}

export function ProductDetailsEditor({ config, onUpdate }: ProductDetailsEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>
          Configure the name and description of your product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product-name">Product Name</Label>
          <Input
            id="product-name"
            placeholder="e.g., Starter Plan"
            value={config.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-description">Description</Label>
          <Textarea
            id="product-description"
            placeholder="Describe your product or service"
            value={config.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}

