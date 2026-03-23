import { redirect } from "next/navigation";
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
import { History, CheckCircle2, XCircle, Clock } from "lucide-react";
import { TransactionActions } from "@/components/admin/transaction-actions";

export default async function AdminTransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, groups(name), profiles:user_id(first_name, last_name, username)")
    .order("created_at", { ascending: false });

  const pending = transactions?.filter((t) => t.status === "pending") || [];
  const processed = transactions?.filter((t) => t.status !== "pending") || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Manage Transactions
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and verify user payments
        </p>
      </div>

      {/* Pending Transactions */}
      <Card className="glass-card border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Verification ({pending.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Code</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Slot</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((tx) => (
                    <TableRow key={tx.id} className="border-border/50">
                      <TableCell className="font-mono text-sm">
                        {tx.code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {tx.profiles?.first_name} {tx.profiles?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{tx.profiles?.username}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{tx.groups?.name || "Unknown"}</TableCell>
                      <TableCell className="font-medium text-gold">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>#{tx.seat_no || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(tx.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <TransactionActions
                          transactionId={tx.id}
                          userId={tx.user_id}
                          groupId={tx.group_id}
                          amount={tx.amount}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500 opacity-50" />
              <p>No pending transactions to verify</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Transactions */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-gold" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {processed.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Code</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processed.slice(0, 20).map((tx) => (
                    <TableRow key={tx.id} className="border-border/50">
                      <TableCell className="font-mono text-sm">
                        {tx.code}
                      </TableCell>
                      <TableCell>
                        {tx.profiles?.first_name} {tx.profiles?.last_name}
                      </TableCell>
                      <TableCell>{tx.groups?.name || "Unknown"}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(tx.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.status === "approved"
                              ? "default"
                              : "destructive"
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
            <div className="text-center py-8 text-muted-foreground">
              <p>No processed transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
