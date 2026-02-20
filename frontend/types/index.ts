export interface ArchiveRule {
  id: string;
  name: string;
  type: 'age' | 'status' | 'custom';
  enabled: boolean;
  config: AgeConfig | StatusConfig | CustomConfig;
}

export interface AgeConfig {
  field: string;
  olderThanDays: number;
}

export interface StatusConfig {
  field: string;
  statusValue: string;
}

export interface CustomConfig {
  filterFormula: string;
}

export interface ArchiveStats {
  totalRecords: number;
  archivedRecords: number;
  recordsSaved: number;
  lastArchiveDate?: Date;
}

export interface ArchivedRecord {
  id: string;
  originalId: string;
  tableName: string;
  data: Record<string, any>;
  archivedAt: Date;
  archiveRuleId: string;
}

export type PricingTier = 'free' | 'pro' | 'team';

export interface PricingFeatures {
  tier: PricingTier;
  price: string;
  monthlyRecordLimit: number | null;
  baseLimit: number | null;
  scheduledArchives: boolean;
  teamManagement: boolean;
  complianceFeatures: boolean;
}
