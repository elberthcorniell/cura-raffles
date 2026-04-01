"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Ticket, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { getImageSrc } from "@/lib/utils";
interface RaffleCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  timeLeft: string;
  featured?: boolean;
}
const RaffleCard = ({
  id,
  title,
  image,
  description,
  ticketPrice,
  totalTickets,
  soldTickets,
  timeLeft,
  featured = false
}: RaffleCardProps) => {
  const router = useRouter();
  const progressPercentage = soldTickets / totalTickets * 100;
  const remainingTickets = totalTickets - soldTickets;
  
  const handleParticipate = () => {
    router.push(`/raffles/${id}`);
  };
  return <Card className={`relative overflow-hidden card-hover bg-gradient-card border-card-border ${featured ? 'ring-2 ring-secondary' : ''}`}>
      {featured && <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-secondary text-secondary-foreground font-semibold">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Destacada
          </Badge>
        </div>}

      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img 
          src={getImageSrc(image)} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== "/placeholder.svg") {
              target.src = "/placeholder.svg";
            }
          }}
        />
      </div>

      <div className="p-6 space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        </div>

        {/* Price and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-white" />
            <span className="font-bold text-lg text-white">
              RD${ticketPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">por boleto</span>
          </div>
          <div className="flex items-center gap-1 text-warning">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{timeLeft}</span>
          </div>
        </div>


        {/* Progress Section */}
        <div className="space-y-3">          
          <div className="relative">
            <Progress value={progressPercentage} className="h-3 progress-glow" />
            {/* Checkpoints */}
            <div className="absolute top-0 left-1/4 w-0.5 h-3 bg-background"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-background"></div>
            <div className="absolute top-0 left-3/4 w-0.5 h-3 bg-background"></div>
            {/* Checkpoint labels */}
            <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary font-bold py-6 text-base" 
          size="lg"
          onClick={handleParticipate}
        >
          <Ticket className="w-5 h-5 mr-2" />
          Participar Ahora
        </Button>

        {/* Additional Info */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t border-card-border">
          <span>✓ Sorteo Transparente</span>
          <span>✓ Envío Gratis</span>
          <span>✓ Garantía Incluida</span>
        </div>
      </div>
    </Card>;
};
export default RaffleCard;