"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductDetailsEditor } from '@/components/settings/product-details-editor';
import { ImageButtonEditor } from '@/components/settings/image-button-editor';
import { AmountEditor } from '@/components/settings/amount-editor';
import { StripePreview } from '@/components/settings/stripe-preview';

export interface ProductConfig {
  name: string;
  description: string;
  amount: string;
  currency: 'USDC' | 'USDT' | 'PYUSD';
  imageUrl: string;
  buttonText: string;
  buttonStyle: 'default' | 'outline' | 'ghost' | 'pill';
  showAmount: boolean;
}

const defaultConfig: ProductConfig = {
  name: 'Starter Plan',
  description: 'Subscribe to get started with premium features',
  amount: '12.00',
  currency: 'USDC',
  imageUrl: '',
  buttonText: 'Subscribe',
  buttonStyle: 'default',
  showAmount: true,
};

export default function SettingsPage() {
  const [config, setConfig] = useState<ProductConfig>(defaultConfig);

  const updateConfig = (updates: Partial<ProductConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your product details, appearance, and pricing
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_500px]">
        {/* Left Side - Configuration */}
        <div className="space-y-6">
          <Tabs defaultValue="product" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="product" className="space-y-4 mt-4">
              <ProductDetailsEditor
                config={config}
                onUpdate={updateConfig}
              />
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4 mt-4">
              <ImageButtonEditor
                config={config}
                onUpdate={updateConfig}
              />
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-4">
              <AmountEditor
                config={config}
                onUpdate={updateConfig}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side - Live Preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your product will appear to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StripePreview config={config} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

