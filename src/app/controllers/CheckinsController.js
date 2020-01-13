import { Op } from 'sequelize';
import { startOfWeek, endOfWeek, isToday } from 'date-fns';
import Checkin from '../models/Checkins';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    //-----------------------------------------------------------
    // Verificando se o id de aluno informado existe
    //-----------------------------------------------------------
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    //-----------------------------------------------------------
    // Validações do checkin
    //-----------------------------------------------------------
    const actualDate = new Date();

    // Buscando os checkins realizados pelo aluno na semana atual
    const weeklyCheckins = await Checkin.findAll({
      where: {
        student_id: student.id,
        created_at: {
          [Op.between]: [startOfWeek(actualDate), endOfWeek(actualDate)],
        },
      },
    });

    // Verificando, dentro dos checkins da semana, se já existe checkin na data atual
    const checkinToday = weeklyCheckins.find(
      checkin => isToday(checkin.createdAt) === true
    );

    if (checkinToday) {
      return res
        .status(400)
        .json({ error: 'Cannot checkin more than two times per day.' });
    }

    // Verificando se já existem 5 checkins durante a semana
    if (weeklyCheckins.length === 5) {
      return res
        .status(400)
        .json({ error: 'Cannot checkin more than five times per week.' });
    }

    // Inserindo o registro no banco de dados
    const checkin = await Checkin.create({ student_id: req.params.id });

    return res.json(checkin);
  }

  async index(req, res) {
    //-----------------------------------------------------------
    // Verificando se o id de aluno informado existe
    //-----------------------------------------------------------
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: student.id },
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
