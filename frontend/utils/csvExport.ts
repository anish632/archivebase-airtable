import { MatchedRecord } from './recordFilter';

export function exportToCSV(records: MatchedRecord[], fieldNames: string[]): string {
  if (records.length === 0) return '';

  // Create header row
  const headers = ['Record ID', ...fieldNames];

  // Create data rows from pre-extracted cell values
  const rows = records.map(record => {
    const row: string[] = [record.id];

    fieldNames.forEach(fieldName => {
      const value = record.cellValues[fieldName];
      row.push(formatCellValue(value));
    });

    return row;
  });

  // Combine headers and rows
  const allRows = [headers, ...rows];

  // Convert to CSV string
  return allRows.map(row =>
    row.map(cell => escapeCsvValue(String(cell ?? ''))).join(',')
  ).join('\n');
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '';

  if (Array.isArray(value)) {
    return value
      .map((v: any) => v.name || v.url || v.filename || v.id || String(v))
      .join('; ');
  }

  if (typeof value === 'object' && value !== null) {
    if ('name' in value) return (value as any).name;
    if ('email' in value) return (value as any).email;
    return JSON.stringify(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
}

function escapeCsvValue(value: string): string {
  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Use window.open as a fallback-safe approach that works in iframes.
  // The <a download> trick can be blocked in sandboxed extension iframes.
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup after a short delay to ensure the browser picks up the download
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

export function getArchiveFilename(tableName: string): string {
  const date = new Date().toISOString().split('T')[0];
  const sanitized = tableName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${sanitized}_archive_${date}.csv`;
}
