/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Loader2, AlertCircle } from 'lucide-react';
import type { CreatePaymentLinkRequest } from '@/lib/types';

interface MagicLinkFormProps {
  onSuccess?: () => void;
}

interface FormErrors {
  amount?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export function MagicLinkForm({ onSuccess }: MagicLinkFormProps) {
  const queryClient = useQueryClient();
  const [currency, setCurrency] = useState<'USDC' | 'USDT' | 'PYUSD'>('USDC');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [successUrl, setSuccessUrl] = useState('');
  const [cancelUrl, setCancelUrl] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate amount
    if (!amount || amount.trim() === '') {
      newErrors.amount = 'Amount is required';
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      }
    }

    // Validate URLs if provided
    if (successUrl && successUrl.trim() !== '') {
      try {
        new URL(successUrl);
      } catch {
        newErrors.successUrl = 'Invalid URL format';
      }
    }

    if (cancelUrl && cancelUrl.trim() !== '') {
      try {
        new URL(cancelUrl);
      } catch {
        newErrors.cancelUrl = 'Invalid URL format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPaymentLink = useMutation({
    mutationFn: async (data: CreatePaymentLinkRequest) => {
      const response = await fetch('/api/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to create payment link');
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
      toast.success('Payment link created successfully!', {
        description: `Link ID: ${data.paymentLink.linkId}`,
      });
      // Reset form
      setAmount('');
      setDescription('');
      setSuccessUrl('');
      setCancelUrl('');
      setErrors({});
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error('Failed to create payment link', {
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

    createPaymentLink.mutate({
      amount: amount.trim(),
      currency,
      description: description.trim() || undefined,
      successUrl: successUrl.trim() || undefined,
      cancelUrl: cancelUrl.trim() || undefined,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="100.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) {
                setErrors((prev) => ({ ...prev, amount: undefined }));
              }
            }}
            className={errors.amount ? 'border-red-500 focus-visible:ring-red-500' : ''}
            required
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
          {errors.amount && (
            <div id="amount-error" className="flex items-center gap-1 text-sm text-red-500" role="alert">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.amount}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={(value: any) => setCurrency(value)}>
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

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Premium subscription - Annual plan"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="successUrl">Success URL (Optional)</Label>
        <Input
          id="successUrl"
          type="url"
          placeholder="https://yoursite.com/success"
          value={successUrl}
          onChange={(e) => {
            setSuccessUrl(e.target.value);
            if (errors.successUrl) {
              setErrors((prev) => ({ ...prev, successUrl: undefined }));
            }
          }}
          className={errors.successUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}
          aria-invalid={!!errors.successUrl}
          aria-describedby={errors.successUrl ? 'successUrl-error' : undefined}
        />
        {errors.successUrl && (
          <div id="successUrl-error" className="flex items-center gap-1 text-sm text-red-500" role="alert">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.successUrl}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cancelUrl">Cancel URL (Optional)</Label>
        <Input
          id="cancelUrl"
          type="url"
          placeholder="https://yoursite.com/cancel"
          value={cancelUrl}
          onChange={(e) => {
            setCancelUrl(e.target.value);
            if (errors.cancelUrl) {
              setErrors((prev) => ({ ...prev, cancelUrl: undefined }));
            }
          }}
          className={errors.cancelUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}
          aria-invalid={!!errors.cancelUrl}
          aria-describedby={errors.cancelUrl ? 'cancelUrl-error' : undefined}
        />
        {errors.cancelUrl && (
          <div id="cancelUrl-error" className="flex items-center gap-1 text-sm text-red-500" role="alert">
            <AlertCircle className="h-3 w-3" />
            <span>{errors.cancelUrl}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setAmount('');
            setDescription('');
            setSuccessUrl('');
            setCancelUrl('');
            onSuccess?.();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createPaymentLink.isPending}>
          {createPaymentLink.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Payment Link
        </Button>
      </div>
    </form>
  );
}

