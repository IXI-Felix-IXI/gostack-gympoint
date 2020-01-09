import { Model } from 'sequelize';

class Checkins extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    return this;
  }

  //----------------------------------------------------------
  // Relacionamento ( Tabela: | Students | )
  //----------------------------------------------------------
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default Checkins;
