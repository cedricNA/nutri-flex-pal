
// Re-export all functionality from the modular files
export { detectSeparator, parseCSVLine } from './csv/csvParser';
export { parseNumericValue } from './csv/valueParser';
export { findColumnIndex, createColumnMapping } from './csv/columnDetection';
export { mapCategory, normalizeCategory } from './csv/categoryMapping';

// Re-export types for convenience
export type { ColumnMapping } from '@/types/import';
