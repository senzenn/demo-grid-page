"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WidgetCustomizer } from '@/components/widget-customizer';
import { WidgetList } from '@/components/widget-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function WidgetsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Widgets</h1>
          <p className="text-muted-foreground">
            Create embeddable payment buttons for your website
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Widget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Payment Widget</DialogTitle>
              <DialogDescription>
                Customize your payment button and generate embed code
              </DialogDescription>
            </DialogHeader>
            <WidgetCustomizer onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Widgets</CardTitle>
          <CardDescription>
            Manage and embed your payment widgets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WidgetList />
        </CardContent>
      </Card>
    </div>
  );
}

