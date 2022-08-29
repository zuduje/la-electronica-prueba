import express from 'express';
import userCreatedMiddleware from "../middlewares/users/userCreated.middleware";
import userGetDelPatMiddleware from "../middlewares/users/userGetDelPat.middleware";
import userUpdateMiddleware from "../middlewares/users/userUpdate.middleware";
import verifyAuthorization from "../middlewares/validateAuthorization.middleware";
import {userCreated, userUpdate, userDelete, userPatch, user} from '../controller/users.controller';
let router = express.Router();

/* GET users listing. */
router.post('/',userCreatedMiddleware, userCreated);
router.get('/:id',[userGetDelPatMiddleware, verifyAuthorization], user);
router.put('/:id',[userUpdateMiddleware, verifyAuthorization], userUpdate);
router.delete('/:id',[userGetDelPatMiddleware,verifyAuthorization], userDelete);
router.patch('/:id/active',[userGetDelPatMiddleware,verifyAuthorization], userPatch);

export default router;
