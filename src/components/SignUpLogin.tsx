import { useState, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, LogIn, Mail, Lock, UserIcon, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function SignUpLogin() {
  const { login, signup, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isCheckoutRedirect = searchParams.get('redirect') === 'checkout';

  // Toggle state: 'login' or 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Input states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Local validation states
  const [localError, setLocalError] = useState<string | null>(null);
  const [isInFlight, setIsInFlight] = useState<boolean>(false);

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setLocalError(null);
    clearError();
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Standard client side sanity validation
    if (!email || !password) {
      setLocalError('All credential fields are required.');
      return;
    }

    if (mode === 'register' && !name) {
      setLocalError('Please specify your profile name.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    setIsInFlight(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }

      // Success! Redirect
      if (isCheckoutRedirect) {
        navigate('/cart');
      } else {
        navigate('/menu');
      }
    } catch {
      // Error is stored inside global AuthContext, we show it below
    } finally {
      setIsInFlight(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[4px] border border-brand-border overflow-hidden p-6 sm:p-10 shadow-none animate-fade-in"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-brand-primary rounded-[2px]" />
            <span className="font-display text-2xl font-black text-brand-ink tracking-tight uppercase">ITALIA</span>
          </div>
          <h2 className="text-xl font-display font-bold text-brand-ink tracking-tight mt-1 uppercase">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed font-sans max-w-xs mx-auto">
            {mode === 'login'
              ? 'Sign in to access your culinary order favorites and checkout history.'
              : 'Join across 30 seconds for direct express pizza delivery tracking.'}
          </p>
        </div>

        {/* Auth redirects alert header */}
        {isCheckoutRedirect && (
          <div className="flex items-start gap-2 p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-[2px] text-[11px] text-stone-800 leading-tight mb-6">
            <ShieldAlert className="w-4 h-4 shrink-0 text-brand-primary mt-0.5" />
            <span>
              <strong>Note:</strong> You must authenticate before continuing checkout processing. After success, we will return you directly back to your shopping tray.
            </span>
          </div>
        )}

        {/* Global error handler boxes */}
        {(localError || authError) && (
          <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-[2px] mb-6 text-xs text-brand-primary font-semibold font-mono leading-relaxed">
            Error: {localError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register Name */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
                Your Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Giovanni Rossi"
                  className="w-full pl-11 pr-4 py-3 bg-brand-bg rounded-[4px] border border-brand-border focus:border-brand-ink focus:bg-white text-sm outline-none transition-all placeholder:text-stone-400 font-mono"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex. giovanni@example.it"
                className="w-full pl-11 pr-4 py-3 bg-brand-bg rounded-[4px] border border-brand-border focus:border-brand-ink focus:bg-white text-sm outline-none transition-all placeholder:text-stone-400 font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 flex justify-between">
              <span>Password</span>
              {mode === 'register' && <span className="text-[9px] text-stone-400 font-normal">Min. 8 chars</span>}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-brand-bg rounded-[4px] border border-brand-border focus:border-brand-ink focus:bg-white text-sm outline-none transition-all placeholder:text-stone-400 font-mono"
              />
            </div>
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={isInFlight}
            className="w-full py-3.5 bg-brand-ink hover:bg-brand-primary text-white rounded-[4px] font-mono font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 group transition-all mt-6 cursor-pointer"
          >
            {mode === 'login' ? (
              <LogIn className="w-3.5 h-3.5 text-stone-300" />
            ) : (
              <UserPlus className="w-3.5 h-3.5 text-stone-300" />
            )}
            {isInFlight ? 'Processing Securely...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode Area */}
        <div className="mt-8 text-center border-t border-brand-border pt-6">
          <p className="text-xs text-stone-500 font-sans">
            {mode === 'login' ? "Don't have an Italia account yet?" : "Already registered with Italia?"}
            <button
              onClick={handleToggleMode}
              className="text-brand-primary hover:text-brand-hover font-mono font-bold uppercase tracking-widest text-[10px] ml-1.5 transition-colors underline bg-transparent border-none cursor-pointer"
            >
              {mode === 'login' ? 'Register Now' : 'Sign In instead'}
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
