export interface Raffle {
  id: number;
  title: string;
  image: string;
  description: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  timeLeft: string;
  featured?: boolean;
}




