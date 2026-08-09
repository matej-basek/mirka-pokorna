'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Building2,
  MapPin,
  Calendar,
  Search,
  LayoutGrid,
  Table as TableIcon,
  X,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';

interface Lesson {
  name: string;
  day: string;
  time: string;
  pricePerLesson?: string;
  coursePrice?: string;
  additionalInfo?: string;
}

interface StudioItem {
  _id: string;
  name: string;
  location?: string;
  description?: string;
  registrationUrl?: string;
  photoUrl?: string;
  mapsUrl?: string;
  lessons: Lesson[];
}

export default function AdminStudiosPage() {
  const [studios, setStudios] = useState<StudioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudio, setEditingStudio] = useState<StudioItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    registrationUrl: '',
    mapsUrl: '',
  });

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const getPhotoUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const backendOrigin = apiUrl.replace(/\/api\/?$/, '');
    return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    fetchStudios();
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

  const fetchStudios = async () => {
    try {
      const res = await api.get('/studios');
      setStudios(res.data);
    } catch (err) {
      console.error('Chyba při načítání rozvrhů', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingStudio(null);
    setImageFile(null);
    setImagePreviewUrl(null);
    setFormData({ name: '', location: '', description: '', registrationUrl: '', mapsUrl: '' });
    setLessons([]);
    setShowModal(true);
  };

  const openEditModal = (studio: StudioItem) => {
    setEditingStudio(studio);
    setImageFile(null);
    setImagePreviewUrl(null);
    setFormData({
      name: studio.name,
      location: studio.location || '',
      description: studio.description || '',
      registrationUrl: studio.registrationUrl || '',
      mapsUrl: studio.mapsUrl || '',
    });
    setLessons(studio.lessons || []);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('location', formData.location);
      data.append('description', formData.description);
      data.append('registrationUrl', formData.registrationUrl);
      data.append('mapsUrl', formData.mapsUrl);
      data.append('lessons', JSON.stringify(lessons));
      if (imageFile) data.append('photo', imageFile);

      if (editingStudio) {
        await api.put(`/studios/${editingStudio._id}`, data);
      } else {
        await api.post('/studios', data);
      }
      
      fetchStudios();
      setShowModal(false);
      setEditingStudio(null);
      setImageFile(null);
      setImagePreviewUrl(null);
      setFormData({ name: '', location: '', description: '', registrationUrl: '', mapsUrl: '' });
      setLessons([]);
    } catch (err) {
      console.error('Chyba při ukládání rozvrhu', err);
      alert('Došlo k chybě při ukládání rozvrhu.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Opravdu chcete smazat toto studio a jeho rozvrhy?')) {
      try {
        await api.delete(`/studios/${id}`);
        fetchStudios();
      } catch (err) {
        console.error('Chyba při mazání', err);
        alert('Došlo k chybě při mazání.');
      }
    }
  };

  const addLesson = () => {
    setLessons([...lessons, { name: '', day: '', time: '', pricePerLesson: '', coursePrice: '', additionalInfo: '' }]);
  };

  const updateLesson = (index: number, field: keyof Lesson, value: string) => {
    const updated = [...lessons];
    updated[index] = { ...updated[index], [field]: value };
    setLessons(updated);
  };

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const filteredStudios = studios.filter((studio) => {
    return (
      studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (studio.location && studio.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (studio.description && studio.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 font-sans text-slate-900" style={{ fontFamily: '"Outfit", "Inter", system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight not-italic"
            style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif', fontWeight: 700, fontStyle: 'normal' }}
          >
            Správa studia a rozvrhu
          </h1>
          <p className="text-base text-slate-500 font-medium mt-1">
            Spravujte vaše studia a jejich pravidelné kurzy a lekce.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2.5 bg-[#ba6d86] text-white hover:bg-[#a05a70] font-bold px-6 py-3 rounded-xl text-base transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Přidat nové studio</span>
        </button>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-700 bg-slate-100/80 px-5 py-2.5 rounded-xl shrink-0 border border-slate-200/60">
          <Building2 className="w-5 h-5 text-[#ba6d86]" />
          <span>Celkem studií: {studios.length}</span>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-80 lg:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Hledat studio..."
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

      {/* Main Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm font-medium">
          Načítání studií...
        </div>
      ) : filteredStudios.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 not-italic" style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700 }}>
            Žádná studia nebyly nalezena
          </h3>
        </div>
      ) : viewMode === 'table' ? (

        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 min-w-[220px]">NÁZEV STUDIA</th>
                  <th className="py-3.5 px-4 min-w-[180px]">LOKACE</th>
                  <th className="py-3.5 px-4 min-w-[160px]">POČET KURZŮ</th>
                  <th className="py-3.5 px-4 min-w-[200px]">POPIS</th>
                  <th className="py-3.5 px-4 text-right min-w-[120px]">AKCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudios.map((studio) => (
                  <tr key={studio._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                          {studio.photoUrl ? (
                            <img src={getPhotoUrl(studio.photoUrl)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <span className="font-bold text-slate-900 text-sm not-italic" style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700 }}>
                          {studio.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#ba6d86] shrink-0" />
                        <span>{studio.location || 'Neurčeno'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-[#ba6d86]" />
                        {studio.lessons?.length || 0} lekcí
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 line-clamp-1 max-w-[240px]">
                      {studio.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(studio)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Upravit studio"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(studio._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Smazat studio"
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
        </div>
      ) : (

        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredStudios.map((studio) => (
            <div
              key={studio._id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Fotka studia */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-b border-slate-100 flex items-center justify-center min-h-[100px] overflow-hidden">
                {studio.photoUrl ? (
                  <img src={getPhotoUrl(studio.photoUrl)} alt="" className="w-full object-cover" style={{ maxHeight: '160px' }} />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-[#ba6d86]" />
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4 flex flex-col flex-1">
                <div>
                  <h3
                    className="font-bold text-slate-900 text-lg not-italic"
                    style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700, fontStyle: 'normal' }}
                  >
                    {studio.name}
                  </h3>
                  {studio.location && (
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ba6d86]" /> {studio.location}
                    </p>
                  )}
                </div>

                {/* Lessons */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Pravidelné lekce ({studio.lessons?.length || 0})
                  </span>
                  {studio.lessons && studio.lessons.length > 0 ? (
                    <div className="space-y-2">
                      {studio.lessons.map((l, idx) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between border border-slate-100 text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{l.name}</div>
                            <div className="text-[11px] text-slate-500">{l.day} • {l.time}</div>
                          </div>
                          <div className="font-bold text-[#ba6d86] bg-white px-2.5 py-1 rounded border border-slate-200">
                            {l.pricePerLesson || l.coursePrice || '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Zatím nebyly vloženy žádné lekce.</p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #eaeaea',
                  paddingTop: '12px',
                  marginTop: '12px',
                  padding: '12px 20px 16px',
                }}
              >
                <span className="text-xs text-slate-400 font-medium">ID: ...{studio._id.slice(-6)}</span>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <button
                    onClick={() => openEditModal(studio)}
                    className="text-xs font-semibold text-slate-700 hover:text-black cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Upravit
                  </button>
                  <button
                    onClick={() => handleDelete(studio._id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Smazat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL WITH EXACT USER CSS SPECS */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full sm:max-w-xl md:max-w-2xl shadow-2xl border-0 sm:border border-slate-200 relative my-0 sm:my-8 flex flex-col h-[95dvh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-2xl p-5 sm:p-8">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 shrink-0">
              <div>
                <h3
                  className="text-xl font-bold text-slate-900 tracking-tight not-italic"
                  style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700, fontStyle: 'normal' }}
                >
                  {editingStudio ? 'Úprava studia' : 'Přidat nové studio'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Vyplňte údaje o studiu a zadejte jeho lekce
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
              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Název studia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="např. Prostor Pro Tebe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Lokace
                </label>
                <input
                  type="text"
                  placeholder="např. Praha 2, Vinohrady"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Popis studia
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86] resize-y"
                />
              </div>

              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Odkaz na mapy
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginLeft: '6px' }}>
                    (kliknutelný název studia v pop-up okně)
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

              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Odkaz na rezervaci (Google Forms)
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

              {/* Fotka studia */}
              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Fotka studia
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginLeft: '6px' }}>
                    (zobrazí se v pop-up okně nad názvem)
                  </span>
                </label>
                {(imagePreviewUrl || editingStudio?.photoUrl) && (
                  <div style={{ maxHeight: '160px', marginBottom: '0.75rem', position: 'relative' }} className="w-full overflow-hidden bg-slate-50 rounded-lg border border-slate-200 p-2 flex items-center justify-center">
                    <img
                      src={imagePreviewUrl || getPhotoUrl(editingStudio?.photoUrl)}
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

              {/* Lessons Builder */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500 }}
                    className="text-slate-700"
                  >
                    Rozvrh lekcí ({lessons.length})
                  </label>
                  <button
                    type="button"
                    onClick={addLesson}
                    className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#ba6d86]" /> Přidat lekci
                  </button>
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                      <button
                        type="button"
                        onClick={() => removeLesson(idx)}
                        className="absolute top-3 right-3 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200"
                      >
                        Odebrat
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-16 sm:pr-0">
                        <div>
                          <label style={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 500 }} className="block text-slate-600 mb-1">Název kurzu *</label>
                          <input required value={lesson.name} onChange={e => updateLesson(idx, 'name', e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} className="w-full text-xs font-medium" />
                        </div>
                        <div>
                          <label style={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 500 }} className="block text-slate-600 mb-1">Den (např. Úterý) *</label>
                          <input required value={lesson.day} onChange={e => updateLesson(idx, 'day', e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} className="w-full text-xs font-medium" />
                        </div>
                        <div>
                          <label style={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 500 }} className="block text-slate-600 mb-1">Čas (např. 18:00 - 19:30) *</label>
                          <input required value={lesson.time} onChange={e => updateLesson(idx, 'time', e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} className="w-full text-xs font-medium" />
                        </div>
                        <div>
                          <label style={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 500 }} className="block text-slate-600 mb-1">Cena za lekci</label>
                          <input value={lesson.pricePerLesson || ''} onChange={e => updateLesson(idx, 'pricePerLesson', e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #ccc' }} className="w-full text-xs font-medium" />
                        </div>
                      </div>
                    </div>
                  ))}
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
                  {editingStudio ? 'Uložit změny' : 'Vytvořit studio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
