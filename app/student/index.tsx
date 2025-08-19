import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function StudentScreen() {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? 'light'];

	return (
		<ThemedView style={[styles.container, { backgroundColor: colors.surface }] }>
			<ThemedText type="title">Öğrenci</ThemedText>
			<ThemedText style={{ marginTop: 8 }}>Giriş ve onboarding burada olacak.</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
});
