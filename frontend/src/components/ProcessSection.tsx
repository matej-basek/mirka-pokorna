'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Music2, SmilePlus } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      number: '1',
      icon: ShieldCheck,
      title: 'Bezpečný prostor',
      description:
        'Představ si místo, kde hned u vstupu ucítíš příjemnou vůni, hřejivé světlo svíček a hluboké přijetí. Společně se usadíme a naladíme na své tělo.',
    },
    {
      number: '2',
      icon: Music2,
      title: 'Prožitek a uvolnění',
      description:
        'Prostor zaplní vědomý tanec, rozezní hudba, muzikoterapeutické nástroje a intuitivní zpěv. Je to čas kdy Tvá mysl utichne a Tvá duše začne volně dýchat, tančit a zářit štěstím.',
    },
    {
      number: '3',
      icon: SmilePlus,
      title: 'Dotek ticha',
      description:
        'Až poslední tón jemně splyne s tichem, necháme tělo odpočívat v klidném bezčasí. Domů budeš odcházet jako znovuzrozená s úsměvem na rtech a lehkostí v každém kroku.',
    },
  ];

  return (
    <section id="jak-to-probiha" className="section">
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
            Průběh setkání
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Jak to</span> probíhá?
          </h2>
          <div className="gradient-line" style={{ margin: '16px auto 0' }} />
        </motion.div>

        {/* Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass glass-hover"
                style={{
                  borderRadius: '24px',
                  padding: '36px 28px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(228, 180, 195,0.35), rgba(245,214,223,0.25))',
                    border: '1px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e4b4c3',
                    marginBottom: '20px',
                    position: 'relative',
                  }}
                >
                  <Icon size={28} />
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#e4b4c3',
                      color: '#101f42',
                      fontSize: '11px',
                      fontWeight: 800,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#111', marginBottom: '12px' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'rgba(17, 17, 17,0.75)', fontSize: '14px', lineHeight: '1.7' }}>
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


