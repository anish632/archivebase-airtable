import React, { useState } from 'react';
import {
  Box,
  Text,
  Heading,
  Button,
  Select,
  FormField,
  ProgressBar,
  Icon,
} from '@airtable/blocks/ui';
import { useBase, useRecords } from '@airtable/blocks/ui';
import { ArchiveRule } from '../types';
import { getRecordsMatchingRule } from '../utils/recordFilter';
import { exportToCSV, downloadCSV, getArchiveFilename } from '../utils/csvExport';

interface ArchiveExecutorProps {
  rules: ArchiveRule[];
  onArchiveComplete: (recordCount: number) => void;
}

export const ArchiveExecutor: React.FC<ArchiveExecutorProps> = ({
  rules,
  onArchiveComplete,
}) => {
  const base = useBase();
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [selectedRuleId, setSelectedRuleId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [matchingCount, setMatchingCount] = useState<number | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeRules = rules.filter(r => r.enabled);
  const selectedTable = selectedTableId 
    ? base.getTableByIdIfExists(selectedTableId)
    : null;

  const handleScan = async () => {
    if (!selectedTable || !selectedRuleId) return;

    setIsScanning(true);
    setMatchingCount(null);

    try {
      const rule = rules.find(r => r.id === selectedRuleId);
      if (!rule) throw new Error('Rule not found');

      const matchingRecords = await getRecordsMatchingRule(selectedTable, rule);
      setMatchingCount(matchingRecords.length);
    } catch (error) {
      console.error('Error scanning records:', error);
      alert('Error scanning records. Check console for details.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleArchive = async () => {
    if (!selectedTable || !selectedRuleId) return;

    const confirmed = confirm(
      `This will archive ${matchingCount} records to CSV and delete them from Airtable. Continue?`
    );

    if (!confirmed) return;

    setIsArchiving(true);
    setProgress(0);

    try {
      const rule = rules.find(r => r.id === selectedRuleId);
      if (!rule) throw new Error('Rule not found');

      // Get matching records
      const matchingRecords = await getRecordsMatchingRule(selectedTable, rule);
      
      if (matchingRecords.length === 0) {
        alert('No records match this rule.');
        return;
      }

      // Export to CSV
      setProgress(25);
      const csvContent = exportToCSV(matchingRecords, selectedTable.name);
      const filename = getArchiveFilename(selectedTable.name);
      
      setProgress(50);
      downloadCSV(csvContent, filename);

      // Delete records from Airtable
      setProgress(75);
      const recordIds = matchingRecords.map(r => r.id);
      
      // Delete in batches of 50 (Airtable API limit)
      const batchSize = 50;
      for (let i = 0; i < recordIds.length; i += batchSize) {
        const batch = recordIds.slice(i, i + batchSize);
        await selectedTable.deleteRecordsAsync(batch);
        
        const progressPercent = 75 + (25 * (i + batchSize) / recordIds.length);
        setProgress(Math.min(progressPercent, 100));
      }

      setProgress(100);
      onArchiveComplete(matchingRecords.length);
      
      alert(`Successfully archived ${matchingRecords.length} records!`);
      setMatchingCount(null);
      
    } catch (error) {
      console.error('Error archiving records:', error);
      alert('Error archiving records. Check console for details.');
    } finally {
      setIsArchiving(false);
      setProgress(0);
    }
  };

  return (
    <Box padding={3}>
      <Heading size="large" marginBottom={3}>
        Archive Records
      </Heading>

      {activeRules.length === 0 && (
        <Box
          padding={4}
          border="default"
          borderRadius="default"
          backgroundColor="lightGray1"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon name="warning" size={32} fillColor="orange" marginBottom={2} />
          <Text textColor="light">
            No active archive rules. Enable or create a rule first.
          </Text>
        </Box>
      )}

      {activeRules.length > 0 && (
        <>
          <FormField label="Select Table">
            <Select
              value={selectedTableId}
              onChange={(value) => {
                setSelectedTableId(value);
                setMatchingCount(null);
              }}
              options={[
                { value: '', label: 'Choose a table...' },
                ...base.tables.map(t => ({ value: t.id, label: t.name }))
              ]}
            />
          </FormField>

          <FormField label="Select Archive Rule" marginTop={2}>
            <Select
              value={selectedRuleId}
              onChange={(value) => {
                setSelectedRuleId(value);
                setMatchingCount(null);
              }}
              options={[
                { value: '', label: 'Choose a rule...' },
                ...activeRules.map(r => ({ value: r.id, label: r.name }))
              ]}
              disabled={!selectedTableId}
            />
          </FormField>

          <Box marginTop={3}>
            <Button
              variant="primary"
              onClick={handleScan}
              disabled={!selectedTableId || !selectedRuleId || isScanning || isArchiving}
              icon="search"
            >
              {isScanning ? 'Scanning...' : 'Scan for Matching Records'}
            </Button>
          </Box>

          {matchingCount !== null && (
            <Box
              marginTop={3}
              padding={3}
              border="thick"
              borderRadius="default"
              backgroundColor="lightGray1"
            >
              <Box display="flex" alignItems="center" marginBottom={2}>
                <Icon 
                  name="info" 
                  size={24} 
                  fillColor={matchingCount > 0 ? 'blue' : 'gray'} 
                />
                <Heading size="small" marginLeft={2}>
                  Scan Results
                </Heading>
              </Box>

              <Text size="large" fontWeight="strong">
                {matchingCount} record{matchingCount !== 1 ? 's' : ''} found
              </Text>

              {matchingCount > 0 && (
                <Box marginTop={3}>
                  <Text size="small" textColor="light" marginBottom={2}>
                    This will:
                  </Text>
                  <Text size="small" marginBottom={1}>
                    • Export {matchingCount} records to CSV
                  </Text>
                  <Text size="small" marginBottom={1}>
                    • Delete records from Airtable
                  </Text>
                  <Text size="small" marginBottom={3}>
                    • Free up space in your base
                  </Text>

                  <Button
                    variant="danger"
                    onClick={handleArchive}
                    disabled={isArchiving}
                    icon="download"
                  >
                    {isArchiving ? 'Archiving...' : 'Archive & Delete Records'}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {isArchiving && (
            <Box marginTop={3}>
              <ProgressBar progress={progress / 100} />
              <Text size="small" textColor="light" marginTop={1}>
                Archiving records... {Math.round(progress)}%
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
