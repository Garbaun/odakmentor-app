	module.exports = ({ config }) => {
	const isProd = process.env.NODE_ENV === 'production';
	// Determine router basePath: use GH_PAGES or explicit EXPO_PUBLIC_BASE_PATH; default to '' for NGINX/site root
	const explicitBase = process.env.EXPO_PUBLIC_BASE_PATH || '';
	const isGhPages = process.env.GH_PAGES === '1' || explicitBase === '/odakmentor-app';
	const basePath = isGhPages ? '/odakmentor-app' : '';
	return {
		...config,
		expo: {
			name: 'Odak Mentor',
			slug: 'odak-mentor',
			version: '1.0.0',
			platforms: ['web'],
			orientation: 'default',
			icon: './assets/images/logo.png',
			userInterfaceStyle: 'automatic',
			splash: {
				image: './assets/images/logo.png',
				resizeMode: 'contain',
				backgroundColor: '#667eea',
			},
			assetBundlePatterns: ['**/*'],
			web: {
				favicon: './assets/images/favicon.png',
				bundler: 'metro',
			},
			plugins: ['expo-router'],
			scheme: 'odak-mentor',
			extra: {
				router: {
					// Only set basePath for GH Pages; keep empty for NGINX/site root.
					basePath,
				},
				eas: {
					projectId: '1f90da54-2681-4ca4-9426-b006c1d79775',
				},
			},
			owner: 'odakmentor',
		},
	};
};
