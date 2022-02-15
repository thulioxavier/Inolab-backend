import { Router } from "express";
import { ModuleControllers, SubjectControllers } from "../../controllers/app";
import { ContentControllers, CouserControllers } from "../../controllers/web";


const webRoutes = Router();

webRoutes.post('/content', ContentControllers.CreateContent);
webRoutes.post('/couser', CouserControllers.CreateCouser);

webRoutes.post('/subject', SubjectControllers.CreateSubject);
webRoutes.get('/subject', SubjectControllers.SelectAreas);


webRoutes.post('/module', ModuleControllers.CreateModule);
webRoutes.get('/modules', ModuleControllers.SelectModules);
webRoutes.get('/modules/new', ModuleControllers.SelectNewModules);


export default webRoutes;