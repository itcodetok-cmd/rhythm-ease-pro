import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageCircle, FileText, Check } from 'lucide-react';
import { Student, Invoice } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface SendReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudents: Student[];
  invoices: Invoice[];
}

export function SendReminderDialog({
  open,
  onOpenChange,
  selectedStudents,
  invoices,
}: SendReminderDialogProps) {
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [attachInvoice, setAttachInvoice] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const getStudentInvoices = (studentId: string) => {
    return invoices.filter(
      (inv) => inv.studentId === studentId && inv.status === 'unpaid'
    );
  };

  const totalAmount = selectedStudents.reduce((sum, student) => {
    const studentInvoices = getStudentInvoices(student.id);
    return (
      sum + studentInvoices.reduce((invSum, inv) => invSum + inv.amount, 0)
    );
  }, 0);

  const handleSend = async () => {
    setIsSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSending(false);
    onOpenChange(false);
    toast({
      title: 'Reminders Sent Successfully!',
      description: `Fee reminders sent to ${selectedStudents.length} student${
        selectedStudents.length > 1 ? 's' : ''
      }.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Send Fee Reminders
          </DialogTitle>
          <DialogDescription>
            Send payment reminders to {selectedStudents.length} selected student
            {selectedStudents.length > 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selected Students Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Selected Students</h4>
            <ScrollArea className="max-h-40">
              <div className="space-y-2">
                {selectedStudents.map((student) => {
                  const studentInvoices = getStudentInvoices(student.id);
                  const pendingAmount = studentInvoices.reduce(
                    (sum, inv) => sum + inv.amount,
                    0
                  );
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between bg-background rounded-md px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {student.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {studentInvoices.length > 0 ? (
                          <>
                            <p className="text-sm font-semibold text-destructive">
                              ₹{pendingAmount.toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {studentInvoices.length} invoice
                              {studentInvoices.length > 1 ? 's' : ''}
                            </p>
                          </>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-success/10 text-success"
                          >
                            No dues
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Pending</span>
              <span className="text-lg font-bold text-primary">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Delivery Method</h4>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  sendEmail
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSendEmail(!sendEmail)}
              >
                <Mail
                  className={`w-5 h-5 ${
                    sendEmail ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">
                    Send via email
                  </p>
                </div>
                {sendEmail && (
                  <Check className="w-4 h-4 text-primary absolute top-2 right-2" />
                )}
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  sendWhatsApp
                    ? 'border-success bg-success/5'
                    : 'border-border hover:border-success/50'
                }`}
                onClick={() => setSendWhatsApp(!sendWhatsApp)}
              >
                <MessageCircle
                  className={`w-5 h-5 ${
                    sendWhatsApp ? 'text-success' : 'text-muted-foreground'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
                {sendWhatsApp && (
                  <Check className="w-4 h-4 text-success absolute top-2 right-2" />
                )}
              </motion.div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="attach-invoice"
                checked={attachInvoice}
                onCheckedChange={(checked) => setAttachInvoice(checked as boolean)}
              />
              <Label htmlFor="attach-invoice" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Attach invoice PDF
              </Label>
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="custom-message">
              Custom Message (Optional)
            </Label>
            <Textarea
              id="custom-message"
              placeholder="Add a personalized message to include with the reminder..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!sendEmail && !sendWhatsApp}
            className="gap-2"
          >
            {isSending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Send className="w-4 h-4" />
              </motion.div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSending ? 'Sending...' : 'Send Reminders'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
