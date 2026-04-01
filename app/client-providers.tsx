"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function ClientProviders() {
  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </>
  );
}




