import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  CreditCard, 
  Database, 
  RotateCw, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Store, 
  FileSpreadsheet,
  Target
} from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const { currentUser, ecountDataMap } = useApp();
  const [syncing, setSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('21 ก.ย. 2569 เวลา 16:30 น.');

  const ecount = (currentUser && ecountDataMap[currentUser.id]) || ecountDataMap['usr_sales_01'];

  const handleSyncEcount = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 600));
    setSyncing(false);
    const now = new Date();
    setLastSyncText(`21 ก.ย. 2569 เวลา ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`);
  };

  const percentAchieved = ecount?.monthlyTarget 
    ? Math.min(100, Math.round((ecount.monthlySales / ecount.monthlyTarget) * 100))
    : 85;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>สรุปผลงาน (ข้อมูลเชื่อมโยงจาก Ecount ERP)</span>
          </h3>
          <p className="text-[11px] text-emerald-800/80 mt-0.5">
            ดึงข้อมูลยอดลูกหนี้และยอดขายตามเวลาจริงจากระบบ ERP Ecount ของบริษัท
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[10px] bg-white border border-emerald-200 px-2.5 py-1 rounded-full text-emerald-800 font-medium flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-600" />
            <span>ซิงค์: {lastSyncText}</span>
          </div>
          <button
            onClick={handleSyncEcount}
            disabled={syncing}
            className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all active:scale-95 text-xs flex items-center gap-1"
            title="ดึงข้อมูลล่าสุดจาก Ecount"
          >
            <RotateCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-amber-300' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2 Main Topics as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* หัวข้อ 1: ยอดลูกหนี้ปัจจุบัน ดึงข้อมูลมาจาก Ecount */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">ยอดลูกหนี้ปัจจุบัน</h4>
                <div className="text-[11px] text-slate-400">ดึงข้อมูลมาจาก Ecount</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
              Ecount AR
            </span>
          </div>

          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-amber-100 font-medium">ยอดลูกหนี้คงค้างในเขตรับผิดชอบ</div>
            <div className="text-3xl font-black tracking-tight mt-1">
              ฿ {ecount.currentReceivables.toLocaleString()}.00
            </div>
            {ecount.overdueReceivables > 0 ? (
              <div className="mt-2 text-xs bg-black/20 p-2 rounded-xl flex items-center gap-1.5 text-amber-200 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>เกินกำหนดชำระ: ฿ {ecount.overdueReceivables.toLocaleString()} (กรุณาติดตาม)</span>
              </div>
            ) : (
              <div className="mt-2 text-xs bg-black/20 p-2 rounded-xl flex items-center gap-1.5 text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>ไม่มีหนี้เกินกำหนดชำระ สถานะดีเยี่ยม</span>
              </div>
            )}
          </div>

          {/* Detailed Invoices from Ecount */}
          <div className="space-y-2 flex-1">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>รายการลูกหนี้รายร้านค้า (Invoices)</span>
            </div>
            <div className="space-y-2 text-xs">
              {ecount.invoices.map(inv => (
                <div
                  key={inv.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-slate-800 text-xs">{inv.storeName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      บิล: {inv.invoiceNo} • กำหนด: {inv.dueDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800 text-xs">
                      ฿ {inv.amount.toLocaleString()}
                    </div>
                    <span className={`inline-block text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      inv.status === 'overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {inv.status === 'overdue' ? `เกิน ${inv.overdueDays} วัน` : 'ปกติ'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* หัวข้อ 2: ยอดขายเดือนนี้ ดึงข้อมูลมาจาก Ecount */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">ยอดขายเดือนนี้</h4>
                <div className="text-[11px] text-slate-400">ดึงข้อมูลมาจาก Ecount</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Ecount Sales
            </span>
          </div>

          <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-emerald-200 font-medium">ยอดขายสะสมประจำเดือน (MTD)</div>
            <div className="text-3xl font-black tracking-tight mt-1 text-amber-300">
              ฿ {ecount.monthlySales.toLocaleString()}.00
            </div>

            {/* Target Progress Bar */}
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-emerald-200">
                <span>ความคืบหน้า: {percentAchieved}%</span>
                <span>เป้าหมาย: ฿ {ecount.monthlyTarget.toLocaleString()}</span>
              </div>
              <div className="w-full bg-emerald-950/60 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${percentAchieved}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Sales breakdown insights */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 text-xs text-slate-700 space-y-2 flex-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>สรุปภาพรวมการขายเดือนนี้</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>• ยอดคงเหลือเพื่อให้ถึงเป้า:</span>
                <strong className="text-slate-800">
                  ฿ {Math.max(0, ecount.monthlyTarget - ecount.monthlySales).toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>• ประเมินโบนัสยอดขาย:</span>
                <strong className="text-emerald-700">ผ่านเกณฑ์ขั้นต้น ระดับ A</strong>
              </div>
              <div className="flex justify-between">
                <span>• อัตราการปิดการขายสำเร็จ:</span>
                <strong className="text-slate-800">82.4%</strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
