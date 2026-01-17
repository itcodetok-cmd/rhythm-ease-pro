import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useDashboardStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeStudents: 0,
    totalBatches: 0,
    unpaidInvoices: 0,
    pendingAmount: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);

      const [{ count: students }, { count: batches }, { data: invoices }] =
        await Promise.all([
          supabase
            .from("students")
            .select("*", { count: "exact", head: true })
            .eq("status", "active"),

          supabase
            .from("batches")
            .select("*", { count: "exact", head: true }),

          supabase
            .from("invoices")
            .select("amount, status")
            .eq("status", "unpaid"),
        ]);

      const pendingAmount =
        invoices?.reduce((sum, inv) => sum + inv.amount, 0) ?? 0;

      setStats({
        activeStudents: students ?? 0,
        totalBatches: batches ?? 0,
        unpaidInvoices: invoices?.length ?? 0,
        pendingAmount,
      });

      setLoading(false);
    };

    loadStats();
  }, []);

  return { stats, loading };
}
