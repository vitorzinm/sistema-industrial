const db = require("../config/database");
// const { randomUUID } = require("node:crypto");

class ConferenciaRepository {
  constructor(db) {
    this.db = db;
  }

 async listarSilos() {
    return await this.db("silos").where({ status: "ATIVO" }).orderBy("id")
 }

 async inserirConferencias(conferencia) {
    return await this.db("conferencias").insert({
        silo_solicitado_id: conferencia.silo_solicitado_id,
        silo_detectado_id: conferencia.silo_detectado_id,
        status: conferencia.status,
        mensagem: conferencia.mensagem,
        confianca: conferencia.confianca,
 })
}   
}

module.exports = new ConferenciaRepository(db);
