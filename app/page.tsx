import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import RaffleGrid from "@/components/RaffleGrid";
import TrustBenefits from "@/components/TrustBenefits";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import StickyRaffleBanner from "@/components/StickyRaffleBanner";
import { fetchFirstRaffle } from "@/lib/raffles";
import { BRAND } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const firstRaffle = await fetchFirstRaffle();

  if (!firstRaffle) {
    return {
      title: `${BRAND.name} - Plataforma de Rifas en República Dominicana`,
      description: "Participa en rifas de productos premium. Plataforma segura y transparente en República Dominicana.",
      openGraph: {
        title: `${BRAND.name} - Gana Increíbles Premios`,
        description: "Participa en rifas de productos premium por una fracción de su precio.",
        type: "website",
        images: ["/logo.jpg"],
      },
      twitter: {
        card: "summary_large_image",
        site: BRAND.twitter_handle,
        images: ["/logo.jpg"],
      },
    };
  }

  const title = `${firstRaffle.title} - ${BRAND.name}`;
  const description = firstRaffle.description || `Participa por solo RD$${firstRaffle.ticketPrice.toLocaleString()} y gana ${firstRaffle.title}`;
  const image = firstRaffle.image;

  return {
    title,
    description,
    openGraph: {
      title: `🎟️ ${firstRaffle.title} | ${BRAND.name}`,
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
      site: BRAND.twitter_handle,
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
        <HowItWorks />
        <RaffleGrid />
        <TrustBenefits />
        <Testimonials />
      </main>
      <Footer />
      <StickyRaffleBanner />
    </div>
  );
}
