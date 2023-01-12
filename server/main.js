/*

CLIENT: {request:  "login", alias: "Ivan"} 
SERVER: {response: "ok", login: 1, team: "yellow"}
SERVER: {response: "error_team_complete", error: "Team already complete"}
SERVER: {response: "error_alias_exist", error: "Alias alread exist"}

CLIENT: {request:  "threw_little_ball", team: "yellow", mouseData: {x: 135, y: 332}, ballData: {ball}}
SERVER: {reponse: "adv_threw_ball",  }

*/


// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8080 });

import * as aux from './src/models/Auxiliary.js'
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 7950, clientTracking: true });

let clients = []

wss.on('connection', function connection(ws, req) {

    ws.on('message', function incoming(message) {

        const sMessage = String(message)
        let jMessage = {}
        aux.dateLog('received: ' + sMessage);

        try {
            jMessage = JSON.parse(sMessage)
        } catch (error) {
        }

        aux.dateLog(jMessage.command)

        switch (jMessage.command) {
            case 'login':

                if (clients.length > 1) {
                    ws.send("Excedeu o limite de 2")
                    ws.close()
                } else {

                    let team = 'yellow'
                    if (clients.length > 0) {
                        team = clients[0].team == 'yellow' ? 'blue' : 'yellow'
                    }

                    clients.push({ login: jMessage.login, ws, team })
                    ws.send(JSON.stringify({ team }))
                    aux.dateLog('Logged as: ' + jMessage.login)
                }
                break;

            case 'threw':


                for (const client of clients) {
                    if (client.login != jMessage.login) {
                        client.ws.send(JSON.stringify(jMessage))
                    }
                }
                break

            case 'allposition':


                for (const client of clients) {
                    if (client.login != jMessage.login) {
                        client.ws.send(JSON.stringify(jMessage))
                    }
                }

                break

        }

    });

    aux.dateLog('Connectou!')

    ws.send('Você conectou no server')

    sendToAll()

    ws.on('close', function close(code, reason) {

        aux.dateLog("Desconectou code: " + code + "  Reason: " + reason)

        aux.dateLog('BEFORE: ' + clients.length)

        clients.forEach((client) => {
            if (client.ws == ws) {
                aux.dateLog('>> DELETING: ' + client.login)
                clients = clients.filter((e) => e.login != client.login)
            }
        })

        aux.dateLog('AFTER: ' + clients.length)

    })
});


function sendToAll() {
    clients.forEach((client) => {
        client.ws.send("Todos receberam isso?   Clients: " + clients.length)
    })
}

