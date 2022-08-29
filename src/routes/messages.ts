import express from 'express';
import {messagesSend} from "../controller/messages.controller";
import verifyAuthorization from "../middlewares/validateAuthorization.middleware";

let router = express.Router();

router.post('/send', verifyAuthorization, messagesSend);

export default router;