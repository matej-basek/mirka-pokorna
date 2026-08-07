'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Building2, Globe, MessageSquare, Menu, X, LogOut, Loader2, Sparkles } from 'lucide-react';
import api from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    api.get('/auth/me')
      .then(() => setChecking(false))
      .catch(() => router.push('/admin/login'));
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  // Přihlašovací stránka — bez layoutu
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Auth check loading
  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#ba6d86] animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Ověřuji přihlášení...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/admin/events', label: 'Akce', icon: Calendar },
    { href: '/admin/studios', label: 'Studia & Rozvrh', icon: Building2 },
    { href: '/admin/services', label: 'Služby', icon: Sparkles },
    { href: '/admin/reviews', label: 'Recenze', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50/50 text-slate-900 selection:bg-[#ba6d86]/20 selection:text-[#ba6d86]">
      {/* Rose Brand Admin Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#ba6d86] via-[#a85b73] to-[#924b61] text-white border-b border-[#924b61]/80 shadow-md">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-20 sm:h-22 flex items-center justify-between gap-4">

          {/* Logo & Brand */}
          <Link href="/admin/events" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 relative flex items-center justify-center bg-white/15 backdrop-blur-md rounded-xl p-2 border border-white/25 group-hover:bg-white/25 transition-all shadow-xs">
              <Image src="/logo-flower.png" alt="Logo" width={40} height={40} className="object-contain brightness-0 invert" />
            </div>
            <div className="hidden sm:block">
              <span className="font-sans text-lg sm:text-xl font-bold text-white tracking-tight block leading-none">
                Mirka Pokorná
              </span>
              <span className="text-xs text-rose-100/90 font-semibold uppercase tracking-wider block mt-1">
                CMS Administrace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2.5 px-4 lg:px-5 py-3 text-sm sm:text-base transition-all ${
                    isActive
                      ? 'text-white font-extrabold'
                      : 'text-white/60 hover:text-white/90 font-semibold'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  {item.label}
                </Link>
              );
            })}

            <div className="h-6 w-[1px] bg-white/20 mx-2 lg:mx-3" />

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-4 lg:px-5 py-3 text-sm sm:text-base font-semibold text-white/70 hover:text-white transition-colors"
            >
              <Globe className="w-5 h-5 text-white/70" />
              <span className="hidden lg:inline">Zobrazit web</span>
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2.5 px-4 lg:px-5 py-3 text-sm sm:text-base font-semibold text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-white/70" />
              <span className="hidden lg:inline">Odhlásit</span>
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-white hover:bg-white/15 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/15 bg-[#823a4f] px-4 py-4 space-y-1.5 shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-base transition-all ${
                    isActive
                      ? 'text-white font-extrabold border-l-4 border-white pl-3'
                      : 'text-white/60 hover:text-white font-medium'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-white/15 flex gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white/80 hover:text-white"
              >
                <Globe className="w-4 h-4" />
                <span>Zobrazit web</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white/80 hover:text-white cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Odhlásit</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
