"use client";

import { ArrowLeft, Lock, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProductConfig } from '@/app/dashboard/settings/page';

interface StripePreviewProps {
  config: ProductConfig;
}

export function StripePreview({ config }: StripePreviewProps) {
  const getButtonClassName = () => {
    switch (config.buttonStyle) {
      case 'outline':
        return 'border-2 border-primary text-primary bg-transparent hover:bg-primary/10';
      case 'ghost':
        return 'text-primary bg-transparent hover:bg-primary/10';
      case 'pill':
        return 'rounded-full';
      default:
        return 'bg-primary text-primary-foreground hover:opacity-90';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="font-semibold">Squad Grid</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* Left Side - Product Display */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{config.name}</h2>
              {config.showAmount && (
                <div className="space-y-1">
                  <div className="text-4xl font-bold">
                    ${config.amount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per month
                  </div>
                </div>
              )}
            </div>

            {/* Product Description */}
            {config.description && (
              <p className="text-sm text-muted-foreground">{config.description}</p>
            )}

            {/* Product Image */}
            {config.imageUrl ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.imageUrl}
                  alt={config.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 border flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Product Image</p>
                  <p className="text-xs mt-1">Add image URL in settings</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Secure payment powered by Squad Grid</span>
            </div>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Payment Method Options */}
            <div className="space-y-4">
              <Button
                className="w-full h-12 bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                variant="default"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Pay with Apple Pay
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-950 px-2 text-muted-foreground">
                    Or pay with card
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preview-email">Email</Label>
                <Input
                  id="preview-email"
                  type="email"
                  placeholder="you@example.com"
                  disabled
                  className="bg-gray-50 dark:bg-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview-card">Card information</Label>
                <Input
                  id="preview-card"
                  placeholder="1234 1234 1234 1234"
                  disabled
                  className="bg-gray-50 dark:bg-gray-900"
                />
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-10 bg-blue-600 rounded border-2 border-white"></div>
                  <div className="h-6 w-10 bg-red-600 rounded border-2 border-white"></div>
                  <div className="h-6 w-10 bg-blue-500 rounded border-2 border-white"></div>
                  <div className="h-6 w-10 bg-orange-600 rounded border-2 border-white"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preview-expiry">MM / YY</Label>
                  <Input
                    id="preview-expiry"
                    placeholder="MM / YY"
                    disabled
                    className="bg-gray-50 dark:bg-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preview-cvc">CVC</Label>
                  <div className="relative">
                    <Input
                      id="preview-cvc"
                      placeholder="CVC"
                      disabled
                      className="bg-gray-50 dark:bg-gray-900"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview-name">Name on card</Label>
                <Input
                  id="preview-name"
                  placeholder="John Doe"
                  disabled
                  className="bg-gray-50 dark:bg-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview-country">Country or region</Label>
                <Input
                  id="preview-country"
                  placeholder="United States"
                  disabled
                  className="bg-gray-50 dark:bg-gray-900"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className={`w-full h-12 ${getButtonClassName()}`}
              disabled
            >
              {config.buttonText || 'Subscribe'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              This is a preview. Fields are disabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

