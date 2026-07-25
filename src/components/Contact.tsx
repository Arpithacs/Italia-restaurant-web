import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { apiClient } from '../api/client';
import { motion } from 'motion/react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isInFlight, setIsInFlight] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('All contact fields are required.');
      return;
    }

    setIsInFlight(true);
    setErrorMsg(null);

    try {
      await apiClient('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, message }),
      });

      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'We could not log your message. Please try again.');
    } finally {
      setIsInFlight(false);
    }
  };

  return (
    <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-xs tracking-widest font-mono text-brand-primary font-bold uppercase mb-2">
          Contattaci
        </h2>
        <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-brand-ink leading-tight uppercase animate-fade-in">
          Keep in Touch with Us
        </h1>
        <p className="text-stone-600 mt-2 text-xs font-sans max-w-md mx-auto leading-relaxed">
          Have an upcoming corporate event, wedding or private reservation request? Fill in our traditional liaison ledger below!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        {/* Contact info list card */}
        <div className="bg-brand-dark text-white rounded-[4px] p-8 flex flex-col justify-between space-y-8 border border-white/10 shadow-none">
          <div className="space-y-6">
            <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-white border-b border-white/15 pb-3">// Contact Ledger</h3>
            <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
              Our support staff and events coordinators read and log messages throughout working hours. Expect a response on your email within 4 hours.
            </p>
          </div>

          <div className="space-y-6 font-mono text-[11px]">
            <div className="flex gap-4">
              <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="block font-sans font-bold text-xs text-stone-100">Ristorante Venue</span>
                <span className="block text-stone-300 mt-1">83 Via dei Tribunali, Napoli, Campania, IT</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="block font-sans font-bold text-xs text-stone-100">Fast Helpline</span>
                <span className="block text-stone-300 mt-1">+39 081 294 3829</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <span className="block font-sans font-bold text-xs text-stone-100">Catering Direct</span>
                <span className="block text-stone-300 mt-1">ciao@italia-ristorante.com</span>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-stone-400 font-sans uppercase tracking-wider pt-4 border-t border-white/15">
            * Options are powered securely by local database nodes.
          </p>
        </div>

        {/* Form input field container */}
        <div className="lg:col-span-2 bg-white rounded-[4px] border border-brand-border p-6 sm:p-10 shadow-none">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-none border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-[#111]">Message Dispatched!</h3>
              <p className="text-xs text-stone-600 max-w-sm leading-relaxed font-sans">
                Thank you! Your contact card was stored into our relational node system. Our event support manager is reviewing and will dispatch an email summary to you shortly.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="bg-brand-ink hover:bg-brand-primary text-white text-[10px] font-mono font-bold uppercase tracking-widest py-3 px-6 rounded-[4px]"
              >
                Send Another Ledger
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-brand-ink pb-3 border-b border-brand-border">
                Send a Message
              </h3>

              {errorMsg && (
                <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-[2px] text-xs text-brand-primary font-semibold font-mono">
                  Error: {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex. Giovanni"
                    className="w-full text-xs font-mono bg-brand-bg rounded-[4px] border border-brand-border focus:border-brand-ink focus:bg-white p-3 px-4 outline-none transition-all placeholder:text-stone-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex. giovanni@gmail.com"
                    className="w-full text-xs font-mono bg-brand-bg rounded-[4px] border border-brand-border focus:border-brand-ink focus:bg-white p-3 px-4 outline-none transition-all placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">
                  Your Message
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us what you need..."
                  className="w-full text-xs font-mono bg-brand-bg rounded-[4px] border border-brand-border focus:border-brand-ink focus:bg-white p-4 outline-none transition-all placeholder:text-stone-400"
                />
              </div>

              <button
                type="submit"
                disabled={isInFlight}
                className="w-full bg-brand-primary hover:bg-brand-hover text-white font-mono font-bold uppercase tracking-widest text-xs py-4 px-6 rounded-[4px] flex items-center justify-center gap-2 border border-transparent shadow-none cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                {isInFlight ? 'Sending Message...' : 'Submit Contact Card'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
