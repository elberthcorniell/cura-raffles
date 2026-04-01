import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">¡Página no encontrada!</p>
        <Link href="/" className="text-secondary underline hover:text-secondary/80">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
