"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AutocompleteInput } from "@/components/autocomplete-input";
import { Suggestions } from "@/types";

interface AddPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: Suggestions;
  onSuccess: () => void;
}

const emptyForm = {
  print_name: "",
  printer_name: "",
  material: "",
  weight_grams: "",
  person_name: "",
  person_email: "",
  description: "",
};

export function AddPrintDialog({ open, onOpenChange, suggestions, onSuccess }: AddPrintDialogProps) {
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  function set(field: keyof typeof emptyForm) {
    return (value: string) => setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/prints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          weight_grams: form.weight_grams ? parseFloat(form.weight_grams) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setForm(emptyForm);
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
          <DialogTitle>Add Print Log</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="print_name">Print Name *</Label>
            <AutocompleteInput
              id="print_name"
              value={form.print_name}
              onChange={set("print_name")}
              suggestions={suggestions.print_names}
              placeholder="e.g. Benchy"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="printer_name">Printer *</Label>
            <AutocompleteInput
              id="printer_name"
              value={form.printer_name}
              onChange={set("printer_name")}
              suggestions={suggestions.printer_names}
              placeholder="e.g. Prusa MK4"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="material">Material *</Label>
            <AutocompleteInput
              id="material"
              value={form.material}
              onChange={set("material")}
              suggestions={suggestions.materials}
              placeholder="e.g. PLA, PETG, ABS"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="weight_grams">Weight (grams)</Label>
            <Input
              id="weight_grams"
              type="number"
              min="0"
              step="0.01"
              value={form.weight_grams}
              onChange={(e) => set("weight_grams")(e.target.value)}
              placeholder="e.g. 45.5"
            />
          </div>

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

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              placeholder="Any notes about the print..."
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
