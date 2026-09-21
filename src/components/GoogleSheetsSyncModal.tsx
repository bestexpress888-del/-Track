import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  PlusCircle, 
  Key, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsSyncModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    googleUser,
    isGoogleConnected,
    spreadsheetId,
    spreadsheetUrl,
    spreadsheetTitle,
    lastSheetsSyncTime,
    isSyncingSheets,
    autoSyncSheets,
    setAutoSyncSheets,
    connectGoogleSheets,
    disconnectGoogleSheets,
    createNewSpreadsheet,
    setCustomSpreadsheetId,
    syncAllToGoogleSheets,
    records,
    attendanceMap
  } = useApp();

  const [inputSheetId, setInputSheetId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmSyncAllModal, setConfirmSyncAllModal] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);
    try {
      await connectGoogleSheets();
      setSuccessMsg('เชื่อมต่อบัญชี Google และสิทธิ์ Google Sheets สำเร็จ');
    } catch (err: any) {
      setErrorMsg(err?.message || 'การเข้าสู่ระบบ Google ล้มเหลว');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisconnect = async () => {
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      await disconnectGoogleSheets();
      setSuccessMsg('ยกเลิกการเชื่อมต่อเรียบร้อยแล้ว');
    } catch (err: any) {
      setErrorMsg(err?.message || 'เกิดข้อผิดพลาดในการยกเลิก');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateNewSheet = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);
    try {
      const url = await createNewSpreadsheet();
      setSuccessMsg('สร้าง Google Sheet ใหม่และเตรียมตารางพร้อมใช้งานแล้ว!');
    } catch (err: any) {
      setErrorMsg(err?.message || 'สร้าง Sheet ไม่สำเร็จ');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCustomId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSheetId.trim()) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);
    try {
      await setCustomSpreadsheetId(inputSheetId.trim());
      setInputSheetId('');
      setSuccessMsg('เชื่อมโยงกับ Spreadsheet ID ที่ระบุสำเร็จ!');
    } catch (err: any) {
      setErrorMsg(err?.message || 'ไม่สามารถเชื่อมโยง Spreadsheet ID ได้');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSyncAll = async () => {
    setConfirmSyncAllModal(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsProcessing(true);
    try {
      await syncAllToGoogleSheets();
      setSuccessMsg(`ส่งข้อมูลทั้งหมดเข้าสู่ Google Sheet เรียบร้อยแล้ว (${records.length} รายการลงพื้นที่, ${Object.keys(attendanceMap).length} รายการเวลา)`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'การส่งข้อมูลทั้งหมดล้มเหลว');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 animate-scale-up my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <FileSpreadsheet className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                เชื่อมต่อ Google Sheets
                <span className="text-[11px] bg-emerald-700/80 text-emerald-200 border border-emerald-500/50 px-2 py-0.5 rounded-full font-normal">
                  Auto-Sync
                </span>
              </h3>
              <p className="text-xs text-emerald-150 text-emerald-200 mt-0.5">
                บันทึกการลงพื้นที่และเวลาเข้า-ออกงานของพนักงานลงสเปรดชีตอัตโนมัติ
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{successMsg}</div>
            </div>
          )}

          {/* Section 1: Google Account Authentication */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. สถานะบัญชี Google
              </span>
              {isGoogleConnected ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  เชื่อมต่อแล้ว
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" />
                  ยังไม่ได้เชื่อมต่อ
                </span>
              )}
            </div>

            {isGoogleConnected && googleUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  {googleUser.photoURL ? (
                    <img 
                      src={googleUser.photoURL} 
                      alt={googleUser.displayName || 'Google User'} 
                      className="w-9 h-9 rounded-full border border-slate-300 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                      {googleUser.email?.[0]?.toUpperCase() || 'G'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {googleUser.displayName || 'บัญชี Google'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {googleUser.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  disabled={isProcessing}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  เปลี่ยนบัญชี
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  เข้าสู่ระบบด้วยบัญชี Google เพื่อให้แอปพลิเคชันได้รับสิทธิ์ในการสร้างและบันทึกข้อมูลลงใน Google Sheets ของท่าน
                </p>

                {/* Standard Google Sign-in button */}
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl shadow-xs text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isProcessing ? 'กำลังเข้าสู่ระบบ Google...' : 'เข้าสู่ระบบด้วย Google (Sign in with Google)'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Target Google Spreadsheet */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. ไฟล์สเปรดชีตเป้าหมาย (Spreadsheet)
              </span>
              {spreadsheetId ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  มีไฟล์พร้อมใช้งาน
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  ยังไม่ได้เลือกไฟล์
                </span>
              )}
            </div>

            {spreadsheetId ? (
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{spreadsheetTitle || 'UNITED DEVELOPMENT - บันทึกงาน'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      ID: {spreadsheetId}
                    </div>
                  </div>

                  {spreadsheetUrl && (
                    <a
                      href={spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                    >
                      <span>เปิด Sheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span>แผ่นงานที่สร้างในไฟล์:</span>
                    <span className="font-semibold text-slate-700">2 แท็บ (บันทึกการลงพื้นที่, บันทึกเข้าออกงาน)</span>
                  </div>
                  {lastSheetsSyncTime && (
                    <div className="flex items-center justify-between text-emerald-700 pt-1 border-t border-slate-200/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ซิงค์ล่าสุดเมื่อ:
                      </span>
                      <span className="font-medium">{lastSheetsSyncTime}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-2 space-y-3">
                <p className="text-xs text-slate-500">
                  คลิกสร้างไฟล์ใหม่ ระบบจะสร้าง Google Spreadsheet พร้อมหัวตารางให้ครบถ้วนทันที
                </p>
                <button
                  type="button"
                  onClick={handleCreateNewSheet}
                  disabled={!isGoogleConnected || isProcessing}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>สร้างไฟล์ Google Sheet ของบริษัทใหม่อัตโนมัติ</span>
                </button>
              </div>
            )}

            {/* Link existing ID option */}
            <div className="pt-2 border-t border-slate-200">
              <details className="text-xs text-slate-600 cursor-pointer">
                <summary className="font-medium text-slate-700 hover:text-emerald-700 transition-colors">
                  หรือระบุ Spreadsheet ID ที่มีอยู่แล้ว
                </summary>
                <form onSubmit={handleApplyCustomId} className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={inputSheetId}
                    onChange={(e) => setInputSheetId(e.target.value)}
                    placeholder="วาง Google Spreadsheet ID ที่นี่..."
                    disabled={!isGoogleConnected || isProcessing}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!isGoogleConnected || !inputSheetId.trim() || isProcessing}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    เชื่อมโยง
                  </button>
                </form>
              </details>
            </div>
          </div>

          {/* Section 3: Sync Settings & Manual Sync All */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              3. การส่งข้อมูล (Data Sync)
            </span>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  ส่งข้อมูลอัตโนมัติ (Auto-Sync)
                </div>
                <div className="text-[11px] text-slate-500">
                  บันทึกลง Google Sheets ทันทีที่พนักงานกด Check-in หรือ ลงเวลา
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSyncSheets}
                  onChange={(e) => setAutoSyncSheets(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Sync All Button with Confirmation */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setConfirmSyncAllModal(true)}
                disabled={!isGoogleConnected || !spreadsheetId || isProcessing || isSyncingSheets}
                className="w-full py-2.5 px-4 bg-white border border-emerald-600 text-emerald-800 hover:bg-emerald-50 disabled:border-slate-200 disabled:text-slate-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin text-emerald-600' : ''}`} />
                <span>
                  {isSyncingSheets 
                    ? 'กำลังส่งข้อมูลทั้งหมด...' 
                    : `ส่งข้อมูลที่มีอยู่ทั้งหมด (${records.length} รายการ) ไปยัง Google Sheet`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            เรียบร้อย
          </button>
        </div>

      </div>

      {/* Confirmation Dialog for Destructive / Mutating Operation (MANDATORY per Workspace guidelines) */}
      {confirmSyncAllModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">
                ยืนยันการส่งข้อมูลทั้งหมด?
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                ระบบจะส่งบันทึกการลงพื้นที่จำนวน <strong>{records.length} รายการ</strong> และข้อมูลเวลาเข้า-ออกงานทั้งหมด ไปบันทึกเพิ่มลงใน Google Sheet:
                <br />
                <span className="font-semibold text-emerald-700">{spreadsheetTitle || 'สเปรดชีตเป้าหมาย'}</span>
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSyncAllModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmSyncAll}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                ยืนยันส่งข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
