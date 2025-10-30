"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MagicLinkForm } from '@/components/magic-link-form';
import { PaymentLinkTable } from '@/components/payment-link-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function MagicLinksPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-medium tracking-tighter text-balance">
              Payment Links
            </h1>
            <p className="text-muted-foreground font-medium text-balance leading-relaxed tracking-tight">
              Create and manage secure payment links for your products and services
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200">
                <Plus className="mr-2 h-4 w-4" />
                Create Payment Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold tracking-tight">Create Payment Link</DialogTitle>
                <DialogDescription className="font-medium">
                  Generate a secure payment link that you can share with your customers
                </DialogDescription>
              </DialogHeader>
              <MagicLinkForm onSuccess={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">Your Payment Links</CardTitle>
              <CardDescription className="font-medium">
                View and manage all your existing payment links
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <PaymentLinkTable />
        </CardContent>
      </Card>
    </div>
  );
}

