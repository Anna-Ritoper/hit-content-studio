import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

// Shared team password. Overridable via VITE_APP_PASSWORD at build time.
const TEAM_PASSWORD =
  (import.meta as any).env?.VITE_APP_PASSWORD || 'hit2026';
const STORAGE_KEY = 'hit-studio-gate-ok';

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === TEAM_PASSWORD) {
      setUnlocked(true);
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === TEAM_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, pwd);
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-brand-bordeaux flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-bordeaux/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-brand-bordeaux" />
          </div>
        </div>
        <h1 className="font-headline text-2xl text-brand-bordeaux text-center mb-2">
          HIT Content Studio
        </h1>
        <p className="text-sm text-brand-navy/60 text-center mb-8">
          Internal tool for the EDHEC Chaire Management in Innovative Health team.
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="input-label">Team password</label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoFocus
              className={`input-field ${error ? 'border-brand-coral' : ''}`}
              placeholder="Enter password"
            />
            {error && (
              <p className="text-xs text-brand-coral mt-2">Incorrect password.</p>
            )}
          </div>
          <button type="submit" className="btn-primary w-full">
            Unlock
          </button>
        </form>
      </motion.div>
    </div>
  );
}
