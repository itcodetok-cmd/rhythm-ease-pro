import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Receipt,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockStudents, mockBatches, mockInvoices } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();

  const activeStudents = mockStudents.filter((s) => s.status === 'active');
  const unpaidInvoices = mockInvoices.filter((inv) => inv.status === 'unpaid');
  const totalPending = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const stats = [
    {
      label: 'Active Students',
      value: activeStudents.length,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Batches',
      value: mockBatches.length,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Unpaid Invoices',
      value: unpaidInvoices.length,
      icon: Receipt,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Pending Amount',
      value: `₹${totalPending.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const recentActivity = [
    {
      type: 'class',
      message: 'Morning Beginners class conducted',
      time: '2 hours ago',
      icon: CheckCircle2,
      iconColor: 'text-success',
    },
    {
      type: 'invoice',
      message: 'Invoice #INV-007 generated for Kavya Iyer',
      time: '5 hours ago',
      icon: Receipt,
      iconColor: 'text-primary',
    },
    {
      type: 'reminder',
      message: 'Payment reminder sent to 3 students',
      time: '1 day ago',
      icon: AlertCircle,
      iconColor: 'text-warning',
    },
    {
      type: 'student',
      message: 'Rohan Mehta marked as inactive',
      time: '2 days ago',
      icon: Users,
      iconColor: 'text-muted-foreground',
    },
  ];

  const upcomingClasses = [
    { batch: 'Morning Beginners', time: '09:00 AM', day: 'Tomorrow' },
    { batch: 'Evening Advanced', time: '06:00 PM', day: 'Tomorrow' },
    { batch: 'Weekend Kids', time: '10:00 AM', day: 'Saturday' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold"
            >
              Welcome back! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              Here's what's happening at your dance studio today.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => navigate('/students')}
              className="gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Send Fee Reminders
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <activity.icon
                        className={`w-4 h-4 ${activity.iconColor}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Upcoming Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
              <div className="space-y-3">
                {upcomingClasses.map((cls, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">{cls.batch}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {cls.time}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{cls.day}</Badge>
                  </motion.div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/schedule')}
              >
                View Full Schedule
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions for Fee Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 border-warning/30 bg-warning/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {unpaidInvoices.length} students have pending payments
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Total outstanding: ₹{totalPending.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/students')}
                className="gap-2 bg-warning hover:bg-warning/90 text-warning-foreground"
              >
                <Receipt className="w-4 h-4" />
                Send Reminders
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
