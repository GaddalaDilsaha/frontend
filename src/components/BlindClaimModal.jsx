import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { claimsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const BlindClaimModal = ({ item, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answers.trim()) {
      setError('Please provide verification details to prove ownership.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await claimsAPI.submitClaim({
        itemId: item.id,
        blindAnswers: answers.trim(),
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ownership claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Claim Submitted Securely</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Your blind verification details have been registered under Claim ID for <strong>{item.title}</strong>.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left">
              <strong>Next Step:</strong> Campus Security will review your submitted answers against the stored verification marks. You can track this under <em>My Reports & Claims</em> or present your student ID at the Security Desk.
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-wider mb-1">
              <ShieldCheck className="w-5 h-5" />
              Secure Blind Verification
            </div>
            <h2 className="text-xl font-bold text-slate-900">Claim: {item.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Location found: {item.campusZoneDisplayName || item.campusZone} ({item.specificLocation || 'Campus premises'})
            </p>

            <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 flex gap-3 text-amber-900 text-xs leading-relaxed">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Anti-Fraud Protection</strong>
                The finder logged hidden distinguishing attributes. To prevent false claims, enter details only the genuine owner can provide (e.g. phone lockscreen image, case stickers, scratches, exact keychain charms, or engraved initials).
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Your Secret Ownership Evidence:
              </label>
              <textarea
                rows={4}
                value={answers}
                onChange={(e) => setAnswers(e.target.value)}
                placeholder="Example: The lockscreen is a picture of a golden retriever puppy. The phone case has a small blue sticker on the bottom-right corner..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-800 placeholder-slate-400 resize-none"
              />
            </div>

            {error && (
              <div className="mt-3 p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-sm transition-colors flex items-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
