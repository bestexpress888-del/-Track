import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  RotateCw, 
  Settings, 
  LogOut, 
  LogIn, 
  Smartphone, 
  BarChart3, 
  CheckCircle2, 
  UserCircle2,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { UnitedDevLogo } from './UnitedDevLogo';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isRefreshing,
    refreshData,
    logout,
    setLoginModalOpen,
    setSettingsModalOpen,
    isGoogleConnected,
    setSheetsModalOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white shadow-md border-b border-emerald-700/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Logo from Image 2 */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 shadow-md border border-amber-300 flex items-center justify-center shrink-0 overflow-hidden">
            <UnitedDevLogo className="w-full h-full" showText={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-wide text-amber-300 truncate">
                ทวีผล Track
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-emerald-800/80 text-emerald-200 border border-emerald-600/60 px-2 py-0.5 rounded-full font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                United development CO.,LTD
              </span>
            </div>
            <div className="text-[11px] text-emerald-200/90 truncate hidden sm:block">
              United development CO.,LTD • ระบบติดตามงานและลงพื้นที่ (ปุ๋ยทวีผล)
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* User's Own Part Indicator (Role Switcher Removed as requested) */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/80 px-3 py-1.5 rounded-xl text-xs shadow-inner">
              {currentUser.role === 'admin' ? (
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-300 shrink-0" />
                  <div className="leading-tight">
                    <span className="font-bold text-amber-300 block text-[11px] sm:text-xs">ส่วนงานผู้บริหาร</span>
                    <span className="text-[10px] text-emerald-300 hidden sm:inline">{currentUser.name}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-300 shrink-0" />
                  <div className="leading-tight">
                    <span className="font-bold text-emerald-200 block text-[11px] sm:text-xs">ส่วนงานพนักงานขาย</span>
                    <span className="text-[10px] text-emerald-300 hidden sm:inline">{currentUser.name} ({currentUser.zone})</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Info Chip (Desktop) */}
          {currentUser ? (
            <div className="hidden xl:flex items-center gap-2 bg-emerald-900/90 border border-emerald-700/80 px-2.5 py-1 rounded-xl text-xs">
              <UserCircle2 className="w-4 h-4 text-amber-300" />
              <div className="leading-tight">
                <div className="font-semibold text-white truncate max-w-[120px]">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-300 truncate">{currentUser.role === 'admin' ? 'แอดมิน' : currentUser.zone}</div>
              </div>
            </div>
          ) : null}

          {/* Google Sheets Sync Status & Trigger */}
          <button
            id="nav-google-sheets-btn"
            onClick={() => setSheetsModalOpen(true)}
            title={isGoogleConnected ? "Google Sheets: เชื่อมต่อแล้ว (คลิกดู/ซิงค์ข้อมูล)" : "เชื่อมต่อกับ Google Sheets"}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              isGoogleConnected
                ? 'bg-emerald-800/90 border-emerald-400 text-emerald-100 hover:bg-emerald-700 shadow-xs'
                : 'bg-emerald-950/90 border-amber-400/80 text-amber-200 hover:bg-emerald-900'
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${isGoogleConnected ? 'text-emerald-300' : 'text-amber-300'}`} />
            <span className="hidden sm:inline">
              {isGoogleConnected ? 'Google Sheet' : 'ต่อ Google Sheet'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isGoogleConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Refresh Button */}
          <button
            id="nav-refresh-btn"
            onClick={refreshData}
            title="รีเฟรชข้อมูล"
            className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/60 text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 text-emerald-100 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
          </button>

          {/* Settings Button (Only for Admin) */}
          {currentUser?.role === 'admin' && (
            <button
              id="nav-settings-btn"
              onClick={() => setSettingsModalOpen(true)}
              title="ตั้งค่าระบบ / จัดการพนักงาน"
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/60 text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <Settings className="w-4 h-4 text-emerald-100" />
            </button>
          )}

          {/* Login / Logout Button */}
          {currentUser ? (
            <button
              id="nav-logout-btn"
              onClick={logout}
              title="ออกจากระบบ"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 border border-rose-700/60 text-rose-100 text-xs font-semibold transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ออก</span>
            </button>
          ) : (
            <button
              id="nav-login-btn"
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
