import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ArrowRightLeft, 
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { matchesAPI } from '../services/api';
import { MatchScoreBadge } from '../components/MatchScoreBadge';
import { BlindClaimModal } from '../components/BlindClaimModal';

export const MatchCenterPage = () => {
  const [searchParams] = useSearchParams();
  const filterItemId = searchParams.get('item');

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      let res;
      if (filterItemId) {
        res = await matchesAPI.getMatchesForItem(filterItemId);
      } else {
        res = await matchesAPI.getTopMatches(50.0);
      }
      setMatches(res.data || []);
    } catch (err) {
      console.error('Failed to fetch matches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [filterItemId]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await matchesAPI.recalculate();
      await fetchMatches();
    } catch (err) {
      console.error(err);
    } finally {
      setRecalculating(false);
    }
  };

  const handleUpdateStatus = async (matchId, newStatus) => {
    try {
      await matchesAPI.updateMatchStatus(matchId, newStatus);
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: newStatus } : m));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Hybrid AI Matchmaking Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus AI Match Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Correlating reported lost and found belongings using NLP TF-IDF similarity, campus spatial topology, and temporal decay.
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all self-start md:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
          {recalculating ? 'Running AI Engine...' : 'Re-scan Campus Database'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-200/70 rounded-3xl"></div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No High-Confidence Matches Detected Yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            When new lost or found belongings are registered, the AI engine automatically evaluates and links potential candidates.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 overflow-hidden transition-all hover:shadow-md"
            >
              {/* Top Score Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-2xl bg-teal-50 text-teal-800 font-extrabold text-xl flex items-center gap-1.5 border border-teal-200/80">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <span>{match.compositeScore}% Match</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Status</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      match.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                      match.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {match.status}
                    </span>
                  </div>
                </div>

                {/* Algorithmic Breakdown Meters */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Text NLP</span>
                    <span className="font-bold text-slate-800">{match.textScore}%</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Spatial Zone</span>
                    <span className="font-bold text-slate-800">{match.spatialScore}%</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Temporal Decay</span>
                    <span className="font-bold text-slate-800">{match.temporalScore}%</span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Center comparison pill (desktop) */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-100 border border-slate-200 shadow-sm items-center justify-center text-slate-500 z-10">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>

                {/* Lost Item Column */}
                <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100/80 flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                    {match.lostItem.imageUrl ? (
                      <img src={match.lostItem.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">LOST</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 inline-block mb-1">
                      Lost Report
                    </span>
                    <h4 className="font-bold text-slate-900 text-base truncate">{match.lostItem.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">{match.lostItem.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{match.lostItem.campusZoneDisplayName || match.lostItem.campusZone}</span>
                    </div>
                  </div>
                </div>

                {/* Found Item Column */}
                <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100/80 flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                    {match.foundItem.imageUrl ? (
                      <img src={match.foundItem.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">FOUND</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 inline-block mb-1">
                      Found Item
                    </span>
                    <h4 className="font-bold text-slate-900 text-base truncate">{match.foundItem.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">{match.foundItem.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span className="truncate">{match.foundItem.campusZoneDisplayName || match.foundItem.campusZone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Calculated automatically by FindIt AI Matcher
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedClaimItem(match.foundItem)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Initiate Blind Claim
                  </button>

                  {match.status !== 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateStatus(match.id, 'CONFIRMED')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Confirm Pair
                    </button>
                  )}

                  {match.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleUpdateStatus(match.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claim Modal */}
      {selectedClaimItem && (
        <BlindClaimModal
          item={selectedClaimItem}
          onClose={() => setSelectedClaimItem(null)}
          onSuccess={() => {
            fetchMatches();
          }}
        />
      )}
    </div>
  );
};
