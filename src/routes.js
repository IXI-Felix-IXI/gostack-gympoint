import { Router } from 'express';

import auth from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Middleware global de autenticação de sessão
routes.use(auth);

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.get('/students', StudentController.index);

routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.get('/plans', PlanController.index);
routes.delete('/plans/:id', PlanController.delete);

export default routes;
