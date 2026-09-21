import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Store, 
  Phone, 
  UserCheck, 
  Camera, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  X,
  Search,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { VisitStatus, CustomerMemory } from '../../types';

export const RecordVisitForm: React.FC = () => {
  const { 
    addVisitRecord, 
    searchCustomers, 
    setActiveSalesTab,
    isGoogleConnected,
    spreadsheetTitle,
    setSheetsModalOpen
  } = useApp();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<VisitStatus>('เยี่ยมชม');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [note, setNote] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Autocomplete suggestions
  const [suggestResults, setSuggestResults] = useState<CustomerMemory[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-search customer when typing store name or phone
  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    if (val.trim().length >= 2) {
      const results = searchCustomers(val);
      setSuggestResults(results);
      setShowSuggest(results.length > 0);
    } else {
      setShowSuggest(false);
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (val.trim().length >= 3) {
      const results = searchCustomers(val);
      setSuggestResults(results);
      setShowSuggest(results.length > 0);
    } else {
      setShowSuggest(false);
    }
  };

  const handleSelectCustomer = (cust: CustomerMemory) => {
    setStoreName(cust.storeName);
    setPhone(cust.phone);
    if (cust.contactPerson) setContactPerson(cust.contactPerson);
    setShowSuggest(false);
  };

  // Image capture / upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !phone.trim()) {
      alert('กรุณากรอกชื่อร้านค้าและเบอร์โทรศัพท์');
      return;
    }

    setIsSubmitting(true);
    try {
      // SILENT LOCATION CAPTURE in background: Employee is NOT shown coordinates!
      await addVisitRecord({
        date,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        storeName: storeName.trim(),
        phone: phone.trim(),
        contactPerson: contactPerson.trim() || undefined,
        status,
        amount: 0,
        photoUrl: photoPreview || undefined,
        note: note.trim() || '-',
      });

      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        setActiveSalesTab('list');
      }, 1200);

      // Reset form
      setStoreName('');
      setPhone('');
      setContactPerson('');
      setNote('');
      setPhotoPreview(null);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-emerald-700" />
            <span>บันทึกการลงพื้นที่ (Check-in ร้านค้า)</span>
          </h3>
          <p className="text-[11px] text-emerald-800/80 mt-0.5">
            บันทึกการเข้าพบลูกค้า ระบบจะช่วยจำข้อมูลร้านค้าและบันทึกข้อมูลอัตโนมัติ
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSheetsModalOpen(true)}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs transition-all cursor-pointer ${
              isGoogleConnected
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
            }`}
          >
            <FileSpreadsheet className="w-3 h-3" />
            <span>{isGoogleConnected ? 'Google Sheets' : 'เชื่อมต่อ Sheet'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3 bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
          <span>บันทึกข้อมูลการลงพื้นที่เรียบร้อยแล้ว กำลังนำทางไปที่รายการของฉัน...</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-700">
        {/* Date & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>เลือกวันที่ <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none shadow-xs font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
              <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
              <span>สถานะการเข้าพบ <span className="text-rose-500">*</span></span>
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={e => setStatus(e.target.value as VisitStatus)}
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none shadow-xs font-medium text-slate-800 appearance-none pr-8 cursor-pointer"
              >
                <option value="เยี่ยมชม">เยี่ยมชม (เยี่ยมเยียน/ตรวจสต็อก)</option>
                <option value="เสนอราคา">เสนอราคา (ส่งใบเสนอราคาปุ๋ย)</option>
                <option value="ปิดการขาย">ปิดการขาย (เปิดบิลสั่งซื้อสำเร็จ)</option>
                <option value="ติดตามผล">ติดตามผล (ผลการใช้ปุ๋ย/การชำระเงิน)</option>
                <option value="ไม่สำเร็จ">ไม่สำเร็จ (ร้านปิด/ไม่สะดวกพบ)</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Store Name with Auto-Memory Dropdown */}
        <div className="relative">
          <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-emerald-700" />
              <span>ชื่อลูกค้า / ร้านค้า <span className="text-rose-500">*</span></span>
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              * ระบบช่วยจำข้อมูลเดิมอัตโนมัติ
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="พิมพ์ชื่อร้าน หรือพิมพ์บางส่วน เช่น รุ่งเรือง, ส.การเกษตร..."
              value={storeName}
              onChange={e => handleStoreNameChange(e.target.value)}
              onFocus={() => {
                if (storeName.trim().length >= 2) {
                  const res = searchCustomers(storeName);
                  setSuggestResults(res);
                  setShowSuggest(res.length > 0);
                }
              }}
              className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-8 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none shadow-xs text-slate-800 font-medium placeholder:font-normal placeholder:text-slate-400"
            />
            {storeName && (
              <button
                type="button"
                onClick={() => {
                  setStoreName('');
                  setShowSuggest(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete suggestions popup */}
          {showSuggest && suggestResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-emerald-200 rounded-2xl shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
              <div className="p-2 bg-emerald-50/80 border-b border-emerald-100 text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                <Search className="w-3 h-3 text-emerald-700" />
                <span>พบข้อมูลร้านค้าที่เคยบันทึกไว้ (คลิกเพื่อเลือกทันที):</span>
              </div>
              {suggestResults.map(cust => (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => handleSelectCustomer(cust)}
                  className="w-full text-left p-2.5 hover:bg-emerald-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>{cust.storeName}</span>
                    <span className="text-[10px] text-emerald-700 font-normal">{cust.province || 'เคยบันทึกแล้ว'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>โทร: {cust.phone}</span>
                    {cust.contactPerson && <span>• ติดต่อ: {cust.contactPerson}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone & Contact Person */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>เบอร์โทรศัพท์ร้านค้า <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="tel"
              required
              placeholder="08X-XXX-XXXX หรือ 02-XXX-XXXX"
              value={phone}
              onChange={e => handlePhoneChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none shadow-xs text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>ชื่อผู้ติดต่อ / เถ้าแก่ (ถ้ามี)</span>
            </label>
            <input
              type="text"
              placeholder="เช่น เถ้าแก่ชัย, คุณสมร ผู้จัดการร้าน"
              value={contactPerson}
              onChange={e => setContactPerson(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none shadow-xs text-slate-800"
            />
          </div>
        </div>

        {/* Store Photo / Evidence Upload */}
        <div>
          <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>รูปถ่ายหน้าร้าน / หลักฐานการลงพื้นที่</span>
            </span>
            <span className="text-[10px] text-slate-400">
              กล้องมือถือ / ไฟล์ภาพ
            </span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {photoPreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-sm">
              <img
                src={photoPreview}
                alt="รูปถ่ายหน้าร้าน"
                className="w-full h-44 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" />
                  <span>ถ่ายใหม่</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="px-2.5 py-1 bg-rose-800/90 hover:bg-rose-900 text-white rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>ลบภาพ</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-full bg-emerald-700 group-hover:bg-emerald-800 text-white flex items-center justify-center mb-1.5 shadow-sm transition-all">
                <Camera className="w-5 h-5" />
              </div>
              <span className="font-bold text-emerald-900 text-xs">
                กดเพื่อเปิดกล้องถ่ายภาพ หรือเลือกรูปจากคลังภาพ
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                รองรับไฟล์ JPG, PNG (ถ่ายภาพหน้าร้านค้า, ป้ายร้าน หรือใบรับสินค้า)
              </span>
            </button>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>หมายเหตุ</span>
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="เช่น สั่งซื้อสูตร 16-16-16 จำนวน 20 ตัน, สนใจปุ๋ยอินทรีย์อัดเม็ด, สภาพสต็อกหน้าร้านคงเหลือ 10 กระสอบ..."
            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none shadow-xs text-slate-800"
          ></textarea>
        </div>

        {/* Security badge: Location captured silently in background */}
        <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-800 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>ระบบรักษาความปลอดภัยบันทึกเวลาและหลักฐานการเช็คอินเรียบร้อย</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
        >
          {isGoogleConnected ? (
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>
            {isSubmitting 
              ? 'กำลังประมวลผลและบันทึก...' 
              : isGoogleConnected 
                ? 'บันทึกข้อมูล (ส่งต่อ Google Sheets อัตโนมัติ)' 
                : 'บันทึกข้อมูลการลงพื้นที่'}
          </span>
        </button>
      </form>
    </div>
  );
};
