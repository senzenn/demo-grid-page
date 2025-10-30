/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, ExternalLink, MoreHorizontal, QrCode, Trash, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { PaymentLink, PaymentLinkStatus } from '@/lib/types';

type SortField = 'createdAt' | 'amount' | 'status' | 'transactionCount';
type SortDirection = 'asc' | 'desc';

export function PaymentLinkTable() {
  const [selectedLinkForQR, setSelectedLinkForQR] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<PaymentLinkStatus | 'all'>('all');
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (selectedLinkForQR && canvasRef.current) {
      const checkoutUrl = `${window.location.origin}/checkout/${selectedLinkForQR}`;
      QRCode.toCanvas(canvasRef.current, checkoutUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    }
  }, [selectedLinkForQR]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['payment-links'],
    queryFn: async () => {
      const response = await fetch('/api/payment-links');
      if (!response.ok) {
        throw new Error('Failed to fetch payment links');
      }
      const result = await response.json();
      return result;
    },
  });

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Payment link copied to clipboard!');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'expired':
        return 'outline';
      case 'paused':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-2 h-3 w-3" />
    );
  };

  const filteredAndSortedLinks = useMemo(() => {
    const paymentLinks: PaymentLink[] = data?.paymentLinks || [];

    // Filter by search query
    const filtered = paymentLinks.filter((link) => {
      const matchesSearch =
        searchQuery === '' ||
        link.linkId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.amount.includes(searchQuery) ||
        link.currency.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || link.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'transactionCount':
          aValue = a.transactionCount;
          bValue = b.transactionCount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchQuery, statusFilter, sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-16" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
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
        <p className="text-lg font-medium text-destructive mb-2">Failed to load payment links</p>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['payment-links'] })}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const paymentLinks: PaymentLink[] = data?.paymentLinks || [];

  if (paymentLinks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-2">No payment links yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first payment link to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, description, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentLinkStatus | 'all')}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        {filteredAndSortedLinks.length !== paymentLinks.length && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedLinks.length} of {paymentLinks.length} payment links
          </p>
        )}

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3"
                    onClick={() => handleSort('createdAt')}
                  >
                    Link ID
                    <SortIcon field="createdAt" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                    <SortIcon field="amount" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <SortIcon field="status" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3"
                    onClick={() => handleSort('transactionCount')}
                  >
                    Transactions
                    <SortIcon field="transactionCount" />
                  </Button>
                </TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payment links match your search criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-mono text-sm">
                      {link.linkId.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      {link.amount} {link.currency}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(link.status) as any}>
                        {link.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {link.completedCount} / {link.transactionCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(link.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => copyToClipboard(
                              `${window.location.origin}/checkout/${link.linkId}`
                            )}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedLinkForQR(link.linkId)}
                          >
                            <QrCode className="mr-2 h-4 w-4" />
                            Show QR code
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a
                              href={`/checkout/${link.linkId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open checkout
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={!!selectedLinkForQR} onOpenChange={() => setSelectedLinkForQR(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Link QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to access the payment checkout
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="bg-white rounded-lg p-4">
              <canvas ref={canvasRef} />
            </div>
            <p className="text-sm text-muted-foreground text-center font-mono break-all">
              {selectedLinkForQR && `${window.location.origin}/checkout/${selectedLinkForQR}`}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedLinkForQR) {
                  copyToClipboard(`${window.location.origin}/checkout/${selectedLinkForQR}`);
                }
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
