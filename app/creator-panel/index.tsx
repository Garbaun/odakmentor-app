import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CreatorPanelIndex() {
  useEffect(() => {
    // Ana sayfaya gelenleri login sayfasına yönlendir
    router.replace('/creator-panel/login');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Creator Panel'e yönlendiriliyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});
