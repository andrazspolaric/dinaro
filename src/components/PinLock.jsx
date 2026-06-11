import { useState } from 'react';

// ─── PIN LOCK ───────────────────────────────────────────────────────────────
// Only active on production (Vercel). Has no effect on localhost dev server.
// To remove: delete this file and remove <PinLock> from App.jsx.
// To change PIN: update the value below.
const PIN = '2505';
// ────────────────────────────────────────────────────────────────────────────

const IS_PROD = import.meta.env.PROD;
const SESSION_KEY = 'dinaro_unlocked';

export default function PinLock({ children }) {
  const [unlocked, setUnlocked] = useState(
    !IS_PROD || sessionStorage.getItem(SESSION_KEY) === '1'
  );
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (unlocked) return children;

  function handleSubmit(e) {
    e.preventDefault();
    if (input === PIN) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 1000);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#044352',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 32,
    }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 24, color: 'white', letterSpacing: '0.02em' }}>
        Dinaro
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <input
          type="password"
          inputMode="numeric"
          placeholder="Enter PIN"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 20, letterSpacing: '0.3em',
            textAlign: 'center',
            width: 160, padding: '14px 16px',
            borderRadius: 12, border: error ? '2px solid #ff6b6b' : '2px solid rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: 'white', outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        {error && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#ff6b6b' }}>Incorrect PIN</p>
        )}
        <button type="submit" style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15,
          color: '#044352', backgroundColor: 'white',
          border: 'none', borderRadius: 40, padding: '12px 32px',
          cursor: 'pointer',
        }}>
          Unlock
        </button>
      </form>
    </div>
  );
}
