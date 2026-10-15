import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Tag, Clock, CheckCircle2 } from 'lucide-react';
import { itemsAPI, claimsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ItemCard } from '../components/ItemCard';

export const MyReportsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'claims'
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsRes, claimsRes] = await Promise.all([
          itemsAPI.getMyItems(),
          claimsAPI.getMyClaims()
        ]);
        setItems(itemsRes.data || []);
        setClaims(claimsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Campus Activity
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review your registered lost or found belongings and track the status of your ownership claims.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'items'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            My Reported Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'claims'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            My Submitted Claims ({claims.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-48 bg-slate-200/70 rounded-3xl animate-pulse"></div>
      ) : activeTab === 'items' ? (
        items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No items reported yet</h3>
            <p className="text-xs text-slate-500 mt-1">Misplaced something on campus?</p>
            <Link to="/report" className="mt-4 inline-block px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">
              Report an Item Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )
      ) : (
        claims.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No active claims</h3>
            <p className="text-xs text-slate-500 mt-1">You haven't submitted any blind ownership claims yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map(claim => (
              <div key={claim.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      claim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      claim.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">Claim #{claim.id}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-1">{claim.itemTitle}</h4>
                  <p className="text-xs text-slate-600 mt-1"><strong>Your Blind Answer:</strong> {claim.blindAnswers}</p>
                  {claim.reviewerNotes && (
                    <p className="text-xs text-teal-700 mt-1 bg-teal-50 p-2 rounded-lg inline-block">
                      <strong>Staff Note:</strong> {claim.reviewerNotes}
                    </p>
                  )}
                </div>
                <Link
                  to={`/items/${claim.itemId}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold shrink-0 text-center"
                >
                  View Item
                </Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
