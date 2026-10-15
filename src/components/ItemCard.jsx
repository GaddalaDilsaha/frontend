import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ShieldCheck, SearchCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ItemCard = ({ item, onClaimClick }) => {
  const isLost = item.type === 'LOST';

  const formatTimestamp = (dateStr) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch (e) {
      return dateStr;
    }
  };

  const statusColors = {
    OPEN: 'bg-blue-100 text-blue-800',
    MATCH_PENDING: 'bg-purple-100 text-purple-800',
    CLAIM_IN_PROGRESS: 'bg-amber-100 text-amber-800',
    RESOLVED: 'bg-emerald-100 text-emerald-800',
    CLOSED: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Top Banner & Image */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200">
            <Tag className="w-10 h-10 mb-2 stroke-1" />
            <span className="text-xs font-medium">No Image Provided</span>
          </div>
        )}

        {/* Type Badge (LOST vs FOUND) */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
            isLost ? 'bg-rose-600 text-white' : 'bg-teal-600 text-white'
          }`}>
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColors[item.status] || 'bg-slate-100 text-slate-700'}`}>
            {item.status.replace('_', ' ')}
          </span>
        </div>

        {item.hasPrivateVerification && (
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Blind Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{item.category.replace('_', ' ')}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatTimestamp(item.eventTimestamp)}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-1 group-hover:text-teal-600 transition-colors">
            {item.title}
          </h3>

          <p className="mt-1.5 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">{item.campusZoneDisplayName || item.campusZone}</span>
              {item.specificLocation && (
                <span className="text-slate-500 block truncate max-w-[220px]">
                  {item.specificLocation}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/items/${item.id}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            View Details
          </Link>

          {!isLost && item.status !== 'RESOLVED' && onClaimClick && (
            <button
              onClick={() => onClaimClick(item)}
              className="py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Claim
            </button>
          )}

          <Link
            to={`/matches?item=${item.id}`}
            title="Check AI Matches"
            className="p-2 rounded-xl border border-slate-200 hover:border-teal-400 text-slate-500 hover:text-teal-600 transition-colors"
          >
            <SearchCheck className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
