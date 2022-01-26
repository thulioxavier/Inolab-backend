import { Router } from "express";
import { UserControllers } from "../../controllers/app";

const UserRoutes = Router();

UserRoutes.post('/', UserControllers.CreateUser)
UserRoutes.get('/', UserControllers.SelectUsers);
export default UserRoutes;