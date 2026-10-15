import React from 'react';
import { Sparkles } from 'lucide-react';

export const MatchScoreBadge = ({ score, size = 'md' }) => {
  const getBadgeStyle = (val) => {
    if (val >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    if (val >= 65) return 'bg-teal-50 text-teal-700 border-teal-300';
    return 'bg-amber-50 text-amber-700 border-amber-300';
  };

  const getMeterColor = (val) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 65) return 'bg-teal-500';
    return 'bg-amber-500';
  };

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(score)}`}>
        <Sparkles className="w-3 h-3" />
        {score}% Match
      </span>
    );
  }

  return (
    <div className={`p-3 rounded-xl border ${getBadgeStyle(score)} flex items-center justify-between`}>
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg bg-white shadow-sm`}>
          <Sparkles className="w-4 h-4 text-teal-600" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">AI Confidence</div>
          <div className="text-lg font-bold">{score}% Match</div>
        </div>
      </div>
      <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
        <div className={`h-full ${getMeterColor(score)} rounded-full`} style={{ width: `${Math.min(100, score)}%` }}></div>
      </div>
    </div>
  );
};
