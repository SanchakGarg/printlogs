"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddPrintDialog } from "@/components/add-print-dialog";
import { PrintLog, Suggestions } from "@/types";

const emptySuggestions: Suggestions = {
  print_names: [],
  printer_names: [],
  materials: [],
  person_names: [],
  person_emails: [],
};

export default function Home() {
  const [logs, setLogs] = React.useState<PrintLog[]>([]);
  const [suggestions, setSuggestions] = React.useState<Suggestions>(emptySuggestions);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  async function fetchData() {
    const [logsRes, suggestionsRes] = await Promise.all([
      fetch("/api/prints"),
      fetch("/api/suggestions"),
    ]);
    setLogs(await logsRes.json());
    setSuggestions(await suggestionsRes.json());
    setLoading(false);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">3D Print Logger</h1>
            <p className="text-sm text-muted-foreground">
              {logs.length} {logs.length === 1 ? "log" : "logs"} recorded
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>+ Add Print</Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No prints logged yet. Add your first one!
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Print Name</TableHead>
                    <TableHead>Printer</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Done For</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.print_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{log.printer_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.material}</Badge>
                      </TableCell>
                      <TableCell>
                        {log.weight_grams != null ? `${log.weight_grams}g` : "—"}
                      </TableCell>
                      <TableCell>{log.person_name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${log.person_email}`}
                          className="text-primary underline underline-offset-2 text-sm"
                        >
                          {log.person_email}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                        {log.description || "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="rounded-lg border p-4 space-y-2 bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-base">{log.print_name}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{log.printer_name}</Badge>
                    <Badge variant="outline">{log.material}</Badge>
                    {log.weight_grams != null && (
                      <Badge variant="outline">{log.weight_grams}g</Badge>
                    )}
                  </div>
                  <div className="text-sm space-y-0.5">
                    <p>
                      <span className="text-muted-foreground">For: </span>
                      {log.person_name}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email: </span>
                      <a
                        href={`mailto:${log.person_email}`}
                        className="text-primary underline underline-offset-2"
                      >
                        {log.person_email}
                      </a>
                    </p>
                    {log.description && (
                      <p className="text-muted-foreground pt-1">{log.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AddPrintDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        suggestions={suggestions}
        onSuccess={fetchData}
      />
    </main>
  );
}
