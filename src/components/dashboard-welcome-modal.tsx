"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const STORAGE_KEY = "dashboard_welcome_modal_shown";

export function DashboardWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if modal has been shown before
    const hasShown = localStorage.getItem(STORAGE_KEY);
    
    if (!hasShown) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as shown so it won't appear again
    localStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Mock Prototype
            </DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2">
            <p className="text-base text-muted-foreground leading-relaxed">
              This is a <strong className="text-primary">mock prototype</strong> that demonstrates
              the features we plan to implement in this Solana Web3 payment platform.
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              The dashboard includes functionality for payment links, widgets, transactions,
              and analytics—all of which are examples of the features we&apos;re building.
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed font-medium">
              Feel free to explore and get a sense of what&apos;s coming!
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={handleClose} className="w-full sm:w-auto">
            Got it, let&apos;s explore!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

