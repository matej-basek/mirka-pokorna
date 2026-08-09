'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  Tag,
  Eye,
  EyeOff,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Upload
} from 'lucide-react';
import api from '@/lib/api';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  registrationUrl?: string;
  date?: string;
  location?: string;
  mapsUrl?: string;
  price?: string;
  active: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Filters & Views
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    mapsUrl: '',
    price: '',
    registrationUrl: '',
    active: true,
  });

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const backendOrigin = apiUrl.replace(/\/api\/?$/, '');
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Chyba při načítání akcí', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setImageFile(null);
    setImagePreviewUrl(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      mapsUrl: '',
      price: '',
      registrationUrl: '',
      active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setImageFile(null);
    setImagePreviewUrl(null);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date || '',
      location: event.location || '',
      mapsUrl: event.mapsUrl || '',
      price: event.price || '',
      registrationUrl: event.registrationUrl || '',
      active: event.active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, String(value));
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, data);
      } else {
        await api.post('/events', data);
      }
      
      fetchEvents();
      setShowModal(false);
      setEditingEvent(null);
      setImageFile(null);
      setImagePreviewUrl(null);
    } catch (err) {
      console.error('Chyba při ukládání akce', err);
      alert('Došlo k chybě při ukládání akce.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Opravdu chcete smazat tuto akci?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        console.error('Chyba při mazání akce', err);
        alert('Došlo k chybě při mazání akce.');
      }
    }
  };

  // Filtered Events logic
  const filteredEvents = events.filter(event => {
    const matchesFilter =
      filterTab === 'all'
        ? true
        : filterTab === 'active'
        ? event.active
        : !event.active;

    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.date && event.date.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const activeCount = events.filter(e => e.active).length;
  const hiddenCount = events.length - activeCount;

  return (
    <div className="space-y-6 font-sans text-slate-900" style={{ fontFamily: '"Outfit", "Inter", system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. SaaS Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight not-italic"
            style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif', fontWeight: 700, fontStyle: 'normal' }}
          >
            Správa akcí
          </h1>
          <p className="text-base text-slate-500 font-medium mt-1">
            Přehled a správa plánovaných workshopů, tanců a kurzů.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2.5 bg-[#ba6d86] text-white hover:bg-[#a05a70] font-bold px-6 py-3 rounded-xl text-base transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Přidat novou akci</span>
        </button>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-2 rounded-xl border border-slate-200/60 overflow-x-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Všechny <span className="ml-1.5 text-sm text-slate-500 font-bold">({events.length})</span>
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterTab === 'active'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktivní <span className="ml-1.5 text-sm text-emerald-700 font-bold">({activeCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('hidden')}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterTab === 'hidden'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skryté <span className="ml-1.5 text-sm text-slate-500 font-bold">({hiddenCount})</span>
          </button>
        </div>

        {/* Search + View Switcher */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80 lg:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Hledat akci..."
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
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`} title="Karetový pohled">
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm font-medium">
          Načítání akcí...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 not-italic" style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700 }}>
            Žádné akce nebyly nalezeny
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `Pro výraz "${searchQuery}" nebyly nalezeny žádné výsledky.`
              : 'Zatím nejsou přidány žádné akce.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (

        /* LIST VIEW TABLE */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 min-w-[240px]">NÁZEV AKCE</th>
                  <th className="py-3.5 px-4 min-w-[160px]">DATUM & ČAS</th>
                  <th className="py-3.5 px-4 min-w-[160px]">MÍSTO KONÁNÍ</th>
                  <th className="py-3.5 px-4 min-w-[100px]">CENA</th>
                  <th className="py-3.5 px-4 min-w-[100px]">STATUS</th>
                  <th className="py-3.5 px-4 text-right min-w-[120px]">AKCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Title & Image Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 p-0.5">
                          {event.imageUrl ? (
                            <img src={getImageUrl(event.imageUrl)} alt="" className="max-w-full max-h-full object-contain rounded-md" />
                          ) : (
                            <Calendar className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <span
                            className="font-bold text-slate-900 text-sm block line-clamp-1 group-hover:text-[#ba6d86] transition-colors not-italic"
                            style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700, fontStyle: 'normal' }}
                          >
                            {event.title}
                          </span>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{event.date || 'Neurčeno'}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{event.location || 'Neurčena'}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {event.price || 'Neurčena'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          event.active
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {event.active ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                        {event.active ? 'Aktivní' : 'Skrytá'}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {event.registrationUrl && (
                          <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-500 hover:text-[#ba6d86] hover:bg-slate-100 rounded-md transition-colors"
                            title="Otevřít registrační formulář"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Upravit akci"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Smazat akci"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs font-semibold text-slate-500 flex justify-between items-center">
            <span>Zobrazeno {filteredEvents.length} z celkem {events.length} akcí</span>
          </div>
        </div>
      ) : (

        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Image Container with position: relative and 9:16 aspect ratio */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '9 / 16', maxHeight: '380px' }} className="bg-slate-50 border-b border-slate-100 p-0 overflow-hidden flex items-center justify-center">
                {event.imageUrl ? (
                  <img src={getImageUrl(event.imageUrl)} alt="" style={{ objectFit: 'cover', width: '100%', height: '100%' }} className="rounded-t-xl shadow-xs" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                    <Calendar className="w-8 h-8 opacity-40" />
                  </div>
                )}

                {/* Status Badge with position: absolute; top: 10px; right: 10px; */}
                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md ${
                      event.active
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {event.active ? 'Aktivní' : 'Skrytá'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3
                    className="font-bold text-slate-900 text-base line-clamp-1 not-italic"
                    style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700, fontStyle: 'normal' }}
                  >
                    {event.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#ba6d86] shrink-0" />
                      <span className="truncate">{event.date || 'Neurčeno'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#ba6d86] shrink-0" />
                      <span className="truncate">{event.location || 'Neurčeno'}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-900 pt-0.5">
                      <Tag className="w-3.5 h-3.5 text-[#ba6d86] shrink-0" />
                      <span>{event.price || 'Neurčena'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 pt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #eaeaea',
                    paddingTop: '12px',
                    marginTop: '12px'
                  }}
                >
                  <div>
                    {event.registrationUrl ? (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#ba6d86] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Formulář
                      </a>
                    ) : null}
                  </div>

                  {/* Actions div with display: flex; gap: 15px; */}
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button
                      onClick={() => openEditModal(event)}
                      className="text-xs font-semibold text-slate-700 hover:text-black cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- FORM MODAL WITH EXACT USER CSS SPECS --- */}
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
                  {editingEvent ? 'Úprava akce' : 'Přidat novou akci'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Vyplňte údaje akce pro zobrazení v kalendáři na webu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields with gap: 1.5rem */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Form Group: Title */}
              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Název akce *
                </label>
                <input
                  type="text"
                  required
                  placeholder="např. Večer intuitivního zpěvu a muzikoterapie"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              {/* Form Group: Description */}
              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Popis akce *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Zadejte detailní popis programu..."
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

              {/* Form Group: Date and Price Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                    className="text-slate-700"
                  >
                    Datum a čas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="15. Října 2026, 17:00 - 20:00"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                    className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                  />
                </div>

                <div>
                  <label
                    style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                    className="text-slate-700"
                  >
                    Cena *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="např. 1 200 Kč"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                    className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                  />
                </div>
              </div>

              {/* Form Group: Location */}
              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Místo konání *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Prostor Pro Tebe, Mánesova 54, Praha 2"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              {/* Form Group: Maps URL */}
              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Odkaz na mapy
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginLeft: '6px' }}>
                    (kliknutelná adresa v pop-up okně)
                  </span>
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={formData.mapsUrl}
                  onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              {/* Form Group: Registration URL */}
              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Odkaz na registrace (volitelné)
                </label>
                <input
                  type="url"
                  placeholder="https://forms.google.com/..."
                  value={formData.registrationUrl}
                  onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              {/* Form Group: Image Upload (PLAKÁT) */}
              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Plakát / Fotka (volitelné)
                </label>

                {/* Preview Container with 9:16 aspect ratio */}
                {(imagePreviewUrl || editingEvent?.imageUrl) && (
                  <div style={{ width: '100%', aspectRatio: '9 / 16', maxHeight: '320px', marginBottom: '1rem', position: 'relative' }} className="overflow-hidden bg-slate-50 rounded-lg border border-slate-200 p-0 flex items-center justify-center mx-auto">
                    <img
                      src={imagePreviewUrl || getImageUrl(editingEvent?.imageUrl)}
                      alt="Preview"
                      style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '8px' }}
                    />
                    {imagePreviewUrl && (
                      <button
                        type="button"
                        onClick={() => setImageFile(null)}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 text-xs shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* File input in SEPARATE block BELOW preview */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#ba6d86] file:text-white hover:file:bg-[#a05a70] cursor-pointer"
                  />
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <span style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500 }} className="block text-slate-900">
                    Zobrazovat veřejně na webu
                  </span>
                  <span className="block text-xs text-slate-500">
                    {formData.active ? 'Akce je viditelná pro návštěvníky' : 'Akce je skrytá'}
                  </span>
                </div>

                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                    formData.active ? 'bg-[#ba6d86]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-xs transition-transform transform ${
                      formData.active ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Footer Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  marginTop: '2rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #eaeaea'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  {editingEvent ? 'Uložit změny' : 'Vytvořit akci'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
