"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger,
} from "@/components/ui/select";
import { AutocompleteInput } from "@/components/autocomplete-input";
import { DatePicker } from "@/components/date-picker";
import { MATERIALS, materialDotColor } from "@/lib/badge-color";
import { PrintLog, Suggestions } from "@/types";

interface PrintFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: Suggestions;
  onSuccess: () => void;
  /** Present → edit mode; absent → add mode */
  log?: PrintLog;
}

function makeEmpty() {
  return {
    print_name:   "",
    printer_name: "",
    material:     "",
    weight_grams: "",
    person_name:  "",
    person_email: "",
    description:  "",
    printed_at:   new Date(),
  };
}

function fromLog(log: PrintLog) {
  return {
    print_name:   log.print_name,
    printer_name: log.printer_name,
    material:     log.material,
    weight_grams: log.weight_grams?.toString() ?? "",
    person_name:  log.person_name,
    person_email: log.person_email,
    description:  log.description ?? "",
    printed_at:   new Date(log.printed_at),
  };
}

export function PrintFormDialog({
  open, onOpenChange, suggestions, onSuccess, log,
}: PrintFormDialogProps) {
  const isEdit = !!log;
  const [form, setForm] = React.useState(makeEmpty);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Reset / populate form whenever dialog opens
  React.useEffect(() => {
    if (open) {
      setForm(log ? fromLog(log) : makeEmpty());
      setError("");
    }
  }, [open, log]);

  function set<K extends keyof ReturnType<typeof makeEmpty>>(field: K) {
    return (value: ReturnType<typeof makeEmpty>[K]) =>
      setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        weight_grams: form.weight_grams ? parseFloat(form.weight_grams) : null,
        printed_at: format(form.printed_at, "yyyy-MM-dd"),
      };

      const url    = isEdit ? `/api/prints/${log!.id}` : "/api/prints";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Print Log" : "Add Print Log"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Print date */}
          <div className="space-y-1">
            <Label>Print Date *</Label>
            <DatePicker value={form.printed_at} onChange={set("printed_at")} />
          </div>

          {/* Print name */}
          <div className="space-y-1">
            <Label htmlFor="print_name">Print Name *</Label>
            <AutocompleteInput
              id="print_name"
              value={form.print_name}
              onChange={set("print_name")}
              suggestions={suggestions.print_names}
              placeholder="Benchy"
            />
          </div>

          {/* Printer */}
          <div className="space-y-1">
            <Label htmlFor="printer_name">Printer *</Label>
            <AutocompleteInput
              id="printer_name"
              value={form.printer_name}
              onChange={set("printer_name")}
              suggestions={suggestions.printer_names}
              placeholder="Ava"
            />
          </div>

          {/* Material — fixed dropdown */}
          <div className="space-y-1">
            <Label>Material *</Label>
            <Select
              value={form.material}
              onValueChange={(v) => setForm((f) => ({ ...f, material: v ?? "" }))}
            >
              <SelectTrigger className="w-full h-9">
                {form.material ? (
                  <span className="flex items-center gap-2 flex-1 text-left">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: materialDotColor(form.material) }}
                    />
                    {form.material}
                  </span>
                ) : (
                  <span className="text-muted-foreground flex-1 text-left">
                    Select material…
                  </span>
                )}
              </SelectTrigger>
              <SelectContent>
                {MATERIALS.map((m) => (
                  <SelectItem key={m} value={m}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: materialDotColor(m) }}
                      />
                      {m}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <Label htmlFor="weight_grams">Weight (grams)</Label>
            <Input
              id="weight_grams"
              type="number"
              min="0"
              step="0.01"
              value={form.weight_grams}
              onChange={(e) => set("weight_grams")(e.target.value)}
              placeholder="45.5"
            />
          </div>

          {/* For (person) */}
          <div className="space-y-1">
            <Label htmlFor="person_name">For *</Label>
            <AutocompleteInput
              id="person_name"
              value={form.person_name}
              onChange={set("person_name")}
              suggestions={suggestions.person_names}
              placeholder="Full name"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="person_email">Email *</Label>
            <AutocompleteInput
              id="person_email"
              type="email"
              value={form.person_email}
              onChange={set("person_email")}
              suggestions={suggestions.person_emails}
              placeholder="email@example.com"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              placeholder="Any notes about the print…"
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
