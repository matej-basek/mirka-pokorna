'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  MessageSquare,
  Quote,
  Star,
  Search,
  LayoutGrid,
  Table as TableIcon,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '@/lib/api';

interface ReviewItem {
  _id: string;
  author: string;
  content: string;
  course?: string;
  rating: number;
  active: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  // Filters & Views
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [formData, setFormData] = useState({
    author: '',
    content: '',
    course: '',
    rating: 5,
    active: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews/all');
      setReviews(res.data);
    } catch (err) {
      console.error('Chyba při načítání recenzí', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({ author: '', content: '', rating: 5, course: '', active: true });
    setShowModal(true);
  };

  const openEditModal = (review: ReviewItem) => {
    setEditingReview(review);
    setFormData({
      author: review.author,
      content: review.content,
      course: review.course || '',
      rating: review.rating || 5,
      active: review.active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, formData);
      } else {
        await api.post('/reviews', formData);
      }
      
      fetchReviews();
      setShowModal(false);
      setEditingReview(null);
      setFormData({ author: '', content: '', course: '', rating: 5, active: true });
    } catch (err) {
      console.error('Chyba při ukládání recenze', err);
      alert('Došlo k chybě při ukládání recenze.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Opravdu chcete smazat tuto recenzi?')) {
      try {
        await api.delete(`/reviews/${id}`);
        fetchReviews();
      } catch (err) {
        console.error('Chyba při mazání recenze', err);
        alert('Došlo k chybě při mazání recenze.');
      }
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter =
      filterTab === 'all'
        ? true
        : filterTab === 'active'
        ? review.active
        : !review.active;

    const matchesSearch =
      review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.course && review.course.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const activeCount = reviews.filter(r => r.active).length;
  const hiddenCount = reviews.length - activeCount;

  return (
    <div className="space-y-6 font-sans text-slate-900" style={{ fontFamily: '"Outfit", "Inter", system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight not-italic"
            style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif', fontWeight: 700, fontStyle: 'normal' }}
          >
            Správa recenzí
          </h1>
          <p className="text-base text-slate-500 font-medium mt-1">
            Spravujte klientské reference a hodnocení kurzů.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2.5 bg-[#ba6d86] text-white hover:bg-[#a05a70] font-bold px-6 py-3 rounded-xl text-base transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Přidat novou recenzi</span>
        </button>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-2 rounded-xl border border-slate-200/60 overflow-x-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Všechny <span className="ml-1.5 text-sm text-slate-500 font-bold">({reviews.length})</span>
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterTab === 'active' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktivní <span className="ml-1.5 text-sm text-emerald-700 font-bold">({activeCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('hidden')}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${
              filterTab === 'hidden' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
              placeholder="Hledat recenzi..."
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
          Načítání recenzí...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 not-italic" style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700 }}>
            Žádné recenze nebyly nalezeny
          </h3>
        </div>
      ) : viewMode === 'table' ? (

        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 min-w-[160px]">AUTOR</th>
                  <th className="py-3.5 px-4 min-w-[280px]">TEXT RECENZE</th>
                  <th className="py-3.5 px-4 min-w-[160px]">KURZ / AKCE</th>
                  <th className="py-3.5 px-4 min-w-[110px]">HODNOCENÍ</th>
                  <th className="py-3.5 px-4 min-w-[100px]">STATUS</th>
                  <th className="py-3.5 px-4 text-right min-w-[120px]">AKCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm not-italic" style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700 }}>
                      {review.author}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 italic max-w-[400px]">
                      „{review.content}“
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {review.course || 'Obecná recenze'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(review.rating || 5)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-[#ba6d86] text-[#ba6d86]" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          review.active
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {review.active ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                        {review.active ? 'Aktivní' : 'Skrytá'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(review)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Upravit recenzi"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Smazat recenzi"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
              style={{ position: 'relative' }}
            >
              {/* Status Badge with position: absolute; top: 10px; right: 10px */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    review.active
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {review.active ? 'Aktivní' : 'Skrytá'}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <Quote className="w-6 h-6 text-[#ba6d86]/60" />
                <p className="text-xs text-slate-700 italic leading-relaxed font-medium">
                  „{review.content}“
                </p>
              </div>

              <div className="space-y-2 pt-3">
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <h4
                      className="font-bold text-slate-900 text-sm not-italic"
                      style={{ fontFamily: '"Outfit", "Inter", sans-serif', fontWeight: 700, fontStyle: 'normal' }}
                    >
                      {review.author}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {review.course || 'Obecná recenze'}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-[#ba6d86] text-[#ba6d86]" />
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
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
                  <span className="text-[11px] text-slate-400 font-medium">ID: ...{review._id.slice(-6)}</span>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button
                      onClick={() => openEditModal(review)}
                      className="text-xs font-semibold text-slate-700 hover:text-black cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
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
                  {editingReview ? 'Úprava recenze' : 'Přidat novou recenzi'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Zadejte podrobnosti klientské reference.
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
                  Jméno autora *
                </label>
                <input
                  type="text"
                  required
                  placeholder="např. Marie K."
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Kurz / Akce (volitelné)
                </label>
                <input
                  type="text"
                  placeholder="např. Intuitivní zpěv & Muzikoterapie"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86]"
                />
              </div>

              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Text recenze *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Napište slova účastnice..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}
                  className="w-full text-sm font-medium text-slate-900 focus:outline-none focus:border-[#ba6d86] resize-y"
                />
              </div>

              <div>
                <label
                  style={{ textTransform: 'none', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}
                  className="text-slate-700"
                >
                  Hodnocení (Hvězdičky)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      className={`p-2 rounded-lg transition-all border cursor-pointer ${
                        formData.rating >= num
                          ? 'bg-slate-50 border-[#ba6d86]'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${formData.rating >= num ? 'fill-[#ba6d86] text-[#ba6d86]' : 'text-slate-300'}`} />
                    </button>
                  ))}
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
                    {formData.active ? 'Recenze je viditelná pro návštěvníky' : 'Recenze je skrytá'}
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
                  {editingReview ? 'Uložit změny' : 'Vytvořit recenzi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
