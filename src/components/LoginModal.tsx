import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { UnitedDevLogo } from './UnitedDevLogo';

export const LoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, login, users } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!loginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(username, password);
    if (!success) {
      setErrorMsg('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (หากลืมรหัสผ่าน กรุณาติดต่อแอดมิน)');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  const handleQuickLogin = (uName: string, pass: string = '123') => {
    setErrorMsg('');
    login(uName, pass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-md w-full overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white p-6 pt-8 text-center relative">
          <div className="mx-auto w-24 h-24 rounded-full bg-white p-1.5 shadow-xl border-2 border-amber-300 flex items-center justify-center mb-3 overflow-hidden">
            <UnitedDevLogo className="w-full h-full" showText={true} />
          </div>
          <h2 className="text-xl font-bold tracking-wide text-amber-300">
            ทวีผล Track
          </h2>
          <p className="text-xs text-emerald-100 mt-1 font-light">
            United development CO.,LTD • ระบบติดตามงานและบันทึกการลงพื้นที่
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="เช่น sales01 หรือ admin"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="รหัสผ่านที่แอดมินกำหนด"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none transition-all text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                * พนักงานจะได้รับชื่อผู้ใช้และรหัสผ่านจากแอดมิน/ผู้ดูแลระบบ
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>เข้าสู่ระบบ</span>
            </button>
          </form>

          {/* Quick Demo Switcher for fast review */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              เลือกบัญชีเข้าสู่ระบบด่วน (Demo Profiles)
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', '123')}
                className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  แอดมิน / ผู้บริหาร
                </div>
                <div className="text-[10px] text-slate-500">user: admin | pass: 123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sales01', '123')}
                className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  เซลล์สมชาย (ภาคกลาง)
                </div>
                <div className="text-[10px] text-slate-500">user: sales01 | pass: 123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sales02', '123')}
                className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  เซลล์วิชัย (ภาคเหนือ)
                </div>
                <div className="text-[10px] text-slate-500">user: sales02 | pass: 123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sales03', '123')}
                className="p-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  เซลล์มานะ (ภาคอีสาน)
                </div>
                <div className="text-[10px] text-slate-500">user: sales03 | pass: 123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
