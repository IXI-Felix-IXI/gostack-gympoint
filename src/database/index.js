//------------------------------------------------------------------
// Arquivo que realiza a conexão com o banco de dados e
// carrega todos os models da aplicação
//------------------------------------------------------------------
import Sequelize from 'sequelize';

// Importando models
import User from '../app/models/User';
import Student from '../app/models/Student';

// Importando configurações do banco
import databaseConfig from '../config/database';

const models = [User, Student];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
