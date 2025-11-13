module.exports = {
  apps: [
    {
      name: 'odakmentor-frontend',
      script: 'npm.cmd',
      args: 'run web:serve',
      cwd: 'C:\\Projects\\odakmentor-app',
      env: {
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log'
    },
    {
      name: 'odakmentor-backend',
      script: 'video-conference-server.js',
      cwd: 'C:\\Projects\\odakmentor-app\\server',
      env: {
        PORT: 3001
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log'
    }
  ]
};