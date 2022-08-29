import { Express, Request, Response } from 'express';
import User from '../models/User';

export function logout(Req:Request, Res:Response){
    let currentUserAuthenticated:string|string[];
    ({currentUserAuthenticated = ""} = Req.headers);
    if(!Array.isArray(currentUserAuthenticated) && currentUserAuthenticated){
        let userAuthenticated = JSON.parse(currentUserAuthenticated);
        User.findOne({cod: userAuthenticated.cod})
            .then((user:any) => {
                user.tokenActived = false;
                user.save((error:any,userStore:any) =>{
                    if (error) {
                        console.error(error);
                        Res.status(500).send({ message: "Error al guardar el usuario" });
                    } else {
                        Res.status(200).send(userStore);
                    }
                });
            }).catch((error) => {
                console.error(error);
                Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
            });
    }else{
        Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
    }
}