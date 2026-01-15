import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentTable } from '@/components/students/StudentTable';
import { SendReminderDialog } from '@/components/students/SendReminderDialog';
import { Button } from '@/components/ui/button';
import { mockStudents, mockBatches, mockInvoices } from '@/data/mockData';

export default function StudentsPage() {
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const handleSendReminder = (studentIds: string[]) => {
    setSelectedStudentIds(studentIds);
    setReminderDialogOpen(true);
  };

  const selectedStudents = mockStudents.filter((s) =>
    selectedStudentIds.includes(s.id)
  );

  const activeStudents = mockStudents.filter((s) => s.status === 'active');
  const studentsWithDues = activeStudents.filter((s) => s.pendingInvoices > 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold"
            >
              Students
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Manage your students and send fee reminders
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold">{activeStudents.length}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">With Pending Dues</p>
              <p className="text-2xl font-bold">{studentsWithDues.length}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Batches</p>
              <p className="text-2xl font-bold">{mockBatches.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Student Table with Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <StudentTable
            students={mockStudents}
            batches={mockBatches}
            onSendReminder={handleSendReminder}
          />
        </motion.div>
      </div>

      {/* Send Reminder Dialog */}
      <SendReminderDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        selectedStudents={selectedStudents}
        invoices={mockInvoices}
      />
    </DashboardLayout>
  );
}
