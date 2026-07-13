import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../../components/ui';
import { LOCALES } from '../../i18n';
import { spacing, ThemeMode } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { usePreferences } from '../../hooks/usePreferences';
import { AppLocale } from '../../model';

const THEME_OPTIONS: ThemeMode[] = ['light', 'dark', 'system'];

export default function PreferencesControls() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { locale, themeMode, setLocale, setThemeMode } = usePreferences();

  return (
    <View style={styles.wrap}>
      <Text variant="label" style={styles.sectionLabel}>
        {t('preferences.language')}
      </Text>
      <View style={styles.row}>
        {LOCALES.map((code) => {
          const selected = locale === code;
          return (
            <Pressable
              key={code}
              onPress={() => setLocale(code as AppLocale)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.accent : colors.backgroundMuted,
                  borderColor: selected ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                variant="label"
                style={{
                  color: selected ? colors.onAccent : colors.textPrimary,
                }}
              >
                {t(`preferences.locale${code[0].toUpperCase()}${code.slice(1)}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text variant="label" style={[styles.sectionLabel, styles.themeLabel]}>
        {t('preferences.theme')}
      </Text>
      <View style={styles.row}>
        {THEME_OPTIONS.map((mode) => {
          const selected = themeMode === mode;
          const labelKey =
            mode === 'light'
              ? 'preferences.themeLight'
              : mode === 'dark'
                ? 'preferences.themeDark'
                : 'preferences.themeSystem';
          return (
            <Pressable
              key={mode}
              onPress={() => setThemeMode(mode)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.accent : colors.backgroundMuted,
                  borderColor: selected ? colors.accent : colors.border,
                },
              ]}
            >
              <Text
                variant="label"
                style={{
                  color: selected ? colors.onAccent : colors.textPrimary,
                }}
              >
                {t(labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginBottom: spacing[5],
  },
  sectionLabel: {
    marginBottom: spacing[2],
  },
  themeLabel: {
    marginTop: spacing[4],
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
});
