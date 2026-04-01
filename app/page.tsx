import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RaffleGrid from "@/components/RaffleGrid";
import Footer from "@/components/Footer";
import { fetchFirstRaffle } from "@/lib/raffles";

export async function generateMetadata(): Promise<Metadata> {
  const firstRaffle = await fetchFirstRaffle();

  if (!firstRaffle) {
    // Fallback to default metadata if no raffle found
    return {
      title: "Rifas Mora Motors - Plataforma de Rifas en República Dominicana",
      description: "Participa en rifas de productos premium. Plataforma segura y transparente en República Dominicana.",
      openGraph: {
        title: "Rifas Mora Motors - Gana Increíbles Premios",
        description: "Participa en rifas de productos premium por una fracción de su precio.",
        type: "website",
        images: ["/placeholder.svg"],
      },
      twitter: {
        card: "summary_large_image",
        site: "@rifasmoramotors",
        images: ["/placeholder.svg"],
      },
    };
  }

  const title = `${firstRaffle.title} - Rifas Mora Motors`;
  const description = firstRaffle.description || `Participa por solo RD$${firstRaffle.ticketPrice.toLocaleString()} y gana ${firstRaffle.title}`;
  const image = firstRaffle.image;

  return {
    title,
    description,
    openGraph: {
      title: `🎟️ ${firstRaffle.title} | Rifas Mora Motors`,
      description: `${description} - Boletos desde RD$${firstRaffle.ticketPrice.toLocaleString()}`,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: firstRaffle.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@rifasmoramotors",
      title: `🎟️ ${firstRaffle.title}`,
      description: `${description} - Boletos desde RD$${firstRaffle.ticketPrice.toLocaleString()}`,
      images: [image],
    },
  };
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-poppins pb-20 md:pb-0">
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
