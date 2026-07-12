import { motion } from 'motion/react';
import { Award, Clock, Heart, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="py-20 px-4 md:px-8 max-w-4xl mx-auto font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-l-4 border-brand-primary pl-4 md:pl-6 mb-12"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-primary font-bold block mb-1">
          // OUR HERITAGE
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-black text-brand-ink uppercase tracking-tight">
          Our Naples Story
        </h1>
        <p className="text-stone-500 mt-2 text-xs md:text-sm max-w-lg leading-relaxed">
          The heritage of Naples traditional wood-fired pizza and rich recipes passed down through generations.
        </p>
      </motion.div>

      <div className="prose text-stone-600 space-y-6 text-sm leading-relaxed mb-16">
        <p>
          Founded in the summer of 1992 on the historic streets of <strong className="text-brand-ink text-xs uppercase font-bold tracking-wider">Via dei Tribunali, Naples</strong>, 
          Italia Ristorante was born from a single, passionate vision: to honor and preserve the time-honored tradition of true Neapolitan dining. Every tomato with which we paint our dough, 
          every drop of extra virgin olive oil, and every soft sheet of handmade lasagna pasta follows a recipe passed down through three generations of family cooking.
        </p>

        <p>
          Our central centerpiece is our monumental 900-degree volcanic brick oven, hand-built from stone excavated from the foot of Mt. Vesuvius. This powerful, traditional oven flash-cooks 
          our pizzas in under 90 seconds, securing a perfect, crispy blistered crust while preserving the refreshing moisture of the genuine Campania mozzarella.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 border-t border-brand-border pt-12">
        <div className="flex flex-col items-center text-center p-4">
          <Award className="w-6 h-6 text-brand-primary mb-3" />
          <h4 className="font-display font-bold text-brand-ink text-xs uppercase tracking-wider">Authentic Cert.</h4>
          <sub className="font-mono text-[9px] text-stone-400 uppercase mt-1 leading-normal">Volcanic stone baked</sub>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <Clock className="w-6 h-6 text-brand-primary mb-3" />
          <h4 className="font-display font-bold text-brand-ink text-xs uppercase tracking-wider">Since 1992</h4>
          <sub className="font-mono text-[9px] text-stone-400 uppercase mt-1 leading-normal">Over 30 years active</sub>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <Users className="w-6 h-6 text-brand-primary mb-3" />
          <h4 className="font-display font-bold text-brand-ink text-xs uppercase tracking-wider">Family Staff</h4>
          <sub className="font-mono text-[9px] text-stone-400 uppercase mt-1 leading-normal">Owned and managed</sub>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <Heart className="w-6 h-6 text-brand-primary mb-3" />
          <h4 className="font-display font-bold text-brand-ink text-xs uppercase tracking-wider">With Love</h4>
          <sub className="font-mono text-[9px] text-stone-400 uppercase mt-1 leading-normal">Naples tradition</sub>
        </div>
      </div>
    </div>
  );
}
