import React from 'react';
import { useTranslation } from 'react-i18next';
import { HStack, VStack } from '@astryxdesign/core/Layout';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Selector } from '@astryxdesign/core/Selector';
import { LOCALES } from '../../i18n';
import { usePreferences } from '../../hooks/usePreferences';

export default function PreferencesControls({ compact = false }) {
  const { t } = useTranslation();
  const { locale, themeMode, setLocale, setThemeMode } = usePreferences();

  const localeOptions = LOCALES.map((code) => ({
    value: code,
    label: t(`preferences.locale${code[0].toUpperCase()}${code.slice(1)}`),
  }));

  const content = (
    <>
      <Selector
        label={t('preferences.language')}
        isLabelHidden={compact}
        size="sm"
        value={locale}
        options={localeOptions}
        onChange={(value) => {
          if (value) setLocale(value);
        }}
      />
      <SegmentedControl
        label={t('preferences.theme')}
        size="sm"
        value={themeMode}
        onChange={(value) => setThemeMode(value)}
      >
        <SegmentedControlItem value="light" label={t('preferences.themeLight')} />
        <SegmentedControlItem value="dark" label={t('preferences.themeDark')} />
        <SegmentedControlItem value="system" label={t('preferences.themeSystem')} />
      </SegmentedControl>
    </>
  );

  if (compact) {
    return <HStack gap={2}>{content}</HStack>;
  }

  return (
    <VStack gap={3} style={{ width: '100%', maxWidth: 360, marginTop: '1.5rem' }}>
      {content}
    </VStack>
  );
}
