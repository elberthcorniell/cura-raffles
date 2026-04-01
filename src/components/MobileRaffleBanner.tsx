"use client";

import { Raffle } from "@/types/raffle";
import PurchaseButton from "./PurchaseButton";
import { getImageSrc } from "@/lib/utils";

interface MobileRaffleBannerProps {
  raffle: Raffle;
  onPurchaseClick: () => void;
}

export default function MobileRaffleBanner({
  raffle,
  onPurchaseClick,
}: MobileRaffleBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t border-card-border shadow-lg">
      <div className="flex items-center gap-3 p-3">
        {/* Raffle Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <img
            src={getImageSrc(raffle.image)}
            alt={raffle.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== "/placeholder.svg") {
                target.src = "/placeholder.svg";
              }
            }}
          />
        </div>

        {/* Raffle Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground truncate">
            {raffle.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            RD${raffle.ticketPrice.toLocaleString()} por boleto
          </p>
        </div>

        {/* Purchase Button */}
        <div className="flex-shrink-0">
          <PurchaseButton
            onClick={onPurchaseClick}
            variant="compact"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}



