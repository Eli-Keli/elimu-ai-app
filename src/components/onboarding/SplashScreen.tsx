import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>📚</Text>
        <Text style={styles.appName}>Elimu AI</Text>
        <Text style={styles.tagline}>Learn Smarter with AI</Text>
      </View>
      <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      <Text style={styles.footer}>Powered by Google Gemini</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  loader: {
    marginTop: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '500',
  },
});
