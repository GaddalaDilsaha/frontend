import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  MapPin, 
  Tag, 
  Calendar, 
  ShieldCheck, 
  Image as ImageIcon, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { itemsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { label: 'Student ID / Smartcard', value: 'STUDENT_ID' },
  { label: 'Electronics & Audio (Phone, Laptop, Earbuds)', value: 'ELECTRONICS' },
  { label: 'Keys & Keychains', value: 'KEYS' },
  { label: 'Books, Notebooks & Course Material', value: 'BOOKS_NOTEBOOKS' },
  { label: 'Wallets, Purses & Backpacks', value: 'WALLETS_BAGS' },
  { label: 'Jackets & Clothing', value: 'CLOTHING' },
  { label: 'Jewelry & Accessories', value: 'JEWELRY_ACCESSORIES' },
  { label: 'Other Item', value: 'OTHER' },
];

const CAMPUS_ZONES = [
  { label: 'Central Library & Study Commons', value: 'CENTRAL_LIBRARY' },
  { label: 'Student Center & Food Court', value: 'STUDENT_CENTER' },
  { label: 'Science & Engineering Complex', value: 'SCIENCE_COMPLEX' },
  { label: 'School of Business & Lecture Halls', value: 'BUSINESS_BUILDING' },
  { label: 'Campus Recreation & Sports Gym', value: 'SPORTS_ARENA' },
  { label: 'Residence Halls & Dormitories', value: 'CAMPUS_DORMITORIES' },
  { label: 'Administrative Block & Registrar', value: 'ADMIN_BUILDING' },
  { label: 'North/South Parking Areas', value: 'PARKING_ZONE' },
  { label: 'Main Quad & Campus Green', value: 'OUTDOOR_QUAD' },
  { label: 'Other Campus Spot', value: 'OTHER' },
];

export const ReportItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [type, setType] = useState('LOST'); // 'LOST' or 'FOUND'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ELECTRONICS');
  const [campusZone, setCampusZone] = useState('CENTRAL_LIBRARY');
  const [specificLocation, setSpecificLocation] = useState('');
  const [eventTimestamp, setEventTimestamp] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [privateVerificationDetails, setPrivateVerificationDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a descriptive title and description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await itemsAPI.createItem({
        type,
        title: title.trim(),
        category,
        campusZone,
        specificLocation: specificLocation.trim(),
        eventTimestamp: new Date(eventTimestamp).toISOString(),
        imageUrl: imageUrl.trim() || null,
        description: description.trim(),
        privateVerificationDetails: privateVerificationDetails.trim() || null,
      });

      // Redirect to feed or matches
      navigate('/matches');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit report. Ensure you are signed in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            FindIt AI Reporting Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Log a Campus Belonging
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Our AI matchmaking engine will instantly index your report against complementary campus records.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              What are you reporting?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('LOST')}
                className={`py-3.5 px-4 rounded-2xl border-2 font-bold text-sm transition-all text-center flex flex-col items-center gap-1 ${
                  type === 'LOST'
                    ? 'border-rose-500 bg-rose-50/50 text-rose-700 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span>🔍 I Lost Something</span>
                <span className="text-[11px] font-normal text-slate-500">Search database & notify me on matches</span>
              </button>
              <button
                type="button"
                onClick={() => setType('FOUND')}
                className={`py-3.5 px-4 rounded-2xl border-2 font-bold text-sm transition-all text-center flex flex-col items-center gap-1 ${
                  type === 'FOUND'
                    ? 'border-teal-500 bg-teal-50/50 text-teal-700 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span>🤝 I Found Something</span>
                <span className="text-[11px] font-normal text-slate-500">Safely return it to the campus owner</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Item Title & Model *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Space Gray MacBook Air M2 in navy sleeve"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800"
            />
          </div>

          {/* Category & Campus Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Campus Zone / Area *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={campusZone}
                  onChange={(e) => setCampusZone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 bg-white"
                >
                  {CAMPUS_ZONES.map((zone) => (
                    <option key={zone.value} value={zone.value}>{zone.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Specific Location & Event Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Specific Spot Description
              </label>
              <input
                type="text"
                placeholder="e.g. Room 204, desk row 3, or near water fountain"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Approximate Date & Time *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="datetime-local"
                  required
                  value={eventTimestamp}
                  onChange={(e) => setEventTimestamp(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Image URL with live preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Photo / Image URL (Optional)
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800"
                />
              </div>
              {imageUrl && (
                <div className="w-11 h-11 rounded-xl border border-slate-200 overflow-hidden shrink-0">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Public Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Public Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe color, general brand, visible stickers, condition. Avoid revealing unique serials or private security marks."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 resize-none"
            />
          </div>

          {/* Secure Blind Verification Secrets */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-teal-950 flex items-center gap-1.5">
                  Blind Ownership Verification Secrets
                  <span className="text-[10px] font-semibold bg-teal-200/80 text-teal-800 px-2 py-0.5 rounded-full">
                    Protected & Hidden
                  </span>
                </h3>
                <p className="text-xs text-teal-800/80 mt-1 leading-relaxed">
                  Protect this report from false or fraudulent claims! Enter distinguishing features that only the true owner can verify (e.g., lock screen wallpaper, engraving, inside bag contents, last 4 digits of ID number).
                  <strong className="block mt-1 font-semibold text-teal-900">
                    This will NEVER be displayed publicly on the feed.
                  </strong>
                </p>
                <textarea
                  rows={2}
                  placeholder="e.g. Phone wallpaper is a photo of Mt. Fuji. Inside keycap has green dot. Engraved initials 'JD' on back."
                  value={privateVerificationDetails}
                  onChange={(e) => setPrivateVerificationDetails(e.target.value)}
                  className="mt-3 w-full px-3.5 py-2 rounded-xl border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-800 bg-white placeholder-slate-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
            >
              {loading ? (
                <span>Indexing with AI...</span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
