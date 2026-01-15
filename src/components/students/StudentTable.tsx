import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MoreVertical,
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { Student, Batch, ReminderFilter } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface StudentTableProps {
  students: Student[];
  batches: Batch[];
  onSendReminder: (studentIds: string[]) => void;
}

export function StudentTable({
  students,
  batches,
  onSendReminder,
}: StudentTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<ReminderFilter>('all');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');

  const getBatchName = (batchId?: string) => {
    if (!batchId) return 'No Batch';
    return batches.find((b) => b.id === batchId)?.name || 'Unknown';
  };

  const filteredStudents = useMemo(() => {
    let result = students.filter((s) => s.status === 'active');

    switch (filterType) {
      case 'unpaid':
        result = result.filter((s) => s.pendingInvoices > 0);
        break;
      case 'overdue':
        result = result.filter((s) => s.pendingInvoices > 1);
        break;
      case 'batch':
        if (selectedBatchId !== 'all') {
          result = result.filter((s) => s.batchId === selectedBatchId);
        }
        break;
    }

    return result;
  }, [students, filterType, selectedBatchId]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleSendReminders = () => {
    onSendReminder(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const selectAllWithPending = () => {
    const withPending = filteredStudents.filter((s) => s.pendingInvoices > 0);
    setSelectedIds(new Set(withPending.map((s) => s.id)));
  };

  return (
    <div className="space-y-4">
      {/* Filter & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Select students to send reminders:
          </span>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as ReminderFilter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Active Students</SelectItem>
              <SelectItem value="unpaid">With Unpaid Invoices</SelectItem>
              <SelectItem value="overdue">Overdue Payments</SelectItem>
              <SelectItem value="batch">By Batch</SelectItem>
            </SelectContent>
          </Select>

          <AnimatePresence>
            {filterType === 'batch' && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                <Select
                  value={selectedBatchId}
                  onValueChange={setSelectedBatchId}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAllWithPending}
            className="text-warning border-warning/30 hover:bg-warning/10"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Select Unpaid
          </Button>

          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button onClick={handleSendReminders} className="gap-2">
                  <Send className="w-4 h-4" />
                  Send Reminder to {selectedIds.size} Student
                  {selectedIds.size > 1 ? 's' : ''}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Selection Summary */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-4 py-3 bg-primary/10 rounded-lg border border-primary/20"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              {selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              Clear Selection
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Students Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedIds.size === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Fee Amount</TableHead>
              <TableHead className="text-center">Classes</TableHead>
              <TableHead className="text-center">Pending</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  'group transition-colors',
                  selectedIds.has(student.id) && 'bg-primary/5'
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(student.id)}
                    onCheckedChange={() => toggleSelect(student.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Since{' '}
                        {student.createdAt.toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 w-fit"
                  >
                    <Users className="w-3 h-3" />
                    {getBatchName(student.batchId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      {student.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₹{student.feeAmount.toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-medium">
                    {student.classesAttended}/4
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {student.pendingInvoices > 0 ? (
                    <Badge
                      variant="destructive"
                      className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                    >
                      {student.pendingInvoices} unpaid
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-success/10 text-success hover:bg-success/20"
                    >
                      All paid
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onSendReminder([student.id])}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Reminder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
