import { Record as AirtableRecord, FieldType } from '@airtable/blocks/models';

export function exportToCSV(records: AirtableRecord[], tableName: string): string {
  if (records.length === 0) return '';

  const table = records[0].parentTable;
  const fields = table.fields;

  // Create header row
  const headers = ['Record ID', ...fields.map(f => f.name)];
  
  // Create data rows
  const rows = records.map(record => {
    const row = [record.id];
    
    fields.forEach(field => {
      const cellValue = record.getCellValue(field);
      row.push(formatCellValue(cellValue, field.type));
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

function formatCellValue(value: any, fieldType: FieldType): string {
  if (value === null || value === undefined) return '';
  
  switch (fieldType) {
    case FieldType.MULTIPLE_ATTACHMENTS:
      return Array.isArray(value) 
        ? value.map((a: any) => a.url || a.filename).join('; ')
        : '';
    
    case FieldType.MULTIPLE_RECORD_LINKS:
    case FieldType.MULTIPLE_LOOKUP_VALUES:
    case FieldType.MULTIPLE_SELECTS:
    case FieldType.MULTIPLE_COLLABORATORS:
      return Array.isArray(value) 
        ? value.map((v: any) => v.name || v.id || String(v)).join('; ')
        : '';
    
    case FieldType.SINGLE_COLLABORATOR:
      return value.name || value.email || '';
    
    case FieldType.DATE:
    case FieldType.DATE_TIME:
      return value;
    
    case FieldType.CHECKBOX:
      return value ? 'true' : 'false';
    
    default:
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return String(value);
  }
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
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function getArchiveFilename(tableName: string): string {
  const date = new Date().toISOString().split('T')[0];
  const sanitized = tableName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${sanitized}_archive_${date}.csv`;
}
