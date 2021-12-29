import { Router } from "express";
import { UserControllers } from "../../controllers/app";

const UserRoutes = Router();

UserRoutes.post('/', UserControllers.CreateUser)

export default UserRoutes;