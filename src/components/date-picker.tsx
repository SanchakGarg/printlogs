"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-left",
          "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        {format(value, "dd MMM yyyy")}
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-1 rounded-lg border bg-popover shadow-lg">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              if (d) { onChange(d); setOpen(false); }
            }}
          />
        </div>
      )}
    </div>
  );
}
