"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
}

export function ChartAreaInteractive() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      return response.json()
    },
  })

  const chartData = React.useMemo(() => {
    if (!data?.stats?.revenueByMonth) return []
    
    return data.stats.revenueByMonth.map((item: { month: string; revenue: number }) => ({
      name: item.month,
      revenue: Math.round(item.revenue * 100) / 100, // Round to 2 decimals
    }))
  }, [data])

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Failed to load chart data
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  // Extract month abbreviation
                  const parts = value.split(' ')
                  return parts[0] || value.slice(0, 3)
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent 
                  formatter={(value) => {
                    const numValue = Array.isArray(value) ? value[0] : value;
                    return `$${Number(numValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  }}
                />} 
              />
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
  )
}

export function ChartBarInteractive() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      return response.json()
    },
  })

  const chartData = React.useMemo(() => {
    if (!data?.stats?.paymentMethodDistribution) return []
    
    return data.stats.paymentMethodDistribution.map((item: { method: string; percentage: number }) => ({
      name: item.method.charAt(0).toUpperCase() + item.method.slice(1),
      percentage: Math.round(item.percentage * 10) / 10, // Round to 1 decimal
    }))
  }, [data])

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Failed to load chart data
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent 
                  formatter={(value) => {
                    const numValue = Array.isArray(value) ? value[0] : value;
                    return `${Number(numValue).toFixed(1)}%`;
                  }}
                />} 
              />
              <defs>
                <linearGradient id="fillPercentage" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="percentage"
                type="natural"
                fill="url(#fillPercentage)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
  )
}
