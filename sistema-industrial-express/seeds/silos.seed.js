exports.seed = async function (knex) {
  const silos = Array.from({ length: 10 }, (_, index) => {
    const numero = String(index + 1).padStart(3, "0");

    return {
      nome: `SILO-${numero}`,
      codigo_qr: `SILO-${numero}`,
      status: "ATIVO",
    };
  });

  for (const silo of silos) {
    await knex("silos")
      .insert(silo)
      .onConflict("nome")
      .merge(["codigo_qr", "status"]);
  }
};
