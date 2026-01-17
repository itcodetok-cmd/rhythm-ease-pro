import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInvoices } from "@/hooks/useInvoices";
import { markInvoicePaid } from "@/hooks/useMarkInvoicePaid";

export default function Invoices() {
  const { invoices, loading } = useInvoices();

  if (loading) {
    return <DashboardLayout>Loading invoices…</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      <div className="space-y-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="font-medium">Invoice #{inv.id}</p>
              <p className="text-sm text-muted-foreground">
                Amount: ₹{inv.amount}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={inv.is_paid ? "success" : "destructive"}>
                {inv.is_paid ? "Paid" : "Unpaid"}
              </Badge>

              {!inv.is_paid && (
                <Button
                  onClick={() =>
                    markInvoicePaid(inv.id, inv.amount)
                  }
                >
                  Mark Paid
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
