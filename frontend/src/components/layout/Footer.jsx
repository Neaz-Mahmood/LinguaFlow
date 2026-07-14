import React from 'react';
import { useTranslation } from 'react-i18next';
import { HStack, LayoutFooter } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <LayoutFooter
      hasDivider
      role="contentinfo"
      label={t('layout.siteFooter')}
      padding={4}
      style={{ paddingInline: '2.5rem' }}
    >
      <HStack gap={2} style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Text type="supporting" color="secondary" as="span">
          {t('common.brand')}
        </Text>
        <Text type="supporting" color="secondary" as="span">
          {t('layout.copyright', { year })}
        </Text>
      </HStack>
    </LayoutFooter>
  );
}
