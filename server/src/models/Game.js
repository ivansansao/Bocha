import * as aux from './Auxiliary.js'
import { errors } from './Errors.js'

export class Game {
    static clients = []

    static getOpponentOf(login) {

        for (const client of this.clients) {
            if (client.login != login) {
                return client
            }
        }

    }
    static getClient(login) {
        for (const client of this.clients) {
            if (client.login == login) {
                return client
            }
        }
        return {}
    }
    static validLogin({ ws, jMessage }) {

        let valid = false

        const alreadyExist = this.clients.filter(cl => aux.hardCompare(cl.login, jMessage.login))

        if (this.clients.length > 1) {
            ws.send(JSON.stringify({ ...jMessage, error: errors[5] }))
        } else if (jMessage.login.trim().length < 3) {
            ws.send(JSON.stringify({ ...jMessage, error: errors[2] }))
        } else if (alreadyExist.length > 0) {
            ws.send(JSON.stringify({ ...jMessage, error: errors[4] }))
        } else if (aux.hardCompare(jMessage.login, 'server')) {
            ws.send(JSON.stringify({ ...jMessage, error: errors[6] }))
        } else {
            valid = true
        }

        if (!valid) {
            ws.close()
        }

        return valid

    }
    static login({ ws, jMessage }) {

        if (this.validLogin({ ws, jMessage })) {

            let team = 'yellow'
            if (this.clients.length > 0) {
                team = this.clients[0].team == 'yellow' ? 'blue' : 'yellow'
            }

            this.clients.push({ login: jMessage.login, opponent: '', ws, team })


            ws.send(JSON.stringify({ ...jMessage, error: errors[0], team }))
            this.sendOpponentsList(jMessage.from)
            aux.dateLog('Logged as: ' + jMessage.login)

            // Send to oppenents my datas

            for (const client of this.clients) {
                for (const op of this.clients) {
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
    static start({ ws, jMessage }) {

        this.setOpponentOf({ jMessage })

        const client = this.getClient(jMessage.from)
        const opponent = this.getClient(jMessage.opponent)

        // Send to player
        this.send(client.ws,
            {
                from: 'server',
                to: client.login,
                command: 'start',
                login: client.login,
                opponent: client.opponent,
                error: errors[0]
            }
        )

        // Send to opponnent
        this.send(opponent.ws,
            {
                from: 'server',
                to: client.opponent,
                command: 'start',
                login: client.opponent,
                opponent: client.login,
                error: errors[0]
            }
        )

    }
    static setOpponentOf({ jMessage }) {

        const client = this.getClient(jMessage.from)
        client.opponent = jMessage.opponent

    }
    static getOpponentsList(from) {
        let list = []

        this.clients.forEach((client) => {
            if (client.login != from) {
                list.push({ login: client.login })
            }
        })

        return list

    }
    static sendOpponentsList() {

        this.clients.forEach((client) => {
            const list = this.getOpponentsList(client.login)
            this.send(client.ws,
                {
                    from: 'server',
                    to: client.login,
                    command: 'opponentsList',
                    opponentsList: list
                }
            )
        })

    }
    static threw({ jMessage }) {

        for (const client of this.clients) {
            if (client.login != jMessage.login) {
                client.ws.send(JSON.stringify(jMessage))
            }
        }
    }
    static allposition({ jMessage }) {
        for (const client of this.clients) {
            if (client.login != jMessage.login) {
                aux.dateLog('Enviando posição para: ' + client.login)
                client.ws.send(JSON.stringify(jMessage))
            }
        }
    }
    static visibilitychange({ jMessage }) {
        const op = this.getOpponentOf(jMessage.login)

        if (op) {
            aux.dateLog('Enviando mudança de visibilidade para: ' + op.login)
            op.ws.send(JSON.stringify({ ...jMessage, error: errors[0] }))
        }


    }
    static chatmessage({ ws, jMessage }) {
        if (this.clients.length > 1) {
            for (const client of this.clients) {
                aux.dateLog('Enviando mensagem para: ' + client.login)
                client.ws.send(JSON.stringify({ ...jMessage, error: errors[0] }))
            }
        } else {
            aux.dateLog('Erro: ' + errors[3] + ' q: ' + this.clients.length)
            ws.send(JSON.stringify({ ...jMessage, error: errors[3] }))
        }
    }
    static close({ ws, code, reason }) {

        aux.dateLog("Desconectou code: " + code + "  Reason: " + reason)
        aux.dateLog('BEFORE: ' + this.clients.length)

        this.clients.forEach((client) => {
            if (client.ws == ws) {
                aux.dateLog('>> DELETING: ' + client.login)
                this.clients = this.clients.filter((e) => e.login != client.login)

                // Comunicate of disconnecting.
                const op = this.getOpponentOf(client.login)
                if (op) {
                    op.ws.send(JSON.stringify({ command: 'disconnected', login: client.login }))
                }

            }
        })
        aux.dateLog('AFTER: ' + this.clients.length)
    }

    static newConnection({ ws }) {
        aux.dateLog('Connectou!')
        ws.send('Você conectou no server')
    }

    static send(ws, data) {
        ws.send(JSON.stringify(data))
    }

}