import React, { useState } from 'react';
import {
  Box,
  Text,
  Heading,
  Button,
  FormField,
  Input,
  Select,
  Switch,
  Icon,
} from '@airtable/blocks/ui';
import { useBase } from '@airtable/blocks/ui';
import { ArchiveRule, AgeConfig, StatusConfig } from '../types';
import { getDateFieldNames, getSelectFieldNames } from '../utils/recordFilter';

interface ArchiveRulesProps {
  rules: ArchiveRule[];
  onAddRule: (rule: ArchiveRule) => void;
  onUpdateRule: (ruleId: string, updates: Partial<ArchiveRule>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const ArchiveRules: React.FC<ArchiveRulesProps> = ({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const base = useBase();

  const handleAddRule = () => {
    setShowAddForm(true);
  };

  return (
    <Box padding={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
        <Heading size="large">Archive Rules</Heading>
        <Button
          variant="primary"
          icon="plus"
          onClick={handleAddRule}
        >
          Add Rule
        </Button>
      </Box>

      {showAddForm && (
        <AddRuleForm
          onSave={(rule) => {
            onAddRule(rule);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {rules.length === 0 && !showAddForm && (
        <Box
          padding={4}
          border="default"
          borderRadius="default"
          backgroundColor="lightGray1"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon name="info" size={32} fillColor="gray" marginBottom={2} />
          <Text textColor="light">
            No archive rules configured. Create your first rule to get started.
          </Text>
        </Box>
      )}

      {rules.map((rule) => (
        <RuleCard
          key={rule.id}
          rule={rule}
          onUpdate={(updates) => onUpdateRule(rule.id, updates)}
          onDelete={() => onDeleteRule(rule.id)}
        />
      ))}
    </Box>
  );
};

interface RuleCardProps {
  rule: ArchiveRule;
  onUpdate: (updates: Partial<ArchiveRule>) => void;
  onDelete: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, onUpdate, onDelete }) => {
  const getRuleDescription = () => {
    switch (rule.type) {
      case 'age':
        const ageConfig = rule.config as AgeConfig;
        return `Archive records where "${ageConfig.field}" is older than ${ageConfig.olderThanDays} days`;
      
      case 'status':
        const statusConfig = rule.config as StatusConfig;
        return `Archive records where "${statusConfig.field}" equals "${statusConfig.statusValue}"`;
      
      case 'custom':
        return 'Custom filter formula';
      
      default:
        return '';
    }
  };

  return (
    <Box
      border="default"
      borderRadius="default"
      padding={3}
      marginBottom={2}
      backgroundColor="white"
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box flex={1}>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Heading size="small">{rule.name}</Heading>
            <Box marginLeft={2}>
              <Switch
                value={rule.enabled}
                onChange={(value) => onUpdate({ enabled: value })}
                size="small"
                label=""
              />
            </Box>
          </Box>
          
          <Text size="small" textColor="light">
            {getRuleDescription()}
          </Text>
          
          <Box marginTop={2}>
            <Text size="small" textColor="light">
              Type: {rule.type.toUpperCase()}
            </Text>
          </Box>
        </Box>
        
        <Button
          variant="danger"
          size="small"
          icon="x"
          onClick={onDelete}
          aria-label="Delete rule"
        />
      </Box>
    </Box>
  );
};

interface AddRuleFormProps {
  onSave: (rule: ArchiveRule) => void;
  onCancel: () => void;
}

const AddRuleForm: React.FC<AddRuleFormProps> = ({ onSave, onCancel }) => {
  const base = useBase();
  const [name, setName] = useState('');
  const [type, setType] = useState<'age' | 'status'>('age');
  const [selectedTableId, setSelectedTableId] = useState<string>(base.tables[0]?.id || '');
  const [field, setField] = useState('');
  const [olderThanDays, setOlderThanDays] = useState(30);
  const [statusValue, setStatusValue] = useState('');

  const activeTable = selectedTableId ? base.getTableByIdIfExists(selectedTableId) : null;

  const dateFields = activeTable ? getDateFieldNames(activeTable) : [];
  const selectFields = activeTable ? getSelectFieldNames(activeTable) : [];

  const handleSave = () => {
    if (!name || !field) return;

    const rule: ArchiveRule = {
      id: `rule_${Date.now()}`,
      name,
      type,
      enabled: true,
      config: type === 'age' 
        ? { field, olderThanDays }
        : { field, statusValue },
    };

    onSave(rule);
  };

  return (
    <Box
      border="thick"
      borderRadius="default"
      padding={3}
      marginBottom={3}
      backgroundColor="lightGray1"
    >
      <Heading size="small" marginBottom={3}>
        Create New Archive Rule
      </Heading>

      <FormField label="Table">
        <Select
          value={selectedTableId}
          onChange={(value) => {
            setSelectedTableId(value as string);
            setField('');
          }}
          options={base.tables.map(t => ({ value: t.id, label: t.name }))}
        />
      </FormField>

      <FormField label="Rule Name" marginTop={2}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Archive completed tasks"
        />
      </FormField>

      <FormField label="Rule Type" marginTop={2}>
        <Select
          value={type}
          onChange={(value) => setType((value as string) as 'age' | 'status')}
          options={[
            { value: 'age', label: 'Age-based (archive old records)' },
            { value: 'status', label: 'Status-based (archive by field value)' },
          ]}
        />
      </FormField>

      {type === 'age' && (
        <>
          <FormField label="Date Field" marginTop={2}>
            <Select
              value={field}
              onChange={(value) => setField(value as string)}
              options={dateFields.map(f => ({ value: f, label: f }))}
            />
          </FormField>

          <FormField label="Older Than (days)" marginTop={2}>
            <Input
              type="number"
              value={String(olderThanDays)}
              onChange={(e) => setOlderThanDays(Number(e.target.value))}
            />
          </FormField>
        </>
      )}

      {type === 'status' && (
        <>
          <FormField label="Status Field" marginTop={2}>
            <Select
              value={field}
              onChange={(value) => setField(value as string)}
              options={selectFields.map(f => ({ value: f, label: f }))}
            />
          </FormField>

          <FormField label="Status Value" marginTop={2}>
            <Input
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              placeholder="e.g., Completed, Archived, Done"
            />
          </FormField>
        </>
      )}

      <Box display="flex" marginTop={3}>
        <Button variant="primary" onClick={handleSave} disabled={!name || !field}>
          Save Rule
        </Button>
        <Button marginLeft={2} onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
