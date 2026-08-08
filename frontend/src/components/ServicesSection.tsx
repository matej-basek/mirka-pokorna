'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Music, Smile, Heart, Star, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';

type IconKey = 'flower' | 'music' | 'smile' | 'heart' | 'star';

interface ServiceData {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  imageUrl?: string;
  icon: IconKey;
  active: boolean;
  order: number;
}

function getIconComponent(key: IconKey) {
  const map: Record<IconKey, React.ElementType> = {
    flower: Flower2,
    music: Music,
    smile: Smile,
    heart: Heart,
    star: Star,
  };
  return map[key] ?? Flower2;
}

// Fallback statická data pokud API selže nebo je prázdné
const FALLBACK_SERVICES: ServiceData[] = [
  {
    _id: 'kruh',
    icon: 'flower',
    imageUrl: '/service-kruh.jpg',
    title: 'Ženský kruh',
    subtitle: 'Bezpečné sdílení, uvolnění a sounáležitost',
    description:
      'Prostor pro ženskou regeneraci, kde v bezpečí a bez hodnocení odkládáme masky a každodenní tlaky. Společně se ladíme na přirozený rytmus svého těla i duše skrz hluboký prožitek.',
    benefits: [
      'Meditace a zklidnění mysli',
      'Intuitivní tanec a vědomý pohyb',
      'Intuitivní zpěv a pasivní muzikoterapie',
    ],
    active: true,
    order: 0,
  },
  {
    _id: 'zpev',
    icon: 'music',
    imageUrl: '/service-zpev.jpg',
    title: 'Intuitivní zpěv',
    subtitle: 'Objevení přirozené síly a svobody vlastního hlasu',
    description:
      'Hlas je naším nejpřirozenějším nástrojem k uvolnění emocí a napětí. V laskavém a podporujícím prostoru probouzíme svou hlasovou autenticitu a radost ze spontánního zvukového projevu.',
    benefits: [
      'Společný intuitivní ženský zpěv',
      'Hra na jednoduché nástroje (perkuse)',
      'Uvolnění hlasového bloku a rezonance těla',
    ],
    active: true,
    order: 1,
  },
  {
    _id: 'ms',
    icon: 'smile',
    imageUrl: '/service-ms.jpg',
    title: 'Muzikoterapie pro MŠ',
    subtitle: 'Harmonizace, radost ze zvuků a práce s emocemi pro děti',
    description:
      'Hravé a empatické programy přizpůsobené na míru pro mateřské školy. Skrz hudbu, rytmus a akustické nástroje dětem pomáháme přirozeně objevovat svět zvuků i vlastních prožitků.',
    benefits: [
      'Aktivní i pasivní muzikoterapie',
      'Rozvoj emoční inteligence u dětí',
      'Zklidnění, koncentrace a podpora vnímání',
    ],
    active: true,
    order: 2,
  },
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [services, setServices] = useState<ServiceData[]>(FALLBACK_SERVICES);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${apiUrl}/services`)
      .then((res) => res.json())
      .then((data: ServiceData[]) => {
        if (Array.isArray(data)) {
          setServices(data.filter((s) => s.active));
        }
      })
      .catch(() => {
        setServices(FALLBACK_SERVICES);
      });
  }, []);

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/service-')) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const backendOrigin = apiUrl.replace(/\/api\/?$/, '');
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const displayedServices = services;

  return (
    <section id="sluzby" className="section">
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
            Čím vás mohu provést
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Služby &amp; Hlavní</span> témata
          </h2>
          <div className="gradient-line" style={{ margin: '16px auto 0' }} />
        </motion.div>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
          }}
        >
          {displayedServices.map((service, i) => {
            const Icon = getIconComponent(service.icon);
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass glass-hover"
                style={{
                  borderRadius: '24px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(228, 180, 195,0.3), rgba(245,214,223,0.2))',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#e4b4c3',
                      }}
                    >
                      <Icon size={26} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#e4b4c3' }}>
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="service-card-title" style={{ fontSize: '1.4rem', color: '#111', marginBottom: '8px' }}>
                    {service.title}
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#111', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    {service.subtitle}
                  </div>
                  <p style={{ color: 'rgba(17, 17, 17,0.75)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                    {service.description}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginBottom: '24px' }}>
                    {service.benefits.map((b, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(17, 17, 17,0.85)', marginBottom: '8px' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e4b4c3' }} />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedService(service)}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '16px', padding: '14px 22px', fontWeight: 600 }}
                >
                  <span>Zjistit více</span>
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Pop-up okno pro detail služby */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass modal-content"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid rgba(228, 180, 195, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(228, 180, 195, 0.25)',
              }}
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 text-black/50 hover:text-black transition-colors"
                aria-label="Zavřít"
              >
                <X size={28} />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                {selectedService.imageUrl ? (
                  <div style={{ position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 8px 24px rgba(228, 180, 195, 0.15)', display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(228, 180, 195, 0.05)' }}>
                    <Image 
                      src={getImageUrl(selectedService.imageUrl)} 
                      alt={selectedService.title} 
                      width={800} 
                      height={600} 
                      style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                    {(() => {
                      const Ic = getIconComponent(selectedService.icon);
                      return <div style={{ width: 80, height: 80, borderRadius: '24px', background: 'linear-gradient(135deg, rgba(228,180,195,0.3), rgba(245,214,223,0.2))', border: '1px solid rgba(228,180,195,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ba6d86' }}><Ic size={40} /></div>;
                    })()}
                  </div>
                )}
                <h3 style={{ fontSize: '2rem', color: '#111', marginBottom: '10px', lineHeight: 1.1 }}>{selectedService.title}</h3>
                <div style={{ color: '#111111', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {selectedService.subtitle}
                </div>
              </div>
              
              <p style={{ color: 'rgba(17, 17, 17,0.85)', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px', textAlign: 'center' }}>
                {selectedService.description}
              </p>
              
              <button
                onClick={() => {
                  setSelectedService(null);
                  setTimeout(() => document.querySelector('#akce')?.scrollIntoView({ behavior: 'smooth' }), 300);
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 600 }}
              >
                Mám zájem se přihlásit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
