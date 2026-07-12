import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Calendar, Package, Clock, ShieldAlert, ArrowRight, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  customization: string | null;
  unit_price: number;
  name: string;
  image: string;
}

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const fetchOrders = async () => {
      try {
        const data = await apiClient<Order[]>('/orders/me');
        if (active) {
          setOrders(data);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Unable to retrieve order history.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      active = false;
    };
  }, [user]);

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  };

  // If user is not authenticated
  if (!user) {
    return (
      <div className="min-h-[70vh] max-w-md mx-auto px-4 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary flex items-center justify-center text-brand-primary rounded-none">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-brand-ink uppercase tracking-wider">Authentication Required</h1>
          <p className="text-stone-500 mt-2 text-xs leading-relaxed max-w-sm font-sans">
            Please log in or register an account with us to view active deliveries, check order slips, and inspect past dining history.
          </p>
        </div>
        <Link
          to="/signup"
          className="bg-brand-ink hover:bg-brand-primary text-white font-mono uppercase tracking-widest text-xs font-bold py-3.5 px-8 rounded-[4px] transition-colors"
        >
          Sign In / Register
        </Link>
      </div>
    );
  }

  // Loading indicator matching the Swiss theme look
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent animate-spin" />
        <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">// SECURING RECORD ARCHIVES...</span>
      </div>
    );
  }

  // Error block
  if (error) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-12 h-12 bg-brand-primary/10 rounded-none flex items-center justify-center text-brand-primary border border-brand-primary">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <p className="text-brand-ink font-mono text-xs uppercase tracking-wider font-semibold">Error: {error}</p>
        <button
          onClick={() => {
            setIsLoading(true);
            setError(null);
            window.location.reload();
          }}
          className="bg-brand-ink hover:bg-brand-primary text-white px-5 py-3 rounded-[4px] text-xs font-bold font-mono uppercase tracking-wider transition-colors"
        >
          Retry Fetching
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
      
      {/* Visual Header Grid & title */}
      <div className="mb-10 border-l-4 border-brand-primary pl-4 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-brand-ink tracking-tight uppercase">
            Your Order History
          </h1>
          <sub className="text-[10px] text-stone-500 font-mono uppercase tracking-widest block mt-1">// Archivio Storico degli Ordini</sub>
        </div>
        <Link
          to="/menu"
          className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 hover:text-brand-primary transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Menu
        </Link>
      </div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[4px] border border-brand-border p-12 text-center flex flex-col items-center max-w-2xl mx-auto"
        >
          <div className="w-12 h-12 bg-brand-primary/5 border border-brand-primary/30 flex items-center justify-center text-brand-primary mb-6">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-brand-ink text-base uppercase tracking-wider">No Past Transactions</h3>
          <p className="text-stone-500 mt-2 text-xs leading-relaxed font-sans max-w-xs mb-8">
            Our traditional ledger contains no culinary orders registered to your name yet. Head back to our Napoli brick-oven selector and build your first masterpiece!
          </p>
          <Link
            to="/menu"
            className="bg-brand-primary hover:bg-brand-hover text-white font-mono uppercase tracking-widest text-xs font-bold py-3.5 px-8 rounded-[4px] transition-colors inline-block"
          >
            Create Your First Order
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              className="bg-white rounded-[4px] border border-brand-border overflow-hidden shadow-none hover:border-brand-ink transition-colors duration-300"
            >
              {/* Header bar of order card */}
              <div className="bg-brand-bg/50 border-b border-brand-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="text-xs font-bold text-brand-ink uppercase">
                    Order Ref <span className="text-brand-primary">#{order.id}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                    <span className="text-[10px] font-bold uppercase tracking-widest border border-brand-green/30 px-2 py-0.5 rounded-[2px] text-brand-green bg-brand-green/5">
                      {order.status}
                    </span>
                  </div>
                  {/* Total price */}
                  <div className="text-xs font-bold text-brand-primary bg-white px-2.5 py-1 border border-brand-border rounded-[2px]">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>

              {/* Items checklist */}
              <div className="p-4 sm:p-5 divide-y divide-brand-border">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-start gap-4 first:pt-0 last:pb-0">
                    <div className="w-12 h-12 rounded-[2px] border border-brand-border overflow-hidden shrink-0 bg-brand-bg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover saturate-75"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="font-display font-bold text-brand-ink text-xs sm:text-sm truncate uppercase tracking-tight">
                          {item.name}
                        </h4>
                        <span className="font-mono text-[11px] font-bold text-brand-ink shrink-0">
                          {formatPrice(item.unit_price * item.quantity)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                          Qty: {item.quantity}
                        </span>
                        {item.unit_price && (
                          <span className="font-mono text-[10px] text-stone-400">
                            @ {formatPrice(item.unit_price)} each
                          </span>
                        )}
                      </div>
                      {item.customization && (
                        <div className="mt-1.5 inline-block bg-brand-primary/5 text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 text-brand-primary border border-brand-primary/20 rounded-[2px]">
                          Custom: {item.customization}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer card note */}
              <div className="bg-brand-bg/20 border-t border-brand-border p-3 px-5 text-[9px] font-mono text-stone-400 flex items-center justify-between">
                <span>SECURED ORDER ENTRY</span>
                <span className="uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 text-brand-primary fill-brand-primary" /> Napoli Tradition Perfected
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
