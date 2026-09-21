import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { VisitRecord, AttendanceRecord } from '../types';

// Ensure Firebase is initialized once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const SHEETS_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets'
];

const provider = new GoogleAuthProvider();
SHEETS_SCOPES.forEach(scope => provider.addScope(scope));

// In-memory token cache (DO NOT store access token in localStorage according to skill rules)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Default headers for Google Sheets
const VISIT_HEADERS = [
  'รหัสบันทึก',
  'วันที่',
  'เวลา',
  'ชื่อพนักงาน',
  'เขตการขาย',
  'ชื่อร้านค้า/ลูกค้า',
  'เบอร์โทร',
  'ผู้ติดต่อ',
  'สถานะการเข้าพบ',
  'ยอดสั่งซื้อ (บาท)',
  'หมายเหตุ',
  'Latitude',
  'Longitude',
  'ที่อยู่พิกัด GPS',
  'บันทึกเมื่อ'
];

const ATTENDANCE_HEADERS = [
  'รหัสบันทึก',
  'วันที่',
  'ชื่อพนักงาน',
  'เวลาเข้างาน',
  'พิกัดเข้างาน',
  'เวลาออกงาน',
  'พิกัดออกงาน',
  'ระยะทางรวม (กม.)',
  'บันทึกเมื่อ'
];

export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('ไม่สามารถดึง Access Token จาก Google ได้');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signOutFromGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getCachedToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Creates a new Google Spreadsheet with predefined sheets and headers
 */
export const createTrackingSpreadsheet = async (accessToken: string, title?: string): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const sheetTitle = title || `ทวีผล Track - United development CO.,LTD (ข้อมูลลงพื้นที่ & สรุปงาน)`;
  
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle,
      },
      sheets: [
        {
          properties: {
            title: 'บันทึกการลงพื้นที่',
            gridProperties: { rowCount: 1000, columnCount: 20, frozenRowCount: 1 }
          }
        },
        {
          properties: {
            title: 'บันทึกเข้าออกงาน',
            gridProperties: { rowCount: 500, columnCount: 15, frozenRowCount: 1 }
          }
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`สร้าง Google Sheet ไม่สำเร็จ: ${errText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  // Insert Headers into both sheets
  await appendRow(accessToken, spreadsheetId, 'บันทึกการลงพื้นที่!A1', VISIT_HEADERS);
  await appendRow(accessToken, spreadsheetId, 'บันทึกเข้าออกงาน!A1', ATTENDANCE_HEADERS);

  return { spreadsheetId, spreadsheetUrl };
};

/**
 * Verify access to an existing spreadsheet and ensure required sheets exist
 */
export const verifySpreadsheetAccess = async (accessToken: string, spreadsheetId: string): Promise<{ title: string; sheets: string[] }> => {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties.title`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    throw new Error('ไม่สามารถเข้าถึง Google Sheet นี้ได้ โปรดตรวจสอบ Spreadsheet ID และสิทธิ์การเข้าถึง');
  }

  const data = await res.json();
  const sheetTitles = (data.sheets || []).map((s: any) => s.properties?.title || '');

  // Add missing sheets if necessary
  const missingSheets: string[] = [];
  if (!sheetTitles.includes('บันทึกการลงพื้นที่')) missingSheets.push('บันทึกการลงพื้นที่');
  if (!sheetTitles.includes('บันทึกเข้าออกงาน')) missingSheets.push('บันทึกเข้าออกงาน');

  if (missingSheets.length > 0) {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: missingSheets.map(title => ({
          addSheet: { properties: { title } }
        }))
      })
    });

    if (missingSheets.includes('บันทึกการลงพื้นที่')) {
      await appendRow(accessToken, spreadsheetId, 'บันทึกการลงพื้นที่!A1', VISIT_HEADERS);
    }
    if (missingSheets.includes('บันทึกเข้าออกงาน')) {
      await appendRow(accessToken, spreadsheetId, 'บันทึกเข้าออกงาน!A1', ATTENDANCE_HEADERS);
    }
  }

  return {
    title: data.properties?.title || 'Spreadsheet',
    sheets: [...sheetTitles, ...missingSheets]
  };
};

/**
 * Append row to range using USER_ENTERED format
 */
export const appendRow = async (
  accessToken: string, 
  spreadsheetId: string, 
  range: string, 
  rowValues: (string | number)[]
) => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error('Failed to append to Google Sheet:', error);
    throw new Error(`บันทึกลง Google Sheet ไม่สำเร็จ: ${error}`);
  }

  return res.json();
};

/**
 * Format a VisitRecord into a row array for Google Sheets
 */
export const formatVisitRecordForSheet = (record: VisitRecord): (string | number)[] => {
  return [
    record.id,
    record.date,
    record.time,
    record.salesRepName,
    record.zone,
    record.storeName,
    record.phone,
    record.contactPerson || '-',
    record.status,
    record.amount,
    record.note || '-',
    record.secretLocation?.lat || '',
    record.secretLocation?.lng || '',
    record.secretLocation?.addressSnippet || '',
    new Date().toLocaleString('th-TH')
  ];
};

/**
 * Format an AttendanceRecord into a row array for Google Sheets
 */
export const formatAttendanceRecordForSheet = (record: AttendanceRecord): (string | number)[] => {
  return [
    record.id,
    record.date,
    record.salesRepName,
    record.clockInTime || '-',
    record.secretClockInLocation?.addressSnippet || '',
    record.clockOutTime || '-',
    record.secretClockOutLocation?.addressSnippet || '',
    record.calculatedDistanceKm || 0,
    new Date().toLocaleString('th-TH')
  ];
};

/**
 * Batch append multiple rows to a specified sheet
 */
export const batchAppendRows = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  rows: (string | number)[][]
) => {
  if (rows.length === 0) return;

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetTitle}!A1`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ส่งข้อมูลชุดใหญ่ล้มเหลว: ${err}`);
  }

  return res.json();
};
