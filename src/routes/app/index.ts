import { Router } from "express";
import {
  AnswerControllers,
  ContentControllers,
  ModuleControllers,
  SubjectControllers,
  UserControllers,
  QuestionControllers,
} from "../../controllers/app";

import UserRoutes from "./user.routes";

const appRoutes = Router();

appRoutes.use("/user", UserRoutes);

appRoutes.get("/contents/:id_module", ContentControllers.SelectContent);
appRoutes.get("/select-content/:id", ContentControllers.SelectContentById);
appRoutes.get(
  "/question/content/:id_content/:id_user",
  QuestionControllers.SelectQuestionByContent
);

appRoutes.post("/subject", SubjectControllers.CreateSubject);
appRoutes.get("/subject", SubjectControllers.SelectSubject);

appRoutes.post("/module", ModuleControllers.CreateModule);
appRoutes.get("/modules", ModuleControllers.SelectModules);
appRoutes.get("/modules/new", ModuleControllers.SelectNewModules);
appRoutes.get(
  "/modules/subject/:id_subject",
  ModuleControllers.SelectModulesSubject
);

appRoutes.post("/answer", AnswerControllers.CreateAnswer);

appRoutes.get("/dash", UserControllers.ShowInfoDash);
export default appRoutes;
