import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/Layout';
import { TopNav, TopNavHeading } from '@astryxdesign/core/TopNav';
import PreferencesControls from '../../features/preferences/PreferencesControls';

/**
 * @param {{
 *   onBootstrap: () => void;
 *   onSignOut: () => void;
 *   resetSession: () => void;
 *   openOnboarding: () => void;
 * }} props
 */
export default function Navbar({ onBootstrap, onSignOut, resetSession, openOnboarding }) {
  const { t } = useTranslation();

  return (
    <TopNav
      label={t('layout.mainNav')}
      heading={
        <TopNavHeading
          heading={t('common.brand')}
          onClick={onBootstrap}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onBootstrap();
            }
          }}
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
        />
      }
      endContent={
        <HStack gap={2}>
          <PreferencesControls compact />
          <Button
            label={t('common.resetSession')}
            variant="secondary"
            size="sm"
            onClick={resetSession}
          />
          <Button
            label={t('common.setProfile')}
            variant="primary"
            size="sm"
            onClick={openOnboarding}
          />
          <Button
            label={t('common.signOut')}
            variant="secondary"
            size="sm"
            onClick={onSignOut}
          />
        </HStack>
      }
    />
  );
}
