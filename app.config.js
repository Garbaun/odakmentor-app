module.exports = ({ config }) => {
	const isProd = process.env.NODE_ENV === 'production';
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
					// Only set basePath for production (e.g., GitHub Pages). In dev, leave empty.
					basePath: isProd ? '/odakmentor-app' : '',
				},
				eas: {
					projectId: '1f90da54-2681-4ca4-9426-b006c1d79775',
				},
			},
			owner: 'odakmentor',
		},
	};
};
