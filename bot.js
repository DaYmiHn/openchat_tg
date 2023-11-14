module.exports = {
  apps: [
    {
      name: 'openchat_tg',
      script: './dist/main.js',
      env_production: {
        TOKEN: process.env.TOKEN,
        URL: process.env.URL,
      },
    },
  ],
};
