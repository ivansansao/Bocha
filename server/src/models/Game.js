import * as aux from './Auxiliary.js'

export class Game {

    static getOpponentOf({ jMessage, clients }) {

        for (const client of clients) {
            if (client.login != jMessage.login) {
                return client
            }
        }
    }
    static login({ ws, errors, clients, jMessage }) {

        const alreadyExist = clients.filter(cl => cl.login.toLowerCase().trim() === jMessage.login.toLowerCase().trim())

        if (clients.length > 1) {
            ws.send("Excedeu o limite de 2")
            ws.close()
        } else if (jMessage.login.trim().length < 3) {
            ws.send(JSON.stringify({ ...jMessage, error: errors[2] }))
            ws.close()
        } else if (alreadyExist.length > 0) {
            ws.send(JSON.stringify({ ...jMessage, error: errors[4] }))
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
                            login: op.login,
                            team: op.team
                        }
                        client.ws.send(JSON.stringify(myData))
                        break
                    }
                }
            }

        }
    }
    static threw({ ws, errors, clients, jMessage }) {

        for (const client of clients) {
            if (client.login != jMessage.login) {
                client.ws.send(JSON.stringify(jMessage))
            }
        }
    }
    static allposition({ ws, errors, clients, jMessage }) {
        for (const client of clients) {
            if (client.login != jMessage.login) {
                aux.dateLog('Enviando posição para: ' + client.login)
                client.ws.send(JSON.stringify(jMessage))
            }
        }
    }
    static visibilitychange({ ws, errors, clients, jMessage }) {
        const op = this.getOpponentOf({ jMessage, clients })

        if (op) {
            aux.dateLog('Enviando mudança de visibilidade para: ' + op.login)
            op.ws.send(JSON.stringify({ ...jMessage, error: errors[0] }))
        }


    }
    static chatmessage({ ws, errors, clients, jMessage }) {
        if (clients.length > 1) {
            for (const client of clients) {
                aux.dateLog('Enviando mensagem para: ' + client.login)
                client.ws.send(JSON.stringify({ ...jMessage, error: errors[0] }))
            }
        } else {
            aux.dateLog('Erro: ' + errors[3] + ' q: ' + clients.length)
            ws.send(JSON.stringify({ ...jMessage, error: errors[3] }))
        }
    }
}