import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '../src/theme/colors';

export default function SettingsScreen() {
  const [isHighContrast, setIsHighContrast] = React.useState(false);
  const [isDyslexiaFriendly, setIsDyslexiaFriendly] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Accessibility Preferences</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>High Contrast Mode</Text>
        <Switch value={isHighContrast} onValueChange={setIsHighContrast} />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Dyslexia Friendly Font</Text>
        <Switch value={isDyslexiaFriendly} onValueChange={setIsDyslexiaFriendly} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.text,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingLabel: {
    fontSize: 18,
    color: colors.text,
  },
});
