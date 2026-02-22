import React from 'react';
import { Box, Text, Heading } from '@airtable/blocks/ui';
import { ArchiveStats } from '../types';

interface DashboardProps {
  stats: ArchiveStats;
  currentTier: 'free' | 'pro' | 'team';
  monthlyArchiveCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, currentTier, monthlyArchiveCount }) => {
  const recordLimit = currentTier === 'free' ? 500 : null;
  const usagePercentage = recordLimit
    ? Math.min((monthlyArchiveCount / recordLimit) * 100, 100)
    : 0;

  return (
    <Box padding={3}>
      <Heading size="large" marginBottom={3}>
        Dashboard
      </Heading>

      <Box
        border="default"
        borderRadius="default"
        padding={3}
        marginBottom={3}
        backgroundColor="lightGray1"
      >
        <Text textColor="light" size="small" fontWeight="strong" marginBottom={2}>
          CURRENT PLAN: {currentTier.toUpperCase()}
        </Text>
        
        {currentTier === 'free' && (
          <Box marginTop={2}>
            <Text size="small">
              {monthlyArchiveCount} / {recordLimit} records archived this month
            </Text>
            <Box 
              height="8px" 
              backgroundColor="lightGray2" 
              borderRadius="default"
              marginTop={1}
              marginBottom={2}
            >
              <Box 
                height="100%" 
                backgroundColor="blue" 
                borderRadius="default"
                width={`${usagePercentage}%`}
              />
            </Box>
            <Text size="small" textColor="light">
              Upgrade to Pro for unlimited archives
            </Text>
          </Box>
        )}
      </Box>

      <Box display="flex" flexWrap="wrap" marginX={-2}>
        <StatCard
          title="Total Records"
          value={stats.totalRecords.toLocaleString()}
        />
        <StatCard
          title="Archived Records"
          value={stats.archivedRecords.toLocaleString()}
        />
        <StatCard
          title="Storage Saved"
          value={`${stats.recordsSaved.toLocaleString()} records`}
        />
        <StatCard
          title="Last Archive"
          value={stats.lastArchiveDate 
            ? new Date(stats.lastArchiveDate).toLocaleDateString()
            : 'Never'
          }
        />
      </Box>
    </Box>
  );
};

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <Box 
    width="50%" 
    padding={2}
    minWidth="200px"
  >
    <Box
      border="default"
      borderRadius="default"
      padding={3}
      backgroundColor="white"
    >
      <Box marginBottom={2}>
        <Text size="small" textColor="light" fontWeight="strong">
          {title.toUpperCase()}
        </Text>
      </Box>
      <Heading size="large">{value}</Heading>
    </Box>
  </Box>
);
