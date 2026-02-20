import { Record as AirtableRecord, Table } from '@airtable/blocks/models';
import { ArchiveRule, AgeConfig, StatusConfig } from '../types';

export async function getRecordsMatchingRule(
  table: Table,
  rule: ArchiveRule
): Promise<AirtableRecord[]> {
  const query = await table.selectRecordsAsync();
  const allRecords = query.records;
  
  const matchingRecords = allRecords.filter(record => 
    doesRecordMatchRule(record, rule)
  );
  
  query.unload();
  return matchingRecords;
}

function doesRecordMatchRule(record: AirtableRecord, rule: ArchiveRule): boolean {
  if (!rule.enabled) return false;
  
  switch (rule.type) {
    case 'age':
      return matchesAgeRule(record, rule.config as AgeConfig);
    
    case 'status':
      return matchesStatusRule(record, rule.config as StatusConfig);
    
    case 'custom':
      // Custom formula filtering would require server-side evaluation
      // For MVP, we skip custom rules in client-side filtering
      return false;
    
    default:
      return false;
  }
}

function matchesAgeRule(record: AirtableRecord, config: AgeConfig): boolean {
  try {
    const field = record.parentTable.getFieldByNameIfExists(config.field);
    if (!field) return false;
    
    const cellValue = record.getCellValue(field);
    if (!cellValue) return false;
    
    const dateValue = new Date(cellValue as string);
    if (isNaN(dateValue.getTime())) return false;
    
    const now = new Date();
    const daysDiff = (now.getTime() - dateValue.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff > config.olderThanDays;
  } catch (error) {
    console.error('Error matching age rule:', error);
    return false;
  }
}

function matchesStatusRule(record: AirtableRecord, config: StatusConfig): boolean {
  try {
    const field = record.parentTable.getFieldByNameIfExists(config.field);
    if (!field) return false;
    
    const cellValue = record.getCellValue(field);
    if (!cellValue) return false;
    
    // Handle different field types
    if (typeof cellValue === 'string') {
      return cellValue === config.statusValue;
    }
    
    if (typeof cellValue === 'object' && cellValue !== null) {
      // Single select field
      if ('name' in cellValue) {
        return (cellValue as any).name === config.statusValue;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error matching status rule:', error);
    return false;
  }
}

export function getDateFieldNames(table: Table): string[] {
  return table.fields
    .filter(field => 
      field.type === 'date' || 
      field.type === 'dateTime' ||
      field.type === 'createdTime' ||
      field.type === 'lastModifiedTime'
    )
    .map(field => field.name);
}

export function getSelectFieldNames(table: Table): string[] {
  return table.fields
    .filter(field => 
      field.type === 'singleSelect' ||
      field.type === 'multipleSelects'
    )
    .map(field => field.name);
}
