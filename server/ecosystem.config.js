module.exports = {
  apps: [
    {
      name: 'odakmentor-server',
      script: 'video-conference-server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        DB_HOST: process.env.DB_HOST || '127.0.0.1',
        DB_PORT: process.env.DB_PORT || '5432',
        DB_NAME: process.env.DB_NAME || 'odakmentor_db',
        DB_USER: process.env.DB_USER || 'odakmentor',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        JWT_SECRET: process.env.JWT_SECRET || 'change-me',
        ADMIN_BOOTSTRAP: process.env.ADMIN_BOOTSTRAP || '0',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@odakmentor.com',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
      },
    },
  ],
};


