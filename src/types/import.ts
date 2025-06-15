
export interface ImportStats {
  total: number;
  processed: number;
  successful: number;
  errors: number;
}

export interface ImportError {
  row: number;
  error: string;
  data: any;
}

export interface ColumnMapping {
  name: number;
  category: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calcium: number;
  iron: number;
  magnesium: number;
  potassium: number;
  sodium: number;
  vitamin_c: number;
  vitamin_d: number;
  salt: number;
}
