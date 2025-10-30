"use client";

import { useQuery } from '@tanstack/react-query';
import { ChartAreaInteractive, ChartBarInteractive } from "@/components/chart-area-interactive"
import { TransactionTable } from "@/components/transaction-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Activity, DollarSign, Link2, Code, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return response.json();
    },
  });

  const stats = analytics?.stats || {
    totalRevenue: 0,
    transactionCount: 0,
    successRate: 0,
    avgTransactionValue: 0,
    totalCompletedTransactions: 0,
    totalPendingTransactions: 0,
    totalFailedTransactions: 0,
  };
  return (
    <div className="flex flex-1 flex-col gap-8 p-6 pt-0">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tighter text-balance">
            Welcome back, John
          </h1>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <p className="text-muted-foreground font-medium text-balance leading-relaxed tracking-tight">
          Here&apos;s what&apos;s happening with your payments today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/magic-links">
          <Card className="group relative overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold tracking-tight">Create Payment Link</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Link2 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Generate secure payment links for your products and services
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                <span>Get started</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/widgets">
          <Card className="group relative overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold tracking-tight">Generate Widget</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Create embeddable payment buttons for your website
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                <span>Build now</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/analytics">
          <Card className="group relative overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold tracking-tight">View Analytics</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Track revenue, conversions, and payment performance
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                <span>View insights</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight">
                  ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    {stats.totalCompletedTransactions} completed
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground">
              Total Transactions
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight">{stats.transactionCount}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    {stats.totalPendingTransactions} pending
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground">
              Success Rate
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight">{stats.successRate.toFixed(1)}%</div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    {stats.totalFailedTransactions} failed
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground">
              Avg Transaction
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold tracking-tight">
                  ${stats.avgTransactionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground font-medium">Average per transaction</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight">Revenue Overview</CardTitle>
                <CardDescription className="font-medium">
                  Your payment performance over the last 12 months
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Last 12 months
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartAreaInteractive />
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight">Transaction Volume</CardTitle>
                <CardDescription className="font-medium">
                  Daily transaction count this month
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                This month
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartBarInteractive />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">Recent Transactions</CardTitle>
              <CardDescription className="font-medium">
                Your latest payment activities and customer interactions
              </CardDescription>
            </div>
            <Link href="/dashboard/transactions">
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent transition-colors">
                View all
              </Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <TransactionTable />
        </CardContent>
      </Card>
    </div>
  );
}
