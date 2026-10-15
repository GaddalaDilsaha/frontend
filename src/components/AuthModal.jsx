import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, switchDemoAccount } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ fullName, email, password, studentId });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError('Cannot connect to backend server. Make sure the Spring Boot backend is running in VS Code (port 8080)!');
      } else {
        setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await switchDemoAccount(demoEmail);
      onClose();
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError('Cannot connect to backend server. Make sure the Spring Boot backend is running in VS Code (port 8080)!');
      } else {
        setError('Failed to sign in to demo account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRegister ? 'Create Campus Account' : 'Sign in to FindIt AI'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your campus lost reports, AI matches, and ownership verification desk.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* 1-Click Demo Accounts Quick Sign In */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Instant 1-Click Demo Logins:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('student1@campus.edu')}
              className="p-2 rounded-xl bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 font-semibold text-slate-700 text-left transition-all"
            >
              🎓 Alex Chen
              <span className="block text-[10px] text-slate-400 font-normal">Student</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('student2@campus.edu')}
              className="p-2 rounded-xl bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 font-semibold text-slate-700 text-left transition-all"
            >
              🎓 Priya Sharma
              <span className="block text-[10px] text-slate-400 font-normal">Student</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('security@campus.edu')}
              className="p-2 rounded-xl bg-white hover:bg-amber-50 hover:border-amber-300 border border-slate-200 font-semibold text-slate-700 text-left transition-all"
            >
              🛡️ Officer Marcus
              <span className="block text-[10px] text-slate-400 font-normal">Campus Security</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('admin@campus.edu')}
              className="p-2 rounded-xl bg-white hover:bg-purple-50 hover:border-purple-300 border border-slate-200 font-semibold text-slate-700 text-left transition-all"
            >
              ⚡ Administrator
              <span className="block text-[10px] text-slate-400 font-normal">Campus Admin</span>
            </button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2 text-slate-400 font-bold">Or enter credentials</span>
          </div>
        </div>

        {/* Regular Sign In / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Sign In')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
          >
            {isRegister ? 'Already have an account? Sign in here' : "Don't have an account? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
};
