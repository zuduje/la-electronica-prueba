import isNumeric from "validator/lib/isNumeric";
import { Express, Request, Response, NextFunction } from 'express';

export default function (Req:Request, Res:Response, Next:NextFunction){
    let id:string;
    ({id= ""} = Req.params);

    if(id){
        if(isNumeric(id)){
            Next();
        }else{
            Res.status(403).json({"message": "Debe enviar un numero valido!, favor comunicarse con el administrador"});
        }
    }else{
        Res.status(403).json({"message": "Debe enviar un numero valido!, favor comunicarse con el administrador"});
    }
}