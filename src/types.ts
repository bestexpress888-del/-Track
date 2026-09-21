export type UserRole = 'admin' | 'sales';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  zone: string;
  phone: string;
  monthlyTarget: number;
  avatar?: string;
  active: boolean;
}

export type VisitStatus = 'เยี่ยมชม' | 'เสนอราคา' | 'ปิดการขาย' | 'ติดตามผล' | 'ไม่สำเร็จ';

export interface SecretLocation {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  addressSnippet?: string;
  capturedAt: string;
  isMockFallback?: boolean;
}

export interface VisitRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  salesRepId: string;
  salesRepName: string;
  zone: string;
  storeName: string;
  phone: string;
  contactPerson?: string;
  status: VisitStatus;
  amount: number;
  photoUrl?: string;
  note: string;
  // Secret location captured silently by system, only visible to Admin
  secretLocation: SecretLocation;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  salesRepId: string;
  salesRepName: string;
  clockInTime: string | null;
  clockOutTime: string | null;
  // Secret location for in/out, hidden from sales reps
  secretClockInLocation?: SecretLocation | null;
  secretClockOutLocation?: SecretLocation | null;
  calculatedDistanceKm: number;
  notes?: string;
}

export interface CustomerMemory {
  id: string;
  storeName: string;
  phone: string;
  contactPerson?: string;
  province?: string;
  district?: string;
  address?: string;
  lastVisitDate?: string;
  totalOrders?: number;
}

export interface GeniusTracksTripStop {
  id: string;
  name: string;
  type: 'store' | 'warehouse' | 'station' | 'checkpoint' | 'stop';
  arrivalTime: string;
  departureTime: string;
  stopDurationMinutes: number;
  lat: number;
  lng: number;
  address: string;
  notes?: string;
}

export interface GeniusTracksTrip {
  id: string;
  salesRepId: string;
  salesRepName: string;
  date: string;
  totalDistanceKm: number;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'in-transit';
  vehiclePlate: string;
  stops: GeniusTracksTripStop[];
}

export interface EcountInvoice {
  id: string;
  invoiceNo: string;
  storeName: string;
  amount: number;
  dueDate: string;
  overdueDays: number;
  status: 'normal' | 'overdue' | 'paid';
}

export interface EcountSummary {
  salesRepId: string;
  salesRepName: string;
  zone: string;
  currentReceivables: number;
  overdueReceivables: number;
  monthlySales: number;
  monthlyTarget: number;
  lastSyncedAt: string;
  invoices: EcountInvoice[];
}


