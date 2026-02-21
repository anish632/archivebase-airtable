import React from 'react';
import { Box, Text, Heading, Icon } from '@airtable/blocks/ui';
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
          icon="table"
        />
        <StatCard
          title="Archived Records"
          value={stats.archivedRecords.toLocaleString()}
          icon="download"
        />
        <StatCard
          title="Storage Saved"
          value={`${stats.recordsSaved.toLocaleString()} records`}
          icon="check"
        />
        <StatCard
          title="Last Archive"
          value={stats.lastArchiveDate 
            ? new Date(stats.lastArchiveDate).toLocaleDateString()
            : 'Never'
          }
          icon="calendar"
        />
      </Box>
    </Box>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
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
      <Box display="flex" alignItems="center" marginBottom={2}>
        <Icon name={icon as any} size={16} fillColor="gray" />
        <Text 
          size="small" 
          textColor="light" 
          fontWeight="strong"
          marginLeft={2}
        >
          {title.toUpperCase()}
        </Text>
      </Box>
      <Heading size="large">{value}</Heading>
    </Box>
  </Box>
);
