import * as Yup from 'yup';

import { addMonths, parseISO, isBefore, startOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Student from '../models/Student';
import Registration from '../models/Registration';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    //-----------------------------------------------------------
    // Verificando se o id de aluno informado existe
    //-----------------------------------------------------------
    const student = await Student.findOne({
      where: { id: req.body.student_id },
    });

    if (!student) {
      return res.status(401).json({ error: 'Student dos not exists' });
    }

    //-----------------------------------------------------------
    // Verificando se o id do plano informadno existe
    //-----------------------------------------------------------
    const plan = await Plan.findOne({
      where: { id: req.body.plan_id },
    });

    if (!plan) {
      return res.status(401).json({ error: 'Plan dos not exists' });
    }

    //-----------------------------------------------------------
    // Verificando se a data informada é inferior a data atual
    //-----------------------------------------------------------
    const startDate = startOfDay(parseISO(req.body.start_date));
    const actualDate = startOfDay(new Date());

    if (isBefore(startDate, actualDate)) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // Calculando a data final da vigência da matrícula
    const endDate = addMonths(startDate, plan.duration);

    // -----------------------------------------------------------
    // Verificando se já existe alguma matrícula em vigência para o aluno
    // -----------------------------------------------------------
    const planExists = await Registration.findOne({
      where: {
        student_id: req.body.student_id,
        [Op.and]: [
          { start_date: { [Op.lte]: actualDate } },
          { end_date: { [Op.gte]: actualDate } },
        ],
      },
    });

    if (planExists) {
      return res
        .status(400)
        .json({ error: 'There is already an registration for the student.' });
    }

    // Calculando o preço final da matrícula
    const price = plan.duration * plan.price;

    // Inserindo o registro no banco de dados
    const registration = await Registration.create({
      student_id: req.body.student_id,
      plan_id: req.body.plan_id,
      start_date: startDate,
      end_date: endDate,
      price,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
