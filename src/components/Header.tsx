 import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Utensils, MessageSquare, PhoneCall, Info, History } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Menu', path: '/menu', icon: Utensils },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
    { name: 'Feedback', path: '/feedback', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-3.5 h-3.5 bg-brand-primary rounded-[2px] transition-transform group-hover:scale-110" />
            <div>
              <span className="font-display text-2xl font-extrabold tracking-tight text-brand-ink group-hover:text-brand-primary transition-colors">
                ITALIA
              </span>
              <span className="block text-[9px] tracking-[0.22em] font-mono text-brand-green -mt-1 font-bold">
                RISTORANTE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest font-mono transition-colors hover:text-brand-primary py-2 relative ${
                    isActive ? 'text-brand-primary' : 'text-stone-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Area (Cart, Profile, Session Actions) */}
          <div className="hidden md:flex items-center gap-5">
            
            {/* Cart Link Widget */}
            <Link to="/cart" className="relative p-2 rounded-[4px] hover:bg-brand-bg border border-transparent hover:border-brand-border transition-colors group">
              <ShoppingCart className="w-4.5 h-4.5 text-brand-ink group-hover:text-brand-primary transition-colors" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                  className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-[2px] shadow-none"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <div className="h-4 w-px bg-brand-border" />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/order-history"
                  className="flex items-center gap-1.5 text-xs font-semibold font-mono uppercase tracking-wider text-stone-600 hover:text-brand-primary py-1.5 px-3 transition-colors rounded-[4px] border border-transparent hover:border-brand-border hover:bg-brand-bg"
                >
                  <History className="w-3.5 h-3.5 text-brand-primary" />
                  <span>My Orders</span>
                </Link>
                <div 
                  onClick={() => setProfileOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold font-mono uppercase tracking-wider text-brand-ink bg-brand-bg border border-brand-border py-1.5 px-3 rounded-[4px] cursor-pointer hover:border-brand-primary hover:bg-white transition-all shadow-none"
                  title="View Diner Profile"
                >
                  <User className="w-3.5 h-3.5 text-brand-green" />
                  <span>Hello, {user.name.split(' ')[0]}</span>
                </div>
              </div>
            ) : (
              <Link
                to="/signup"
                className="bg-brand-ink hover:bg-brand-primary text-white text-xs font-semibold uppercase tracking-wider font-mono py-2.5 px-5 rounded-[4px] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Action Trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <Link to="/cart" className="relative p-2 rounded-[4px] hover:bg-brand-bg border border-transparent transition-colors">
              <ShoppingCart className="w-5 h-5 text-brand-ink" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[9px] font-bold font-mono px-1.5 py-0.2 rounded-[2px] border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-[4px] hover:bg-stone-50 border border-transparent transition-colors text-brand-ink"
            >
              {mobileOpen ? (
                <span className="font-bold text-lg block w-5 h-5 text-center leading-none">✕</span>
              ) : (
                <span className="font-semibold text-lg block w-5 h-5 text-center leading-5">☰</span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Nav Overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-b border-brand-border overflow-hidden"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-widest font-mono text-stone-700 hover:bg-brand-bg hover:text-brand-primary rounded-[4px] transition-colors"
                >
                  <Icon className="w-4 h-4 text-stone-500" />
                  {link.name}
                </Link>
              );
            })}
            <div className="border-t border-brand-border pt-4 px-4 flex flex-col gap-2">
               {user ? (
                <>
                  <div 
                    onClick={() => {
                      setProfileOpen(true);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 text-stone-700 pb-1 font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer hover:text-brand-primary"
                  >
                    <User className="w-4 h-4 text-brand-green" />
                    <span>Hello, {user.name}</span>
                  </div>
                  <Link
                    to="/order-history"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 px-4 rounded-[4px] border border-brand-border text-brand-ink hover:text-brand-primary hover:bg-brand-bg font-mono font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                  >
                    <History className="w-4 h-4 text-brand-primary" />
                    My Orders
                  </Link>
                </>
              ) : (
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-brand-ink hover:bg-brand-primary text-white font-mono font-bold py-3 px-4 rounded-[4px] tracking-wider uppercase transition-colors block text-xs"
                >
                  Sign Up / Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
      {user && (
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          onLogout={logout}
          user={user}
        />
      )}
    </header>
  );
}
