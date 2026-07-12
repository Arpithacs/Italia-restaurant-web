import { useState, FormEvent } from 'react';
import { Star, Check, Award } from 'lucide-react';
import { apiClient } from '../api/client';
import { motion } from 'motion/react';

export default function Feedback() {
  const [rating, setRating] = useState<number>(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  const [isInFlight, setIsInFlight] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message) {
      setErrorMsg('Feedback comments are required.');
      return;
    }

    setIsInFlight(true);
    setErrorMsg(null);

    try {
      await apiClient('/feedback', {
        method: 'POST',
        body: JSON.stringify({ message, rating }),
      });

      setIsSuccess(true);
      setMessage('');
      setRating(5);
    } catch (err: any) {
      setErrorMsg(err.message || 'We could not sign your review. Please try again.');
    } finally {
      setIsInFlight(false);
    }
  };

  return (
    <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-xs tracking-widest font-mono text-brand-primary font-bold uppercase mb-2">
          Le Vostre Recensioni
        </h2>
        <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-brand-ink leading-tight uppercase animate-fade-in">
          Customer Opinions Ledger
        </h1>
        <p className="text-stone-500 mt-2 text-xs font-sans max-w-md mx-auto leading-relaxed">
          We gather and honor customer recommendations. Help us fine-tune our baking temperature, crust thickness, and delivery speeds!
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-[4px] border border-brand-border p-6 sm:p-10 shadow-none">
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center text-center p-8 space-y-4 font-sans"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-none border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-[#111]">Grazie Mille!</h3>
            <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
              Grazie! Your stars and review card have been stored successfully. We share reviews in kitchen logs to encourage our bakers!
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="bg-brand-ink hover:bg-brand-primary text-white text-[10px] font-mono font-bold uppercase tracking-widest py-3 px-6 rounded-[4px]"
            >
              Sign Reviews Ledger Again
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-brand-ink pb-3 border-b border-brand-border flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-primary" /> Introduce Your Review
            </h3>

            {errorMsg && (
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-[2px] text-xs text-brand-primary font-semibold font-mono">
                Error: {errorMsg}
              </div>
            )}

            {/* Star selector ratings scale */}
            <div className="space-y-2">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#111]">
                Rate Our Craft (Stars)
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="p-1 rounded transform hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredStar ?? rating)
                          ? 'fill-brand-primary text-brand-primary'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="block text-[10px] font-mono text-brand-primary font-bold uppercase tracking-wide">
                {rating === 5 ? '🏆 Eccellente! (5 Stars)' : rating === 4 ? '✨ Molto bene! (4 Stars)' : rating === 3 ? '👍 Buono (3 Stars)' : rating === 2 ? '⚠️ Sufficiente (2 Stars)' : '😢 Insufficiente (1 Star)'}
              </span>
            </div>

            {/* Comments Box */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#111]">
                Recensione (Opinion comments)
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Ex. Best Roman carbonara in Campania! Dough was airy and thin..."
                className="w-full text-xs font-mono bg-brand-bg border border-brand-border focus:border-brand-ink focus:bg-white rounded-[4px] p-4 outline-none transition-all placeholder:text-stone-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-hover text-white font-mono font-bold uppercase tracking-widest text-xs py-4 px-6 rounded-[4px] flex items-center justify-center border border-transparent shadow-none transition-colors cursor-pointer"
            >
              Sign Opinion Ledger
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
