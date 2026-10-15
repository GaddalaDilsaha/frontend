import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { FeedPage } from './pages/FeedPage';
import { ReportItemPage } from './pages/ReportItemPage';
import { MatchCenterPage } from './pages/MatchCenterPage';
import { ClaimsDeskPage } from './pages/ClaimsDeskPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { MyReportsPage } from './pages/MyReportsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<FeedPage />} />
              <Route path="/report" element={<ReportItemPage />} />
              <Route path="/matches" element={<MatchCenterPage />} />
              <Route path="/claims" element={<ClaimsDeskPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route path="/my-reports" element={<MyReportsPage />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-semibold text-slate-700">FindIt AI • Campus Lost & Found System</span>
              <span>Production-Grade Architecture: React 18, Spring Boot 3, MySQL 8 & AI Similarity Engine</span>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
