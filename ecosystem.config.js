require('dotenv').config()

module.exports = {
  apps: [{
    name: 'anonchat',
    script: 'server/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development',
      PORT: process.env.PORT || 3000,
      MONGODB_URI: process.env.MONGODB_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      ADMIN_USERNAME: process.env.ADMIN_USERNAME,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      CLIENT_URL: 'http://localhost:3000'
    }
  }]
}