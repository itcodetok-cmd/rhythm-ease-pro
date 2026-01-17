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
    .select("id, student_id, amount, created_at")
    .eq("status", "unpaid");

  if (error) {
    console.error(error);
    return new Response("Failed to fetch invoices", { status: 500 });
  }

  const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
  const TODAY = new Date();

  const eligibleInvoices: any[] = [];

  // 2️⃣ Determine eligibility
  for (const inv of invoices) {
    const createdAt = new Date(inv.created_at);
    const ageMs = TODAY.getTime() - createdAt.getTime();

    // Rule 1: At least 15 days old
    if (ageMs < FIFTEEN_DAYS) continue;

    const { data: lastReminder } = await supabase
      .from("invoice_reminders")
      .select("sent_at")
      .eq("invoice_id", inv.id)
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Rule 2: Never sent before
    if (!lastReminder) {
      eligibleInvoices.push(inv);
      continue;
    }

    const lastSent = new Date(lastReminder.sent_at);
    const daysSinceLast =
      (TODAY.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24);

    // Rule 3: Alternate days only
    if (daysSinceLast >= 2) {
      eligibleInvoices.push(inv);
    }
  }

  // 3️⃣ Send reminders + log history
  let emailsSent = 0;

  for (const inv of eligibleInvoices) {
    // 🔔 TODO: send email here (Resend logic already added earlier)

    await supabase.from("invoice_reminders").insert({
      invoice_id: inv.id,
      channel: "email",
      status: "sent",
    });

    emailsSent++;
  }

  return new Response(
    JSON.stringify({
      message: "Payment reminders processed",
      total_unpaid: invoices.length,
      eligible: eligibleInvoices.length,
      emails_sent: emailsSent,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
