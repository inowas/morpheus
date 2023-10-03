module.exports = {
  server: {
    command: 'npm start -- --port 5000 --open false',
    launchTimeout: 50000,
    port: 5000,
  },
  launch: {
    headless: true,
    slowMo: false,
    devtools: true
  },
}
