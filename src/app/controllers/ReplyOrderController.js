import * as Yup from 'yup';
import { format, pt } from 'date-fns';
import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class ReplyOrderController {
  async store(req, res) {
    // Schema validation (YUP) do 'req.body'
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    // Verificando se o 'req.body' esta sendo passado conforme o schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Validando se o ID informado do pedido de auxílio existe
    const helpOrder = await HelpOrders.findByPk(req.params.id);

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order does not exists.' });
    }

    // Atualização dos dados do pedido de auxílio
    const helpOrderAnswered = await helpOrder.update(req.body);

    const student = await Student.findByPk(helpOrderAnswered.student_id);

    // Enviando email notificando o aluno da resposta (utilizando)
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `GymPoint - Pedido de auxílio N° ${helpOrderAnswered.id}`,
      template: 'replyOrder',
      context: {
        student: student.name,
        question: helpOrderAnswered.question,
        answer: helpOrderAnswered.answer,
        date: format(
          helpOrderAnswered.answer_at,
          "dd '/' MMM '/' yyyy 'às' H:mm'h' ",
          { locale: pt }
        ),
      },
    });

    return res.json(helpOrderAnswered);
  }

  async index(req, res) {
    const unansweredOrders = await HelpOrders.findAll({
      where: { student_id: 1 },
    });

    return res.json(unansweredOrders);
  }
}

export default new ReplyOrderController();
