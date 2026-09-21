import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ListOrdered, 
  Calendar, 
  Store, 
  Search, 
  Phone, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle, 
  Clock, 
  X,
  Trash2,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { VisitRecord } from '../../types';

export const MyRecordsList: React.FC = () => {
  const { 
    records, 
    currentUser, 
    deleteVisitRecord,
    isGoogleConnected,
    spreadsheetTitle,
    spreadsheetUrl,
    lastSheetsSyncTime,
    setSheetsModalOpen,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filter records by current user and search/date
  const userRecords = records.filter(r => {
    // If sales rep, show their own records; if admin previewing, show all or filtered
    if (currentUser?.role === 'sales' && r.salesRepId !== currentUser.id) {
      return false;
    }
    if (selectedDate && r.date !== selectedDate) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStore = r.storeName.toLowerCase().includes(q);
      const matchPhone = r.phone.includes(q);
      const matchNote = r.note.toLowerCase().includes(q);
      return matchStore || matchPhone || matchNote;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ปิดการขาย':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'เสนอราคา':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ติดตามผล':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ไม่สำเร็จ':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const totalAmount = userRecords.reduce((acc, r) => acc + (r.amount || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-emerald-700" />
              <span>รายการของฉัน (สรุปการลงพื้นที่ประจำวัน)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              สรุปรายการเข้าพบร้านค้าและงานที่บันทึกไว้ ({userRecords.length} รายการ)
            </p>
          </div>
          {totalAmount > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-right">
              <div className="text-[10px] text-emerald-700 font-semibold">ยอดปิดการขายรวม</div>
              <div className="text-sm font-bold text-emerald-900">฿ {totalAmount.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อร้าน, เบอร์โทร, หมายเหตุ..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[11px] font-semibold whitespace-nowrap"
              >
                ล้างวันที่
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Google Sheets Sync Banner */}
      <div className={`rounded-2xl p-3.5 border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
        isGoogleConnected
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/70 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isGoogleConnected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
          }`}>
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-bold flex items-center gap-1.5 truncate">
              <span>{isGoogleConnected ? 'เชื่อมต่อ Google Sheet แล้ว' : 'ยังไม่ได้เชื่อมต่อ Google Sheet'}</span>
              {isGoogleConnected && (
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.2 rounded-full font-medium shrink-0">
                  Auto-Sync
                </span>
              )}
            </div>
            <div className="text-[11px] opacity-80 truncate">
              {isGoogleConnected
                ? `ไฟล์: ${spreadsheetTitle || 'สเปรดชีตของบริษัท'}`
                : 'เชื่อมต่อเพื่อให้ระบบบันทึกรายการลงพื้นที่ของพนักงานลง Google Sheet อัตโนมัติ'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {isGoogleConnected && spreadsheetUrl && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
            >
              <span>เปิด Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            type="button"
            onClick={() => setSheetsModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
              isGoogleConnected
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {isGoogleConnected ? 'จัดการการซิงค์' : 'เชื่อมต่อตอนนี้'}
          </button>
        </div>
      </div>

      {/* Record Cards */}
      {userRecords.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-400 text-xs">
          <Store className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-slate-600">ยังไม่พบรายการลงพื้นที่ตามเงื่อนไข</p>
          <p className="text-[11px] mt-1 text-slate-400">
            คุณสามารถไปที่แท็บ &quot;บันทึกใหม่&quot; เพื่อเพิ่มรายการเช็คอินร้านค้า
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userRecords.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 space-y-2.5"
            >
              {/* Row 1: Date & Status */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-bold text-slate-700">{item.date}</span>
                  <span className="text-slate-400">• {item.time} น.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`ต้องการลบรายการของ ${item.storeName} ใช่หรือไม่?`)) {
                        deleteVisitRecord(item.id);
                      }
                    }}
                    title="ลบรายการนี้"
                    className="text-slate-300 hover:text-rose-500 p-1 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Row 2: Store Name & Phone */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span>{item.storeName}</span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <Phone className="w-3 h-3" />
                      {item.phone}
                    </span>
                    {item.contactPerson && (
                      <span className="text-slate-400">• ผู้ติดต่อ: {item.contactPerson}</span>
                    )}
                  </div>
                </div>

                {item.amount > 0 && (
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400">ยอดขาย</div>
                    <div className="text-sm font-bold text-emerald-700">
                      ฿ {item.amount.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3: Note */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-700 flex items-start gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-slate-600">หมายเหตุ: </span>
                  <span>{item.note}</span>
                </div>
              </div>

              {/* Row 4: Photo Thumbnail if available */}
              {item.photoUrl && (
                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewImage(item.photoUrl || null)}
                    className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>ดูรูปถ่ายหน้าร้าน / หลักฐาน</span>
                  </button>
                  <img
                    src={item.photoUrl}
                    alt={item.storeName}
                    onClick={() => setPreviewImage(item.photoUrl || null)}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Modal Lightbox */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-3 max-w-lg w-full overflow-hidden relative shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="รูปถ่ายหลักฐานหน้าร้าน"
              className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 text-center text-xs text-slate-500 font-medium">
              หลักฐานรูปถ่ายหน้าร้าน - ปุ๋ยทวีผล Tracking
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
