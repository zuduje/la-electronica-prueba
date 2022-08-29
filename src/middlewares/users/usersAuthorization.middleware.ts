import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';
import { Express, Request, Response, NextFunction } from 'express';

export default function(Req:Request, Res:Response, Next:NextFunction){
    let email:string, password:string;
    ({email = "", password = ""} = Req.body);
    if(email && password){
       if(isEmail(email) && isStrongPassword(password)){
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
    }
}

