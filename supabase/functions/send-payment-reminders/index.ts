import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 1️⃣ Fetch unpaid invoices
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(`
      id,
      amount,
      due_date,
      students (
        name,
        email
      )
    `)
    .eq("status", "unpaid");

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  // 2️⃣ Prepare reminders
  const reminders = invoices.map((inv) => ({
    invoice_id: inv.id,
    amount: inv.amount,
    due_date: inv.due_date,
    student_name: inv.students?.name,
    student_email: inv.students?.email,
  }));

  return new Response(
    JSON.stringify({
      message: "Payment reminders prepared",
      count: reminders.length,
      reminders,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
