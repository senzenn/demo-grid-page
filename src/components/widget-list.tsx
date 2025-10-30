"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, Eye, Trash, Check, Heart, Repeat } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Widget } from '@/lib/types';

export function WidgetList() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['widgets'],
    queryFn: async () => {
      const response = await fetch('/api/widgets');
      if (!response.ok) {
        throw new Error('Failed to fetch widgets');
      }
      return response.json();
    },
  });

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Embed code copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this widget?')) {
      return;
    }
    // TODO: Implement delete API endpoint
    toast.info('Delete functionality coming soon');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(5)].map((_, i) => (
                  <TableHead key={i}><Skeleton className="h-4 w-20" /></TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-destructive mb-2">Failed to load widgets</p>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['widgets'] })}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const widgets: Widget[] = data?.widgets || [];

  if (widgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-2">
          No widgets yet
        </p>
        <p className="text-sm text-muted-foreground">
          Create your first widget to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Button Text</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Link</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {widgets.map((widget) => {
              // Handle old widgets that might not have type/style/size
              const widgetType = widget.type || 'button';
              
              return (
                <TableRow key={widget.id}>
                  <TableCell className="font-medium">{widget.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {widgetType}
                    </Badge>
                  </TableCell>
                  <TableCell>{widget.buttonText}</TableCell>
                  <TableCell>
                    <Badge variant={widget.isActive ? 'default' : 'secondary'}>
                      {widget.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {widget.paymentLinkId.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(widget.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(widget.embedCode, widget.id)}
                      title="Copy embed code"
                    >
                      {copiedId === widget.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Preview widget"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Widget Preview & Embed Code</DialogTitle>
                          <DialogDescription>
                            Preview your widget and copy the embed code to add it to your website
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Preview */}
                          <div className="border rounded-lg p-6 bg-muted/30">
                            <h3 className="text-sm font-medium mb-3">Preview</h3>
                            <div className="flex items-center justify-center p-8 bg-background rounded border min-h-[200px]">
                              {(() => {
                                const type = widget.type || 'button';
                                const size = widget.size || 'md';
                                
                                switch (type) {
                                  case 'button':
                                    return (
                                      <Button size={size === 'md' ? 'default' : size}>
                                        {widget.buttonText}
                                      </Button>
                                    );
                                  case 'card':
                                    return (
                                      <div className="max-w-sm border rounded-lg overflow-hidden">
                                        {widget.imageUrl && (
                                          <div className="h-32 bg-muted" />
                                        )}
                                        <div className="p-4 space-y-2">
                                          {widget.description && (
                                            <p className="text-sm text-muted-foreground">{widget.description}</p>
                                          )}
                                          {widget.showAmount && (
                                            <div className="text-lg font-semibold">
                                              {widget.showCurrency && 'USD '}Amount
                                            </div>
                                          )}
                                          <Button className="w-full">{widget.buttonText}</Button>
                                        </div>
                                      </div>
                                    );
                                  case 'checkout':
                                    return (
                                      <div className="text-center text-muted-foreground">
                                        <p className="text-sm">Embedded Checkout Preview</p>
                                        <p className="text-xs mt-1">Full checkout loads in iframe</p>
                                      </div>
                                    );
                                  case 'donation':
                                    return (
                                      <div className="text-center space-y-3">
                                        <Heart className="h-8 w-8 mx-auto text-red-500" />
                                        <Button>{widget.buttonText}</Button>
                                      </div>
                                    );
                                  case 'subscription':
                                    return (
                                      <div className="text-center space-y-3">
                                        <Repeat className="h-8 w-8 mx-auto text-muted-foreground" />
                                        <Button>{widget.buttonText}</Button>
                                      </div>
                                    );
                                  case 'inline':
                                    return (
                                      <div className="border rounded-lg p-4 space-y-3 w-full max-w-sm">
                                        <Button className="w-full">{widget.buttonText}</Button>
                                      </div>
                                    );
                                  default:
                                    return (
                                      <Button size={size === 'md' ? 'default' : size}>
                                        {widget.buttonText}
                                      </Button>
                                    );
                                }
                              })()}
                            </div>
                          </div>

                          {/* Embed Code */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Embed Code</label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(widget.embedCode, widget.id)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <div className="relative">
                              <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto font-mono">
                                <code>{widget.embedCode}</code>
                              </pre>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Paste this code into your HTML where you want the payment button to appear
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      title="Delete widget"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
