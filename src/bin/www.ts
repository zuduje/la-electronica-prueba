#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import Logger from "../lib/logger";
import http from 'http';
import { Schema, model, connect } from 'mongoose';
import {CallbackError, CallbackWithoutResult} from "mongoose";
import * as socket from 'socket.io';
import os from 'os';

//creacion de agente de envio de mensajes de socket.io
let io = require("socket.io")(http);

//Create interfaces of the server than used
let ifaces = os.networkInterfaces();

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

//Configuration of mongoose and socketio
let connectionMongoDB = process.env.MONGODB_HOST ||"mongodb://localhost:27017/test"
connect(connectionMongoDB, {}, <(error: CallbackError) => void>function (err: CallbackError, res: any) {
    if (err) {
        throw err;
    } else {
        console.info("Conexion realizada con exito a MongoDB");
        // @ts-ignore
        server.listen(port, function (error: any, server: any) {
            Object.keys(ifaces).forEach(function (ifname:string) {
                var alias = 0;

                // @ts-ignore
                ifaces[ifname].forEach(function (iface) {
                    if ('IPv4' !== iface.family || iface.internal !== false) {
                        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                        return;
                    }

                    if (alias >= 1) {
                        // this single interface has multiple ipv4 addresses
                        console.info("API funcionando en http://" + ifname + ':' + alias, iface.address);
                    } else {
                        // this interface has only one ipv4 adress
                        console.error("API funcionando en http://", iface.address + ":" + port + " interfaz:" + ifname);
                    }
                    ++alias;
                });
            });
            /**
             * Socket io instance on the server
             */

            io.on('connection', function (socket:any) {
                console.log('A socket is now open socket: ' + socket);
            });
        });
    }
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val:any) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error:any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr?.port;
    Logger.debug(`Server is up and running @ http://localhost:${port}`);
}
