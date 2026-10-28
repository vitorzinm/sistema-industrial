exports.up = async function (knex) {
  await knex.schema.createTable("conferencias", (table) => {
    table.increments("id").primary();

    table
      .integer("silo_solicitado_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("silos")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table
      .integer("silo_detectado_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("silos")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");

    table.enum("status", ["APROVADO", "DIVERGENTE", "ERRO"]).notNullable();

    table.string("mensagem", 255).nullable();
    table.decimal("confianca", 5, 4).nullable();

    table.timestamp("data_hora").notNullable().defaultTo(knex.fn.now());

    table.index("data_hora");
    table.index("status");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("conferencias");
};
