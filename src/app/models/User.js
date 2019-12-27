import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    //---------------------------------------------------------
    // Sequelize - HOOKS
    //---------------------------------------------------------
    this.addHook('beforeSave', async user => {
      // Caso tenha sido informado um novo password
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Retorna true se o parâmetro bate com a senha criptografada
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
