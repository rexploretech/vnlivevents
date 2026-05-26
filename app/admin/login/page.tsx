'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Google "G" SVG logo
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push('/admin/events');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account already exists with this email. Please sign in instead.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push('/admin/events');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // user dismissed the popup — not really an error
      } else {
        setError(err.message || 'Google sign-in failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0008] relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/6 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#C2637A]/5 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-sm mx-4"
      >
        {/* Card */}
        <div className="bg-[#120a10]/90 backdrop-blur-xl border border-[#C9A84C]/12 rounded-2xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

          {/* Logo mark */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-[1px] bg-[#C9A84C]/50 mb-6" />
            <h1 className="font-cinzel text-2xl text-[#C9A84C] tracking-widest uppercase mb-1">
              VN Live
            </h1>
            <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Admin Panel</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-red-900/20 border border-red-500/30 text-red-300 text-xs rounded-lg text-center leading-relaxed"
            >
              {error}
            </motion.div>
          )}

          {/* ── Google Sign-In ── */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
            ) : (
              <GoogleLogo />
            )}
            <span className="text-sm font-medium text-white/80">
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] uppercase tracking-widest text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* ── Email / Password form ── */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                Email
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 focus:border-[#C9A84C]/50 focus:outline-none transition-colors"
                required
                minLength={6}
              />
            </div>

            <button
              id="email-signin-btn"
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#C9A84C,#a8852e)', color: '#0d0008' }}
            >
              {loading
                ? (isSignUp ? 'Creating...' : 'Signing in...')
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </button>
          </form>

          {/* Toggle sign up / sign in */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-[11px] text-white/30 hover:text-[#C9A84C] transition-colors uppercase tracking-widest"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>

          <div className="mt-6 h-px bg-white/5" />
          <p className="mt-4 text-center text-[10px] text-white/15 uppercase tracking-widest">
            Authorized access only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
