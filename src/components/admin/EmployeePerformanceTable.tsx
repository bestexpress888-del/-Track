import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, TrendingUp, Store, Target, Milestone, User } from 'lucide-react';

export const EmployeePerformanceTable: React.FC = () => {
  const { users, records, geniusTracksTrips, ecountDataMap } = useApp();

  const salesUsers = users.filter(u => u.role === 'sales');

  const getSalesRepStats = (userId: string) => {
    const userRecs = records.filter(r => r.salesRepId === userId);
    const totalVisits = userRecs.length;
    const closedVisits = userRecs.filter(r => r.status === 'ปิดการขาย').length;
    const ecount = ecountDataMap[userId];
    const salesTotal = ecount?.monthlySales || userRecs.reduce((sum, r) => sum + (r.amount || 0), 0);
    const target = ecount?.monthlyTarget || 1500000;
    const attainment = Math.round((salesTotal / target) * 100);
    const trip = geniusTracksTrips.find(t => t.salesRepId === userId);
    const km = trip?.totalDistanceKm || 100;

    return { totalVisits, closedVisits, salesTotal, target, attainment, km };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              ยอดขายแต่ละพนักงาน (Sales Representative Leaderboard)
            </h3>
            <p className="text-[11px] text-slate-400">
              เปรียบเทียบผลงานการลงพื้นที่, ยอดขายสะสม และการบรรลุเป้าหมาย
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
          ข้อมูลประจำเดือน กันยายน 2569
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
            <tr>
              <th className="py-3 px-4">พนักงานขาย</th>
              <th className="py-3 px-4">เขตรับผิดชอบ</th>
              <th className="py-3 px-4 text-center">เข้าพบร้านค้า</th>
              <th className="py-3 px-4 text-center">ระยะทาง GPS</th>
              <th className="py-3 px-4 text-right">ยอดขายรวม (บาท)</th>
              <th className="py-3 px-4 text-center">เป้าหมายประจำเดือน</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salesUsers.map((user, rank) => {
              const stats = getSalesRepStats(user.id);
              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-200 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        user.name.slice(0, 1)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {rank === 0 && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                            Top Sales
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        โทร: {user.phone}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      {user.zone}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="font-bold text-slate-800">{stats.totalVisits} ร้านค้า</div>
                    <div className="text-[10px] text-emerald-700">ปิดขาย {stats.closedVisits} ร้าน</div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {stats.km} กม.
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="font-black text-sm text-emerald-800">
                      ฿ {stats.salesTotal.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      เป้า ฿ {stats.target.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      stats.attainment >= 100
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {stats.attainment >= 100 ? `ทะลุเป้า ${stats.attainment}%` : `คืบหน้า ${stats.attainment}%`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
