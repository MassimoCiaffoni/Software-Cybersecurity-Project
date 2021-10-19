module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
    },
    gui: {
      host: "localhost",
      port: 3000,
      network_id: "*" // Match any network id
    }
  },

  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
