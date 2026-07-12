import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiClient } from '../api/client';
import { ChevronLeft, ShoppingCart, Sliders, CheckSquare, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function OrderCustomization() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Customization States
  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [selectedCrust, setSelectedCrust] = useState<string>('Classic Original');
  const [extraCheese, setExtraCheese] = useState<boolean>(false);
  const [wellDone, setWellDone] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const fetchItem = async () => {
      try {
        if (!id) return;
        const data = await apiClient<MenuItem>(`/menu/${id}`);
        if (active) {
          setItem(data);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Unable to retrieve menu item details.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchItem();
    return () => {
      active = false;
    };
  }, [id]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleApplySuggestion = (text: string) => {
    setCustomNotes((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      if (trimmed.toLowerCase().includes(text.toLowerCase())) return prev;
      return `${trimmed}, ${text}`;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!item) return;

    // Build centralized customization string
    const parts: string[] = [];
    
    // Add pizza preferences if relevant (e.g. if the item name contains pizza)
    const isPizza = item.name.toLowerCase().includes('pizza') || item.name.toLowerCase().includes('focaccia');
    if (isPizza && selectedCrust && selectedCrust !== 'Classic Original') {
      parts.push(`Crust: ${selectedCrust}`);
    }

    if (extraCheese) {
      parts.push('Extra Cheese');
    }

    if (wellDone) {
      parts.push('Well Done / Extra Crispy');
    }

    if (customNotes.trim()) {
      parts.push(customNotes.trim());
    }

    const customizationString = parts.join(', ');

    addToCart({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity,
      customization: customizationString,
    });

    // Navigate to Cart as requested in frontend spec
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-stone-500 tracking-wider">Loading Culinary Details...</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[50vh] max-w-lg mx-auto flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-700 font-semibold">{error || 'Dish not found.'}</p>
        <Link to="/menu" className="bg-brand-primary hover:bg-brand-hover text-white px-6 py-2.5 rounded-full text-xs font-semibold">
          Return to Menu
        </Link>
      </div>
    );
  }

  const isPizza = item.name.toLowerCase().includes('pizza') || item.name.toLowerCase().includes('focaccia');

  return (
    <div className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
      
      {/* Back button */}
      <Link to="/menu" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-brand-primary transition-colors mb-8">
        <ChevronLeft className="w-3.5 h-3.5" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-[4px] p-6 md:p-10 border border-brand-border shadow-none">
        
        {/* Left pane: Image & base details */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[4px] border border-brand-border overflow-hidden shadow-none bg-brand-bg">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-brand-ink tracking-tight uppercase leading-tight">
              {item.name}
            </h1>
            <span className="inline-block text-lg font-mono font-bold text-brand-primary mt-1">
              {formatPrice(item.price)}
            </span>
            <p className="text-xs text-stone-500 mt-4 leading-relaxed bg-brand-bg p-4 rounded-[4px] border border-brand-border font-sans">
              {item.description}
            </p>
          </div>
        </div>

        {/* Right pane: Customizer form */}
        <form onSubmit={handleSubmit} className="flex flex-col justify-between space-y-8">
          <div className="space-y-8">
            <div className="flex items-center gap-2 pb-4 border-b border-brand-border">
              <Sliders className="w-4 h-4 text-brand-primary" />
              <h3 className="font-mono font-bold text-brand-ink text-xs uppercase tracking-widest">Custom Preferences</h3>
            </div>

            {/* Crust selection (only for Pizzas/Focaccia) */}
            {isPizza && (
              <div className="space-y-3">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#111]">
                  Scegli la Base (Crust option)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Classic Original', 'Thin & Crispy', 'Thick Sicilian'].map((crust) => (
                    <button
                      key={crust}
                      type="button"
                      onClick={() => setSelectedCrust(crust)}
                      className={`py-3 px-1 rounded-[4px] text-[10px] font-mono uppercase tracking-wider border text-center transition-all ${
                        selectedCrust === crust
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-bold'
                          : 'border-brand-border text-stone-600 hover:bg-brand-bg bg-white'
                      }`}
                    >
                      {crust}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick add-ons checkboxes */}
            <div className="space-y-3">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#111]">
                Aggiunte Rapide (Add-on upgrades)
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setExtraCheese(!extraCheese)}
                  className={`flex items-center justify-between w-full p-4 rounded-[4px] border text-xs text-left transition-all ${
                    extraCheese
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold'
                      : 'border-brand-border text-stone-700 hover:bg-brand-bg bg-white'
                  }`}
                >
                  <span className="font-sans">Extra Creamy Mozzarella / Cheese</span>
                  <span className="text-[10px] font-mono bg-brand-bg py-0.5 px-2 rounded-[2px] border border-brand-border text-stone-500 font-bold">
                    +$1.50
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWellDone(!wellDone)}
                  className={`flex items-center justify-between w-full p-4 rounded-[4px] border text-xs text-left transition-all ${
                    wellDone
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary font-bold'
                      : 'border-brand-border text-stone-700 hover:bg-brand-bg bg-white'
                  }`}
                >
                  <span className="font-sans">Well Done / Crispy Crust Finish</span>
                  <span className="text-[10px] font-mono bg-brand-bg py-0.5 px-2 rounded-[2px] border border-brand-border text-stone-500 font-bold">
                    Free
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Notes text area */}
            <div className="space-y-3">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#111]">
                Informazioni Extra (Special Instructions)
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
                placeholder="Ex. No onions, double sauce, extra napkins, eggless sauce..."
                className="w-full text-xs font-mono bg-brand-bg border border-brand-border focus:border-brand-ink focus:bg-white rounded-[4px] p-4 outline-none transition-all placeholder:text-stone-400"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['No garlic', 'Sauce on side', 'Less salt', 'Extra basil'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleApplySuggestion(sug)}
                    className="text-[9px] font-mono font-semibold bg-brand-bg border border-brand-border hover:border-brand-primary hover:bg-brand-primary/10 text-stone-600 hover:text-brand-primary py-1 px-2.5 rounded-[2px] transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity selector and Add-to-Cart Trigger */}
          <div className="space-y-4 pt-6 border-t border-brand-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500">Quantity</span>
              <div className="flex items-center gap-2 border border-brand-border rounded-[4px] p-1 bg-brand-bg">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="p-1.5 hover:bg-brand-border text-brand-ink rounded-[2px] transition-colors shrink-0"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-brand-ink text-xs leading-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="p-1.5 hover:bg-brand-border text-brand-ink rounded-[2px] transition-colors shrink-0"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-[4px] bg-brand-primary hover:bg-brand-hover text-white font-mono font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-transparent shadow-none"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart — {formatPrice(item.price * quantity + (extraCheese ? 150 * quantity : 0))}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
