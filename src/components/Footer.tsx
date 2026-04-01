import { Mail, Phone, MapPin } from "lucide-react";
import { BRAND } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg"
                alt={`${BRAND.name} Logo`}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              {BRAND.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#rifas" className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Rifas Activas</a></li>
              <li><a href="#como-funciona" className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Cómo Funciona</a></li>
              <li><a href="#ganadores" className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Ganadores</a></li>
              <li><a href="#testimonios" className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Testimonios</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#terminos" className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Términos y Condiciones</a></li>
              <li><a href="#privacidad" className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Política de Privacidad</a></li>
              <li><a href="#reglamento" className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Reglamento de Rifas</a></li>
              <li><a href="#soporte" className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Soporte</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary-glow" />
                <span className="text-primary-foreground/80">{BRAND.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary-glow" />
                <span className="text-primary-foreground/80">{BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary-glow" />
                <span className="text-primary-foreground/80">{BRAND.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              {BRAND.copyright}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-primary-foreground/60">Síguenos:</span>
              <div className="flex gap-4">
                <a href={BRAND.social.facebook} className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Facebook</a>
                <a href={BRAND.social.instagram} className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Instagram</a>
                <a href={BRAND.social.twitter} className="text-primary-foreground/80 hover:text-secondary-glow transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
