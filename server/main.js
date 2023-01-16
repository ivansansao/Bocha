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
const port = 7950
const wss = new WebSocketServer({ port, clientTracking: true });

aux.dateLog('Bocha server is listenning...            (Port: ' + port + ')')

let clients = []

const errors = {}

errors[0] = { code: 0, reason: 'No erros' }
errors[1] = { code: 1, reason: 'Login já existe' }
errors[2] = { code: 2, reason: 'Vamos lá digite algo maior' }


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
                } else if (jMessage.login.trim().length < 3) {
                    ws.send(JSON.stringify({ ...jMessage, error: errors[2] }))
                    ws.close()
                } else {

                    let team = 'yellow'
                    if (clients.length > 0) {
                        team = clients[0].team == 'yellow' ? 'blue' : 'yellow'
                    }

                    clients.push({ login: jMessage.login, ws, team })
                    ws.send(JSON.stringify({ ...jMessage, error: errors[0], team }))
                    aux.dateLog('Logged as: ' + jMessage.login)

                    // Send to oppenents my datas

                    for (const client of clients) {
                        for (const op of clients) {
                            if (client.login != op.login) {
                                const myData = {
                                    command: 'opponentData',
                                    opponentLogin: op.login
                                }
                                client.ws.send(JSON.stringify(myData))
                                break
                            }
                        }
                    }

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
                        aux.dateLog('Enviando posição para' + client.login)
                        client.ws.send(JSON.stringify(jMessage))
                    }
                }

                break

            case 'general-message':
                for (const client of clients) {
                    aux.dateLog('Enviando mensagem para' + client.login)
                    client.ws.send(JSON.stringify(jMessage))
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

