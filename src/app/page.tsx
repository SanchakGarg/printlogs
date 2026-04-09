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
import { badgeColor } from "@/lib/badge-color";
import { Trash2 } from "lucide-react";

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
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [confirmId, setConfirmId] = React.useState<number | null>(null);
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

  async function handleDelete(id: number) {
    setDeletingId(id);
    await fetch(`/api/prints/${id}`, { method: "DELETE" });
    setConfirmId(null);
    setDeletingId(null);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function DeleteButton({ id }: { id: number }) {
    const isConfirming = confirmId === id;
    const isDeleting = deletingId === id;

    if (isConfirming) {
      return (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="destructive"
            className="h-7 px-2 text-xs"
            disabled={isDeleting}
            onClick={() => handleDelete(id)}
          >
            {isDeleting ? "…" : "Delete"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={() => setConfirmId(null)}
          >
            Cancel
          </Button>
        </div>
      );
    }

    return (
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-muted-foreground hover:text-destructive"
        onClick={() => setConfirmId(id)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    );
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
                    <TableHead>For</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.print_name}</TableCell>
                      <TableCell>
                        <Badge style={badgeColor(log.printer_name)}>
                          {log.printer_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge style={badgeColor(log.material)}>
                          {log.material}
                        </Badge>
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
                      <TableCell className="text-right">
                        <DeleteButton id={log.id} />
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
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(log.created_at)}
                      </span>
                      <DeleteButton id={log.id} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge style={badgeColor(log.printer_name)}>
                      {log.printer_name}
                    </Badge>
                    <Badge style={badgeColor(log.material)}>
                      {log.material}
                    </Badge>
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
