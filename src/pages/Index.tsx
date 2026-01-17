import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Receipt,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  const { stats, loading } = useDashboardStats();

  if (loading) {
    return <DashboardLayout>Loading dashboard…</DashboardLayout>;
  }

  const unpaidInvoicesCount = stats.unpaidInvoices ?? 0;
  const totalPending = stats.pendingAmount ?? 0;

  const sendReminders = async () => {
    try {
      setSending(true);
      const { error } = await supabase.functions.invoke(
        "send-payment-reminders"
      );
      if (error) throw error;
      alert("Reminders sent successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to send reminders");
    } finally {
      setSending(false);
    }
  };

  const statCards = [
    {
      label: "Active Students",
      value: stats.activeStudents,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Batches",
      value: stats.totalBatches,
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Unpaid Invoices",
      value: stats.unpaidInvoices,
      icon: Receipt,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Pending Amount",
      value: `₹${totalPending.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  const upcomingClasses = [
    { batch: "Morning Beginners", time: "09:00 AM", day: "Tomorrow" },
    { batch: "Evening Advanced", time: "06:00 PM", day: "Tomorrow" },
    { batch: "Weekend Kids", time: "10:00 AM", day: "Saturday" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back 👋</h1>
            <p className="text-muted-foreground">
              Here's what's happening today.
            </p>
          </div>
          <Button onClick={sendReminders} disabled={sending}>
            {sending ? "Sending…" : "Send Fee Reminders"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-5">
              <div className="flex gap-4 items-center">
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
          ))}
        </div>

        {/* Upcoming Classes */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
          <div className="space-y-3">
            {upcomingClasses.map((cls, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-muted/50 p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">{cls.batch}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {cls.time}
                  </div>
                </div>
                <Badge>{cls.day}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Payments */}
        <Card className="p-5 bg-warning/5 border-warning/30">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                {unpaidInvoicesCount} students have pending payments
              </h3>
              <p className="text-sm text-muted-foreground">
                Total outstanding: ₹{totalPending.toLocaleString("en-IN")}
              </p>
            </div>
            <Button onClick={() => navigate("/students")}>
              View Students
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
