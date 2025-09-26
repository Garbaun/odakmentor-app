import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

let overrideScheme: Exclude<ColorSchemeName, 'no-preference'> | null = null;
const listeners = new Set<() => void>();

export function setColorSchemeOverride(next: Exclude<ColorSchemeName, 'no-preference'> | null) {
	overrideScheme = next;
	listeners.forEach((fn) => fn());
}

export function useColorScheme(): Exclude<ColorSchemeName, 'no-preference'> {
	const system = useSystemColorScheme() ?? 'light';
	const [, setVersion] = useState(0);

	useEffect(() => {
		const sub = Appearance.addChangeListener(() => setVersion((v) => v + 1));
		const rerender = () => setVersion((v) => v + 1);
		listeners.add(rerender);
		return () => {
			sub.remove();
			listeners.delete(rerender);
		};
	}, []);

	return (overrideScheme ?? system) as 'light' | 'dark';
}
