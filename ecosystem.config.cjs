module.exports = {
  apps: [
    {
      name: "chefenvideos",
      script: "dist/server/node-build.mjs",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
