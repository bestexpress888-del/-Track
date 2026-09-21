import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Milestone, 
  Car, 
  ExternalLink, 
  RotateCw, 
  Calendar, 
  User, 
  CheckCircle, 
  ParkingSquare, 
  Flag,
  ArrowRight,
  ShieldCheck,
  Building,
  Store
} from 'lucide-react';
import { GeniusTracksTrip, GeniusTracksTripStop } from '../../types';

export const GeniusTracksReportViewer: React.FC = () => {
  const { geniusTracksTrips, users } = useApp();
  const [selectedSalesRepId, setSelectedSalesRepId] = useState<string>('usr_sales_01');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-21');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState('21 ก.ย. 2569 เวลา 16:30 น.');

  // Find matching trip or fallback to first trip
  const currentTrip: GeniusTracksTrip = geniusTracksTrips.find(
    t => t.salesRepId === selectedSalesRepId
  ) || geniusTracksTrips[0];

  const handleSyncGeniusTracks = async () => {
    setIsSyncing(true);
    await new Promise(res => setTimeout(res, 700));
    setIsSyncing(false);
    const now = new Date();
    setSyncTimestamp(`21 ก.ย. 2569 เวลา ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`);
  };

  const getStopTypeBadge = (type: GeniusTracksTripStop['type']) => {
    switch (type) {
      case 'store':
        return { label: 'ร้านค้าเกษตร', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: Store };
      case 'station':
        return { label: 'ปั๊มน้ำมัน/พักรถ', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: ParkingSquare };
      case 'warehouse':
        return { label: 'คลังสินค้า/สาขา', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Building };
      default:
        return { label: 'จุดจอดพัก', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Flag };
    }
  };

  const totalParkingMinutes = currentTrip.stops.reduce((sum, s) => sum + s.stopDurationMinutes, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-5">
      {/* Top Header & GeniusTracks link */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-700 text-white">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>สรุปการเดินทางของพนักงาน (GeniusTracks GPS Report)</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                  Live Telemetry
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                ดึงข้อมูลสรุปว่าพนักงานแต่ละคนไปจุดไหนบ้าง, จอดจุดไหนบ้าง, สิ้นสุดที่จุดไหน และเดินทางวันนั้นไปกี่ กม.
              </p>
            </div>
          </div>
        </div>

        {/* Source link & Sync action */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="https://track4.geniustracks.com/report"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            title="เปิดหน้าเว็บรายงาน GeniusTracks ต้นฉบับ"
          >
            <span className="font-mono text-[11px]">track4.geniustracks.com</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          <button
            onClick={handleSyncGeniusTracks}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isSyncing ? 'กำลังดึงข้อมูล GPS...' : 'ซิงค์ข้อมูลสด'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Select Sales Rep & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>เลือกพนักงานที่ต้องการตรวจสอบ</span>
          </label>
          <select
            value={selectedSalesRepId}
            onChange={e => setSelectedSalesRepId(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
          >
            {users.filter(u => u.role === 'sales').map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.zone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>เลือกวันที่เดินทาง</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-1 flex items-end">
          <div className="w-full bg-white border border-emerald-200 p-2 rounded-xl text-emerald-900 font-medium flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-700" />
              <span className="font-bold">{currentTrip.vehiclePlate}</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              GPS Online
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Metrics requested by user */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: เดินทางวันนั้นไปกี่ กม. */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
            <Milestone className="w-4 h-4 text-emerald-700" />
            <span>ระยะทางรวมของวัน</span>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-1">
            {currentTrip.totalDistanceKm} กม.
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">
            เวลาเดินทาง: {currentTrip.startTime} - {currentTrip.endTime} น.
          </div>
        </div>

        {/* Metric 2: จำนวนจุดจอด และเวลาจอดรวม */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
            <ParkingSquare className="w-4 h-4 text-amber-700" />
            <span>จุดจอดทั้งหมด</span>
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">
            {currentTrip.stops.length} จุด
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5">
            จอดสะสม: {Math.floor(totalParkingMinutes / 60)} ชม. {totalParkingMinutes % 60} นาที
          </div>
        </div>

        {/* Metric 3: จุดเริ่มต้น */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-blue-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-700" />
            <span>จุดเริ่มต้น ({currentTrip.startTime} น.)</span>
          </div>
          <div className="text-xs font-bold text-blue-950 mt-1 line-clamp-2">
            {currentTrip.startLocation}
          </div>
          <div className="text-[10px] text-blue-600 mt-0.5">เริ่มสตาร์ทรถและออกจากคลัง</div>
        </div>

        {/* Metric 4: สิ้นสุดที่จุดไหน */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/70 border border-purple-200 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-purple-800 flex items-center gap-1.5">
            <Flag className="w-4 h-4 text-purple-700" />
            <span>สิ้นสุดที่จุดไหน ({currentTrip.endTime} น.)</span>
          </div>
          <div className="text-xs font-bold text-purple-950 mt-1 line-clamp-2">
            {currentTrip.endLocation}
          </div>
          <div className="text-[10px] text-purple-600 mt-0.5">ดับเครื่องยนต์สิ้นสุดงาน</div>
        </div>
      </div>

      {/* Visual GPS Timeline of Waypoints & Stops */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-700" />
            <span>ลำดับเส้นทาง GPS, จุดจอด และเวลาจอดแต่ละจุด (Timeline Route)</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {currentTrip.salesRepName} • วันที่ {selectedDate}
          </span>
        </div>

        <div className="p-4 space-y-4">
          {currentTrip.stops.map((stop, idx) => {
            const badge = getStopTypeBadge(stop.type);
            const IconComponent = badge.icon;
            const isLast = idx === currentTrip.stops.length - 1;

            return (
              <div key={stop.id} className="relative flex items-start gap-4">
                {/* Timeline connector line */}
                {!isLast && (
                  <div className="absolute left-4.5 top-9 bottom-[-16px] w-0.5 bg-slate-200 z-0"></div>
                )}

                {/* Node Icon */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 shadow-xs border-2 ${
                  idx === 0 
                    ? 'bg-blue-600 text-white border-blue-200' 
                    : isLast 
                    ? 'bg-purple-700 text-white border-purple-200'
                    : 'bg-emerald-700 text-white border-emerald-200'
                }`}>
                  <span className="text-xs font-black">{idx + 1}</span>
                </div>

                {/* Node Content Card */}
                <div className="flex-1 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl p-3.5 transition-all space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">{stop.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    {stop.stopDurationMinutes > 0 ? (
                      <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 self-start sm:self-auto">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>จอด {stop.stopDurationMinutes} นาที</span>
                      </div>
                    ) : (
                      <div className="text-xs bg-purple-50 border border-purple-200 text-purple-900 font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 self-start sm:self-auto">
                        <Flag className="w-3 h-3 text-purple-600" />
                        <span>จุดจอดค้างคืน</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      <strong>เวลาเข้าจอด:</strong> {stop.arrivalTime} น.
                    </span>
                    {stop.departureTime !== '-' && (
                      <span>
                        <strong>เวลาออกเดินทาง:</strong> {stop.departureTime} น.
                      </span>
                    )}
                    <span className="text-slate-400 font-mono text-[11px]">
                      พิกัด GPS: {stop.lat}, {stop.lng}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="truncate max-w-[450px]">
                      <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
                      {stop.address}
                    </span>
                    {stop.notes && (
                      <span className="text-emerald-700 font-semibold shrink-0 ml-2">
                        {stop.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
