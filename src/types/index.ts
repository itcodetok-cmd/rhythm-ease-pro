export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  feeAmount: number;
  batchId?: string;
  status: 'active' | 'removed';
  classesAttended: number;
  pendingInvoices: number;
  createdAt: Date;
}

export interface Batch {
  id: string;
  name: string;
  days: string[];
  time: string;
  studentIds: string[];
  createdAt: Date;
}

export interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid';
  classesCount: number;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
  dueDate: Date;
}

export interface ClassSession {
  id: string;
  batchId?: string;
  studentId?: string;
  type: 'batch' | 'single';
  scheduledAt: Date;
  status: 'upcoming' | 'conducted' | 'cancelled';
  createdAt: Date;
}

export type ReminderFilter = 'all' | 'unpaid' | 'overdue' | 'batch';
