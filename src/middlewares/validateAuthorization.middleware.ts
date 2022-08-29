import {decoded, normalizeToken} from '../helpers/token.helper';
import isJWT from "validator/lib/isJWT";
import { Express, Request, Response, NextFunction } from 'express';
import User from '../models/User';

export default function verifyAuthorization(Req:Request, Res:Response, Next:NextFunction){
    let authorization:string|string[]|undefined, decodedPayload:any;
    ({authorization } = Req.headers);
    if(authorization){
        if(isJWT(normalizeToken(authorization))){
            decodedPayload = decoded(authorization);
            if(decodedPayload){
                let tempUser = decodedPayload.data;
                User.findOne({cod: tempUser.cod})
                    .then((user:any) => {
                        if(user.active && user.tokenActived){
                            Req.headers.currentUserAuthenticated = JSON.stringify(tempUser);
                            Next();
                        }else{
                            if(!user.active){
                                Res.status(403).json({"message":"Usuario no se encuentra activo"});
                            }

                            if(!user.tokenActived){
                                Res.status(403).json({"message":"El token utilizado ya caduco"});
                            }
                        }
                    }).catch((error) => {
                        console.error(error);
                        Res.status(500).send({ message: "Error al consultar el usuario" });
                    });
            }else{
                Res.status(403).json({"message":"Usuario no autenticado"});
            }
        }else{
            Res.status(403).json({"message":"Usuario no autenticado"});
        }
    }else{
        Res.status(403).json({"message":"Usuario no autenticado"});
    }
}

