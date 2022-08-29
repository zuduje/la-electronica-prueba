import { Express, Request, Response } from 'express';
import addHours from 'date-fns/addHours';
import getUnixTime from 'date-fns/getUnixTime';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {verifyPassword} from "../helpers/bcrypt.helper";

function userCreated(Req:Request, Res:Response){
    let name:string, email:string, password:string, cod:number;
    ({name="",email="",password=""}= Req.body);
    User.find({})
        .limit(1)
        .sort('-cod')
        .then(function(lastUser:any) {
            cod = lastUser[0]?lastUser[0].cod+1:1;
            new User({
                "cod":cod,
                "name":name,
                "password":password,
                "email":email,
                "deleted_at":null
            })
            .save((error:any,userStore:any) =>{
                if (error) {
                    console.error(error);
                    Res.status(500).send({ message: "Error al guardar el usuario" });
                } else {
                    Res.status(200).send(userStore);
                }
            });
        }).catch((error) =>{
            console.error(error);
            Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
        });
}

function usersAuthorization(Req:Request, Res:Response){
    let secretPassword = process.env.SECRET_PASSWORD || "SECRET", email:string, password:string;
    ({email="", password=""} = Req.body);
    User.findOne({email:email})
        .then((userStored:any)=>{
                // @ts-ignore
                if(verifyPassword(password, userStored.password)){
                    userStored.tokenActived = true;
                    userStored.save((error:any,userStoredTokenActived:any) =>{
                        if (error) {
                            console.error(error);
                            Res.status(500).send({ message: "Error al guardar el usuario" });
                        } else {
                            let token = jwt.sign({
                                exp: getUnixTime(addHours(Date.now(),24)),
                                data: userStoredTokenActived
                            }, secretPassword);
                            Res.status(200).json({"token": "JWT "+token});
                        }
                    });
                }else{
                    Res.status(403).send({ message: 'Error la clave usada no es correcta' });
                }
        })
        .catch((error) =>{
            console.error(error);
            Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
        });
}

function userUpdate(Req:Request, Res:Response) {
    let id:string, name:string, email:string, password:string;
    ({id = ""} = Req.params);
    ({name="",email="",password=""}= Req.body);
    User.findOne({cod:id})
        .then((userStored:any) => {
            if(userStored){
                userStored.name = name;
                userStored.password = password;
                userStored.email = email;
                userStored.save((error:any, userSaved:any)=>{
                    if (error) {
                        console.error(error);
                        Res.status(500).send({ message: "Error al guardar el usuario" });
                    } else {
                        Res.status(200).send(userSaved);
                    }
                });
            }else{

            }
        }).catch((error) => {
            console.error(error);
            Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
        });
}

function userDelete(Req:Request, Res:Response){
    let id:string;
    ({id=""} = Req.params);
    User.deleteOne({cod:id})
        .then((userDeleted:any) => {
            userDeleted.message = "El usuario fue borrado de manera exitosa.";
            Res.status(200).send(userDeleted);
        }).catch((error) => {
            console.error(error);
            Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
        });
}

function userPatch(Req:Request, Res:Response) {
    let id:string;
    ({id=""} = Req.params);
    User.updateOne({cod:id},{active:true})
        .then((userActived:any) => {
            userActived.message = "El usuario fue activado de manera exitosa.";
            Res.status(200).json(userActived);
        })
        .catch((error) => {
            console.error(error);
            Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
        });
}

function user(Req:Request, Res:Response) {
    let id:string;
    ({id = ""} = Req.params);
    User.findOne({cod:id})
        .then((user:any) => {
            Res.status(200).send(user);
        }).catch((error) => {
        console.error(error);
        Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
    });
}

export {
    user,
    userPatch,
    userDelete,
    userUpdate,
    usersAuthorization,
    userCreated}