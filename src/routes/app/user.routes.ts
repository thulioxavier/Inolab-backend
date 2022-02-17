import { Router } from "express";
import { UserControllers } from "../../controllers/app";

const UserRoutes = Router();

UserRoutes.post('/', UserControllers.CreateUser)
UserRoutes.get('/', UserControllers.SelectUsers);

UserRoutes.post('/login', UserControllers.Login);

export default UserRoutes;