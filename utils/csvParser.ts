import { MatchData } from '../types';

export const parseCSV = (csvText: string): MatchData[] => {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  // Detect delimiter (comma or semicolon) based on first line
  const firstLine = lines[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';

  const headers = lines[0].split(delimiter).map(h => h.trim());
  
  // Required columns from PRD
  const requiredColumns = [
    'Date', 'HomeTeam', 'AwayTeam', 'FTHG', 'FTAG', 'FTR',
    'HTHG', 'HTAG', 'HTR', 'HS', 'AS', 'HST', 'AST',
    'HF', 'AF', 'HC', 'AC', 'HY', 'AY', 'HR', 'AR'
  ];

  // Map header index to column name
  const columnMap: { [key: string]: number } = {};
  requiredColumns.forEach(col => {
    const index = headers.indexOf(col);
    if (index !== -1) {
      columnMap[col] = index;
    }
  });

  const data: MatchData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(delimiter);
    if (currentLine.length < headers.length) continue;

    try {
      const row: any = {};
      
      // Helper to safely parse int
      const parseIntSafe = (val: string) => {
        const num = parseInt(val, 10);
        return isNaN(num) ? 0 : num;
      };

      // Extract data based on mapped indices
      if (columnMap['Date'] !== undefined) row.Date = currentLine[columnMap['Date']];
      if (columnMap['HomeTeam'] !== undefined) row.HomeTeam = currentLine[columnMap['HomeTeam']];
      if (columnMap['AwayTeam'] !== undefined) row.AwayTeam = currentLine[columnMap['AwayTeam']];
      
      row.FTHG = parseIntSafe(currentLine[columnMap['FTHG']]);
      row.FTAG = parseIntSafe(currentLine[columnMap['FTAG']]);
      row.FTR = currentLine[columnMap['FTR']] || 'D';
      
      row.HTHG = parseIntSafe(currentLine[columnMap['HTHG']]);
      row.HTAG = parseIntSafe(currentLine[columnMap['HTAG']]);
      row.HTR = currentLine[columnMap['HTR']] || 'D';
      
      row.HS = parseIntSafe(currentLine[columnMap['HS']]);
      row.AS = parseIntSafe(currentLine[columnMap['AS']]);
      row.HST = parseIntSafe(currentLine[columnMap['HST']]);
      row.AST = parseIntSafe(currentLine[columnMap['AST']]);
      
      row.HF = parseIntSafe(currentLine[columnMap['HF']]);
      row.AF = parseIntSafe(currentLine[columnMap['AF']]);
      row.HC = parseIntSafe(currentLine[columnMap['HC']]);
      row.AC = parseIntSafe(currentLine[columnMap['AC']]);
      
      row.HY = parseIntSafe(currentLine[columnMap['HY']]);
      row.AY = parseIntSafe(currentLine[columnMap['AY']]);
      row.HR = parseIntSafe(currentLine[columnMap['HR']]);
      row.AR = parseIntSafe(currentLine[columnMap['AR']]);

      // Basic validation: Ensure teams exist
      if (row.HomeTeam && row.AwayTeam) {
        data.push(row as MatchData);
      }
    } catch (e) {
      console.warn(`Skipping malformed line ${i}`, e);
    }
  }

  return data;
};
