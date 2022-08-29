import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import matches from "validator/lib/matches";
import { Express, Request, Response, NextFunction } from 'express';

export default function(Req:Request, Res:Response, Next:NextFunction){
    let email:string, password:string, name:string;
    ({email = "", password = "", name = ""} = Req.body);
    if(email && password && name){
        if(isEmail(email) && isStrongPassword(password) && matches(name, '^[a-zA-Z ]+$')){
            Next();
        }else{
            if(!isEmail(email)){
                Res.status(403).json({"message": "Debe enviar un correo valido!, favor comunicarse con el administrador"});
            }

            if(!isStrongPassword(password)){
                Res.status(403).json({
                    "message": "Debe enviar un password de nivel fuerte valido!, " +
                        "                          favor comunicarse con el administrador, tener en cuenta las siguientes " +
                        "recomiendaciones: minLength: 8, minLowercase: 1, minUppercase: 1, " +
                        "minNumbers: 1, minSymbols: 1, pointsPerUnique: 1 "});
            }

            if(!matches(name, '^[a-zA-Z ]+$')){
                Res.status(403).json({"message": "Debe enviar un nombre y apellido valido, solo se acepta letras!, favor comunicarse con el administrador"});
            }
        }
    }else{
        if(!email){
            Res.status(403).json({"message": "Debe enviar un correo valido!, favor comunicarse con el administrador"});
        }

        if(!password){
            Res.status(403).json({
                "message": "Debe enviar un password de nivel fuerte valido!, " +
                    "                          favor comunicarse con el administrador, tener en cuenta las siguientes " +
                    "recomiendaciones: minLength: 8, minLowercase: 1, minUppercase: 1, " +
                    "minNumbers: 1, minSymbols: 1, pointsPerUnique: 1 "});
        }

        if(!name){
            Res.status(403).json({"message": "Debe enviar un nombre y apellido valido, solo se acepta letras!, favor comunicarse con el administrador"});
        }
    }
}