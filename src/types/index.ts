export interface PrintLog {
  id: number;
  log_id: string;
  print_name: string;
  printer_name: string;
  material: string;
  weight_grams: number | null;
  person_name: string;
  person_email: string;
  description: string | null;
  printed_at: string;
  created_at: string;
}

export interface Suggestions {
  print_names: string[];
  printer_names: string[];
  person_names: string[];
  person_emails: string[];
}
