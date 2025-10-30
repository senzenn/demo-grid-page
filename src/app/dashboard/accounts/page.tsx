"use client";

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Wallet, TrendingUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { VirtualAccount, AccountType, Currency, YieldEarning } from '@/lib/types';

// Mock API calls
const fetchAccounts = async () => {
  // In real app, this would be an API call
  const { mockStore } = await import('@/lib/mock-data');
  return mockStore.getAllVirtualAccounts();
};

const fetchYieldEarnings = async () => {
  const { mockStore } = await import('@/lib/mock-data');
  return mockStore.getAllYieldEarnings();
};

export default function AccountsPage() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<VirtualAccount | null>(null);
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['virtualAccounts'],
    queryFn: fetchAccounts,
  });

  const { data: yieldEarnings, isLoading: yieldLoading } = useQuery({
    queryKey: ['yieldEarnings'],
    queryFn: fetchYieldEarnings,
  });

  const copyToClipboard = async (text: string, accountId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccountId(accountId);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedAccountId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const totalBalance = accounts?.reduce((sum, acc) => sum + parseFloat(acc.totalBalance), 0) || 0;
  const totalYieldEarned = yieldEarnings?.reduce((sum, y) => sum + parseFloat(y.earned), 0) || 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your virtual accounts, balances, and yield earnings
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Virtual Account</DialogTitle>
              <DialogDescription>
                Create a new programmable non-custodial account
              </DialogDescription>
            </DialogHeader>
            <CreateAccountForm onSuccess={() => {
              setIsCreateDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['virtualAccounts'] });
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{accounts?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {accounts?.filter(a => a.status === 'active').length || 0} active
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">Across all accounts</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Yield Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {yieldLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${totalYieldEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">All-time earnings</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList>
          <TabsTrigger value="accounts">Virtual Accounts</TabsTrigger>
          <TabsTrigger value="yield">Yield Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Accounts</CardTitle>
              <CardDescription>
                Manage your programmable non-custodial accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : accounts && accounts.length > 0 ? (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      yieldEarning={yieldEarnings?.find(y => y.accountId === account.accountId)}
                      onSelect={() => setSelectedAccount(account)}
                      onCopy={(text) => copyToClipboard(text, account.accountId)}
                      copiedAccountId={copiedAccountId}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    No accounts yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first virtual account to get started
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Yield Earnings</CardTitle>
              <CardDescription>
                Track earnings from your yield-enabled accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {yieldLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : yieldEarnings && yieldEarnings.length > 0 ? (
                <div className="space-y-4">
                  {yieldEarnings.map((earning) => {
                    const account = accounts?.find(a => a.accountId === earning.accountId);
                    return (
                      <Card key={earning.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{account?.accountName || 'Unknown Account'}</h3>
                                <Badge variant="outline">{earning.currency}</Badge>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>Principal: ${parseFloat(earning.principal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                <p>Earned: <span className="text-foreground font-medium">${parseFloat(earning.earned).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></p>
                                <p>APY: {earning.currentRate}% • {earning.period}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                ${parseFloat(earning.earned).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Next payment: {new Date(earning.nextPayment).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    No yield earnings yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enable yield on your accounts to start earning
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Details Dialog */}
      {selectedAccount && (
        <AccountDetailsDialog
          account={selectedAccount}
          yieldEarning={yieldEarnings?.find(y => y.accountId === selectedAccount.accountId)}
          open={!!selectedAccount}
          onOpenChange={(open) => !open && setSelectedAccount(null)}
        />
      )}
    </div>
  );
}

function AccountCard({
  account,
  yieldEarning,
  onSelect,
  onCopy,
  copiedAccountId,
}: {
  account: VirtualAccount;
  yieldEarning?: YieldEarning;
  onSelect: () => void;
  onCopy: (text: string) => void;
  copiedAccountId: string | null;
}) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={onSelect}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{account.accountName}</h3>
              <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                {account.status}
              </Badge>
              <Badge variant={getAccountTypeBadgeVariant(account.accountType)}>
                {account.accountType}
              </Badge>
              {account.isYieldEnabled && (
                <Badge variant="outline" className="text-green-600">
                  Yield {account.yieldRate}% APY
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {(['USDC', 'USDT', 'PYUSD'] as Currency[]).map((currency) => {
                const balance = parseFloat(account.balances[currency] || '0');
                return balance > 0 ? (
                  <div key={currency} className="space-y-1">
                    <p className="text-xs text-muted-foreground">{currency}</p>
                    <p className="text-sm font-medium">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                ) : null;
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Account ID:</span>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {account.accountId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy(account.accountId);
                    }}
                  >
                    {copiedAccountId === account.accountId ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Wallet:</span>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded truncate max-w-[120px]">
                    {account.walletAddress.slice(0, 8)}...{account.walletAddress.slice(-6)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy(account.walletAddress);
                    }}
                  >
                    {copiedAccountId === account.accountId ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right ml-4">
            <div className="text-2xl font-bold mb-1">
              ${parseFloat(account.totalBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Total Balance</p>
            {yieldEarning && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-muted-foreground">Yield Earned</p>
                <p className="text-sm font-medium text-green-600">
                  ${parseFloat(yieldEarning.earned).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateAccountForm({ onSuccess }: { onSuccess: () => void }) {
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [enableYield, setEnableYield] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In real app, this would be an API call
      const { mockStore } = await import('@/lib/mock-data');
      mockStore.createVirtualAccount({
        accountName,
        accountType,
        enableYield,
      });
      
      toast.success('Account created successfully!');
      onSuccess();
      setAccountName('');
      setAccountType('personal');
      setEnableYield(false);
    } catch {
      toast.error('Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name *</Label>
        <Input
          id="accountName"
          placeholder="e.g., Business Operating Account"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountType">Account Type *</Label>
        <Select value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
          <SelectTrigger id="accountType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="savings">Savings</SelectItem>
            <SelectItem value="yield">Yield Account</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enableYield"
          checked={enableYield}
          onChange={(e) => setEnableYield(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="enableYield" className="text-sm font-normal cursor-pointer">
          Enable yield earning (Earn APY on balances)
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
}

function AccountDetailsDialog({
  account,
  yieldEarning,
  open,
  onOpenChange,
}: {
  account: VirtualAccount;
  yieldEarning?: YieldEarning;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{account.accountName}</DialogTitle>
          <DialogDescription>
            Account details and balance information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Account ID</Label>
              <p className="font-mono text-sm">{account.accountId}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Account Type</Label>
              <p className="text-sm capitalize">{account.accountType}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                {account.status}
              </Badge>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total Balance</Label>
              <p className="text-sm font-semibold">
                ${parseFloat(account.totalBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Balances by Currency</Label>
            <div className="grid grid-cols-3 gap-4">
              {(['USDC', 'USDT', 'PYUSD'] as Currency[]).map((currency) => (
                <div key={currency} className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">{currency}</p>
                  <p className="text-lg font-semibold">
                    ${parseFloat(account.balances[currency] || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {account.isYieldEnabled && yieldEarning && (
            <div className="border rounded-lg p-4 space-y-2">
              <Label className="text-sm font-medium">Yield Information</Label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">APY Rate</p>
                  <p className="font-semibold">{account.yieldRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Earned</p>
                  <p className="font-semibold text-green-600">
                    ${parseFloat(yieldEarning.earned).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Principal</p>
                  <p className="font-semibold">
                    ${parseFloat(yieldEarning.principal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Payment</p>
                  <p className="font-semibold">
                    {new Date(yieldEarning.nextPayment).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Wallet Address</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono bg-muted px-3 py-2 rounded">
                {account.walletAddress}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(account.walletAddress)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getAccountTypeBadgeVariant(type: AccountType): "default" | "secondary" | "outline" {
  switch (type) {
    case 'business':
      return 'default';
    case 'savings':
      return 'secondary';
    case 'yield':
      return 'outline';
    default:
      return 'default';
  }
}

