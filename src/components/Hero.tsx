"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Ticket, Sparkles, ArrowRight } from "lucide-react";
import { Raffle } from "@/types/raffle";
import { getImageSrc } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
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
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-background via-background-alt to-accent overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 stars-container">
        {[...Array(25)].map((_, i) => (
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

      {/* Decorative floating shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-secondary/5 animate-float hidden lg:block" />
      <div className="absolute bottom-32 right-16 w-32 h-32 rounded-full bg-secondary/5 animate-float-delayed hidden lg:block" />
      <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-warning/10 animate-float hidden lg:block" />

      <div className="container mx-auto px-4 relative z-10 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Column - Brand Message */}
            <div className="text-center lg:text-left space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Plataforma de Rifas #1 en RD</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
                <span className="text-gradient-primary">Cura tu</span>
                <br />
                <span className="text-gradient-secondary">Suerte</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Participa en rifas de productos premium por una fracción de su precio. 
                Sorteos transparentes y premios reales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary font-bold py-6 px-8 text-base"
                  onClick={() => {
                    document.getElementById("rifas")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Ver Rifas Activas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary/5 py-6 px-8 text-base font-semibold"
                  onClick={() => {
                    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Cómo Funciona
                </Button>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">Transparente</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-foreground">RD</p>
                  <p className="text-xs text-muted-foreground">Envío Gratis</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-secondary">En Vivo</p>
                  <p className="text-xs text-muted-foreground">Sorteos</p>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Raffle Card */}
            <div className="flex justify-center lg:justify-end animate-fade-in-up-delayed">
              {loading ? (
                <Card className="w-full max-w-md bg-gradient-card border-card-border p-6 animate-pulse">
                  <div className="h-64 bg-muted rounded-lg mb-4" />
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </Card>
              ) : firstRaffle ? (
                <Card className="w-full max-w-md bg-gradient-card border-card-border overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
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
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {firstRaffle.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {firstRaffle.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-primary" />
                      <span className="font-bold text-xl text-foreground">
                        RD${firstRaffle.ticketPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        por boleto
                      </span>
                    </div>

                    {(() => {
                      const totalTickets = 9999;
                      const sold = totalTickets - firstRaffle.totalTickets;
                      const pct = Math.min(
                        (sold / totalTickets) * 100,
                        100
                      );
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
              ) : (
                <div className="w-full max-w-md text-center py-20">
                  <Sparkles className="w-12 h-12 text-secondary/40 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    Próximamente nuevas rifas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
