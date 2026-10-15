import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  Lock, 
  Eye, 
  FileText,
  Clock
} from 'lucide-react';
import { claimsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export const ClaimsDeskPage = () => {
  const { user, isSecurityOrAdmin } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState({});
  const [actionInProgress, setActionInProgress] = useState(null);

  const fetchPendingClaims = async () => {
    setLoading(true);
    try {
      const res = await claimsAPI.getPendingClaims();
      setClaims(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingClaims();
  }, []);

  const handleReview = async (claimId, status) => {
    setActionInProgress(claimId);
    try {
      const notes = reviewNotes[claimId] || '';
      await claimsAPI.reviewClaim(claimId, status, notes);
      await fetchPendingClaims();
    } catch (err) {
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Campus Security & Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ownership Verification Desk
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Evaluate blind ownership submissions against confidential item verification marks. Verify identity credentials before approving property release.
          </p>
        </div>

        {!isSecurityOrAdmin && (
          <div className="p-3 bg-white rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Switch persona to <strong>Officer Marcus</strong> or <strong>Admin</strong> in top bar to execute decisions.</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-slate-200/70 rounded-3xl"></div>
          ))}
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">All Ownership Claims Processed</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            There are currently no outstanding blind verification requests pending campus staff review.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 overflow-hidden"
            >
              {/* Item & Claimant Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    {claim.itemImageUrl ? (
                      <img src={claim.itemImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">ITEM</div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Pending Staff Review
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{claim.itemTitle}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Submitted {formatDistanceToNow(new Date(claim.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {/* Claimant Identity Card */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>{claim.claimantName}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">ID: {claim.claimantStudentId || 'N/A'}</div>
                  <div className="text-slate-500 truncate">{claim.claimantEmail}</div>
                </div>
              </div>

              {/* Side-by-Side Verification Check */}
              <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Claimant's Blind Answers */}
                <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase tracking-wider mb-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Claimant's Submitted Details
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-teal-100">
                    {claim.blindAnswers}
                  </p>
                </div>

                {/* Right: Confidential Stored Verification Ground Truth */}
                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wider mb-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    Stored Verification Ground Truth (Finder's Secret Note)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-purple-100">
                    {claim.storedPrivateVerificationDetails || 'No private verification notes were recorded by the finder. Inspect claimant student ID card.'}
                  </p>
                </div>
              </div>

              {/* Reviewer Notes & Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Officer review notes (e.g., student ID checked, physical collection counter #2)..."
                  value={reviewNotes[claim.id] || ''}
                  onChange={(e) => setReviewNotes({ ...reviewNotes, [claim.id]: e.target.value })}
                  className="w-full sm:w-96 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleReview(claim.id, 'REJECTED')}
                    disabled={!isSecurityOrAdmin || actionInProgress === claim.id}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 disabled:opacity-50 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Claim
                  </button>

                  <button
                    onClick={() => handleReview(claim.id, 'APPROVED')}
                    disabled={!isSecurityOrAdmin || actionInProgress === claim.id}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Release Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
