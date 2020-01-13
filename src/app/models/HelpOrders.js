import Sequelize, { Model } from 'sequelize';

class HelpOrders extends Model {
  static init(sequelize) {
    super.init(
      {
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    //----------------------------------------------------------
    // Sequelize - HOOKS
    // -> Antes de salvar a criação ou edição de um pedido de auxílio
    //----------------------------------------------------------
    this.addHook('beforeSave', async helpOrder => {
      // Caso tenha sido informado uma resposta
      if (helpOrder.answer) {
        helpOrder.answer_at = new Date();
      }
    });

    return this;
  }

  //----------------------------------------------------------
  // Relacionamentos ( Tabelas: | Students | )
  //----------------------------------------------------------
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default HelpOrders;
