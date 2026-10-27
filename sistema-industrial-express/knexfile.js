
require('dotenv').config()

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'silocheck'
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
    extension: 'js'
  },
  seeds: {
    directory: './seeds',
    extension: 'js'
  }
}

module.exports = {
  development: config
}
