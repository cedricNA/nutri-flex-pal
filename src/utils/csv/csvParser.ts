
export const detectSeparator = (line: string): string => {
  const separators = ['\t', ';', ','];
  const counts = separators.map(sep => (line.match(new RegExp(sep, 'g')) || []).length);
  const maxIndex = counts.indexOf(Math.max(...counts));
  return separators[maxIndex];
};

export const parseCSVLine = (line: string, separator: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
};
