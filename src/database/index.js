//------------------------------------------------------------------
// Arquivo que realiza a conexão com o banco de dados e
// carrega todos os models da aplicação
//------------------------------------------------------------------
import Sequelize from 'sequelize';

// Importando models
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Registration from '../app/models/Registration';
import Checkins from '../app/models/Checkins';

// Importando configurações do banco
import databaseConfig from '../config/database';

const models = [User, Student, Plan, Registration, Checkins];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))

      // Carregando o método associate de cada model (caso ele exista)
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
