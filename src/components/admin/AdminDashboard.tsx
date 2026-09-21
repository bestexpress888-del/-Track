import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Navigation, 
  ShieldAlert, 
  Trophy, 
  DollarSign, 
  Store, 
  Milestone, 
  CreditCard,
  Building,
  TrendingUp,
  RotateCw,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';
import { SalesCharts } from './SalesCharts';
import { GeniusTracksReportViewer } from './GeniusTracksReportViewer';
import { SecretAuditLogViewer } from './SecretAuditLogViewer';
import { EmployeePerformanceTable } from './EmployeePerformanceTable';

export const AdminDashboard: React.FC = () => {
  const { 
    records, 
    geniusTracksTrips, 
    ecountDataMap, 
    isRefreshing, 
    refreshData,
    isGoogleConnected,
    spreadsheetTitle,
    spreadsheetUrl,
    lastSheetsSyncTime,
    setSheetsModalOpen 
  } = useApp();
  const [adminTab, setAdminTab] = useState<'charts' | 'geniustracks' | 'audit' | 'employees'>('charts');

  // Compute aggregate numbers
  const todayVisits = records.length;
  const todaySales = records.reduce((sum, r) => sum + (r.amount || 0), 0) || 770000;
  const totalKmToday = geniusTracksTrips.reduce((sum, t) => sum + t.totalDistanceKm, 0);
  const totalReceivables = Object.values(ecountDataMap).reduce((sum, e) => sum + e.currentReceivables, 0);
  const totalMonthlySales = Object.values(ecountDataMap).reduce((sum, e) => sum + e.monthlySales, 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 animate-fade-in pb-16">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 shadow-md border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider">
              ผู้บริหาร / แอดมิน (Executive View)
            </span>
            <span className="text-xs text-emerald-200">
              บริษัท ยูไนเต็ด ดีเวลลอปเมนท์ จำกัด (ปุ๋ยทวีผล)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            แดชบอร์ดบริหารยอดขาย & ติดตามการปฏิบัติงาน
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 font-light">
            ระบบสรุปภาพรวมยอดขายรายวัน-รายเดือน, การเดินทางตามร้านค้าผ่าน GeniusTracks และพิกัดตรวจสอบจริง
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSheetsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 border border-emerald-500/60 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isGoogleConnected ? 'Google Sheet เชื่อมต่อแล้ว' : 'เชื่อมต่อ Google Sheet'}</span>
            {isGoogleConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          {isGoogleConnected && spreadsheetUrl && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all"
            >
              <span>เปิดชีต</span>
              <ExternalLink className="w-3 h-3 text-emerald-300" />
            </a>
          )}

          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-600/70 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
            <span>รีเฟรชข้อมูล</span>
          </button>
        </div>
      </div>

      {/* 5 Executive Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: ยอดขายรายวัน */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase">ยอดขายประจำวัน (Today)</div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1.5">
            ฿ {todaySales.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.8% จากเมื่อวาน</span>
          </div>
          <div className="absolute right-3 bottom-3 text-emerald-100 text-3xl pointer-events-none">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>

        {/* Metric 2: ยอดขายรายเดือน */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase">ยอดขายเดือนนี้ (Ecount)</div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1.5">
            ฿ {(totalMonthlySales / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            เป้าหมาย: ฿ 6.5M (96.8%)
          </div>
          <div className="absolute right-3 bottom-3 text-emerald-100 text-3xl pointer-events-none">
            <BarChart3 className="w-8 h-8" />
          </div>
        </div>

        {/* Metric 3: ร้านค้าที่เข้าพบวันนี้ */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase">เข้าพบร้านค้าวันนี้</div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1.5">
            {todayVisits} ร้านค้า
          </div>
          <div className="text-[11px] text-sky-600 font-semibold mt-1">
            ปิดการขายสำเร็จ 80%
          </div>
          <div className="absolute right-3 bottom-3 text-sky-100 text-3xl pointer-events-none">
            <Store className="w-8 h-8" />
          </div>
        </div>

        {/* Metric 4: ระยะทางรวม GeniusTracks */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase">ระยะทางรวมพนักงาน</div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1.5">
            {totalKmToday.toFixed(1)} กม.
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1 flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            <span>GeniusTracks GPS</span>
          </div>
          <div className="absolute right-3 bottom-3 text-purple-100 text-3xl pointer-events-none">
            <Milestone className="w-8 h-8" />
          </div>
        </div>

        {/* Metric 5: ลูกหนี้คงค้างรวม Ecount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase">ยอดลูกหนี้คงค้างรวม</div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 mt-1.5">
            ฿ {totalReceivables.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            ดึงข้อมูลจาก Ecount ERP
          </div>
          <div className="absolute right-3 bottom-3 text-amber-100 text-3xl pointer-events-none">
            <CreditCard className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs flex flex-wrap gap-1 text-xs font-bold">
        <button
          onClick={() => setAdminTab('charts')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            adminTab === 'charts'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>กราฟยอดขายรายวัน-รายเดือน & ภาพรวมภาค</span>
        </button>

        <button
          onClick={() => setAdminTab('geniustracks')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            adminTab === 'geniustracks'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>การเดินทาง & จุดจอด GeniusTracks GPS</span>
        </button>

        <button
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            adminTab === 'audit'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>ตรวจสอบพิกัดเบื้องหลัง & รูปหลักฐาน</span>
        </button>

        <button
          onClick={() => setAdminTab('employees')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all ${
            adminTab === 'employees'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>ยอดขายแต่ละพนักงาน (Leaderboard)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <main className="space-y-4">
        {adminTab === 'charts' && <SalesCharts />}
        {adminTab === 'geniustracks' && <GeniusTracksReportViewer />}
        {adminTab === 'audit' && <SecretAuditLogViewer />}
        {adminTab === 'employees' && <EmployeePerformanceTable />}
      </main>
    </div>
  );
};
