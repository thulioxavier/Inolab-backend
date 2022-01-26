import { Router } from "express";
import { ModuleControllers, SubjectControllers } from "../../controllers/app";

import UserRoutes from './user.routes';

const appRoutes = Router();

appRoutes.use('/user', UserRoutes);

appRoutes.post('/subject', SubjectControllers.CreateSubject);
appRoutes.get('/subject', SubjectControllers.SelectAreas);


appRoutes.post('/module', ModuleControllers.CreateModule);
appRoutes.get('/modules', ModuleControllers.SelectModules);
appRoutes.get('/modules/new', ModuleControllers.SelectNewModules);


export default appRoutes;