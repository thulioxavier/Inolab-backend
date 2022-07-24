import { Router } from "express";
import { ModuleControllers } from "../../controllers/app";
import { AdminControllers, ContentControllers, CouserControllers, LevelControllers, QuestionControllers, SubjectControllers, UserControllers, ModuleControllers as ModulesControllersWeb } from "../../controllers/web";
// import { Auth } from "../../middlewares/auth";


const webRoutes = Router();

webRoutes.post('/content',  ContentControllers.CreateContent);
webRoutes.get('/contents',  ContentControllers.SelectContents);
webRoutes.post('/couser',  CouserControllers.CreateCouser);

webRoutes.post('/subject',  SubjectControllers.CreateSubject);
webRoutes.get('/subjects',  SubjectControllers.SelectSubject);
webRoutes.put('/subject/update/status/:subject_id',  SubjectControllers.UpdateStatusSubject);


webRoutes.post('/module',  ModuleControllers.CreateModule);
webRoutes.get('/modules',  ModuleControllers.SelectModules);
webRoutes.get('/modules/new',  ModuleControllers.SelectNewModules);


webRoutes.post('/question',  QuestionControllers.CreateQuestion);
webRoutes.get('/question/:id_question',  QuestionControllers.SelectQuestionById);
webRoutes.get('/question/content/:id_content',  QuestionControllers.SelectQuestionByContent);


webRoutes.post('/level/store',  LevelControllers.store);


webRoutes.post('/admin',  AdminControllers.createAdmin);
webRoutes.post('/admin/signin', AdminControllers.signin);


// Routes Dashboard Web
webRoutes.get('/users/count',  UserControllers.userCount);
webRoutes.get('/users/points', UserControllers.sumPointsByUser);

webRoutes.get('/subjects/count',  SubjectControllers.subjectsCount);
webRoutes.get('/modules/count',  ModulesControllersWeb.modulesCount);
webRoutes.get('/questions/count',  QuestionControllers.questionsCount);


export default webRoutes;