import { Express, Request, Response } from 'express';
import { connect } from "mqtt";
import axios from "axios";

export function messagesSend (Req:Request, Res:Response) {
    let currentUserAuthenticated:string|string[];
    ({currentUserAuthenticated = ""} = Req.headers);
    if(!Array.isArray(currentUserAuthenticated) && currentUserAuthenticated){
        let userAuthenticated = JSON.parse(currentUserAuthenticated);
        let client = connect('mqtt:// mqtt.lyaelectronic.com:1883'), userToSend = {message:[],user:[]};
        const topic = 'lyatest/[código_prueba]';
        axios.get('https://catfact.ninja/docs').then((doc:any) =>{
            // @ts-ignore
            userToSend.message.push(doc);
            // @ts-ignore
            userToSend.user.push(userAuthenticated.cod);

        }).catch((error) =>{
            console.error(error);
            Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
        })
        client.on('connect', () => {
            console.log('Connected')
            client.subscribe([topic], () => {
                console.log(`Subscribe to topic '${topic}'`);
            })
            client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
                if (error) {
                    console.error(error)
                }
                Res.status(200).json({"message": "messages enviado de manera exitosa"});
            })
        })
        client.on('message', (topic:string, payload:any) => {
            console.log('Received Message:', topic, payload.toString());
        });
    }else{
        Res.status(500).send({ message: 'Error al devolver los marcadores del servidor' });
    }
}