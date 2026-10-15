import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  User, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  ArrowLeft,
  Lock,
  Clock
} from 'lucide-react';
import { itemsAPI, matchesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BlindClaimModal } from '../components/BlindClaimModal';
import { MatchScoreBadge } from '../components/MatchScoreBadge';
import { formatDistanceToNow, format } from 'date-fns';

export const ItemDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const fetchItemData = async () => {
    setLoading(true);
    try {
      const [itemRes, matchesRes] = await Promise.all([
        itemsAPI.getItemById(id),
        matchesAPI.getMatchesForItem(id)
      ]);
      setItem(itemRes.data);
      setMatches(matchesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold">Item not found</h2>
        <Link to="/" className="text-teal-600 mt-2 inline-block font-semibold">Back to Feed</Link>
      </div>
    );
  }

  const isOwner = user && user.id === item.reporterId;
  const isLost = item.type === 'LOST';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Campus Feed
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Pane */}
          <div className="h-80 md:h-full min-h-[350px] bg-slate-100 relative overflow-hidden">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <Tag className="w-16 h-16 stroke-1 mb-2" />
                <span className="text-sm font-semibold">No Image Provided</span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-white ${
                isLost ? 'bg-rose-600' : 'bg-teal-600'
              }`}>
                {isLost ? 'Lost Report' : 'Found Belonging'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
                {item.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Details Pane */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">
                <span>{item.category.replace('_', ' ')}</span>
                <span>•</span>
                <span>Report #{item.id}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {item.title}
              </h1>

              <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-600 border-y border-slate-100 py-3.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong>Zone:</strong> {item.campusZoneDisplayName || item.campusZone} {item.specificLocation && `(${item.specificLocation})`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong>Date & Time:</strong> {format(new Date(item.eventTimestamp), 'PPpp')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong>Reported by:</strong> {item.reporterName} ({item.reporterEmail})
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Private Verification (Shown if owner or staff) */}
              {item.privateVerificationDetails && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                    <Lock className="w-4 h-4 text-amber-600" />
                    Private Blind Verification Truth (Confidential)
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {item.privateVerificationDetails}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {!isLost && item.status !== 'RESOLVED' && !isOwner && (
                <button
                  onClick={() => setClaimModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Submit Blind Ownership Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested AI Matches for this item */}
      {matches.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Correlated AI Matches ({matches.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => {
              const otherItem = isLost ? match.foundItem : match.lostItem;
              return (
                <div key={match.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      {match.compositeScore}% Match
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{otherItem.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{otherItem.campusZoneDisplayName || otherItem.campusZone}</p>
                  </div>
                  <Link
                    to={`/items/${otherItem.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0"
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {claimModalOpen && (
        <BlindClaimModal
          item={item}
          onClose={() => setClaimModalOpen(false)}
          onSuccess={() => fetchItemData()}
        />
      )}
    </div>
  );
};
