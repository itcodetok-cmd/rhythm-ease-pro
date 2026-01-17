import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("invoices")
        .select(`
          id,
          student_id,
          amount,
          status,
          generated_on,
          is_paid
        `)
        .order("generated_on", { ascending: false });

      if (!error) setInvoices(data || []);
      setLoading(false);
    };

    loadInvoices();
  }, []);

  return { invoices, loading };
}
