import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

class HelpOrdersController {
  async store(req, res) {
    // Schema validation (YUP) do 'req.body'
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    // Verificando se o 'req.body' esta sendo passado conforme o schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Verificando se o id de aluno informado existe
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    // Criação de um novo pedido de auxílio
    const helpOrder = await HelpOrders.create({
      student_id: req.params.id,
      ...req.body,
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    // Verificando se o id de aluno informado existe
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    const helpOrders = await HelpOrders.findAll({
      where: { student_id: req.params.id },
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrdersController();
