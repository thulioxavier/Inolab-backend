import { Router } from "express";

import UserRoutes from './user.routes';

const appRoutes = Router();

appRoutes.use('/user', UserRoutes);

export default appRoutes;