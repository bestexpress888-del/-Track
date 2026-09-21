import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart as PieIcon, Calendar, DollarSign } from 'lucide-react';

export const SalesCharts: React.FC = () => {
  const [chartMode, setChartMode] = useState<'daily' | 'monthly'>('daily');

  // Daily Sales data
  const dailyData = [
    { day: 'จันทร์ (15)', sales: 380000, visits: 6 },
    { day: 'อังคาร (16)', sales: 520000, visits: 8 },
    { day: 'พุธ (17)', sales: 440000, visits: 7 },
    { day: 'พฤหัส (18)', sales: 690000, visits: 9 },
    { day: 'ศุกร์ (19)', sales: 810000, visits: 11 },
    { day: 'เสาร์ (20)', sales: 430000, visits: 6 },
    { day: 'วันนี้ (21)', sales: 770000, visits: 8 },
  ];

  // Monthly Sales data
  const monthlyData = [
    { month: 'เม.ย.', sales: 4100000, target: 4500000 },
    { month: 'พ.ค.', sales: 5300000, target: 5000000 },
    { month: 'มิ.ย.', sales: 5800000, target: 5500000 },
    { month: 'ก.ค.', sales: 6200000, target: 6000000 },
    { month: 'ส.ค.', sales: 6900000, target: 6500000 },
    { month: 'ก.ย. (ปัจจุบัน)', sales: 6290000, target: 7000000 },
  ];

  // Regional breakdown
  const regionalData = [
    { region: 'ภาคกลาง', amount: 2450000, percent: 39, color: '#15803d', bg: 'bg-emerald-700' },
    { region: 'ภาคเหนือ', amount: 1650000, percent: 26, color: '#0284c7', bg: 'bg-sky-600' },
    { region: 'ภาคอีสาน', amount: 1420000, percent: 23, color: '#d97706', bg: 'bg-amber-600' },
    { region: 'ภาคใต้', amount: 770000, percent: 12, color: '#7e22ce', bg: 'bg-purple-700' },
  ];

  const maxDaily = Math.max(...dailyData.map(d => d.sales));
  const maxMonthly = Math.max(...monthlyData.map(d => Math.max(d.sales, d.target)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left 2 Cols: Daily & Monthly Sales Trend Charts */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                กราฟยอดขาย ปุ๋ยทวีผล ({chartMode === 'daily' ? 'รายวันรอบสัปดาห์' : 'รายเดือนปี 2569'})
              </h3>
              <p className="text-[11px] text-slate-400">
                วิเคราะห์แนวโน้มยอดขายจริงตามเวลา
              </p>
            </div>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setChartMode('daily')}
              className={`px-3 py-1 rounded-lg transition-all ${
                chartMode === 'daily'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ยอดขายรายวัน
            </button>
            <button
              onClick={() => setChartMode('monthly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                chartMode === 'monthly'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ยอดขายรายเดือน
            </button>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="py-4">
          {chartMode === 'daily' ? (
            <div className="space-y-4">
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
                {dailyData.map((d, i) => {
                  const heightPct = Math.round((d.sales / maxDaily) * 100);
                  const isToday = i === dailyData.length - 1;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ฿{(d.sales / 1000).toFixed(0)}k
                      </div>
                      <div
                        className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 group-hover:opacity-90 relative ${
                          isToday
                            ? 'bg-gradient-to-t from-emerald-800 to-emerald-500 shadow-md shadow-emerald-500/20'
                            : 'bg-emerald-600/85 hover:bg-emerald-600'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      >
                        {isToday && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400"></span>
                        )}
                      </div>
                      <div className={`text-[11px] text-center font-medium mt-1 ${isToday ? 'text-emerald-900 font-bold' : 'text-slate-500'}`}>
                        {d.day}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600"></span>
                  <span>ยอดสั่งซื้อปิดการขายรายวัน (บาท)</span>
                </span>
                <span className="font-semibold text-emerald-800">
                  ยอดรวมสัปดาห์นี้: ฿ 4,040,000 บาท
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2">
                {monthlyData.map((m) => {
                  const salesHeight = Math.round((m.sales / maxMonthly) * 100);
                  const targetHeight = Math.round((m.target / maxMonthly) * 100);
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ฿{(m.sales / 1000000).toFixed(1)}M
                      </div>
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        {/* Target Column */}
                        <div
                          className="w-1/2 max-w-[20px] bg-slate-200 rounded-t-lg"
                          style={{ height: `${targetHeight}%` }}
                          title={`เป้า: ฿${m.target.toLocaleString()}`}
                        ></div>
                        {/* Actual Sales Column */}
                        <div
                          className="w-1/2 max-w-[20px] bg-emerald-700 rounded-t-lg shadow-sm"
                          style={{ height: `${salesHeight}%` }}
                          title={`ยอดจริง: ฿${m.sales.toLocaleString()}`}
                        ></div>
                      </div>
                      <div className="text-[11px] text-center font-medium mt-1 text-slate-600">
                        {m.month}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-700"></span>
                    <span>ยอดขายจริง (Ecount)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-300"></span>
                    <span>เป้าหมายบริษัท</span>
                  </span>
                </div>
                <span className="font-semibold text-emerald-800">
                  บรรลุเป้าเฉลี่ย: 96.8%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right 1 Col: Regional Overview (ภาพรวมของภาค) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              ภาพรวมของภาค (Regional Sales)
            </h3>
            <p className="text-[11px] text-slate-400">
              สัดส่วนยอดขายแบ่งตามภูมิภาคทั่วประเทศ
            </p>
          </div>
        </div>

        {/* Stacked Progress Bar representation */}
        <div className="space-y-3">
          <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-slate-100">
            {regionalData.map(r => (
              <div
                key={r.region}
                className={`${r.bg} transition-all duration-500 hover:opacity-90`}
                style={{ width: `${r.percent}%` }}
                title={`${r.region}: ${r.percent}% (฿${r.amount.toLocaleString()})`}
              ></div>
            ))}
          </div>

          <div className="space-y-2.5 pt-2">
            {regionalData.map(r => (
              <div
                key={r.region}
                className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${r.bg}`}></span>
                  <span className="font-bold text-slate-800">{r.region}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">฿ {r.amount.toLocaleString()}</span>
                  <span className="text-slate-400 text-[11px] ml-1.5">({r.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900">
          <div className="font-bold">สรุปภูมิภาคดาวเด่น: ภาคกลาง</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            ยอดสั่งซื้อปุ๋ยเคมีและอินทรีย์ชีวภาพขยายตัวสูง 14% เทียบกับเดือนก่อน
          </div>
        </div>
      </div>
    </div>
  );
};
