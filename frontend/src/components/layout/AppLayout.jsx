import React from 'react';
import { AppShell } from '@astryxdesign/core/AppShell';
import { VStack } from '@astryxdesign/core/Layout';
import Footer from './Footer';
import Navbar from './Navbar';

/**
 * @param {{
 *   children: React.ReactNode;
 *   onBootstrap: () => void;
 *   onSignOut: () => void;
 *   resetSession: () => void;
 *   openOnboarding: () => void;
 * }} props
 */
export default function AppLayout({
  children,
  onBootstrap,
  onSignOut,
  resetSession,
  openOnboarding,
}) {
  return (
    <VStack className="app-layout" gap={0}>
      <div className="app-navbar">
        <Navbar
          onBootstrap={onBootstrap}
          onSignOut={onSignOut}
          resetSession={resetSession}
          openOnboarding={openOnboarding}
        />
      </div>

      <AppShell
        mobileNav={false}
        contentPadding={0}
        height="fill"
        variant="section"
        style={{ flex: 1, width: '100%' }}
      >
        <div className="app-main">{children}</div>
      </AppShell>

      <div className="app-footer">
        <Footer />
      </div>
    </VStack>
  );
}
