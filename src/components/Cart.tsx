import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingCart, Plus, Minus, CreditCard, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { cart, removeItem, updateQuantity, totalPrice, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCheckoutInFlight, setIsCheckoutInFlight] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleCheckout = async () => {
    if (!user) {
      // Handled inline inside the UI render
      return;
    }

    setIsCheckoutInFlight(true);
    setErrorMsg(null);

    try {
      const order = await checkout();
      if (order && order.id) {
        navigate(`/order-confirmation/${order.id}`);
      } else {
        // Fallback error
        setErrorMsg('Order submitted but no receipt ID returned.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed. Please verify your network.');
    } finally {
      setIsCheckoutInFlight(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] max-w-lg mx-auto px-4 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary flex items-center justify-center text-brand-primary rounded-none">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold text-brand-ink uppercase tracking-wider">Your Cart is Empty</h1>
          <p className="text-stone-500 mt-2 text-xs leading-relaxed max-w-sm mx-auto font-sans">
            There are no culinary masterpieces selected in your shopping tray yet. Let’s head to our traditional Italian menu to fill it up!
          </p>
        </div>
        <Link
          to="/menu"
          className="bg-brand-ink hover:bg-brand-primary text-white font-mono uppercase tracking-widest text-xs font-bold py-3.5 px-8 rounded-[4px]"
        >
          Explore Menus
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8 border-l-4 border-brand-primary pl-4">
        <h1 className="text-2xl md:text-3xl font-display font-black text-brand-ink tracking-tight uppercase">
          Your Dining Cart
        </h1>
        <p className="text-xs text-stone-500 mt-1 font-mono uppercase tracking-widest">ITALIA CHECKOUT BAR</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column: Cart Items list */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, x: -50 }}
                className="bg-white rounded-[4px] p-4 sm:p-5 border border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-brand-ink transition-colors duration-300 shadow-none"
              >
                {/* Thumbnail & names */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[2px] overflow-hidden shrink-0 border border-brand-border bg-brand-bg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-brand-ink leading-tight text-sm sm:text-base">
                      {item.name}
                    </h4>
                    <span className="font-mono text-xs text-stone-500 font-medium block mt-0.5">
                      {formatPrice(item.price)}
                    </span>
                    {item.customization && (
                      <span className="inline-block mt-1 bg-brand-primary/5 text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 text-brand-primary border border-brand-primary/20 rounded-[2px]">
                        custom: {item.customization}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantitative Modifier / Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center gap-1 border border-brand-border rounded-[4px] p-1 bg-brand-bg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-brand-border text-brand-ink rounded-[2px] transition-colors shrink-0"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-xs text-brand-ink leading-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-brand-border text-brand-ink rounded-[2px] transition-colors shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono font-bold text-brand-ink text-sm w-16 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-brand-primary/5 hover:text-brand-primary border border-brand-border hover:border-brand-primary/30 rounded-[4px] text-stone-400 shrink-0 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right column: Checkout Summary Invoice card */}
        <div className="space-y-6">
          <div className="bg-white rounded-[4px] border border-brand-border p-6 md:p-8 shadow-none">
            <h3 className="font-mono font-bold text-[11px] uppercase tracking-widest text-[#111] pb-3 border-b border-brand-border mb-6">
              // RECEIPT INVOICE
            </h3>

            {/* Calculations lines */}
            <div className="space-y-4 text-xs mb-6 font-mono uppercase tracking-wider">
              <div className="flex justify-between text-stone-500 font-medium">
                <span>Subtotal (Cibo)</span>
                <span className="text-brand-ink font-bold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-stone-500 font-medium">
                <span>Delivery (Consegna)</span>
                <span className="text-brand-green font-bold">Free</span>
              </div>
              <div className="h-px bg-brand-border" />
              <div className="flex justify-between text-sm font-bold text-brand-ink font-display items-center pt-2">
                <span>Grand Total</span>
                <span className="font-mono text-brand-primary text-base font-extrabold">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/30 rounded-[2px] mb-6 text-[11px] text-brand-primary font-semibold font-mono">
                Error: {errorMsg}
              </div>
            )}

            {/* Checkout CTA button action list */}
            {user ? (
              <button
                onClick={handleCheckout}
                disabled={isCheckoutInFlight}
                className="w-full bg-brand-primary hover:bg-brand-hover disabled:bg-stone-300 text-white font-mono uppercase tracking-widest text-xs font-bold py-4 px-6 rounded-[4px] flex items-center justify-center gap-2 transition-colors border border-transparent shadow-none"
              >
                <CreditCard className="w-3.5 h-3.5" />
                {isCheckoutInFlight ? 'Placing Order...' : 'Place Secure Order'}
              </button>
            ) : (
              <div className="p-4 bg-brand-bg border border-brand-border rounded-[4px] text-stone-800 space-y-4">
                <div className="flex items-start gap-2 text-brand-primary">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold leading-tight font-mono uppercase tracking-wide">
                    Authorization Security Notice
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-600 font-sans">
                  Please quickly register or sign in to complete your transaction secure delivery routing. Clicking below takes you to our express authentication page.
                </p>
                <Link
                  to="/signup?redirect=checkout"
                  className="w-full bg-white border border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white font-mono font-bold py-3 px-4 rounded-[4px] text-xs flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
                >
                  Sign In / Create Account
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
