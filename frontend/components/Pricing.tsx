import React, { useState } from 'react';
import { Box, Text, Heading, Button, Icon } from '@airtable/blocks/ui';
import { createCheckout } from '../utils/api';

interface PricingProps {
  currentTier: 'free' | 'pro' | 'team';
  baseId: string;
}

export const Pricing: React.FC<PricingProps> = ({ currentTier, baseId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (tier: 'pro' | 'team') => {
    setIsLoading(true);
    try {
      const res = await createCheckout(baseId, tier);
      if (res.success && res.checkoutUrl) {
        window.open(res.checkoutUrl, '_blank');
      } else {
        alert(res.error || 'Failed to create checkout. Please try again.');
      }
    } catch (e) {
      alert('Failed to connect to billing service. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      features: [
        'Archive up to 500 records/month',
        '1 base',
        'CSV export',
        'Basic archive rules',
      ],
      limitations: [
        'No scheduled archives',
        'No team features',
      ],
      tier: 'free' as const,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: [
        'Unlimited records',
        'Up to 10 bases',
        'Scheduled archives',
        'Advanced archive rules',
        'Priority support',
      ],
      tier: 'pro' as const,
      popular: true,
    },
    {
      name: 'Team',
      price: '$79',
      period: '/month',
      features: [
        'Unlimited bases',
        'Team management',
        'Compliance features',
        'Audit logs',
        'Custom retention policies',
        'Dedicated support',
      ],
      tier: 'team' as const,
    },
  ];

  return (
    <Box padding={3}>
      <Heading size="large" marginBottom={2}>
        Pricing
      </Heading>
      
      <Text textColor="light" marginBottom={4}>
        Choose the plan that fits your archiving needs
      </Text>

      <Box display="flex" flexWrap="wrap" marginX={-2}>
        {tiers.map((tier) => (
          <Box
            key={tier.name}
            width="33.333%"
            minWidth="280px"
            padding={2}
          >
            <Box
              border={tier.tier === currentTier ? 'thick' : 'default'}
              borderRadius="default"
              padding={3}
              backgroundColor="white"
              height="100%"
              display="flex"
              flexDirection="column"
            >
              {tier.popular && (
                <Box
                  backgroundColor="blue"
                  padding={1}
                  borderRadius="default"
                  marginBottom={2}
                  textAlign="center"
                >
                  <Text textColor="white" size="small" fontWeight="strong">
                    MOST POPULAR
                  </Text>
                </Box>
              )}

              <Heading size="small" marginBottom={1}>
                {tier.name}
              </Heading>

              <Box display="flex" alignItems="baseline" marginBottom={3}>
                <Heading size="xlarge">{tier.price}</Heading>
                {tier.period && (
                  <Text textColor="light" marginLeft={1}>
                    {tier.period}
                  </Text>
                )}
              </Box>

              <Box flex={1}>
                {tier.features.map((feature, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="flex-start"
                    marginBottom={2}
                  >
                    <Icon name="check" size={16} fillColor="green" />
                    <Text size="small" marginLeft={2}>
                      {feature}
                    </Text>
                  </Box>
                ))}

                {tier.limitations && tier.limitations.map((limitation, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="flex-start"
                    marginBottom={2}
                  >
                    <Icon name="x" size={16} fillColor="gray" />
                    <Text size="small" textColor="light" marginLeft={2}>
                      {limitation}
                    </Text>
                  </Box>
                ))}
              </Box>

              <Box marginTop={3}>
                {tier.tier === currentTier ? (
                  <Box
                    padding={2}
                    backgroundColor="lightGray1"
                    borderRadius="default"
                    textAlign="center"
                  >
                    <Text size="small" fontWeight="strong" textColor="light">
                      Current Plan
                    </Text>
                  </Box>
                ) : (
                  <Button
                    variant={tier.popular ? 'primary' : 'default'}
                    width="100%"
                    disabled={isLoading}
                    onClick={() => {
                      if (tier.tier === 'pro' || tier.tier === 'team') {
                        handleUpgrade(tier.tier);
                      }
                    }}
                  >
                    {isLoading ? 'Loading...' : tier.tier === 'free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        marginTop={4}
        padding={3}
        border="default"
        borderRadius="default"
        backgroundColor="lightGray1"
      >
        <Heading size="small" marginBottom={2}>
          💡 Why Archive with ArchiveBase?
        </Heading>
        <Text size="small" marginBottom={2}>
          • <strong>Performance:</strong> Keep your base fast by removing old data
        </Text>
        <Text size="small" marginBottom={2}>
          • <strong>Cost:</strong> Stay within Airtable's record limits without upgrading
        </Text>
        <Text size="small" marginBottom={2}>
          • <strong>Compliance:</strong> Automated retention policies for regulatory requirements
        </Text>
        <Text size="small">
          • <strong>Safety:</strong> Records are exported to CSV before deletion so you always have a backup
        </Text>
      </Box>
    </Box>
  );
};
