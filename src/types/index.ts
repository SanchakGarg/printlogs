export interface PrintLog {
  id: number;
  print_name: string;
  printer_name: string;
  material: string;
  weight_grams: number | null;
  person_name: string;
  person_email: string;
  description: string | null;
  created_at: string;
}

export interface Suggestions {
  print_names: string[];
  printer_names: string[];
  materials: string[];
  person_names: string[];
  person_emails: string[];
}
