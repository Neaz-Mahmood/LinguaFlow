import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
  children: React.ReactNode;
  onSignOut: () => void;
};

export default function AppLayout({ children, onSignOut }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundBody }]}>
      <Navbar onSignOut={onSignOut} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
