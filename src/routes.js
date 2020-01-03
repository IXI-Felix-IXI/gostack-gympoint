import { Router } from 'express';

import auth from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Middleware global de autenticação de sessão
routes.use(auth);

//-----------------------------------------------------------
// Users
//-----------------------------------------------------------
routes.post('/users', UserController.store);
routes.get('/users', UserController.index);

//-----------------------------------------------------------
// Students
//-----------------------------------------------------------
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.get('/students', StudentController.index);

//-----------------------------------------------------------
// Plans
//-----------------------------------------------------------
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.get('/plans', PlanController.index);
routes.delete('/plans/:id', PlanController.delete);

//-----------------------------------------------------------
// Registrations
//-----------------------------------------------------------
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:id', RegistrationController.update);
routes.get('/registrations', RegistrationController.index);
routes.delete('/registrations/:id', RegistrationController.delete);

export default routes;
