import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiClient } from '../api/client';
import { Utensils, Sliders, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  taste: string;
}

const tastesList = [
  { id: 'all', label: 'All Dishes', desc: 'Craft culinary items hand-crafted in our traditional stone ovens.' },
  { id: 'savory', label: 'Savory', desc: 'Rich, comforting classics layered with aged cheeses and home-made sauces.' },
  { id: 'sweet', label: 'Sweet', desc: 'Heavenly traditional Italian desserts dusted with pure cocoa and fresh berries.' },
  { id: 'spicy', label: 'Spicy', desc: 'Bold, fiery creations infused with authentic Calabrian chili oil and spices.' },
  { id: 'bitter', label: 'Bitter', desc: 'Intense profiles featuring aged espresso reductions and botanical infusions.' },
  { id: 'sour', label: 'Sour & Zesty', desc: 'Bright, citrus-forward masterpieces featuring zest of Amalfi coast lemons.' }
];

export default function Menu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedTaste, setSelectedTaste] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;
    const fetchMenu = async () => {
      try {
        const data = await apiClient<MenuItem[]>('/menu');
        if (active) {
          setMenu(data);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Unable to retrieve menu. Please check your network connection.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchMenu();
    return () => {
      active = false;
    };
  }, []);

  const handleQuickAdd = (item: MenuItem) => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
      customization: '', // No customizations on quick add
    });

    // Show instant temporary feedback
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
    }, 1500);
  };

  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent animate-spin" />
        <span className="font-mono text-[10px] text-stone-600 uppercase tracking-widest">Loading Ristorante Menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] max-w-md mx-auto flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-10 h-10 bg-brand-primary/10 rounded-none flex items-center justify-center text-brand-primary border border-brand-primary">
          <Utensils className="w-5 h-5" />
        </div>
        <p className="text-stone-800 font-mono text-xs uppercase tracking-wider font-semibold">{error}</p>
        <button
          onClick={() => {
            setIsLoading(true);
            setError(null);
            window.location.reload();
          }}
          className="bg-brand-ink hover:bg-brand-primary text-white px-5 py-3 rounded-[4px] text-xs font-bold font-mono uppercase tracking-wider"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const filteredMenu = selectedTaste === 'all'
    ? menu
    : menu.filter(item => item.taste && item.taste.toLowerCase() === selectedTaste.toLowerCase());

  const activeTasteInfo = tastesList.find(t => t.id === selectedTaste);

  return (
    <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* English Header */}
      <div className="mb-10 text-center md:text-left border-l-4 border-brand-primary pl-4 md:pl-6">
        <h2 className="text-[10px] tracking-[0.25em] font-mono text-brand-primary font-bold uppercase mb-1.5">
          Our Culinary Specialties
        </h2>
        <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-brand-ink leading-none uppercase">
          Explore Our Menu Ledger
        </h1>
        <p className="text-stone-600 mt-3 leading-relaxed text-xs md:text-sm max-w-xl font-sans">
          Savor the finest Italian dishes cooked inside our traditional high-temperature wood oven. Tap any dish for customized ingredients options!
        </p>
      </div>

      {/* Taste Filter Tabs */}
      <div className="mb-8 font-sans">
        <div className="flex flex-wrap gap-2 pb-3 border-b border-brand-border">
          {tastesList.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTaste(t.id)}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-[4px] border transition-all cursor-pointer ${
                selectedTaste === t.id
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-brand-bg text-stone-600 border-brand-border hover:border-stone-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        
        {/* Dynamic Taste Profile Description */}
        {activeTasteInfo && (
          <motion.div
            key={selectedTaste}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-brand-bg border border-brand-border rounded-[2px] text-stone-600 font-mono text-[10px] uppercase tracking-wide"
          >
            <span className="text-brand-primary font-bold mr-1">// {activeTasteInfo.label} profile:</span> {activeTasteInfo.desc}
          </motion.div>
        )}
      </div>

      {/* Dishes Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {filteredMenu.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[4px] overflow-hidden border border-brand-border hover:border-brand-ink transition-all duration-300 flex flex-col group h-full shadow-none"
            >
              {/* Food Image Container */}
              <div className="relative aspect-video overflow-hidden bg-brand-bg border-b border-brand-border">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-white/95 border border-brand-border font-mono font-bold text-brand-ink px-2.5 py-0.5 rounded-[2px] text-xs tracking-wider">
                  {formatPrice(item.price)}
                </div>
                {/* Micro taste indicator */}
                <div className="absolute bottom-2 left-2 bg-brand-dark/80 backdrop-blur-xs border border-white/10 text-white font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-[1px]">
                  {item.taste}
                </div>
              </div>

              {/* Food Details */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h4 className="text-base font-display font-bold text-brand-ink leading-tight group-hover:text-brand-primary transition-colors uppercase">
                    {item.name}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Actions Box */}
                <div className="flex items-center gap-2 pt-4 mt-5 border-t border-brand-border animate-inputs">
                  <button
                    onClick={() => handleQuickAdd(item)}
                    className={`flex-grow py-2 px-3 rounded-[4px] font-mono text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      addedItemId === item.id
                        ? 'bg-brand-green text-white'
                        : 'bg-brand-ink hover:bg-brand-primary text-white'
                    }`}
                  >
                    {addedItemId === item.id ? (
                      '✓ Added'
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Quick Add
                      </>
                    )}
                  </button>
                  <Link
                    to={`/order/${item.id}`}
                    className="bg-brand-bg hover:bg-white border border-brand-border p-2 rounded-[4px] text-stone-600 hover:text-brand-primary transition-colors flex items-center justify-center"
                    title="Configure Customization"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {filteredMenu.length === 0 && (
        <div className="text-center py-12 p-6 border border-dashed border-brand-border rounded-[4px] bg-brand-bg/50">
          <p className="font-mono text-xs text-stone-600 uppercase tracking-widest">// No items found matching taste filter</p>
        </div>
      )}
    </div>
  );
}
