"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Ticket } from "lucide-react";
import { Raffle } from "@/types/raffle";
import { getImageSrc } from "@/lib/utils";
import PurchaseDialog from "@/components/PurchaseDialog";

const Hero = () => {
  const [firstRaffle, setFirstRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

  useEffect(() => {
    const fetchFirstRaffle = async () => {
      try {
        const response = await fetch("/api/raffles?page=1&limit=1");
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          setFirstRaffle(result.data[0]);
        }
      } catch (err) {
        console.error("Error fetching first raffle:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstRaffle();
  }, []);

  const handleParticipate = () => {
    setPurchaseDialogOpen(true);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-background-alt to-accent overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 stars-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center">
            {/* Featured Raffle Card */}
            <div className="flex justify-center py-4 lg:py-8">
              {loading ? (
                <Card className="w-full max-w-md bg-gradient-card border-card-border p-6 animate-pulse">
                  <div className="h-64 bg-muted rounded-lg mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </Card>
              ) : firstRaffle ? (
                <Card className="w-full max-w-md bg-gradient-card border-card-border overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="relative">
                    {firstRaffle.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-secondary text-secondary-foreground font-semibold">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Destacada
                        </Badge>
                      </div>
                    )}
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <img 
                        src={getImageSrc(firstRaffle.image)} 
                        alt={firstRaffle.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== "/placeholder.svg") {
                            target.src = "/placeholder.svg";
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{firstRaffle.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{firstRaffle.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      <span className="font-bold text-xl text-white">
                        RD${firstRaffle.ticketPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">por boleto</span>
                    </div>

                    {/* Tickets sold progress */}
                    {(() => {
                      const totalTickets = 9999;
                      const sold = totalTickets - firstRaffle.totalTickets;
                      const pct = Math.min((sold / totalTickets) * 100, 100);
                      return (
                        <div className="space-y-1.5">
                          <div className="flex justify-end text-xs text-muted-foreground">
                            <span>{pct.toFixed(1)}% vendido</span>
                          </div>
                          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-secondary transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}

                    <Button 
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary font-bold py-6 text-base" 
                      size="lg"
                      onClick={handleParticipate}
                    >
                      <Ticket className="w-5 h-5 mr-2" />
                      Comprar boleto ya
                    </Button>
                  </div>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Dialog */}
      {firstRaffle && (
        <PurchaseDialog
          open={purchaseDialogOpen}
          onOpenChange={setPurchaseDialogOpen}
          raffleId={firstRaffle.id}
          ticketPrice={firstRaffle.ticketPrice}
          availableTickets={firstRaffle.totalTickets - firstRaffle.soldTickets}
        />
      )}
    </section>
  );
};

export default Hero;