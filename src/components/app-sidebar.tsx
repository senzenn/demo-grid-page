"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChevronUp,
  Link2,
  Receipt,
  Search,
  Settings,
  TrendingUp,
  User2,
  Wallet,
  Zap,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Organized menu items by priority and functionality
const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    description: "Overview & metrics",
  },
  {
    title: "Magic Links",
    url: "/dashboard/magic-links",
    icon: Link2,
    description: "Payment links",
  },
  {
    title: "Accounts",
    url: "/dashboard/accounts",
    icon: Wallet,
    description: "Virtual accounts",
  },
]

const paymentsNavItems = [
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: Receipt,
    description: "Payment history",
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: TrendingUp,
    description: "Performance insights",
  },
]

const toolsNavItems = [
  {
    title: "Widgets",
    url: "/dashboard/widgets",
    icon: Zap,
    description: "Integration tools",
  },
]

// Export navigation data for use in top navbar
export const navigationData = {
  mainNavItems,
  paymentsNavItems,
  toolsNavItems,
  settingsItem: {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    description: "Account preferences",
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter menu items based on search
  const filteredMainItems = mainNavItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPaymentsItems = paymentsNavItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredToolsItems = toolsNavItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50 transition-colors">
              <Link href="/">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <Icons.logo className="size-4 text-primary" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight">Squad Grid</span>
                  <span className="truncate text-xs text-sidebar-foreground/60 font-medium">Payment Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Search */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/50" />
              <Input
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-sidebar-accent/30 border-sidebar-border/50 focus:bg-sidebar-accent/50 transition-colors"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{item.title}</span>
                        <span className="truncate text-xs text-sidebar-foreground/60">{item.description}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Payments Section */}
        {(filteredPaymentsItems.length > 0 || !searchQuery) && (
          <SidebarGroup>
            <SidebarGroupLabel>Payments</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredPaymentsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{item.title}</span>
                          <span className="truncate text-xs text-sidebar-foreground/60">{item.description}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Tools Section */}
        {(filteredToolsItems.length > 0 || !searchQuery) && (
          <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredToolsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{item.title}</span>
                          <span className="truncate text-xs text-sidebar-foreground/60">{item.description}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings - Always visible at bottom */}
        {!searchQuery || "Settings".toLowerCase().includes(searchQuery.toLowerCase()) && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
                    <Link href="/dashboard/settings">
                      <Settings className="h-4 w-4" />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Settings</span>
                        <span className="truncate text-xs text-sidebar-foreground/60">Account preferences</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/01.png" alt="User" />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">John Doe</span>
                    <span className="truncate text-xs text-sidebar-foreground/70">john@example.com</span>
                  </div>
                  <ChevronUp className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/dropdown:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <User2 className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
