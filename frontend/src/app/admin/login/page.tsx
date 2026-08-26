'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Sparkles, ArrowLeft, Eye, EyeOff, ShieldCheck, AlertCircle, User } from 'lucide-react';
import api from '@/lib/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post(
        '/auth/login',
        { username: username.trim(), password: password.trim() },
      );
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      router.push('/admin/events');
    } catch (err: any) {
      if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK' || !err.response) {
        setError('Nelze se připojit k backend serveru. Zkontrolujte síťové připojení.');
      } else {
        setError(err.response?.data?.message || 'Nesprávné uživatelské jméno nebo heslo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600;700&display=swap');

        .login-bg {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background-color: #ffffff;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Ambient glows */
        .login-bg::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -100px;
          width: 560px;
          height: 560px;
          background: radial-gradient(circle, rgba(255, 218, 229, 0.5) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-bg::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -80px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(255, 234, 210, 0.45) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Scattered starburst icons */
        .star {
          position: absolute;
          pointer-events: none;
          font-size: 18px;
          color: #f0c4d0;
          opacity: 0.7;
          animation: starPulse 3s ease-in-out infinite;
        }
        .star:nth-child(2) { animation-delay: 0.7s; font-size: 14px; }
        .star:nth-child(3) { animation-delay: 1.4s; font-size: 22px; }
        .star:nth-child(4) { animation-delay: 0.3s; font-size: 12px; }
        .star:nth-child(5) { animation-delay: 2s; font-size: 16px; }

        @keyframes starPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.15); }
        }

        /* Bottom-left 'N' icon */
        .corner-icon {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 36px;
          height: 36px;
          background: #F5D6DF;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #c87c94;
          letter-spacing: -1px;
          opacity: 0.7;
        }

        /* Card wrapper — provides z-stacking context for the overlapping logo */
        .card-wrapper {
          position: relative;
          width: 100%;
          max-width: 440px;
          z-index: 1;
        }

        /* The overlapping circular logo badge */
        .logo-badge {
          position: absolute;
          top: -36px;
          left: -28px;
          z-index: 10;
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: #FDEDF2;
          border: 3px solid #f5d6df;
          box-shadow: 0 6px 20px rgba(228, 180, 195, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          overflow: hidden;
        }

        /* The white card */
        .card {
          background: #ffffff;
          border-radius: 20px;
          padding: 52px 40px 36px;
          box-shadow: 0 8px 40px rgba(210, 160, 175, 0.18), 0 2px 8px rgba(0,0,0,0.04);
          border: 1px solid rgba(245, 214, 223, 0.5);
          position: relative;
        }

        /* Typography */
        .card-title {
          font-family: 'Great Vibes', cursive;
          font-size: 46px;
          font-weight: 400;
          color: #1a1a1a;
          text-align: center;
          line-height: 1.1;
          margin: 0 0 4px;
        }

        .card-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: #aaaaaa;
          text-align: center;
          margin: 0 0 28px;
        }

        /* Error banner */
        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #fff0f0;
          border: 1px solid #fca5a5;
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 20px;
          font-size: 12px;
          color: #dc2626;
          line-height: 1.4;
        }

        /* Form */
        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555555;
          margin-bottom: 7px;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon-left {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #d4a0b0;
          pointer-events: none;
          display: flex;
        }

        .input-icon-right {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #cccccc;
          cursor: pointer;
          display: flex;
          padding: 4px;
          background: none;
          border: none;
          transition: color 0.2s;
        }

        .input-icon-right:hover { color: #888; }

        .form-input {
          width: 100%;
          background: #FFF5F7;
          border: 1.5px solid #f5d6df;
          border-radius: 12px;
          padding: 11px 42px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #333333;
          text-align: center;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: #ccbbbb;
          text-align: center;
        }

        .form-input:focus {
          border-color: #c5a059;
          background: #fffaf5;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          margin-top: 22px;
          background: #C5A059;
          color: #000000;
          border: none;
          border-radius: 50px;
          padding: 14px 20px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.1s;
          box-shadow: 0 4px 16px rgba(197, 160, 89, 0.3);
        }

        .submit-btn:hover { background: #b8924d; }
        .submit-btn:active { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Card footer */
        .card-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #f0e8eb;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
        }

        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: #bbbbbb;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-link:hover { color: #888888; }
      `}</style>

      <div className="login-bg">
        {/* Atmospheric starburst icons */}
        <span className="star" style={{ top: '10%', left: '14%' }}>✦</span>
        <span className="star" style={{ top: '8%', right: '18%' }}>✦</span>
        <span className="star" style={{ top: '45%', right: '8%' }}>✧</span>
        <span className="star" style={{ bottom: '18%', left: '22%' }}>✦</span>
        <span className="star" style={{ bottom: '12%', right: '14%' }}>✧</span>

        {/* Bottom-left brand corner mark */}
        <div className="corner-icon">M</div>

        {/* Card wrapper */}
        <motion.div
          className="card-wrapper"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Overlapping circular logo badge */}
          <div className="logo-badge">
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src="/logo-flower.png"
                alt="Mirka Pokorná"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* White card */}
          <div className="card">
            {/* Title block */}
            <div style={{ marginBottom: '24px', marginTop: '4px' }}>
              <h1 className="card-title">Správa obsahu</h1>
              <p className="card-subtitle">MIRKAPOKORNA.CZ · ADMINISTRACE</p>
            </div>

            {/* Error box */}
            {error && (
              <motion.div
                className="error-box"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">UŽIVATELSKÉ JMÉNO</label>
                <div className="input-wrap">
                  <span className="input-icon-left">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Mirka Pokorna"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">HESLO</label>
                <div className="input-wrap">
                  <span className="input-icon-left">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner" />
                    PŘIHLAŠOVÁNÍ...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    VSTOUPIT DO ADMINISTRACE
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="card-footer">
              <Link href="/" className="footer-link">
                <ArrowLeft size={13} />
                Zpět na veřejný web mirkapokorna.cz
              </Link>
              <span className="footer-link">
                <ShieldCheck size={13} />
                Zabezpečená administrace s JWT šifrováním
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
