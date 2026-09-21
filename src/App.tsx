import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { SalesView } from './components/sales/SalesView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ShieldCheck, Leaf } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeView, 
    sheetsModalOpen, 
    setSheetsModalOpen,
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Fixed / Sticky Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
        {activeView === 'sales' ? <SalesView /> : <AdminDashboard />}
      </div>

      {/* Modals */}
      <LoginModal />
      <SettingsModal />
      <GoogleSheetsSyncModal 
        isOpen={sheetsModalOpen} 
        onClose={() => setSheetsModalOpen(false)} 
      />

      {/* Corporate Clean Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-200">United development CO.,LTD</span>
            <span className="text-slate-500 hidden sm:inline">| ปุ๋ยทวีผล</span>
          </div>
          <div className="text-[11px] text-slate-500">
            ทวีผล Track • ระบบติดตามการลงพื้นที่ & Google Sheets & GPS
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
