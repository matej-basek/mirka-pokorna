'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, BarChart2, Target, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

type CookieState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookies, setCookies] = useState<CookieState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('mirka_cookie_consent');
    if (!consent) {
      // Malé zpoždění, aby se banner zobrazil poté, co se stránka načte
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const saveConsent = (granted: CookieState) => {
    localStorage.setItem('mirka_cookie_consent', JSON.stringify(granted));
    setShow(false);
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
  const rejectOptional = () => saveConsent({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => saveConsent(cookies);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Subtle light backdrop so main page is clearly visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.08)',
              zIndex: 9000,
            }}
            onClick={rejectOptional}
          />

          {/* Bottom Flexbox Container */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9001,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '16px 16px 20px',
              pointerEvents: 'none',
            }}
          >
            {/* Banner near bottom edge */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{
                width: '100%',
                maxWidth: '520px',
                pointerEvents: 'auto',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: '1px solid rgba(228,180,195,0.4)',
                boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.12), 0 4px 20px rgba(228,180,195,0.25)',
                overflow: 'hidden',
                fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
              }}
            >
            {/* Top gradient accent */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #e4b4c3, #c5a059, #ffb7c5)',
            }} />

            <div style={{ padding: '22px 24px 20px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #fdedf2, #f5d6df)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(228,180,195,0.4)',
                    flexShrink: 0,
                  }}>
                    <Cookie size={18} color="#c87c94" />
                  </div>
                  <div>
                    <h4 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1e293b',
                      fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
                    }}>
                      Nastavení soukromí
                    </h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#aaaaaa', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                      Cookies & Ochrana dat
                    </p>
                  </div>
                </div>
                <button
                  onClick={rejectOptional}
                  aria-label="Odmítnout a zavřít"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#cccccc', padding: '6px', borderRadius: '8px',
                    display: 'flex', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#888')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '13px', color: 'rgba(17,17,17,0.65)',
                lineHeight: 1.65, margin: '0 0 16px',
              }}>
                Tento web používá soubory cookies pro zajištění správné funkčnosti, analýzu návštěvnosti a personalizaci obsahu. Vaše soukromí je pro nás důležité.
              </p>

              {/* Expandable details */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      {/* Necessary */}
                      <CookieRow
                        icon={<Shield size={15} color="#c87c94" />}
                        title="Nezbytné cookies"
                        description="Zajišťují základní funkčnost webu (přihlášení, formuláře). Nelze vypnout."
                        checked={true}
                        disabled={true}
                        onChange={() => {}}
                      />
                      {/* Analytics */}
                      <CookieRow
                        icon={<BarChart2 size={15} color="#c5a059" />}
                        title="Analytické cookies"
                        description="Pomáhají nám pochopit, jak návštěvníci používají web (Google Analytics)."
                        checked={cookies.analytics}
                        disabled={false}
                        onChange={(v) => setCookies(p => ({ ...p, analytics: v }))}
                      />
                      {/* Marketing */}
                      <CookieRow
                        icon={<Target size={15} color="#e8957a" />}
                        title="Marketingové cookies"
                        description="Umožňují zobrazení personalizovaných reklam a obsahu na jiných stránkách."
                        checked={cookies.marketing}
                        disabled={false}
                        onChange={(v) => setCookies(p => ({ ...p, marketing: v }))}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle details */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '12px', color: '#c87c94', fontWeight: 600,
                  padding: '0', marginBottom: '16px',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showDetails ? 'Skrýt podrobnosti' : 'Upravit nastavení'}
              </button>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Reject / Save custom */}
                <button
                  onClick={showDetails ? saveCustom : rejectOptional}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: '1.5px solid #f5d6df',
                    color: '#555555',
                    borderRadius: '50px',
                    padding: '11px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'border-color 0.2s, color 0.2s',
                    letterSpacing: '0.3px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#c87c94';
                    e.currentTarget.style.color = '#c87c94';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#f5d6df';
                    e.currentTarget.style.color = '#555555';
                  }}
                >
                  {showDetails ? 'Uložit výběr' : 'Pouze nezbytné'}
                </button>

                {/* Accept all */}
                <button
                  onClick={acceptAll}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #e4b4c3, #c5a059)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '50px',
                    padding: '11px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: '0 4px 16px rgba(228,180,195,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    letterSpacing: '0.3px',
                    transition: 'opacity 0.2s, transform 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                  onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <Check size={14} />
                  Přijmout vše
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>
      )}
    </AnimatePresence>
  );
}

/* Cookie row toggle component */
function CookieRow({
  icon, title, description, checked, disabled, onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      background: '#fdfafb',
      borderRadius: '14px',
      padding: '12px 14px',
      border: '1px solid rgba(228,180,195,0.25)',
    }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px',
        background: 'rgba(228,180,195,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: '#111111' }}>{title}</p>
        <p style={{ margin: 0, fontSize: '11.5px', color: '#999999', lineHeight: 1.5 }}>{description}</p>
      </div>
      {/* Toggle switch */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          width: '42px', height: '24px',
          borderRadius: '12px',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: checked
            ? 'linear-gradient(135deg, #e4b4c3, #c5a059)'
            : 'rgba(0,0,0,0.12)',
          position: 'relative',
          transition: 'background 0.3s',
          padding: 0,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '18px', height: '18px',
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.25s ease',
          display: 'block',
        }} />
      </button>
    </div>
  );
}
