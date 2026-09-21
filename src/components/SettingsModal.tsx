import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Users, 
  KeyRound, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle, 
  Radio, 
  Database,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

export const SettingsModal: React.FC = () => {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'integrations' | 'company'>('users');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // New User Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'sales' | 'admin'>('sales');
  const [newZone, setNewZone] = useState('ภาคกลาง');
  const [newPhone, setNewPhone] = useState('');
  const [newTarget, setNewTarget] = useState('1500000');

  // Edit user state
  const [editPassword, setEditPassword] = useState('');
  const [editName, setEditName] = useState('');
  const [editZone, setEditZone] = useState('');
  const [editTarget, setEditTarget] = useState('');

  if (!settingsModalOpen) return null;

  const handleStartEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditPassword(user.password || '');
    setEditZone(user.zone);
    setEditTarget(user.monthlyTarget.toString());
  };

  const handleSaveEdit = (userId: string) => {
    updateUser(userId, {
      name: editName,
      password: editPassword,
      zone: editZone,
      monthlyTarget: Number(editTarget) || 0,
    });
    setEditingUserId(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newName) return;

    addUser({
      username: newUsername.trim(),
      password: newPassword.trim(),
      name: newName.trim(),
      role: newRole,
      zone: newZone,
      phone: newPhone,
      monthlyTarget: Number(newTarget) || 1500000,
      active: true,
    });

    setShowAddForm(false);
    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-300 leading-tight">
                ตั้งค่าระบบ & สิทธิ์พนักงาน
              </h3>
              <p className="text-xs text-emerald-200">
                จัดการบัญชีผู้ใช้งาน, รหัสผ่านพนักงาน และการเชื่อมต่อภายนอก
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-white text-emerald-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>จัดการพนักงาน & รหัสผ่าน ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'integrations'
                ? 'bg-white text-emerald-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>GeniusTracks & Ecount</span>
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'company'
                ? 'bg-white text-emerald-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>ข้อมูลบริษัท</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">
                    รายชื่อพนักงานและสิทธิ์การใช้งาน
                  </h4>
                  <p className="text-xs text-slate-500">
                    แอดมินสามารถกำหนดชื่อผู้ใช้, ตั้งหรือรีเซ็ตรหัสผ่านให้พนักงานได้โดยตรง
                  </p>
                </div>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มพนักงานใหม่</span>
                  </button>
                )}
              </div>

              {/* Add User Form */}
              {showAddForm && (
                <form
                  onSubmit={handleCreateUser}
                  className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-fade-in"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-200/60">
                    <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-emerald-700" />
                      กรอกข้อมูลสร้างพนักงานใหม่
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      ยกเลิก
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="เช่น สมชาย ใจดี"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        บทบาท (Role)
                      </label>
                      <select
                        value={newRole}
                        onChange={e => setNewRole(e.target.value as 'sales' | 'admin')}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value="sales">พนักงานขาย (Sales Rep)</option>
                        <option value="admin">ผู้บริหาร / แอดมิน (Admin)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        ชื่อผู้ใช้งาน (Username) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        placeholder="เช่น sales05"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="กำหนดรหัสผ่าน เช่น 1234"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        ภูมิภาค / โซนรับผิดชอบ
                      </label>
                      <input
                        type="text"
                        value={newZone}
                        onChange={e => setNewZone(e.target.value)}
                        placeholder="เช่น ภาคกลาง (สระบุรี-ลพบุรี)"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        เป้ายอดขายรายเดือน (บาท)
                      </label>
                      <input
                        type="number"
                        value={newTarget}
                        onChange={e => setNewTarget(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs"
                  >
                    บันทึกข้อมูลพนักงาน
                  </button>
                </form>
              )}

              {/* Users List */}
              <div className="space-y-2.5">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl p-3.5 transition-all space-y-2"
                  >
                    {editingUserId === u.id ? (
                      <div className="space-y-3 text-xs bg-white p-2 rounded-xl border border-emerald-300">
                        <div className="font-bold text-emerald-900">แก้ไขข้อมูล: {u.username}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500 font-medium">ชื่อพนักงาน:</span>
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="w-full border rounded-lg p-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">รหัสผ่านใหม่:</span>
                            <input
                              type="text"
                              value={editPassword}
                              onChange={e => setEditPassword(e.target.value)}
                              className="w-full border rounded-lg p-1.5 text-xs font-mono text-slate-800"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">โซน:</span>
                            <input
                              type="text"
                              value={editZone}
                              onChange={e => setEditZone(e.target.value)}
                              className="w-full border rounded-lg p-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">เป้ายอดขาย (บาท):</span>
                            <input
                              type="number"
                              value={editTarget}
                              onChange={e => setEditTarget(e.target.value)}
                              className="w-full border rounded-lg p-1.5 text-xs text-slate-800"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingUserId(null)}
                            className="px-3 py-1 bg-slate-200 rounded-lg text-slate-700"
                          >
                            ยกเลิก
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(u.id)}
                            className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg"
                          >
                            บันทึกการแก้ไข
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {u.name.slice(0, 1)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-800">{u.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {u.role === 'admin' ? 'ผู้บริหาร / แอดมิน' : 'พนักงานขาย'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-[11px] text-slate-700">user: {u.username}</span>
                              <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-[11px] text-slate-700">pass: {u.password}</span>
                              <span>• {u.zone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(u)}
                            title="แก้ไขข้อมูล / รหัสผ่าน"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {users.length > 1 && u.id !== currentUser?.id && (
                            <button
                              onClick={() => {
                                if (confirm(`ต้องการลบผู้ใช้งาน ${u.name} หรือไม่?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              title="ลบพนักงาน"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>GeniusTracks GPS Integration Report</span>
                </div>
                <p className="text-slate-600">
                  ระบบเชื่อมต่อดึงข้อมูลการเดินทาง, จุดจอด, และระยะทางอัตโนมัติจากเซิร์ฟเวอร์ GeniusTracks
                </p>
                <div className="bg-white p-3 rounded-xl border border-emerald-100 font-mono text-[11px] space-y-1 text-slate-700">
                  <div><strong>Endpoint:</strong> https://track4.geniustracks.com/report</div>
                  <div><strong>Status:</strong> <span className="text-emerald-600 font-bold">200 OK (Syncing Every 5 Mins)</span></div>
                  <div><strong>Telemetry:</strong> Vehicle Stop Points, Engine Idle, Waypoints, Odometer KM</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Ecount ERP Live Sync</span>
                </div>
                <p className="text-slate-600">
                  ดึงข้อมูลยอดขายประจำเดือน และยอดลูกหนี้คงค้างแยกตามพนักงานจากระบบบัญชี Ecount
                </p>
                <div className="bg-white p-3 rounded-xl border border-blue-100 font-mono text-[11px] space-y-1 text-slate-700">
                  <div><strong>System:</strong> Ecount ERP Cloud v5.4</div>
                  <div><strong>Status:</strong> <span className="text-blue-600 font-bold">Connected & Verified</span></div>
                  <div><strong>Synced Collections:</strong> Accounts Receivable (AR), Sales Invoices</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-sm text-slate-800">บริษัท ปุ๋ยทวีผล จำกัด (สำนักงานใหญ่)</h4>
                <p className="text-slate-600">เครือ บริษัท ยูไนเต็ด ดีเวลลอปเมนท์ จำกัด</p>
                <div className="space-y-1 pt-2 text-slate-700">
                  <div><strong>ผู้ผลิตและจัดจำหน่าย:</strong> ปุ๋ยเคมีทวีผล, ปุ๋ยอินทรีย์ชีวภาพ, ฮอร์โมนพืชเกษตรกรรม</div>
                  <div><strong>ฝ่ายประสานงานขาย:</strong> 02-999-8888, 081-999-0001</div>
                  <div><strong>ระบบแอปพลิเคชัน:</strong> ทวีผล Track v2.4 (GPS & Field Sales Intelligence)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-all"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
