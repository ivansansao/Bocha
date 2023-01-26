import * as aux from './Auxiliary.js'
import { Game } from './Game.js'

let clients = []
const errors = {}

errors[0] = { code: 0, reason: 'No erros' }
errors[1] = { code: 1, reason: 'Login já existe' }
errors[2] = { code: 2, reason: 'Vamos lá digite algo maior' }
errors[3] = { code: 3, reason: 'Jogador não conectado' }
errors[4] = { code: 4, reason: 'Login inválido!' }

export class HandleMessages {
    constructor() {
    }
    static getJsonMessage(message) {
        const sMessage = String(message)
        let jMessage = {}
        aux.dateLog('Received: ' + sMessage);

        try {
            jMessage = JSON.parse(sMessage)
        } catch (error) {
        }
        return jMessage
    }
    static incoming(ws, message) {

        const jMessage = this.getJsonMessage(message)

        switch (jMessage.command) {
            case 'login':
                Game.login({ ws, errors, clients, jMessage })
                break;
            case 'threw':
                Game.threw({ ws, errors, clients, jMessage })
                break
            case 'allposition':
                Game.allposition({ ws, errors, clients, jMessage })
                break
            case 'visibilitychange':
                Game.visibilitychange({ ws, errors, clients, jMessage })
                break
            case 'chatmessage':
                Game.chatmessage({ ws, errors, clients, jMessage })
                break
        }

    }

    static close(ws, code, reason) {

        aux.dateLog("Desconectou code: " + code + "  Reason: " + reason)
        aux.dateLog('BEFORE: ' + clients.length)

        clients.forEach((client) => {
            if (client.ws == ws) {
                aux.dateLog('>> DELETING: ' + client.login)
                clients = clients.filter((e) => e.login != client.login)

                // Comunicate of disconnecting.
                const op = getOpponentOf(client.login)
                if (op) {
                    op.ws.send(JSON.stringify({ command: 'disconnected', login: client.login }))
                }

            }
        })

        aux.dateLog('AFTER: ' + clients.length)

    }
    static newConnection(ws) {
        aux.dateLog('Connectou!')
        ws.send('Você conectou no server')
    }

}