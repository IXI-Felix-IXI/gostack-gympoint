import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    // Schema validation (YUP) do 'req.body'
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    // Verificando se o 'req.body' esta sendo passado conforme o schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Verificando se já existe um usuário com o email informado cadastrado
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    // Criação do novo estudante no banco de dados
    const student = await Student.create(req.body);

    return res.json({
      student,
    });
  }

  async update(req, res) {
    // Schema validation (YUP) do 'req.body'
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().integer(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    // Verificando se o 'req.body' esta sendo passado conforme o schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Checando se o usuário informado nos parâmetros da requisição existe
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    // Caso seja alteração de email, verificar se já não existe usuário com o email informado
    if (req.body.email && req.body.email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email: req.body.email },
      });

      if (studentExists) {
        return res.status(400).json({ error: 'Student email already exists.' });
      }
    }

    // Atualização dos dados do estudante no banco de dados
    const { name, email, age, weight, height } = await student.update(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async index(req, res) {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
      order: ['name'],
    });

    return res.json(students);
  }
}

export default new StudentController();
