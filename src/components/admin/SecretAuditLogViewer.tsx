import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Store, 
  ExternalLink, 
  Image as ImageIcon, 
  User, 
  Compass, 
  X,
  CheckCircle2
} from 'lucide-react';

export const SecretAuditLogViewer: React.FC = () => {
  const { records, attendanceMap, users } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'visits' | 'clockin'>('visits');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span>ระบบตรวจสอบพิกัดเบื้องหลัง (Secret Location Audit)</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                เฉพาะผู้บริหาร
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              พิกัด GPS ณ จุดที่พนักงานบันทึกข้อมูลและเข้างานจริง (ซ่อนไม่ให้พนักงานเห็นในหน้าจอเซลล์)
            </p>
          </div>
        </div>

        {/* Subtab toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('visits')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeSubTab === 'visits'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600'
            }`}
          >
            พิกัดตอนลงพื้นที่ ({records.length})
          </button>
          <button
            onClick={() => setActiveSubTab('clockin')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeSubTab === 'clockin'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600'
            }`}
          >
            พิกัดตอนเข้า-ออกงาน
          </button>
        </div>
      </div>

      {/* Content */}
      {activeSubTab === 'visits' ? (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 bg-amber-50/70 border border-amber-200 p-3 rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              ข้อมูลเหล่านี้ถูกเก็บอัตโนมัติขณะพนักงานกดบันทึกการลงพื้นที่ เพื่อให้ผู้บริหารตรวจสอบว่าพนักงานอยู่หน้าร้านค้าจริงหรือไม่
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">พนักงาน</th>
                  <th className="py-2.5 px-3">ร้านค้าที่เข้าพบ</th>
                  <th className="py-2.5 px-3">พิกัดจริงที่ตรวจจับได้ (Lat, Lng)</th>
                  <th className="py-2.5 px-3">เวลาที่กดบันทึก</th>
                  <th className="py-2.5 px-3">รูปถ่ายหลักฐาน</th>
                  <th className="py-2.5 px-3 text-right">เปิดแผนที่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div>{rec.salesRepName}</div>
                      <div className="text-[10px] text-slate-400">{rec.zone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{rec.storeName}</div>
                      <div className="text-[10px] text-slate-500">โทร: {rec.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-emerald-700 font-bold">
                        {rec.secretLocation.lat}, {rec.secretLocation.lng}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {rec.secretLocation.addressSnippet || 'พิกัด GPS อุปกรณ์'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{rec.date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rec.time} น.</div>
                    </td>
                    <td className="py-3 px-3">
                      {rec.photoUrl ? (
                        <button
                          onClick={() => setSelectedPhoto(rec.photoUrl || null)}
                          className="flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>ดูรูป ({rec.status})</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">ไม่มีรูปภาพ</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`https://www.google.com/maps?q=${rec.secretLocation.lat},${rec.secretLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-semibold"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Google Map</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Clock In / Out secret locations */
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">พนักงาน</th>
                  <th className="py-2.5 px-3">เวลาเข้างาน</th>
                  <th className="py-2.5 px-3">พิกัดตอนเข้างาน (ซ่อนจากเซลล์)</th>
                  <th className="py-2.5 px-3">เวลาออกงาน</th>
                  <th className="py-2.5 px-3">พิกัดตอนออกงาน (ซ่อนจากเซลล์)</th>
                  <th className="py-2.5 px-3 text-right">ระยะทางรวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(attendanceMap).map(att => (
                  <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {att.salesRepName}
                    </td>
                    <td className="py-3 px-3 text-emerald-800 font-semibold">
                      {att.clockInTime || '-'}
                    </td>
                    <td className="py-3 px-3">
                      {att.secretClockInLocation ? (
                        <div>
                          <span className="font-mono text-emerald-700 font-bold">
                            {att.secretClockInLocation.lat}, {att.secretClockInLocation.lng}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {att.secretClockInLocation.addressSnippet}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-amber-800 font-semibold">
                      {att.clockOutTime || 'ยังไม่ออกงาน'}
                    </td>
                    <td className="py-3 px-3">
                      {att.secretClockOutLocation ? (
                        <div>
                          <span className="font-mono text-amber-700 font-bold">
                            {att.secretClockOutLocation.lat}, {att.secretClockOutLocation.lng}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {att.secretClockOutLocation.addressSnippet}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">
                      {att.calculatedDistanceKm} กม.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-3 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="หลักฐานหน้าร้าน"
              className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 text-center text-xs text-slate-500 font-medium">
              หลักฐานรูปถ่ายสถานที่จริง - ปุ๋ยทวีผล แอดมินตรวจสอบ
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
