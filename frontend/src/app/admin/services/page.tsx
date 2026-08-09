'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  EyeOff,
  Sparkles,
  Upload,
  GripVertical,
  Flower2,
  Music,
  Smile,
  Heart,
  Star,
} from 'lucide-react';
import api from '@/lib/api';

type IconKey = 'flower' | 'music' | 'smile' | 'heart' | 'star';

interface ServiceItem {
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

const ICON_OPTIONS: { key: IconKey; label: string; component: React.ElementType }[] = [
  { key: 'flower', label: 'Květ', component: Flower2 },
  { key: 'music', label: 'Hudba', component: Music },
  { key: 'smile', label: 'Úsměv', component: Smile },
  { key: 'heart', label: 'Srdce', component: Heart },
  { key: 'star', label: 'Hvězda', component: Star },
];

function getIconComponent(key: IconKey): React.ElementType {
  return ICON_OPTIONS.find((o) => o.key === key)?.component ?? Flower2;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [benefitInput, setBenefitInput] = useState('');
  const benefitInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    benefits: [] as string[],
    icon: 'flower' as IconKey,
    active: true,
    order: 0,
  });

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const backendOrigin = apiUrl.replace(/\/api\/?$/, '');
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      console.error('Chyba při načítání služeb', err);
    } finally {
      setLoading(false);
    }
  };

  const blankForm = () => ({
    title: '',
    subtitle: '',
    description: '',
    benefits: [] as string[],
    icon: 'flower' as IconKey,
    active: true,
    order: services.length,
  });

  const openAddModal = () => {
    setEditingService(null);
    setImageFile(null);
    setImagePreviewUrl(null);
    setBenefitInput('');
    setFormData(blankForm());
    setShowModal(true);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setImageFile(null);
    setImagePreviewUrl(null);
    setBenefitInput('');
    setFormData({
      title: s.title,
      subtitle: s.subtitle || '',
      description: s.description,
      benefits: [...s.benefits],
      icon: s.icon || 'flower',
      active: s.active,
      order: s.order ?? 0,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('description', formData.description);
      data.append('benefits', JSON.stringify(formData.benefits));
      data.append('icon', formData.icon);
      data.append('active', String(formData.active));
      data.append('order', String(formData.order));
      if (imageFile) data.append('image', imageFile);

      if (editingService) {
        await api.put(`/services/${editingService._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/services', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      fetchServices();
      setShowModal(false);
      setEditingService(null);
      setImageFile(null);
      setImagePreviewUrl(null);
    } catch (err) {
      console.error('Chyba při ukládání služby', err);
      alert('Došlo k chybě při ukládání služby.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Opravdu chcete smazat tuto službu?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error('Chyba při mazání služby', err);
        alert('Došlo k chybě při mazání.');
      }
    }
  };

  const addBenefit = () => {
    const val = benefitInput.trim();
    if (!val) return;
    setFormData((f) => ({ ...f, benefits: [...f.benefits, val] }));
    setBenefitInput('');
    benefitInputRef.current?.focus();
  };

  const removeBenefit = (idx: number) => {
    setFormData((f) => ({ ...f, benefits: f.benefits.filter((_, i) => i !== idx) }));
  };

  const filteredServices = services.filter((s) => {
    const matchesFilter =
      filterTab === 'all' ? true : filterTab === 'active' ? s.active : !s.active;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.subtitle && s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const activeCount = services.filter((s) => s.active).length;
  const hiddenCount = services.length - activeCount;

  return (
    <div className="space-y-6 font-sans text-slate-900" style={{ fontFamily: '"Outfit", "Inter", system-ui, -apple-system, sans-serif' }}>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight not-italic"
            style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif', fontWeight: 700 }}>
            Služby & Témata
          </h1>
          <p className="text-base text-slate-500 font-medium mt-1">
            Správa karet v sekci &quot;Služby &amp; Hlavní témata&quot; na webu.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2.5 bg-[#ba6d86] text-white hover:bg-[#a05a70] font-bold px-6 py-3 rounded-xl text-base transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Přidat novou službu</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100/80 p-2 rounded-xl border border-slate-200/60 overflow-x-auto">
          {(['all', 'active', 'hidden'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'all' && <>Všechny <span className="ml-1.5 text-sm text-slate-500 font-bold">({services.length})</span></>}
              {tab === 'active' && <>Aktivní <span className="ml-1.5 text-sm text-emerald-700 font-bold">({activeCount})</span></>}
              {tab === 'hidden' && <>Skryté <span className="ml-1.5 text-sm text-slate-500 font-bold">({hiddenCount})</span></>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80 lg:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Hledat službu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '3rem', paddingRight: '2.5rem' }}
              className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#ba6d86] focus:ring-2 focus:ring-[#ba6d86]/15 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-base font-bold cursor-pointer">✕</button>
            )}
          </div>
          <div className="flex items-center bg-slate-100/80 p-2 rounded-xl border border-slate-200/60 shrink-0">
            <button onClick={() => setViewMode('table')} className={`p-2.5 rounded-lg transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`} title="Tabulkový pohled">
              <TableIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`} title="Karetní pohled">
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm font-medium">
          Načítání služeb...
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Žádné služby nenalezeny</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `Pro výraz "${searchQuery}" nebyly nalezeny žádné výsledky.`
              : 'Zatím nejsou přidány žádné služby. Klikněte na "Přidat novou službu".'}
          </p>
        </div>
      ) : viewMode === 'table' ? (

        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 min-w-[240px]">NÁZEV & PODTITULEK</th>
                  <th className="py-3.5 px-4 min-w-[220px]">POPIS</th>
                  <th className="py-3.5 px-4 min-w-[80px]">IKONA</th>
                  <th className="py-3.5 px-4 min-w-[80px]">POŘADÍ</th>
                  <th className="py-3.5 px-4 min-w-[100px]">STATUS</th>
                  <th className="py-3.5 px-4 text-right min-w-[120px]">AKCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredServices.map((service) => {
                  const Icon = getIconComponent(service.icon);
                  return (
                    <tr key={service._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-[#ba6d86]" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 text-sm block group-hover:text-[#ba6d86] transition-colors not-italic" style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif' }}>
                              {service.title}
                            </span>
                            {service.subtitle ? (
                              <span className="text-[11px] font-semibold text-[#ba6d86] block not-italic" style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif' }}>
                                {service.subtitle}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 block italic">bez podtitulku</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[280px]">
                        <p className="text-xs leading-relaxed">{service.description || '—'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 capitalize">{service.icon}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">{service.order}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold not-italic ${
                          service.active
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`} style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif' }}>
                          {service.active ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                          {service.active ? 'Aktivní' : 'Skrytá'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEditModal(service)} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer" title="Upravit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(service._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer" title="Smazat">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs font-semibold text-slate-500 flex justify-between items-center">
            <span>Zobrazeno {filteredServices.length} z celkem {services.length} služeb</span>
          </div>
        </div>
      ) : (

        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const Icon = getIconComponent(service.icon);
            return (
              <div key={service._id} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col overflow-hidden">
                {/* Image or icon */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-b border-slate-100 p-6 flex items-center justify-center min-h-[100px] relative">
                  {service.imageUrl ? (
                    <img src={getImageUrl(service.imageUrl)} alt="" className="max-h-24 max-w-full object-contain rounded-lg" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#ba6d86]" />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm not-italic ${
                      service.active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'
                    }`} style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif' }}>
                      {service.active ? 'Aktivní' : 'Skrytá'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base not-italic" style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif' }}>{service.title}</h3>
                    {service.subtitle && (
                      <p className="text-xs font-semibold text-[#ba6d86] leading-snug not-italic" style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif' }}>{service.subtitle}</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 flex-1 leading-relaxed pt-1">{service.description}</p>
                  {service.benefits.length > 0 && (
                    <div className="pt-2 space-y-1">
                      {service.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba6d86] shrink-0 mt-[5px]" />
                          <span className="flex-1 leading-normal">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', marginTop: '8px' }}>
                    <button onClick={() => openEditModal(service)} className="text-xs font-semibold text-slate-700 hover:text-black cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors">
                      Upravit
                    </button>
                    <button onClick={() => handleDelete(service._id)} className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition-colors">
                      Smazat
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full sm:max-w-xl md:max-w-2xl shadow-2xl border-0 sm:border border-slate-200 relative my-0 sm:my-8 flex flex-col h-[95dvh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl p-5 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 shrink-0">
              <div>
                <h3
                  className="text-xl font-bold text-slate-900 tracking-tight not-italic"
                  style={{ fontFamily: '"Outfit", "Inter", system-ui, -apple-system, sans-serif', fontWeight: 700, fontStyle: 'normal' }}
                >
                  {editingService ? 'Úprava služby' : 'Přidat novou službu'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Karta se zobrazí v sekci &quot;Služby &amp; Hlavní témata&quot; na webu.
                </p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Název */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }} className="text-slate-700">
                  Název služby *
                </label>
                <input
                  type="text" required
                  placeholder="např. Ženský kruh"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              {/* Podtitulek */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }} className="text-slate-700">
                  Podtitulek (krátký popisek)
                </label>
                <input
                  type="text"
                  placeholder="např. Bezpečné sdílení, uvolnění a sounáležitost"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              {/* Popis */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }} className="text-slate-700">
                  Popis *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailní popis služby..."
                  value={formData.description}
                  ref={(el) => {
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = `${Math.max(100, el.scrollHeight + 4)}px`;
                    }
                  }}
                  onInput={(e) => {
                    const target = e.currentTarget;
                    target.style.height = 'auto';
                    target.style.height = `${Math.max(100, target.scrollHeight + 4)}px`;
                  }}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86] resize-y"
                />
              </div>

              {/* Ikona + Pořadí */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }} className="text-slate-700">
                    Ikona
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {ICON_OPTIONS.map(({ key, label, component: Ic }) => (
                      <button
                        key={key}
                        type="button"
                        title={label}
                        onClick={() => setFormData({ ...formData, icon: key })}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                          formData.icon === key
                            ? 'border-[#ba6d86] bg-pink-50 text-[#ba6d86]'
                            : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <Ic className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }} className="text-slate-700">
                    Pořadí
                  </label>
                  <input
                    type="number" min={0}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                    className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                  />
                </div>
              </div>

              {/* Výhody / body */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }} className="text-slate-700">
                  Výhody / body programu
                </label>
                <div className="space-y-2 mb-2">
                  {formData.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800">
                      <GripVertical className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="flex-1">{b}</span>
                      <button type="button" onClick={() => removeBenefit(idx)} className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    ref={benefitInputRef}
                    type="text"
                    placeholder="Přidat bod..."
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                    style={{ padding: '0.6rem 0.875rem', borderRadius: '8px', border: '1px solid #ccc' }}
                    className="flex-1 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                  />
                  <button
                    type="button" onClick={addBenefit}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Přidat
                  </button>
                </div>
              </div>

              {/* Obrázek */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block' }} className="text-slate-700">
                  Fotka detail
                </label>
                {(imagePreviewUrl || editingService?.imageUrl) && (
                  <div style={{ maxHeight: '160px', marginBottom: '0.75rem', position: 'relative' }} className="w-full overflow-hidden bg-slate-50 rounded-lg border border-slate-200 p-2 flex items-center justify-center">
                    <img
                      src={imagePreviewUrl || getImageUrl(editingService?.imageUrl)}
                      alt="Preview"
                      style={{ objectFit: 'contain', borderRadius: '8px', maxWidth: '100%', maxHeight: '140px', width: 'auto', height: 'auto' }}
                    />
                    {imagePreviewUrl && (
                      <button type="button" onClick={() => setImageFile(null)} className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 text-xs shadow-md">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <input
                  type="file" accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#ba6d86] file:text-white hover:file:bg-[#a05a70] cursor-pointer"
                />
              </div>

              {/* Toggle viditelnosti */}
              <div
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }} className="block text-slate-900">
                    Zobrazovat veřejně na webu
                  </span>
                  <span className="block text-xs text-slate-500">
                    {formData.active ? 'Služba je viditelná pro návštěvníky' : 'Služba je skrytá'}
                  </span>
                </div>
                <div className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${formData.active ? 'bg-[#ba6d86]' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-xs transition-transform transform ${formData.active ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eaeaea' }}>
                <button
                  type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #ccc', fontWeight: 500 }}
                  className="text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#ba6d86', color: '#ffffff', fontWeight: 600, border: 'none' }}
                  className="text-sm hover:bg-[#a05a70] transition-colors cursor-pointer shadow-xs"
                >
                  {editingService ? 'Uložit změny' : 'Vytvořit službu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
