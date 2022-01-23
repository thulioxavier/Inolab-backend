import { Router } from "express";
import { SubjectControllers } from "../../controllers/app";

import UserRoutes from './user.routes';

const appRoutes = Router();

appRoutes.use('/user', UserRoutes);

appRoutes.post('/subject', SubjectControllers.CreateSubject);
appRoutes.get('/subject', SubjectControllers.SelectAreas);

export default appRoutes;