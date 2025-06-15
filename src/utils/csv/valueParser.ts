
export const parseNumericValue = (value: string): number => {
  if (!value || value === '' || value === '-' || value === 'traces' || value === '<' || value === 'nd') return 0;
  
  let cleanValue = value.replace(',', '.').replace(/[^\d.-]/g, '');
  
  if (!cleanValue) return 0;
  
  const num = parseFloat(cleanValue);
  
  if (isNaN(num)) return 0;
  
  if (num > 999999) return 999999;
  if (num < -999999) return -999999;
  
  return Math.round(num * 100) / 100;
};
