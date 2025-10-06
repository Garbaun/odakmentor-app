module.exports = {
  apps: [{
    name: 'odak-mentor-ai-backend',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Restart policy
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Memory management
    max_memory_restart: '1G',
    
    // Monitoring
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'data'],
    
    // Health check
    health_check_grace_period: 3000,
    
    // Advanced options
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
