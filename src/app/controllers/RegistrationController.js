import * as Yup from 'yup';

import { addMonths, parseISO, isBefore, startOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Student from '../models/Student';
import Registration from '../models/Registration';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    // Schema validation (YUP) do 'req.body'
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

  async index(req, res) {
    const registrations = await Registration.findAll({
      order: ['student_id'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(registrations);
  }

  async update(req, res) {
    // Schema validation (YUP) do 'req.body'
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Checando se a matrícula informada nos parâmetros da requisição existe
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration does not exists.' });
    }

    // Checando, caso seja alteração de plano, se o novo plano informado existe
    if (req.body.plan_id) {
      const planExists = await Plan.findByPk(req.body.plan_id);
      if (!planExists) {
        return res.status(400).json({ error: 'Plan does not exists.' });
      }
    }

    // Checando, caso seja alteração de aluno, se o aluno informado existe
    if (req.body.student_id) {
      const studentExists = await Plan.findByPk(req.body.student_id);
      if (!studentExists) {
        return res.status(400).json({ error: 'Student does not exists.' });
      }
    }

    // Atualização dos dados da matrícula no banco de dados
    const {
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
    } = await registration.update(req.body);

    return res.json({ id, student_id, plan_id, start_date, end_date });
  }
}

export default new RegistrationController();
