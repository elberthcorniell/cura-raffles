"use client";

import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface PurchaseButtonProps {
  onClick: () => void;
  ticketPrice?: number;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "compact";
}

export default function PurchaseButton({
  onClick,
  ticketPrice,
  className = "",
  size = "lg",
  variant = "default",
}: PurchaseButtonProps) {
  if (variant === "compact") {
    return (
      <Button
        className={`bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary font-bold ${className}`}
        size={size}
        onClick={onClick}
      >
        <Ticket className="w-4 h-4 mr-2" />
        Comprar
      </Button>
    );
  }

  return (
    <Button
      className={`w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary font-bold py-6 text-lg ${className}`}
      size={size}
      onClick={onClick}
    >
      <Ticket className="w-5 h-5 mr-2" />
      Comprar Boletos
    </Button>
  );
}



