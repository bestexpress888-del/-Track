import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PlusCircle, 
  ListCheck, 
  Clock, 
  PieChart, 
  User, 
  MapPin, 
  Building
} from 'lucide-react';
import { RecordVisitForm } from './RecordVisitForm';
import { MyRecordsList } from './MyRecordsList';
import { AttendanceView } from './AttendanceView';
import { PerformanceView } from './PerformanceView';
import { UnitedDevLogo } from '../UnitedDevLogo';

export const SalesView: React.FC = () => {
  const { currentUser, activeSalesTab, setActiveSalesTab } = useApp();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 animate-fade-in pb-12">
      {/* Top Sales Profile Badge */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-4 pointer-events-none">
          <UnitedDevLogo className="w-48 h-48" showText={true} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-white p-1 border-2 border-amber-300 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UnitedDevLogo className="w-full h-full" showText={false} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                  พนักงานขาย (Sales Rep)
                </span>
                <span className="text-xs text-emerald-200">
                  รหัส: {currentUser?.username || 'sales01'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {currentUser?.name || 'พนักงานขาย ปุ๋ยทวีผล'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-emerald-100 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentUser?.zone || 'ภาคกลาง'}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-600/50 rounded-2xl px-3.5 py-2 text-right">
            <div className="text-[10px] text-emerald-300">บริษัท ปุ๋ยทวีผล จำกัด</div>
            <div className="text-xs font-bold text-amber-300">ระบบภาคสนาม Field Track</div>
          </div>
        </div>
      </div>

      {/* 4 Main Nav Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-bold">
        <button
          onClick={() => setActiveSalesTab('record')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
            activeSalesTab === 'record'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>บันทึกใหม่</span>
        </button>

        <button
          onClick={() => setActiveSalesTab('list')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
            activeSalesTab === 'list'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ListCheck className="w-4 h-4" />
          <span>รายการของฉัน</span>
        </button>

        <button
          onClick={() => setActiveSalesTab('clock')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
            activeSalesTab === 'clock'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>เข้า-ออกงาน</span>
        </button>

        <button
          onClick={() => setActiveSalesTab('summary')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl transition-all ${
            activeSalesTab === 'summary'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>สรุปผลงาน</span>
        </button>
      </div>

      {/* Active Tab View */}
      <main className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 min-h-[500px]">
        {activeSalesTab === 'record' && <RecordVisitForm />}
        {activeSalesTab === 'list' && <MyRecordsList />}
        {activeSalesTab === 'clock' && <AttendanceView />}
        {activeSalesTab === 'summary' && <PerformanceView />}
      </main>
    </div>
  );
};
