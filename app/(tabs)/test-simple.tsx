import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TestSimple() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test Sayfası Çalışıyor!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
