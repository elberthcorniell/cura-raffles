import { Mail, Phone, MapPin } from "lucide-react";
import logoImage from "@/assets/rifa-mora-motors-logo.png";
import { getImageSrc } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={getImageSrc(logoImage)} 
                alt="Rifas Mora Motors Logo" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              La plataforma de rifas más confiable y emocionante de República Dominicana. 
              Tecnología de punta al alcance de todos.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#rifas" className="text-primary-foreground/80 hover:text-secondary transition-colors">Rifas Activas</a></li>
              <li><a href="#como-funciona" className="text-primary-foreground/80 hover:text-secondary transition-colors">Cómo Funciona</a></li>
              <li><a href="#ganadores" className="text-primary-foreground/80 hover:text-secondary transition-colors">Ganadores</a></li>
              <li><a href="#testimonios" className="text-primary-foreground/80 hover:text-secondary transition-colors">Testimonios</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#terminos" className="text-primary-foreground/80 hover:text-secondary transition-colors">Términos y Condiciones</a></li>
              <li><a href="#privacidad" className="text-primary-foreground/80 hover:text-secondary transition-colors">Política de Privacidad</a></li>
              <li><a href="#reglamento" className="text-primary-foreground/80 hover:text-secondary transition-colors">Reglamento de Rifas</a></li>
              <li><a href="#soporte" className="text-primary-foreground/80 hover:text-secondary transition-colors">Soporte</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                <span className="text-primary-foreground/80">Rifasmoramotors@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span className="text-primary-foreground/80">809-592-1456</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-primary-foreground/80">La Vega, Rep. Dom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Rifas Mora Motors. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-primary-foreground/60">Síguenos:</span>
              <div className="flex gap-4">
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Facebook</a>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Instagram</a>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;