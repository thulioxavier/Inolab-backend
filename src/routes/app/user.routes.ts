import { Router } from "express";
import { Adapter } from "../../adapter/routeAdapter";
import { UserControllers } from "../../controllers/app";
import { Authorized } from "../../middlewares/authorized";
import { RequestError } from "../../middlewares/requestError";

const UserRoutes = Router();

UserRoutes.post('/', UserControllers.CreateUser);
UserRoutes.get('/', UserControllers.SelectUsers);
UserRoutes.get('/profile/:id', UserControllers.findUserById);

UserRoutes.post('/login', Adapter.resolver(RequestError.login), Adapter.resolver(UserControllers.Login));
UserRoutes.get('/answer-date/:date/:id_user', Adapter.resolver(Authorized.access), Adapter.resolver(UserControllers.SelectDateAnswer));


export default UserRoutes;