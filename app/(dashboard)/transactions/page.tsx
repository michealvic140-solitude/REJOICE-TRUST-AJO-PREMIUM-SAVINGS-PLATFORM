import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, CheckCircle2, XCircle, Receipt } from "lucide-react";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, groups(name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const stats = {
    total: transactions?.length || 0,
    approved: transactions?.filter((t) => t.status === "approved").length || 0,
    pending: transactions?.filter((t) => t.status === "pending").length || 0,
    declined: transactions?.filter((t) => t.status === "declined").length || 0,
    totalAmount:
      transactions
        ?.filter((t) => t.status === "approved")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Transactions
        </h1>
        <p className="text-muted-foreground mt-1">
          View and track all your contribution payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Approved</p>
                <p className="text-2xl font-bold text-gold">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Declined</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.declined}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-destructive opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Code</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Slot</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} className="border-border/50">
                      <TableCell className="font-mono text-sm">
                        {tx.code}
                      </TableCell>
                      <TableCell>{tx.groups?.name || "Unknown"}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>#{tx.seat_no || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "approved"
                              ? "default"
                              : tx.status === "declined"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            tx.status === "approved"
                              ? "bg-green-500/20 text-green-500"
                              : ""
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(tx.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Transactions Yet
              </h3>
              <p className="text-muted-foreground">
                Your transaction history will appear here after you make your
                first contribution.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
