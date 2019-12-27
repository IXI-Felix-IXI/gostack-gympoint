import { Router } from 'express';

import auth from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Middleware global de autenticação de sessão
routes.use(auth);

routes.post('/users', UserController.store);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;
