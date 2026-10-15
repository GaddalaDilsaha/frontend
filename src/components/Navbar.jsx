import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  ChevronDown,
  Layers,
  School
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const { user, logout, switchDemoAccount, isSecurityOrAdmin } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleDemoSwitch = async (email) => {
    setSwitching(true);
    try {
      await switchDemoAccount(email);
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(false);
      setDropdownOpen(false);
    }
  };

  const navLinks = [
    { name: 'Browse Feed', path: '/', icon: Compass },
    { name: 'Report Item', path: '/report', icon: PlusCircle },
    { name: 'AI Matches', path: '/matches', icon: Sparkles, badge: 'AI' },
    { name: 'Claims Desk', path: '/claims', icon: ShieldCheck, restricted: true },
    { name: 'My Reports', path: '/my-reports', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner: Quick Role Switcher for Campus Testing */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <School className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-medium text-slate-200">University Campus Lost & Found Network</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">Active Profile: <strong className="text-white">{user?.fullName || 'Guest'}</strong> ({user?.role?.replace('ROLE_', '') || 'ANONYMOUS'})</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 mr-1">Switch Persona:</span>
            <button
              onClick={() => handleDemoSwitch('student1@campus.edu')}
              className={`px-2 py-0.5 rounded transition-colors ${user?.email === 'student1@campus.edu' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Alex (Student)
            </button>
            <button
              onClick={() => handleDemoSwitch('student2@campus.edu')}
              className={`px-2 py-0.5 rounded transition-colors ${user?.email === 'student2@campus.edu' ? 'bg-teal-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Priya (Student)
            </button>
            <button
              onClick={() => handleDemoSwitch('security@campus.edu')}
              className={`px-2 py-0.5 rounded transition-colors ${user?.email === 'security@campus.edu' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Officer Marcus (Security)
            </button>
            <button
              onClick={() => handleDemoSwitch('admin@campus.edu')}
              className={`px-2 py-0.5 rounded transition-colors ${user?.email === 'admin@campus.edu' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                FindIt<span className="text-teal-600">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block -mt-1">
                Intelligent Lost & Found
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                  {link.name}
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                  {link.restricted && isSecurityOrAdmin && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/report"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm shadow-teal-600/30 transition-all hover:shadow"
            >
              <PlusCircle className="w-4 h-4" />
              Report Item
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                    {user.fullName ? user.fullName.charAt(0) : 'U'}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <div className="font-bold text-slate-800 leading-tight">{user.fullName}</div>
                    <div className="text-[10px] text-slate-400">{user.studentId || user.email}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/my-reports"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      My Logged Items & Claims
                    </Link>

                    {isSecurityOrAdmin && (
                      <Link
                        to="/claims"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        Security Desk & Approvals
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal for Sign In / Registration */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};
