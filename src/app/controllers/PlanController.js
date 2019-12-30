import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    //------------------------------------------
    // Schema validation (YUP) do 'req.body'
    //------------------------------------------
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number()
        .integer()
        .required(),
    });

    // Verificando se o 'req.body' esta sendo passado conforme o schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Verificando se já existe um plano com o título informado na requisição
    const planExists = await Plan.findOne({ where: { title: req.body.title } });
    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    // Criação de um novo plano
    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    //------------------------------------------
    // Schema validation (YUP) do 'req.body'
    //------------------------------------------
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number().integer(),
    });

    // Verificando se o 'req.body' esta sendo passado conforme o schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Checando se o plano informado nos parâmetros da requisição existe
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists.' });
    }

    // Caso seja alteração do título, verificar se já não existe plano com o título informado
    if (req.body.title && req.body.title !== plan.title) {
      const planExists = await Plan.findOne({
        where: { title: req.body.title },
      });

      if (planExists) {
        return res.status(400).json({ error: 'Plan title already exists.' });
      }
    }

    // Atualização dos dados do plano no banco de dados
    const { title, duration, price } = await plan.update(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['id'],
    });

    return res.json(plans);
  }

  async delete(req, res) {
    return res.json();
  }
}

export default new PlanController();
