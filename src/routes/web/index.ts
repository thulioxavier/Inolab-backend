import { Router } from "express";
import { ModuleControllers } from "../../controllers/app";
import { ContentControllers, CouserControllers, QuestionControllers, SubjectControllers } from "../../controllers/web";


const webRoutes = Router();

webRoutes.post('/content', ContentControllers.CreateContent);
webRoutes.get('/contents', ContentControllers.SelectContents);
webRoutes.post('/couser', CouserControllers.CreateCouser);

webRoutes.post('/subject', SubjectControllers.CreateSubject);
webRoutes.get('/subjects', SubjectControllers.SelectSubject);


webRoutes.post('/module', ModuleControllers.CreateModule);
webRoutes.get('/modules', ModuleControllers.SelectModules);
webRoutes.get('/modules/new', ModuleControllers.SelectNewModules);


webRoutes.post('/question', QuestionControllers.CreateQuestion);
webRoutes.get('/question/:id_question', QuestionControllers.SelectQuestionById);
webRoutes.get('/question/content/:id_content', QuestionControllers.SelectQuestionByContent);

export default webRoutes;