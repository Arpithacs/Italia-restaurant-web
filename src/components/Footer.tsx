import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-stone-300 pt-16 pb-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2.5 h-2.5 bg-brand-primary rounded-[1px]" />
              <span className="font-display text-2.5xl font-black tracking-tight text-white leading-none">
                ITALIA
              </span>
            </div>
            <span className="block text-[9px] tracking-[0.25em] font-mono text-brand-green font-extrabold mb-4 uppercase">
              RISTORANTE
            </span>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              Bringing the authentic flavor of traditional Naples pizzas, layered lasagna, and sweet mascarpone directly to your doorstep with family dedication since 1992.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-mono font-bold text-white mb-5 text-[11px] tracking-widest uppercase">
              // OUR KITCHEN
            </h4>
            <ul className="space-y-2.5 text-xs font-mono uppercase tracking-wider">
              <li>
                <Link to="/menu" className="hover:text-brand-primary transition-colors">
                  View Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-primary transition-colors">
                  Reservations & Contact
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-brand-primary transition-colors">
                  Reviews & Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours info */}
          <div>
            <h4 className="font-mono font-bold text-white mb-5 text-[11px] tracking-widest uppercase">
              // OPENING HOURS
            </h4>
            <ul className="space-y-2 text-xs text-stone-300 font-mono">
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span>MON - FRI</span>
                <span className="text-white font-bold">12:00 - 22:00</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1.5">
                <span>SAT - SUN</span>
                <span className="text-white font-bold">11:30 - 23:00</span>
              </li>
              <li className="text-[10px] text-brand-primary uppercase mt-3 font-semibold tracking-wide">
                * Kitchen closes 30 mins before shop
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-mono font-bold text-white mb-5 text-[11px] tracking-widest uppercase">
              // CONTACT INFO
            </h4>
            <ul className="space-y-3.5 text-xs font-mono">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                <span className="leading-normal text-stone-300">83 Via dei Tribunali, Naples, Campania, Italy</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="text-stone-300 font-bold">+39 081 294 3829</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="text-stone-300 hover:text-brand-primary transition-colors cursor-pointer break-all">hello@italia-ristorante.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-400 font-mono uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Italia Ristorante. Real-time active environment.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1 hover:text-stone-300 cursor-pointer">
              <Shield className="w-3 h-3" /> Privacy Policy
            </span>
            <span className="flex items-center gap-1 hover:text-stone-300 cursor-pointer">
              <HelpCircle className="w-3 h-3" /> Terms of Service
            </span>
          </div>
        </div>

        {/* Live system status bar representing Geometric Balance */}
        <div className="border-t border-white/8 mt-6 pt-5 flex flex-col sm:flex-row items-center gap-4 text-[9px] font-mono uppercase tracking-widest text-stone-600 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full shrink-0" />
            <span>Connection: Live</span>
          </div>
          <div>Server: Node.js Dev Engine</div>
          <div>Build: v1.0.4-stable</div>
          <div className="sm:ml-auto text-[9px] text-stone-600 text-right">
            Client-State Sandbox App / React 18
          </div>
        </div>
      </div>
    </footer>
  );
}
