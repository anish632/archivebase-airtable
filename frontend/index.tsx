import React, { useState, useEffect, useRef } from 'react';
import {
  initializeBlock,
  useBase,
  useGlobalConfig,
  Box,
  ViewportConstraint,
  Button,
} from '@airtable/blocks/ui';
import { ArchiveRule, ArchiveStats } from './types';
import { Dashboard } from './components/Dashboard';
import { ArchiveRules } from './components/ArchiveRules';
import { ArchiveExecutor } from './components/ArchiveExecutor';
import { Pricing } from './components/Pricing';
import { getLicense } from './utils/api';

type TabName = 'dashboard' | 'rules' | 'archive' | 'pricing';

function ArchiveBaseApp() {
  const base = useBase();
  const globalConfig = useGlobalConfig();

  const [activeTab, setActiveTab] = useState<TabName>('dashboard');
  const [rules, setRules] = useState<ArchiveRule[]>([]);
  const [stats, setStats] = useState<ArchiveStats>({
    totalRecords: 0,
    archivedRecords: 0,
    recordsSaved: 0,
    lastArchiveDate: undefined,
  });
  const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'team'>('free');
  const [monthlyArchiveCount, setMonthlyArchiveCount] = useState(0);

  // Load rules from global config only on initial mount
  const hasLoadedConfig = useRef(false);
  useEffect(() => {
    if (hasLoadedConfig.current) return;
    hasLoadedConfig.current = true;

    const savedRules = globalConfig.get('archiveRules') as ArchiveRule[] | undefined;
    if (savedRules) {
      setRules(savedRules);
    }

    const savedStats = globalConfig.get('archiveStats') as ArchiveStats | undefined;
    if (savedStats) {
      setStats({
        ...savedStats,
        lastArchiveDate: savedStats.lastArchiveDate
          ? new Date(savedStats.lastArchiveDate)
          : undefined,
      });
    }
  }, [globalConfig]);

  // Fetch license from backend
  useEffect(() => {
    getLicense(base.id).then((res) => {
      if (res.success && res.license) {
        setCurrentTier(res.license.tier);
        if (res.license.usage) {
          setMonthlyArchiveCount(res.license.usage.monthlyArchiveCount || 0);
        }
      }
    }).catch(() => {
      // Default to free on error
    });
  }, [base.id]);

  // Calculate total records across all tables
  useEffect(() => {
    const calculateTotalRecords = async () => {
      let total = 0;
      for (const table of base.tables) {
        const query = await table.selectRecordsAsync();
        total += query.records.length;
        
      }
      setStats(prev => ({ ...prev, totalRecords: total }));
    };

    calculateTotalRecords();
  }, [base]);

  const handleAddRule = async (rule: ArchiveRule) => {
    const newRules = [...rules, rule];
    setRules(newRules);
    await globalConfig.setAsync('archiveRules', newRules as any);
  };

  const handleUpdateRule = async (ruleId: string, updates: Partial<ArchiveRule>) => {
    const newRules = rules.map(r =>
      r.id === ruleId ? { ...r, ...updates } : r
    );
    setRules(newRules);
    await globalConfig.setAsync('archiveRules', newRules as any);
  };

  const handleDeleteRule = async (ruleId: string) => {
    const newRules = rules.filter(r => r.id !== ruleId);
    setRules(newRules);
    await globalConfig.setAsync('archiveRules', newRules as any);
  };

  const handleArchiveComplete = async (recordCount: number) => {
    const newStats: ArchiveStats = {
      ...stats,
      archivedRecords: stats.archivedRecords + recordCount,
      recordsSaved: stats.recordsSaved + recordCount,
      lastArchiveDate: new Date(),
    };
    
    setStats(newStats);
    await globalConfig.setAsync('archiveStats', {
      ...newStats,
      lastArchiveDate: newStats.lastArchiveDate?.toISOString(),
    });

    // Refresh total records count
    let total = 0;
    for (const table of base.tables) {
      const query = await table.selectRecordsAsync();
      total += query.records.length;
      
    }
    setStats(prev => ({ ...prev, totalRecords: total }));
  };

  return (
    <Box
      backgroundColor="lightGray1"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box
        backgroundColor="white"
        borderBottom="thick"
        padding={3}
      >
        <Box display="flex" alignItems="center">
          <Box>
            <Box fontFamily="system" fontSize={20} fontWeight="600">
              ArchiveBase
            </Box>
            <Box fontSize={12} textColor="light">
              Smart Archive & Data Lifecycle Manager
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box
        backgroundColor="white"
        borderBottom="default"
        paddingX={3}
        display="flex"
      >
        {([
          ['dashboard', 'Dashboard'],
          ['rules', 'Archive Rules'],
          ['archive', 'Archive Now'],
          ['pricing', 'Pricing'],
        ] as const).map(([tab, label]) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'secondary'}
            size="small"
            onClick={() => setActiveTab(tab as TabName)}
            marginRight={1}
            aria-selected={activeTab === tab}
          >
            {label}
          </Button>
        ))}
      </Box>

      {/* Content */}
      <Box flex={1} overflow="auto">
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} currentTier={currentTier} monthlyArchiveCount={monthlyArchiveCount} />
        )}
        
        {activeTab === 'rules' && (
          <ArchiveRules
            rules={rules}
            onAddRule={handleAddRule}
            onUpdateRule={handleUpdateRule}
            onDeleteRule={handleDeleteRule}
          />
        )}
        
        {activeTab === 'archive' && (
          <ArchiveExecutor
            rules={rules}
            onArchiveComplete={handleArchiveComplete}
            baseId={base.id}
          />
        )}
        
        {activeTab === 'pricing' && (
          <Pricing currentTier={currentTier} baseId={base.id} />
        )}
      </Box>

      {/* Footer */}
      <Box
        backgroundColor="white"
        borderTop="default"
        padding={2}
        textAlign="center"
      >
        <Box fontSize={11} textColor="light">
          ArchiveBase v1.0.0 | Made with ♥ for Airtable users
        </Box>
      </Box>
    </Box>
  );
}

initializeBlock(() => (
  <ViewportConstraint minSize={{ width: 600, height: 400 }}>
    <ArchiveBaseApp />
  </ViewportConstraint>
));
