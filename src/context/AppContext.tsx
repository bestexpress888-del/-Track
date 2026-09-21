import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  VisitRecord,
  CustomerMemory,
  AttendanceRecord,
  GeniusTracksTrip,
  EcountSummary,
  SecretLocation
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_VISIT_RECORDS,
  INITIAL_ATTENDANCE,
  INITIAL_GENIUSTRACKS_TRIPS,
  INITIAL_ECOUNT_DATA
} from '../data/initialData';
import {
  initGoogleAuth,
  signInWithGoogle,
  signOutFromGoogle,
  createTrackingSpreadsheet,
  verifySpreadsheetAccess,
  appendRow,
  formatVisitRecordForSheet,
  formatAttendanceRecordForSheet,
  batchAppendRows
} from '../services/googleSheetsService';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  records: VisitRecord[];
  customers: CustomerMemory[];
  attendanceMap: Record<string, AttendanceRecord>;
  geniusTracksTrips: GeniusTracksTrip[];
  ecountDataMap: Record<string, EcountSummary>;
  activeView: 'sales' | 'admin';
  activeSalesTab: 'record' | 'list' | 'clock' | 'summary';
  isRefreshing: boolean;
  loginModalOpen: boolean;
  settingsModalOpen: boolean;

  // Actions
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  setActiveView: (view: 'sales' | 'admin') => void;
  setActiveSalesTab: (tab: 'record' | 'list' | 'clock' | 'summary') => void;
  setLoginModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  refreshData: () => Promise<void>;

  // Visit Records
  addVisitRecord: (recordData: Omit<VisitRecord, 'id' | 'salesRepId' | 'salesRepName' | 'zone' | 'secretLocation'>) => Promise<VisitRecord>;
  deleteVisitRecord: (recordId: string) => void;

  // Attendance
  clockIn: () => Promise<AttendanceRecord>;
  clockOut: () => Promise<AttendanceRecord>;

  // User Management
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Customer autofill memory
  searchCustomers: (query: string) => CustomerMemory[];
  addOrUpdateCustomerMemory: (customer: CustomerMemory) => void;

  // Google Sheets Integration
  googleUser: any;
  isGoogleConnected: boolean;
  googleAccessToken: string | null;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  spreadsheetTitle: string | null;
  autoSyncSheets: boolean;
  setAutoSyncSheets: (auto: boolean) => void;
  lastSheetsSyncTime: string | null;
  isSyncingSheets: boolean;
  sheetsModalOpen: boolean;
  setSheetsModalOpen: (open: boolean) => void;
  connectGoogleSheets: () => Promise<void>;
  disconnectGoogleSheets: () => Promise<void>;
  createNewSpreadsheet: (title?: string) => Promise<string>;
  setCustomSpreadsheetId: (id: string) => Promise<void>;
  syncAllToGoogleSheets: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for silent background geolocation capture
