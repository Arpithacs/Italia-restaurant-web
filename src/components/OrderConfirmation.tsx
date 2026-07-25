import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Check, Calendar, MapPin, Truck, Utensils, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderItem {
  id: number;
  menu_item_id: number;
  name: string;
  image: string;
  quantity: number;
  customization: string;
  unit_price: number;
}

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchOrderDetails = async () => {
      try {
        const history = await apiClient<Order[]>('/orders/me');
        if (active) {
          // Find the order that matches orderId
          const matchingOrder = history.find((ord) => ord.id === Number(orderId));
          if (matchingOrder) {
            setOrder(matchingOrder);
            setErrorMsg(null);
          } else {
            setErrorMsg(`We cannot locate an order matching ID ${orderId} in your checkout history.`);
          }
        }
      } catch (err: any) {
        if (active) {
          setErrorMsg(err.message || 'Error occurred while loading confirmation receipt details.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchOrderDetails();
    return () => {
      active = false;
    };
  }, [orderId]);

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-stone-600 tracking-wider">Generating Confirmation Invoice...</span>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="min-h-[50vh] max-w-lg mx-auto flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-700 font-semibold">{errorMsg || 'Receipt details not found.'}</p>
        <Link to="/menu" className="bg-brand-primary hover:bg-brand-hover text-white px-6 py-2.5 rounded-full text-xs font-semibold">
          Retrace Menu Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 animate-fade-in"
      >
        
        {/* Top Success Badge card */}
        <div className="bg-brand-primary rounded-[4px] p-8 text-center text-white space-y-4 shadow-none border border-transparent flex flex-col items-center">
          <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-none flex items-center justify-center">
            <Check className="w-5 h-5 text-white stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono font-bold tracking-widest bg-white/10 p-1 px-3.5 rounded-[2px] border border-white/20">
              Checkout Successful
            </span>
            <h1 className="text-2xl font-display font-extrabold tracking-tight mt-3 uppercase">
              Ordine Ricevuto
            </h1>
            <p className="text-stone-100 text-[11px] mt-2 max-w-sm mx-auto leading-relaxed font-sans">
              Grazie! Your payment was compiled, verified, and dispatched to our kitchen ovens. Our cooks have started stretch-kneading your pizzas!
            </p>
          </div>
        </div>

        {/* Detailed logistics timeline */}
        <div className="bg-white rounded-[4px] p-6 md:p-8 border border-brand-border shadow-none grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-700 text-sm">
          <div className="flex gap-3">
            <Truck className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <span className="block font-mono font-bold text-[10px] text-brand-ink uppercase tracking-widest leading-none">Rider Support</span>
              <span className="block text-[11px] text-stone-600 mt-1 font-sans">Sandro R. (Express Moto)</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Calendar className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <span className="block font-mono font-bold text-[10px] text-brand-ink uppercase tracking-widest leading-none">Arrival Time</span>
              <span className="block text-[11px] text-brand-primary font-bold mt-1 font-sans">In 35–40 Minutes</span>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <span className="block font-mono font-bold text-[10px] text-brand-ink uppercase tracking-widest leading-none">Transit route</span>
              <span className="block text-[11px] text-stone-600 mt-1 font-sans">Live tracking enabled</span>
            </div>
          </div>
        </div>

        {/* Receipt invoice details */}
        <div className="bg-white rounded-[4px] border border-brand-border p-6 md:p-8 shadow-none space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-border">
            <div>
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-[#111]">Receipt Statement</h3>
              <span className="text-[10px] font-mono text-stone-600">Order Ref #: {order.id}</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-brand-bg py-1 px-3 border border-brand-border rounded-[2px] text-stone-600">
              Ref Status: {order.status}
            </span>
          </div>

          {/* Items checklist */}
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[2px] border border-brand-border overflow-hidden shrink-0 bg-brand-bg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover animate-fade-in"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-brand-ink text-xs block font-sans">{item.name}</span>
                    <span className="text-stone-400 font-mono text-[10px] block mt-0.5">Quantity: {item.quantity}</span>
                    {item.customization && (
                      <span className="block text-[9px] text-brand-primary uppercase font-mono mt-1">
                        * {item.customization}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono text-stone-600 text-xs font-semibold shrink-0">
                  {formatPrice(item.unit_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals footer */}
          <div className="pt-6 border-t border-brand-border space-y-3.5 text-xs font-mono uppercase tracking-wider">
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Baking Oven Dispatch</span>
              <span className="text-brand-green font-bold">Included</span>
            </div>
            <div className="h-px bg-brand-border" />
            <div className="flex justify-between font-display font-bold text-sm text-[#111] items-center pt-1">
              <span>Paid Total</span>
              <span className="font-mono text-brand-primary text-base font-extrabold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action redirections */}
        <div className="text-center">
          <Link
            to="/menu"
            className="inline-flex bg-brand-ink hover:bg-brand-primary text-white py-3.5 px-8 rounded-[4px] font-mono font-bold uppercase tracking-widest text-xs border border-transparent transition-all"
          >
            Sfoglia di Nuovo il Menu (Rebrowse Menu)
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
