import { Router } from "express";
import { UserControllers } from "../../controllers/app";

const UserRoutes = Router();

UserRoutes.post('/', UserControllers.CreateUser)
UserRoutes.get('/', UserControllers.SelectUsers);

UserRoutes.post('/login', UserControllers.Login);
UserRoutes.get('/answer-date/:date/:id_user', UserControllers.SelectDateAnswer);

export default UserRoutes;