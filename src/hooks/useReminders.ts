import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useReminders() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("reminder_logs")
      .select("*")
      .order("sent_on", { ascending: false })
      .then(({ data }) => setLogs(data || []));
  }, []);

  return logs;
}
