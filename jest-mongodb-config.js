module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '4.4.17',
      skipMD5: true
    },
    autoStart: false
  }
}
