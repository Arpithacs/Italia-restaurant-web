import { useState, useEffect } from 'react';
import { User, Mail, Shield, Award, LogOut, X } from 'lucide-react';
import { apiClient } from '../api/client';
import { motion, AnimatePresence } from 'motion/react';

interface Order {
  id: number;
  total: number;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function ProfileModal({ isOpen, onClose, onLogout, user }: ProfileModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetchingStats, setIsFetchingStats] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const fetchOrderStats = async () => {
      try {
        const orderData = await apiClient<Order[]>('/orders/me');
        if (active) {
          setOrders(orderData);
        }
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      } finally {
        if (active) {
          setIsFetchingStats(false);
        }
      }
    };

    fetchOrderStats();
    return () => {
      active = false;
    };
  }, [isOpen, user.id]);

  const calculatedTotalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const formattedTotalSpent = `$${(calculatedTotalSpent / 100).toFixed(2)}`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center font-sans">
        
        {/* Dark backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-ink/75 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal body sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white w-full max-w-lg mx-4 rounded-[4px] border border-brand-border overflow-hidden shadow-2xl z-10"
        >
          {/* Header */}
          <div className="bg-brand-bg border-b border-brand-border px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-brand-primary rounded-[1px]" />
              <h2 className="text-sm font-mono font-extrabold uppercase tracking-widest text-brand-ink">
                DINER PROFILE & AMENITIES
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-[2px] text-stone-400 hover:text-brand-primary hover:bg-brand-bg transition-colors cursor-pointer"
              aria-label="Close Profile"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* User credentials details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border border-brand-border bg-stone-50/50 rounded-[4px]">
              <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary flex items-center justify-center text-brand-primary rounded-none shrink-0 font-display font-black text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-grow text-center sm:text-left min-w-0">
                <h3 className="font-display font-bold text-lg text-brand-ink uppercase tracking-tight truncate">
                  {user.name}
                </h3>
                <span className="flex items-center justify-center sm:justify-start gap-1.5 text-stone-600 font-mono text-xs mt-1 truncate">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  {user.email}
                </span>
                
                {/* User Badging */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 bg-brand-primary/5 text-brand-primary border border-brand-primary/10 rounded-[2px] py-0.5 px-2 font-mono text-[9px] uppercase font-bold tracking-wider">
                    <Award className="w-3 h-3" /> VIP Dinner Club
                  </span>
                  <span className="inline-flex items-center gap-1 bg-brand-green/5 text-brand-green border border-brand-green/20 rounded-[2px] py-0.5 px-2 font-mono text-[9px] uppercase font-bold tracking-wider">
                    <Shield className="w-3 h-3" /> Fully Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Realtime stats grid */}
            <div>
              <h4 className="font-mono text-[10px] uppercase font-extrabold tracking-widest text-stone-400 mb-3 block">
                // AUTHENTIC DINING METRICS
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-brand-border p-4 bg-brand-bg rounded-[2px] transition-colors">
                  <sub className="text-[9px] font-mono text-stone-400 uppercase tracking-wider block">Total Culinary Orders</sub>
                  {isFetchingStats ? (
                    <div className="h-6 w-10 mt-1 bg-stone-200 animate-pulse rounded-[1px]" />
                  ) : (
                    <span className="font-display font-black text-2xl text-brand-ink block mt-0.5">
                      {orders.length}
                    </span>
                  )}
                </div>

                <div className="border border-brand-border p-4 bg-brand-bg rounded-[2px] transition-colors">
                  <sub className="text-[9px] font-mono text-stone-400 uppercase tracking-wider block">Naples Patronage SPENT</sub>
                  {isFetchingStats ? (
                    <div className="h-6 w-16 mt-1 bg-stone-200 animate-pulse rounded-[1px]" />
                  ) : (
                    <span className="font-display font-black text-2xl text-brand-primary block mt-0.5">
                      {formattedTotalSpent}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Footer controls */}
          <div className="bg-brand-bg border-t border-brand-border p-4 px-6 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 text-brand-primary hover:text-brand-hover font-mono text-[10px] uppercase tracking-wider font-bold py-2.5 px-4 rounded-[4px] border border-brand-primary/20 hover:bg-brand-primary/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="bg-brand-ink hover:bg-brand-primary text-white font-mono text-[10px] uppercase tracking-wider font-bold py-2.5 px-6 rounded-[4px] cursor-pointer transition-colors"
            >
              Close Profile
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
