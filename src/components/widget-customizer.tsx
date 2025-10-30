/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Copy, Check, AlertCircle, CreditCard, Layout, ShoppingCart, Heart, Repeat } from 'lucide-react';
import type { CreateWidgetRequest, WidgetType, WidgetStyle, WidgetSize } from '@/lib/types';

interface WidgetCustomizerProps {
  onSuccess?: () => void;
}

interface FormErrors {
  name?: string;
  buttonText?: string;
  paymentLinkId?: string;
}

const WIDGET_TYPES: Array<{ value: WidgetType; label: string; description: string; icon: React.ReactNode }> = [
  { value: 'button', label: 'Payment Button', description: 'Simple button to trigger checkout', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'card', label: 'Product Card', description: 'Card with image, description, and price', icon: <Layout className="h-4 w-4" /> },
  { value: 'inline', label: 'Inline Form', description: 'Embedded payment form', icon: <ShoppingCart className="h-4 w-4" /> },
  { value: 'checkout', label: 'Embedded Checkout', description: 'Full checkout page in iframe', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'donation', label: 'Donation Widget', description: 'For accepting donations', icon: <Heart className="h-4 w-4" /> },
  { value: 'subscription', label: 'Subscription', description: 'Recurring payment widget', icon: <Repeat className="h-4 w-4" /> },
];

const WIDGET_STYLES: Array<{ value: WidgetStyle; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'pill', label: 'Pill' },
  { value: 'minimal', label: 'Minimal' },
];

const WIDGET_SIZES: Array<{ value: WidgetSize; label: string }> = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