async function captureSilentLocation(defaultZoneHint?: string): Promise<SecretLocation> {
  const timestamp = new Date().toISOString();

  // Try HTML5 Geolocation API with timeout
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 2500,
          maximumAge: 30000,
        });
      });

      return {
        lat: Number(position.coords.latitude.toFixed(6)),
        lng: Number(position.coords.longitude.toFixed(6)),
        accuracyMeters: Math.round(position.coords.accuracy || 10),
        addressSnippet: 'พิกัด GPS อัตโนมัติจากอุปกรณ์ (ความแม่นยำ ~' + Math.round(position.coords.accuracy || 10) + 'ม.)',
        capturedAt: timestamp,
        isMockFallback: false,
      };
    } catch {
      // Geolocation denied or sandboxed iframe restriction: provide high quality fallback
    }
  }

  // Fallback realistic coordinates based on zone
  let lat = 14.0228 + (Math.random() * 0.04 - 0.02);
  let lng = 99.5328 + (Math.random() * 0.04 - 0.02);
  let snippet = 'พิกัดเครือข่ายเสาสัญญาณใกล้ อ.เมือง จ.กาญจนบุรี';

  if (defaultZoneHint?.includes('เหนือ')) {
    lat = 18.7904 + (Math.random() * 0.05 - 0.025);
    lng = 98.9817 + (Math.random() * 0.05 - 0.025);
    snippet = 'พิกัดเครือข่ายสัญญาณ จ.เชียงใหม่';
  } else if (defaultZoneHint?.includes('อีสาน')) {
    lat = 16.4322 + (Math.random() * 0.05 - 0.025);
    lng = 102.8236 + (Math.random() * 0.05 - 0.025);
    snippet = 'พิกัดเครือข่ายสัญญาณ จ.ขอนแก่น';
  } else if (defaultZoneHint?.includes('ใต้')) {
    lat = 9.1382 + (Math.random() * 0.05 - 0.025);
    lng = 99.3217 + (Math.random() * 0.05 - 0.025);
    snippet = 'พิกัดเครือข่ายสัญญาณ จ.สุราษฎร์ธานี';
  }

  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    accuracyMeters: 12,
    addressSnippet: snippet,
    capturedAt: timestamp,
    isMockFallback: true,
  };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pui_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pui_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default active user is Sales Rep 'usr_sales_01' so app renders immediately
    return INITIAL_USERS[1];
  });

  const [activeView, setActiveView] = useState<'sales' | 'admin'>(() => {
    const saved = localStorage.getItem('pui_current_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.role === 'admin' ? 'admin' : 'sales';
      } catch {
        // ignore
      }
    }
    return 'sales';
  });

  const [activeSalesTab, setActiveSalesTab] = useState<'record' | 'list' | 'clock' | 'summary'>(() => {
    const saved = localStorage.getItem('pui_sales_tab');
    if (saved === 'record' || saved === 'list' || saved === 'clock' || saved === 'summary') {
      return saved;
    }
    return 'record';
  });

  const [records, setRecords] = useState<VisitRecord[]>(() => {
    const saved = localStorage.getItem('pui_visit_records');
    return saved ? JSON.parse(saved) : INITIAL_VISIT_RECORDS;
  });

  const [customers, setCustomers] = useState<CustomerMemory[]>(() => {
    const saved = localStorage.getItem('pui_customers_memory');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>(() => {
    const saved = localStorage.getItem('pui_attendance_map');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [geniusTracksTrips] = useState<GeniusTracksTrip[]>(INITIAL_GENIUSTRACKS_TRIPS);
  const [ecountDataMap] = useState<Record<string, EcountSummary>>(INITIAL_ECOUNT_DATA);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Google Sheets integration state
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(() => {
    return localStorage.getItem('pui_sheets_spreadsheet_id') || null;
  });
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() => {
    return localStorage.getItem('pui_sheets_spreadsheet_url') || null;
  });
  const [spreadsheetTitle, setSpreadsheetTitle] = useState<string | null>(() => {
    return localStorage.getItem('pui_sheets_spreadsheet_title') || null;
  });
  const [autoSyncSheets, setAutoSyncSheets] = useState<boolean>(() => {
    const saved = localStorage.getItem('pui_sheets_auto_sync');
    return saved !== null ? saved === 'true' : true;
  });
  const [lastSheetsSyncTime, setLastSheetsSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('pui_sheets_last_sync') || null;
  });
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsModalOpen, setSheetsModalOpen] = useState(false);

  // Initialize Google Auth state
  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleAccessToken(token);
        setIsGoogleConnected(true);
      },
      () => {
        setGoogleUser(null);
        setGoogleAccessToken(null);
        setIsGoogleConnected(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (spreadsheetId) {
      localStorage.setItem('pui_sheets_spreadsheet_id', spreadsheetId);
    } else {
      localStorage.removeItem('pui_sheets_spreadsheet_id');
    }
  }, [spreadsheetId]);

  useEffect(() => {
    if (spreadsheetUrl) {
      localStorage.setItem('pui_sheets_spreadsheet_url', spreadsheetUrl);
    } else {
      localStorage.removeItem('pui_sheets_spreadsheet_url');
    }
  }, [spreadsheetUrl]);

  useEffect(() => {
    if (spreadsheetTitle) {
      localStorage.setItem('pui_sheets_spreadsheet_title', spreadsheetTitle);
    } else {
      localStorage.removeItem('pui_sheets_spreadsheet_title');
    }
  }, [spreadsheetTitle]);

  useEffect(() => {
    localStorage.setItem('pui_sheets_auto_sync', String(autoSyncSheets));
  }, [autoSyncSheets]);

  useEffect(() => {
    if (lastSheetsSyncTime) {
      localStorage.setItem('pui_sheets_last_sync', lastSheetsSyncTime);
    }
  }, [lastSheetsSyncTime]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pui_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pui_current_user', JSON.stringify(currentUser));
      setActiveView(currentUser.role === 'admin' ? 'admin' : 'sales');
    } else {
      localStorage.removeItem('pui_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pui_active_view', activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem('pui_sales_tab', activeSalesTab);
  }, [activeSalesTab]);

  useEffect(() => {
    localStorage.setItem('pui_visit_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('pui_customers_memory', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('pui_attendance_map', JSON.stringify(attendanceMap));
  }, [attendanceMap]);

  // Login handler
  const login = (username: string, password?: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const found = users.find(u => u.username.toLowerCase() === cleanUser);
    if (!found) return false;

    // Verify password if set
    if (found.password && password && found.password !== password.trim()) {
      return false;
    }

    setCurrentUser(found);
    if (found.role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('sales');
    }
    setLoginModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setLoginModalOpen(true);
  };

  // Refresh handler: updates simulation, keeps current page & user logged in!
  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(res => setTimeout(res, 500));
    // Verify distance / attendance state
    setIsRefreshing(false);
  };

  // Add Visit Record with Silent Location
  const addVisitRecord = async (
    recordData: Omit<VisitRecord, 'id' | 'salesRepId' | 'salesRepName' | 'zone' | 'secretLocation'>
  ): Promise<VisitRecord> => {
    if (!currentUser) throw new Error('ต้องเข้าสู่ระบบก่อนบันทึก');

    // SILENT GEOLOCATION CAPTURE: Employee is NOT shown this coordinate
    const secretLocation = await captureSilentLocation(currentUser.zone);

    const newRecord: VisitRecord = {
      ...recordData,
      id: `vis_${Date.now()}`,
      salesRepId: currentUser.id,
      salesRepName: currentUser.name,
      zone: currentUser.zone,
      secretLocation,
    };

    setRecords(prev => [newRecord, ...prev]);

    // Update or add customer to memory so future autocompletion finds it instantly
    addOrUpdateCustomerMemory({
      id: `cust_${Date.now()}`,
      storeName: recordData.storeName,
      phone: recordData.phone,
      contactPerson: recordData.contactPerson,
      lastVisitDate: recordData.date,
      totalOrders: (recordData.amount > 0 ? 1 : 0),
    });

    // Auto-sync to Google Sheets if connected
    if (autoSyncSheets && googleAccessToken && spreadsheetId) {
      appendRow(
        googleAccessToken,
        spreadsheetId,
        'บันทึกการลงพื้นที่!A1',
        formatVisitRecordForSheet(newRecord)
      ).then(() => {
        const timeNow = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
        setLastSheetsSyncTime(timeNow);
      }).catch(err => {
        console.error('Auto sync visit record to Google Sheets failed:', err);
      });
    }

    return newRecord;
  };

  const deleteVisitRecord = (recordId: string) => {
    setRecords(prev => prev.filter(r => r.id !== recordId));
  };

  // Customer memory autosearch
  const searchCustomers = (query: string): CustomerMemory[] => {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();
    return customers.filter(c => 
      c.storeName.toLowerCase().includes(q) || 
      c.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(q))
    );
  };

  const addOrUpdateCustomerMemory = (customer: CustomerMemory) => {
    setCustomers(prev => {
      const idx = prev.findIndex(c => 
        c.storeName.toLowerCase() === customer.storeName.toLowerCase() ||
        c.phone.replace(/[^0-9]/g, '') === customer.phone.replace(/[^0-9]/g, '')
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          storeName: customer.storeName,
          phone: customer.phone,
          contactPerson: customer.contactPerson || updated[idx].contactPerson,
          lastVisitDate: customer.lastVisitDate || new Date().toISOString().split('T')[0],
          totalOrders: (updated[idx].totalOrders || 0) + (customer.totalOrders || 0),
        };
        return updated;
      }
      return [customer, ...prev];
    });
  };

  // Attendance Clock In / Out
  const clockIn = async (): Promise<AttendanceRecord> => {
    if (!currentUser) throw new Error('กรุณาเข้าสู่ระบบ');
    const secretLocation = await captureSilentLocation(currentUser.zone);
    const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    const today = new Date().toISOString().split('T')[0];

    const currentAtt = attendanceMap[currentUser.id] || {
      id: `att_${currentUser.id}`,
      date: today,
      salesRepId: currentUser.id,
      salesRepName: currentUser.name,
      clockInTime: null,
      clockOutTime: null,
      calculatedDistanceKm: 0,
    };

    // Calculate initial estimated distance from base (e.g. 15-30 km starting radius)
    const baseDistance = Number((Math.random() * 25 + 40).toFixed(1));

    const updated: AttendanceRecord = {
      ...currentAtt,
      date: today,
      clockInTime: nowStr,
      secretClockInLocation: secretLocation,
      calculatedDistanceKm: currentAtt.calculatedDistanceKm || baseDistance,
    };

    setAttendanceMap(prev => ({ ...prev, [currentUser.id]: updated }));

    // Auto-sync attendance to Google Sheets if connected
    if (autoSyncSheets && googleAccessToken && spreadsheetId) {
      appendRow(
        googleAccessToken,
        spreadsheetId,
        'บันทึกเข้าออกงาน!A1',
        formatAttendanceRecordForSheet(updated)
      ).then(() => {
        const timeNow = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
        setLastSheetsSyncTime(timeNow);
      }).catch(err => {
        console.error('Auto sync clockIn to Google Sheets failed:', err);
      });
    }

    return updated;
  };

  const clockOut = async (): Promise<AttendanceRecord> => {
    if (!currentUser) throw new Error('กรุณาเข้าสู่ระบบ');
    const secretLocation = await captureSilentLocation(currentUser.zone);
    const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    const today = new Date().toISOString().split('T')[0];

    const currentAtt = attendanceMap[currentUser.id] || {
      id: `att_${currentUser.id}`,
      date: today,
      salesRepId: currentUser.id,
      salesRepName: currentUser.name,
      clockInTime: '08:30 น.',
      clockOutTime: null,
      calculatedDistanceKm: 85,
    };

    // Final distance calculation for the day
    const trip = geniusTracksTrips.find(t => t.salesRepId === currentUser.id);
    const finalKm = trip?.totalDistanceKm || (currentAtt.calculatedDistanceKm + Math.floor(Math.random() * 40 + 50));

    const updated: AttendanceRecord = {
      ...currentAtt,
      date: today,
      clockOutTime: nowStr,
      secretClockOutLocation: secretLocation,
      calculatedDistanceKm: Number(finalKm.toFixed(1)),
    };

    setAttendanceMap(prev => ({ ...prev, [currentUser.id]: updated }));

    // Auto-sync attendance to Google Sheets if connected
    if (autoSyncSheets && googleAccessToken && spreadsheetId) {
      appendRow(
        googleAccessToken,
        spreadsheetId,
        'บันทึกเข้าออกงาน!A1',
        formatAttendanceRecordForSheet(updated)
      ).then(() => {
        const timeNow = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
        setLastSheetsSyncTime(timeNow);
      }).catch(err => {
        console.error('Auto sync clockOut to Google Sheets failed:', err);
      });
    }

    return updated;
  };

  // Google Sheets Management Methods
  const connectGoogleSheets = async () => {
    try {
      const { user, accessToken } = await signInWithGoogle();
      setGoogleUser(user);
      setGoogleAccessToken(accessToken);
      setIsGoogleConnected(true);

      // If we don't have a spreadsheet yet, auto create one
      if (!spreadsheetId) {
        try {
          const created = await createTrackingSpreadsheet(accessToken);
          setSpreadsheetId(created.spreadsheetId);
          setSpreadsheetUrl(created.spreadsheetUrl);
          setSpreadsheetTitle('UNITED DEVELOPMENT - ข้อมูลลงพื้นที่ & สรุปงาน (ปุ๋ยทวีผล)');
        } catch (createErr) {
          console.error('Auto create spreadsheet failed:', createErr);
        }
      } else {
        try {
          const info = await verifySpreadsheetAccess(accessToken, spreadsheetId);
          setSpreadsheetTitle(info.title);
        } catch (verifyErr) {
          console.warn('Verify existing spreadsheet warning:', verifyErr);
        }
      }
    } catch (err) {
      console.error('connectGoogleSheets error:', err);
      throw err;
    }
  };

  const disconnectGoogleSheets = async () => {
    await signOutFromGoogle();
    setGoogleUser(null);
    setGoogleAccessToken(null);
    setIsGoogleConnected(false);
  };

  const createNewSpreadsheet = async (title?: string): Promise<string> => {
    if (!googleAccessToken) throw new Error('กรุณาเข้าสู่ระบบ Google ก่อน');
    const result = await createTrackingSpreadsheet(googleAccessToken, title);
    setSpreadsheetId(result.spreadsheetId);
    setSpreadsheetUrl(result.spreadsheetUrl);
    setSpreadsheetTitle(title || 'UNITED DEVELOPMENT - ข้อมูลลงพื้นที่ & สรุปงาน (ปุ๋ยทวีผล)');
    return result.spreadsheetUrl;
  };

  const setCustomSpreadsheetId = async (id: string) => {
    if (!googleAccessToken) throw new Error('กรุณาเข้าสู่ระบบ Google ก่อน');
    const verified = await verifySpreadsheetAccess(googleAccessToken, id);
    setSpreadsheetId(id);
    setSpreadsheetUrl(`https://docs.google.com/spreadsheets/d/${id}`);
    setSpreadsheetTitle(verified.title);
  };

  const syncAllToGoogleSheets = async () => {
    if (!googleAccessToken || !spreadsheetId) {
      throw new Error('ยังไม่ได้เชื่อมต่อ Google Sheets หรือยังไม่ได้ระบุ Spreadsheet');
    }
    setIsSyncingSheets(true);
    try {
      if (records.length > 0) {
        const rows = records.map(r => formatVisitRecordForSheet(r));
        await batchAppendRows(googleAccessToken, spreadsheetId, 'บันทึกการลงพื้นที่', rows);
      }

      const attendances = Object.values(attendanceMap);
      if (attendances.length > 0) {
        const rows = attendances.map(a => formatAttendanceRecordForSheet(a));
        await batchAppendRows(googleAccessToken, spreadsheetId, 'บันทึกเข้าออกงาน', rows);
      }

      const syncTimeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น. (' + new Date().toLocaleDateString('th-TH') + ')';
      setLastSheetsSyncTime(syncTimeStr);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // User Management
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      active: true,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        records,
        customers,
        attendanceMap,
        geniusTracksTrips,
        ecountDataMap,
        activeView,
        activeSalesTab,
        isRefreshing,
        loginModalOpen,
        settingsModalOpen,
        login,
        logout,
        setActiveView,
        setActiveSalesTab,
        setLoginModalOpen,
        setSettingsModalOpen,
        refreshData,
        addVisitRecord,
        deleteVisitRecord,
        clockIn,
        clockOut,
        addUser,
        updateUser,
        deleteUser,
        searchCustomers,
        addOrUpdateCustomerMemory,
        googleUser,
        isGoogleConnected,
        googleAccessToken,
        spreadsheetId,
        spreadsheetUrl,
        spreadsheetTitle,
        autoSyncSheets,
        setAutoSyncSheets,
        lastSheetsSyncTime,
        isSyncingSheets,
        sheetsModalOpen,
        setSheetsModalOpen,
        connectGoogleSheets,
        disconnectGoogleSheets,
        createNewSpreadsheet,
        setCustomSpreadsheetId,
        syncAllToGoogleSheets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
