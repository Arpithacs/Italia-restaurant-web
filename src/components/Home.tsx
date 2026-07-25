import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Award, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white min-h-[90vh] flex items-center justify-center py-20 px-4 md:px-8">
        
        {/* Background Image Accent Mask */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80"
            alt="Classic Italian Table"
            className="w-full h-full object-cover opacity-30 filter brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            
            {/* Top Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-mono font-bold py-1.5 px-4 rounded-[2px] uppercase tracking-widest"
            >
              <Sparkles className="w-3 h-3 text-brand-primary" />
              Napoli Tradition, Perfected
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-7xl font-display font-extrabold tracking-tight"
            >
              The Real Taste of <br />
              <span className="text-brand-primary">
                Traditional Italia
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-stone-200 max-w-3xl mx-auto leading-relaxed font-sans"
            >
              Hand-pressed brick oven pizzas, creamy slow-cooked lasagna bolognese, and silky sweet tiramisu whipped fresh daily. Sourced locally, baked in stone.
            </motion.p>

            {/* Actions CTA */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <Link
                to="/menu"
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-hover text-white font-mono font-bold uppercase tracking-widest text-xs py-4 px-10 rounded-[4px] flex items-center justify-center gap-2 duration-200 border border-transparent"
              >
                Browse Menu
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-stone-100 font-mono font-bold uppercase tracking-widest text-xs py-4 px-10 rounded-[4px] border border-white/20 text-center duration-200"
              >
                Our Heritage
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-24 bg-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs tracking-widest font-mono text-brand-primary font-bold uppercase mb-2">
              Why Choose Italia
            </h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-stone-900 tracking-tight">
              An Authentic Feast with Pure Honesty
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature Item 1 */}
            <div className="bg-white p-8 rounded-[4px] border border-brand-border flex flex-col items-center text-center group hover:border-brand-ink transition-all duration-300">
              <div className="w-12 h-12 bg-brand-bg text-brand-primary border border-brand-border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-display font-bold text-brand-ink mb-2">Family Recipes Only</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero mimics, zero compromises. Our marinara bases are slowly simmered across 8 hours according to grandma Isabella's handwritten recipes.
              </p>
            </div>

            {/* Feature Item 2 */}
            <div className="bg-white p-8 rounded-[4px] border border-brand-border flex flex-col items-center text-center group hover:border-brand-ink transition-all duration-300">
              <div className="w-12 h-12 bg-brand-bg text-brand-green border border-brand-border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-display font-bold text-brand-ink mb-2">100% Organic Sourcing</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Double-zero caputo flours, PDO San Marzano tomatoes, and creamy fresh cow mozzarella delivered straight from local artisan farms each morning.
              </p>
            </div>

            {/* Feature Item 3 */}
            <div className="bg-white p-8 rounded-[4px] border border-brand-border flex flex-col items-center text-center group hover:border-brand-ink transition-all duration-300">
              <div className="w-12 h-12 bg-brand-bg text-brand-gold border border-brand-border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-display font-bold text-brand-ink mb-2">Fresh Cooking Guarantee</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We never store pre-baked doughs. Every pizza enters our 800°F lava-stone furnace only after you submit your checkout.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Culinary Banner Block Section */}
      <section className="bg-brand-dark text-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1598103442097-8b74394b98c6?w=800&auto=format&fit=crop&q=80"
              alt="Artisanal Baking Process"
              className="absolute inset-0 w-full h-full object-cover filter brightness-75 saturate-90"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-12 md:p-24 flex flex-col justify-center space-y-6">
            <h4 className="text-xs font-mono font-bold tracking-widest text-brand-primary uppercase">
              The Artisan Oven
            </h4>
            <h3 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              A Warm Promise and a Crispy Crust
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Our traditional baking process starts with hydrated high-protein dough left to slowly rise across 48 cold-fermented hours. This forms complex yeast cellular profiles which caramelize beautifully under our high gas-fired lava stones, creating a light, digestible crust with exquisite crunch.
            </p>
            <div className="pt-4 border-t border-white/15 flex gap-6 text-xs text-stone-300 font-mono">
              <div>
                <span className="block text-2xl font-bold text-white font-sans">48h</span>
                Cold Fermentation
              </div>
              <div>
                <span className="block text-2xl font-bold text-white font-sans">800°F</span>
                Stone Oven Temperature
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
