import express from 'express';
import usersAuthorizationMiddleware from "../middlewares/users/usersAuthorization.middleware";
import {usersAuthorization} from "../controller/users.controller";
import verifyAuthorization from "../middlewares/validateAuthorization.middleware";
import {logout} from "../controller/authorizations.controller";

let router = express.Router();

router.post('/',usersAuthorizationMiddleware, usersAuthorization);
router.delete('/',[verifyAuthorization], logout);

export default router;