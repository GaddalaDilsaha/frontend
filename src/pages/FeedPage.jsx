import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, MapPin, Tag, RefreshCw } from 'lucide-react';
import { itemsAPI } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { BlindClaimModal } from '../components/BlindClaimModal';

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Student IDs & Cards', value: 'STUDENT_ID' },
  { label: 'Electronics & Audio', value: 'ELECTRONICS' },
  { label: 'Keys & Keyrings', value: 'KEYS' },
  { label: 'Books & Notebooks', value: 'BOOKS_NOTEBOOKS' },
  { label: 'Wallets & Bags', value: 'WALLETS_BAGS' },
  { label: 'Clothing & Apparel', value: 'CLOTHING' },
  { label: 'Other Belongings', value: 'OTHER' },
];

const CAMPUS_ZONES = [
  { label: 'All Campus Zones', value: '' },
  { label: 'Central Library', value: 'CENTRAL_LIBRARY' },
  { label: 'Student Center & Food Court', value: 'STUDENT_CENTER' },
  { label: 'Science & Engineering Complex', value: 'SCIENCE_COMPLEX' },
  { label: 'Business School', value: 'BUSINESS_BUILDING' },
  { label: 'Sports Complex / Gym', value: 'SPORTS_ARENA' },
  { label: 'Residence Halls & Dorms', value: 'CAMPUS_DORMITORIES' },
  { label: 'Outdoor Quad & Green', value: 'OUTDOOR_QUAD' },
];

export const FeedPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(''); // '' | 'LOST' | 'FOUND'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [claimModalItem, setClaimModalItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedType) params.type = selectedType;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedZone) params.campusZone = selectedZone;
      if (search.trim()) params.search = search.trim();

      const res = await itemsAPI.getItems(params);
      setItems(res.data.content || []);
    } catch (err) {
      console.error('Error fetching items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [selectedType, selectedCategory, selectedZone, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-12 mb-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold tracking-wide uppercase mb-4 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Spatial & Semantic Matching
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Campus Lost & Found <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Recover Misplaced Belongings Instantly.
            </span>
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Replace cluttered WhatsApp & Discord groups. Report lost belongings or found items, let our automated AI matchmaker correlate reports, and safely claim items using blind verification.
          </p>

          {/* Type Toggle Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedType === ''
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setSelectedType('LOST')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedType === 'LOST'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Lost Reports
            </button>
            <button
              onClick={() => setSelectedType('FOUND')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedType === 'FOUND'
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Found Belongings
            </button>
          </div>
        </div>
      </div>

      {/* Search & Multi-Faceted Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Text Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keywords (e.g. AirPods, Student ID, blue keys, Texas Instruments...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-56 relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Campus Zone Dropdown */}
          <div className="w-full md:w-64 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 bg-white"
            >
              {CAMPUS_ZONES.map((zone) => (
                <option key={zone.value} value={zone.value}>{zone.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchItems}
            title="Refresh Catalog"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shrink-0 flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-200/70 rounded-2xl"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Matching Campus Items Found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, clearing filters, or submit a new report if you misplaced or found something.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClaimClick={(itemToClaim) => setClaimModalItem(itemToClaim)}
            />
          ))}
        </div>
      )}

      {/* Blind Claim Modal */}
      {claimModalItem && (
        <BlindClaimModal
          item={claimModalItem}
          onClose={() => setClaimModalItem(null)}
          onSuccess={() => {
            fetchItems();
          }}
        />
      )}
    </div>
  );
};