export function WidgetCustomizer({ onSuccess }: WidgetCustomizerProps) {
  const queryClient = useQueryClient();
  const [embedCode, setEmbedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [widgetType, setWidgetType] = useState<WidgetType>('button');
  const [style, setStyle] = useState<WidgetStyle>('default');
  const [size, setSize] = useState<WidgetSize>('md');
  const [buttonText, setButtonText] = useState('Pay Now');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [paymentLinkId, setPaymentLinkId] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState(8);
  const [showAmount, setShowAmount] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch payment links for dropdown
  const { data: paymentLinksData } = useQuery({
    queryKey: ['payment-links'],
    queryFn: async () => {
      const response = await fetch('/api/payment-links');
      if (!response.ok) {
        throw new Error('Failed to fetch payment links');
      }
      return response.json();
    },
  });

  const paymentLinks = paymentLinksData?.paymentLinks || [];
  const selectedPaymentLink = paymentLinks.find((link: any) => link.linkId === paymentLinkId);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name || name.trim() === '') {
      newErrors.name = 'Widget name is required';
    }

    if (!buttonText || buttonText.trim() === '') {
      newErrors.buttonText = 'Button text is required';
    }

    if (!paymentLinkId || paymentLinkId.trim() === '') {
      newErrors.paymentLinkId = 'Payment link is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createWidget = useMutation({
    mutationFn: async (data: CreateWidgetRequest) => {
      const response = await fetch('/api/widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to create widget');
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['widgets'] });
      setEmbedCode(data.widget.embedCode);
      toast.success('Widget created successfully!', {
        description: `Widget "${data.widget.name}" is ready to embed`,
      });
      // Reset form
      setName('');
      setButtonText('Pay Now');
      setPaymentLinkId('');
      setDescription('');
      setImageUrl('');
      setWidgetType('button');
      setStyle('default');
      setSize('md');
      setPrimaryColor('#000000');
      setBorderRadius(8);
      setShowAmount(false);
      setShowCurrency(false);
      setErrors({});
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error('Failed to create widget', {
        description: error.message || 'An unexpected error occurred',
      });
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors', {
        description: 'Some fields contain invalid values',
      });
      return;
    }

    createWidget.mutate({
      name: name.trim(),
      type: widgetType,
      style,
      size,
      buttonText: buttonText.trim(),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      paymentLinkId: paymentLinkId.trim(),
      primaryColor: primaryColor || undefined,
      borderRadius: borderRadius || undefined,
      showAmount: showAmount || undefined,
      showCurrency: showCurrency || undefined,
    });
  };

  const copyEmbedCode = async () => {
    if (!embedCode) return;
    await navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPreview = () => {

    switch (widgetType) {
      case 'button':
        return (
          <div className="flex items-center justify-center">
            <Button
              size={size === 'md' ? 'default' : size}
              variant={style === 'outline' ? 'outline' : style === 'ghost' ? 'ghost' : 'default'}
              className={style === 'pill' ? 'rounded-full' : style === 'minimal' ? 'underline-offset-4 hover:underline' : ''}
              style={{
                backgroundColor: (style === 'default' || style === 'pill') ? primaryColor : undefined,
                borderColor: style === 'outline' ? primaryColor : undefined,
                color: (style === 'outline' || style === 'ghost' || style === 'minimal') ? primaryColor : '#fff',
                borderRadius: style === 'pill' ? 9999 : borderRadius,
              }}
            >
              {buttonText}
            </Button>
          </div>
        );

      case 'card':
        return (
          <div className="max-w-sm mx-auto border rounded-lg overflow-hidden shadow-sm">
            {imageUrl && (
              <div className="h-48 bg-muted flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 space-y-3">
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
              {(showAmount || showCurrency) && selectedPaymentLink && (
                <div className="text-lg font-semibold">
                  {showAmount && `${selectedPaymentLink.amount} `}
                  {showCurrency && selectedPaymentLink.currency}
                </div>
              )}
              <Button
                size={size === 'md' ? 'default' : size}
                className="w-full"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: borderRadius,
                }}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        );

      case 'inline':
        return (
          <div className="border rounded-lg p-6 space-y-4 max-w-md mx-auto">
            {selectedPaymentLink && (showAmount || showCurrency) && (
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {showAmount && `${selectedPaymentLink.amount} `}
                  {showCurrency && selectedPaymentLink.currency}
                </div>
              </div>
            )}
            {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
            <Button
              size={size === 'md' ? 'default' : size}
              className="w-full"
              style={{
                backgroundColor: primaryColor,
                borderRadius: borderRadius,
              }}
            >
              {buttonText}
            </Button>
          </div>
        );

      case 'checkout':
        return (
          <div className="border rounded-lg overflow-hidden" style={{ borderRadius: borderRadius }}>
            <div className="h-96 bg-muted flex items-center justify-center">
              <div className="text-center space-y-2">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Checkout preview</p>
                <p className="text-xs text-muted-foreground">Full checkout will load in iframe</p>
              </div>
            </div>
          </div>
        );

      case 'donation':
        return (
          <div className="border rounded-lg p-6 space-y-4 max-w-md mx-auto text-center">
            <Heart className="h-12 w-12 mx-auto text-red-500" />
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            <Button
              size={size === 'md' ? 'default' : size}
              className="w-full"
              style={{
                backgroundColor: primaryColor,
                borderRadius: borderRadius,
              }}
            >
              {buttonText}
            </Button>
          </div>
        );

      case 'subscription':
        return (
          <div className="border rounded-lg p-6 space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Subscription</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            </div>
            {selectedPaymentLink && (showAmount || showCurrency) && (
              <div className="text-xl font-bold">
                {showAmount && `${selectedPaymentLink.amount} `}
                {showCurrency && selectedPaymentLink.currency} / month
              </div>
            )}
            <Button
              size={size === 'md' ? 'default' : size}
              className="w-full"
              style={{
                backgroundColor: primaryColor,
                borderRadius: borderRadius,
              }}
            >
              {buttonText}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Form Section */}
      <div className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="name">Widget Name *</Label>
                <Input
                  id="name"
                  placeholder="My Payment Button"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  className={errors.name ? 'border-red-500' : ''}
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <div id="name-error" className="flex items-center gap-1 text-sm text-red-500" role="alert">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="widgetType">Widget Type *</Label>
                <Select value={widgetType} onValueChange={(value) => setWidgetType(value as WidgetType)}>
                  <SelectTrigger id="widgetType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WIDGET_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span className="flex-shrink-0">{type.icon}</span>
                          <span className="flex flex-col">
                            <span className="font-medium">{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentLinkId">Payment Link *</Label>
                <Select
                  value={paymentLinkId}
                  onValueChange={(value) => {
                    setPaymentLinkId(value);
                    if (errors.paymentLinkId) {
                      setErrors((prev) => ({ ...prev, paymentLinkId: undefined }));
                    }
                  }}
                >
                  <SelectTrigger id="paymentLinkId" className={errors.paymentLinkId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a payment link" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentLinks.length === 0 ? (
                      <SelectItem value="" disabled>No payment links available</SelectItem>
                    ) : (
                      paymentLinks.map((link: any) => (
                        <SelectItem key={link.linkId} value={link.linkId}>
                          {link.description || `Link ${link.linkId.slice(0, 8)}`} - {link.amount} {link.currency}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.paymentLinkId && (
                  <div className="flex items-center gap-1 text-sm text-red-500" role="alert">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.paymentLinkId}</span>
                  </div>
                )}
                {paymentLinks.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Create a payment link first to generate a widget
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text *</Label>
                <Input
                  id="buttonText"
                  placeholder="Pay Now"
                  value={buttonText}
                  onChange={(e) => {
                    setButtonText(e.target.value);
                    if (errors.buttonText) {
                      setErrors((prev) => ({ ...prev, buttonText: undefined }));
                    }
                  }}
                  className={errors.buttonText ? 'border-red-500' : ''}
                  required
                  aria-invalid={!!errors.buttonText}
                  aria-describedby={errors.buttonText ? 'buttonText-error' : undefined}
                />
                {errors.buttonText && (
                  <div id="buttonText-error" className="flex items-center gap-1 text-sm text-red-500" role="alert">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.buttonText}</span>
                  </div>
                )}
              </div>

              {(widgetType === 'card' || widgetType === 'inline' || widgetType === 'donation' || widgetType === 'subscription') && (
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description or payment details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {(widgetType === 'card') && (
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={style} onValueChange={(value) => setStyle(value as WidgetStyle)}>
                    <SelectTrigger id="style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WIDGET_STYLES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={(value) => setSize(value as WidgetSize)}>
                    <SelectTrigger id="size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WIDGET_SIZES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    className="w-20 h-10"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="#000000"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius: {borderRadius}px</Label>
                <input
                  id="borderRadius"
                  type="range"
                  min="0"
                  max="24"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showAmount"
                    checked={showAmount}
                    onChange={(e) => setShowAmount(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="showAmount" className="cursor-pointer">Show Amount</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showCurrency"
                    checked={showCurrency}
                    onChange={(e) => setShowCurrency(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="showCurrency" className="cursor-pointer">Show Currency</Label>
                </div>
              </div>
            </TabsContent>

            <Button type="submit" className="w-full" disabled={createWidget.isPending}>
              {createWidget.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Generate Widget'
              )}
            </Button>
          </form>
        </Tabs>

        {embedCode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Embed Code</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={copyEmbedCode}
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={embedCode}
              readOnly
              className="font-mono text-xs h-32"
            />
            <p className="text-xs text-muted-foreground">
              Paste this code into your HTML where you want the widget to appear
            </p>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <div>
          <Label>Live Preview</Label>
          <p className="text-sm text-muted-foreground">
            This is how your widget will appear on your website
          </p>
        </div>

        <div className="border rounded-lg p-8 bg-muted/50 flex items-center justify-center min-h-[400px]">
          {renderPreview()}
        </div>

        <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium">Widget Type: {WIDGET_TYPES.find(t => t.value === widgetType)?.label}</p>
          <p className="text-muted-foreground">
            {WIDGET_TYPES.find(t => t.value === widgetType)?.description}
          </p>
        </div>
      </div>
    </div>
  );
}
