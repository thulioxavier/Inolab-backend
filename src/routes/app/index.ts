import { Router } from "express";
import { AnswerControllers, ContentControllers, ModuleControllers, SubjectControllers, UserControllers } from "../../controllers/app";

import UserRoutes from './user.routes';

const appRoutes = Router();

appRoutes.use('/user', UserRoutes);

appRoutes.get('/contents/:id_module', ContentControllers.SelectContent);

appRoutes.post('/subject', SubjectControllers.CreateSubject);
appRoutes.get('/subject', SubjectControllers.SelectAreas);


appRoutes.post('/module', ModuleControllers.CreateModule);
appRoutes.get('/modules', ModuleControllers.SelectModules);
appRoutes.get('/modules/new', ModuleControllers.SelectNewModules);
appRoutes.get('/modules/subject/:id_subject', ModuleControllers.SelectModulesSubject);

appRoutes.post('/answer', AnswerControllers.CreateAnswer);

appRoutes.get('/dash', UserControllers.ShowInfoDash);
export default appRoutes;