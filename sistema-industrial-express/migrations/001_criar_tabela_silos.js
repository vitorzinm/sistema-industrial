
exports.up = async function (knex) {
  await knex.schema.createTable('silos', (table) => {
    table.increments('id').primary()

    table.string('nome', 50).notNullable().unique()
    table.string('codigo_qr', 100).notNullable().unique()

    table
      .enum('status', ['ATIVO', 'INATIVO'])
      .notNullable()
      .defaultTo('ATIVO')

    table
      .timestamp('criado_em')
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('silos')
}
