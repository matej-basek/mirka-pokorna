'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Send, CheckCircle2, XCircle, FileText, Instagram, Facebook } from 'lucide-react';
import axios from 'axios';
import { getApiBaseUrl } from '@/lib/baseUrl';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('loading');
    setErrorMsg('');
    try {
      const apiUrl = getApiBaseUrl();
      const res = await axios.post(`${apiUrl}/contact`, form);
      if (res.data && res.data.success !== false) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(res.data?.message || 'Chyba při odesílání zprávy. Zkuste to prosím znovu.');
      }
    } catch (err: any) {
      console.error('Chyba při odesílání formuláře:', err);
      setStatus('error');
      setErrorMsg(
        err.response?.data?.message ||
        'Nepodařilo se připojit k serveru. Zkontrolujte připojení nebo to zkuste znovu.'
      );
    }
  };

  return (
    <section id="kontakt" className="section" style={{ paddingBottom: '100px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#111',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Napište mi
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Kontakt & Rezervace</span>
          </h2>
          <div className="gradient-line" style={{ margin: '16px auto 0' }} />
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* Left – Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass glass-hover" style={{ borderRadius: '24px', padding: '36px' }}>
              <h3
                style={{
                  fontFamily: '"Outfit", "Inter", sans-serif',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  marginBottom: '28px',
                  color: '#111',
                }}
              >
                Kontaktní údaje
              </h3>
              {[
                {
                  icon: <User size={20} />,
                  label: 'Jméno',
                  value: 'Mirka Pokorná',
                },
                {
                  icon: <FileText size={20} />,
                  label: 'IČO',
                  value: '21632448',
                },
                {
                  icon: <Phone size={20} />,
                  label: 'Telefon',
                  value: '+420 775 255 789',
                  href: 'tel:+420775255789',
                },
                {
                  icon: <Mail size={20} />,
                  label: 'E-mail',
                  value: 've.smiru@seznam.cz',
                  href: 'mailto:ve.smiru@seznam.cz',
                },
                {
                  icon: <Instagram size={20} />,
                  label: 'Instagram',
                  value: '@vesmiru_',
                  href: 'https://www.instagram.com/vesmiru_/',
                  target: '_blank',
                },
                {
                  icon: <Facebook size={20} />,
                  label: 'Facebook',
                  value: 'Mirka Pokorná',
                  href: 'https://www.facebook.com/profile.php?id=61560386386160',
                  target: '_blank',
                },
                {
                  icon: <MapPin size={20} />,
                  label: 'Lokace',
                  value: 'Zábřeh',
                },
              ].map(({ icon, label, value, href, target }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '22px',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(228, 180, 195,0.3), rgba(245,214,223,0.2))',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0,
                      color: '#e4b4c3',
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(17, 17, 17,0.45)',
                        marginBottom: '3px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        target={target}
                        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                        style={{
                          color: '#111111',
                          textDecoration: 'none',
                          fontSize: '15px',
                          fontWeight: 500,
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#c87c94')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#111111')}
                      >
                        {value}
                      </a>
                    ) : (
                      <span style={{ color: '#111', fontSize: '15px', fontWeight: 500 }}>
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="glass glass-hover" style={{ borderRadius: '24px', padding: '36px' }}>
              <h3
                style={{
                  fontFamily: '"Outfit", "Inter", sans-serif',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  marginBottom: '28px',
                  color: '#111',
                }}
              >
                Kontaktní formulář
              </h3>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'rgba(17, 17, 17,0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    Jméno a příjmení *
                  </label>
                  <input
                    className="glass-input"
                    type="text"
                    placeholder="Vaše jméno"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'rgba(17, 17, 17,0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    E-mailová adresa *
                  </label>
                  <input
                    className="glass-input"
                    type="email"
                    placeholder="vas@email.cz"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'rgba(17, 17, 17,0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    Telefonní číslo (nepovinné)
                  </label>
                  <input
                    className="glass-input"
                    type="tel"
                    placeholder="+420 775 255 789"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'rgba(17, 17, 17,0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    Zpráva *
                  </label>
                  <textarea
                    className="glass-input"
                    placeholder="Napište svou zprávu..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    style={{ resize: 'vertical', minHeight: '120px' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'loading'}
                  style={{
                    marginTop: '8px',
                    opacity: status === 'loading' ? 0.7 : 1,
                  }}
                >
                  {status === 'loading' ? (
                    '⏳ Odesílám...'
                  ) : (
                    <>
                      <Send size={18} /> Odeslat zprávu
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#15803d',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <CheckCircle2 size={16} /> Zpráva byla úspěšně odeslána! Brzy se vám ozvu.
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#b91c1c',
                      fontSize: '14px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <XCircle size={16} /> {errorMsg || 'Chyba při odesílání zprávy. Zkuste to prosím znovu.'}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            textAlign: 'center',
            marginTop: '60px',
            color: 'rgba(17, 17, 17,0.4)',
            fontSize: '13px',
          }}
        >
          © {new Date().getFullYear()} Mirka Pokorná · IČO: 21632448 · mirkapokorna.cz · Web vytvořil Matěj Bašek
        </motion.div>
      </div>
    </section>
  );
}


