/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
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
import { ExternalLink, Search, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Transaction, TransactionStatus, Currency } from '@/lib/types';

type SortField = 'createdAt' | 'amount' | 'status' | 'paymentMethod';
type SortDirection = 'asc' | 'desc';

export function TransactionTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [currencyFilter, setCurrencyFilter] = useState<Currency | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return response.json();
    },
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      default:
        return 'outline';
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

  const filteredAndSortedTransactions = useMemo(() => {
    const transactions: Transaction[] = data?.transactions || [];

    // Filter by search query
    const filtered = transactions.filter((tx) => {
      const matchesSearch =
        searchQuery === '' ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.includes(searchQuery) ||
        tx.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.customerWallet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.solanaSignature?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchesCurrency = currencyFilter === 'all' || tx.currency === currencyFilter;

      // Date filter
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const txDate = new Date(tx.createdAt);
        const now = new Date();
        const diffTime = now.getTime() - txDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        switch (dateFilter) {
          case 'today':
            matchesDate = diffDays < 1;
            break;
          case 'week':
            matchesDate = diffDays < 7;
            break;
          case 'month':
            matchesDate = diffDays < 30;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesCurrency && matchesDate;
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
        case 'paymentMethod':
          aValue = a.paymentMethod;
          bValue = b.paymentMethod;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchQuery, statusFilter, currencyFilter, dateFilter, sortField, sortDirection]);

  const exportToCSV = () => {
    const transactions = filteredAndSortedTransactions;
    
    // CSV Header
    const headers = ['Date', 'Amount', 'Currency', 'Status', 'Payment Method', 'Customer Wallet', 'Customer Email', 'Transaction ID', 'Solana Signature'];
    const csvRows = [headers.join(',')];

    // CSV Data
    transactions.forEach((tx) => {
      const row = [
        new Date(tx.createdAt).toISOString(),
        tx.amount,
        tx.currency,
        tx.status,
        tx.paymentMethod,
        tx.customerWallet || '',
        tx.customerEmail || '',
        tx.id,
        tx.solanaSignature || '',
      ];
      csvRows.push(row.map((cell) => `"${cell}"`).join(','));
    });

    // Create and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                {[...Array(6)].map((_, i) => (
                  <TableHead key={i}><Skeleton className="h-4 w-20" /></TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
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
        <p className="text-lg font-medium text-destructive mb-2">Failed to load transactions</p>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['transactions'] })}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const transactions: Transaction[] = data?.transactions || [];

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-2">
          No transactions yet
        </p>
        <p className="text-sm text-muted-foreground">
          Transactions will appear here once customers make payments
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, amount, wallet, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'all')}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value as Currency | 'all')}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Currencies</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="PYUSD">PYUSD</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Results count */}
        {filteredAndSortedTransactions.length !== transactions.length && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
          </p>
        )}
      </div>

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
                  Date
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
                  onClick={() => handleSort('paymentMethod')}
                >
                  Method
                  <SortIcon field="paymentMethod" />
                </Button>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No transactions match your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm">
                    {new Date(tx.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {tx.amount} {tx.currency}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(tx.status) as any}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-sm">
                    {tx.paymentMethod.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {tx.customerWallet ? (
                      <span className="text-muted-foreground">
                        {tx.customerWallet.slice(0, 4)}...{tx.customerWallet.slice(-4)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {tx.customerEmail || 'N/A'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {tx.solanaSignature ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <a
                          href={`https://explorer.solana.com/tx/${tx.solanaSignature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View transaction on Solana Explorer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
