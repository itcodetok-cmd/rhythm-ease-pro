import { supabase } from "@/lib/supabase";

export async function markInvoicePaid(invoiceId: number, amount: number) {
  await supabase.from("payments").insert({
    invoice_id: invoiceId,
    amount,
    method: "manual",
  });

  await supabase
    .from("invoices")
    .update({ is_paid: true, status: "paid" })
    .eq("id", invoiceId);
}
