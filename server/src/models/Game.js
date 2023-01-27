import * as aux from './Auxiliary.js'
import { errors } from './Errors.js'

export class Game {
    static clients = []

    static getWsOpponentOf(login) {
        let opponentLogin = ''

        for (const client of this.clients) {
            if (client.login == login) {
                opponentLogin = client.opponent
                break
            }
        }

        for (const client of this.clients) {
            if (client.login == opponentLogin) {
                return client
            }
        }

    }
    static getClientByLogin(login) {
        for (const client of this.clients) {
            if (client.login == login) {
                return client
            }
        }
        return {}
    }
    static getClientByWs(ws) {
        for (const client of this.clients) {
            if (client.ws == ws) {
                return client
            }
        }
        return {}
    }

    static validLogin({ ws, jMessage }) {

        let valid = false

        const alreadyExist = this.clients.filter(cl => aux.hardCompare(cl.login, jMessage.login))

        if (this.clients.length > 9999) {
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


            this.clients.push({ login: jMessage.login, opponent: '', ws, team: '' })

            ws.send(JSON.stringify({ ...jMessage, error: errors[0], team: '' }))
            aux.dateLog('Logged as: ' + jMessage.login)
            this.sendOpponentsList()
            this.showPlayers()

            // // Send to oppenents my datas
            // for (const client of this.clients) {
            //     for (const op of this.clients) {
            //         if (client.login != op.login) {
            //             const myData = {
            //                 command: 'opponentData',
            //                 login: op.login,
            //                 team: op.team
            //             }
            //             client.ws.send(JSON.stringify(myData))
            //             break
            //         }
            //     }
            // }


        }
    }
    static start({ ws, jMessage }) {

        // this.setOpponentOf({ jMessage })

        const client = this.getClientByLogin(jMessage.from)
        const opponent = this.getClientByLogin(jMessage.opponent)

        if (client.opponent != '' || opponent.opponent != '') {
            this.send(client.ws,
                {
                    from: 'server',
                    to: client.login,
                    command: 'start',
                    login: client.login,
                    opponent: client.opponent,
                    error: errors[7]
                }
            )
            return
        }

        client.opponent = opponent.login
        opponent.opponent = client.login

        // Send to player
        this.send(client.ws,
            {
                from: 'server',
                to: client.login,
                command: 'start',
                login: client.login,
                opponent: client.opponent,
                team: 'yellow',
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
                team: 'blue',
                error: errors[0]
            }
        )
        this.sendOpponentsList()

        this.showPlayers()

    }
    // static setOpponentOf({ jMessage }) {

    //     const client = this.getClientByLogin(jMessage.from)
    //     client.opponent = jMessage.opponent

    // }
    static getOpponentsList(from) {
        let list = []

        this.clients.forEach((client) => {
            if (client.login != from) {
                if (client.opponent == '') {
                    list.push({ login: client.login })
                }
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

        const op = this.getWsOpponentOf(jMessage.login)
        op.ws.send(JSON.stringify(jMessage))

        // for (const client of this.clients) {
        //     if (client.login != jMessage.login) {
        //         client.ws.send(JSON.stringify(jMessage))
        //     }
        // }
    }
    static allposition({ jMessage }) {

        const op = this.getWsOpponentOf(jMessage.login)
        op.ws.send(JSON.stringify(jMessage))

        // for (const client of this.clients) {
        //     if (client.login != jMessage.login) {
        //         aux.dateLog('Enviando posição para: ' + client.login)
        //         client.ws.send(JSON.stringify(jMessage))
        //     }
        // }

    }
    static visibilitychange({ jMessage }) {
        const op = this.getWsOpponentOf(jMessage.login)

        if (op) {
            aux.dateLog('Enviando mudança de visibilidade para: ' + op.login)
            op.ws.send(JSON.stringify({ ...jMessage, error: errors[0] }))
        }


    }
    static chatmessage({ jMessage }) {

        const client = this.getClientByLogin(jMessage.login)
        const op = this.getWsOpponentOf(jMessage.login)

        aux.dateLog('Enviando mensagem para: ' + client.login)
        client.ws.send(JSON.stringify({ ...jMessage, error: errors[0] }))

        aux.dateLog('Enviando mensagem para: ' + op.login)
        op.ws.send(JSON.stringify({ ...jMessage, error: errors[0] }))

        // if (this.clients.length > 1) {
        //     for (const client of this.clients) {
        //         aux.dateLog('Enviando mensagem para: ' + client.login)
        //         client.ws.send(JSON.stringify({ ...jMessage, error: errors[0] }))
        //     }
        // } else {
        //     aux.dateLog('Erro: ' + errors[3] + ' q: ' + this.clients.length)
        //     ws.send(JSON.stringify({ ...jMessage, error: errors[3] }))
        // }
    }
    static close({ ws, code, reason }) {

        aux.dateLog("Desconectou code: " + code + "  Reason: " + reason)
        aux.dateLog('BEFORE: ' + this.clients.length)


        const client = this.getClientByWs(ws)
        const op = this.getWsOpponentOf(client.login)

        this.showPlayers('unsetOpponent of player: ' + client.login + " A ")
        client.opponent = ''
        this.unsetOpponent(client.opponent)
        this.showPlayers('unsetOpponent of player: ' + client.login + " B ")





        aux.dateLog('>> DELETING: ' + client.login)
        this.clients = this.clients.filter((e) => e.login != client.login)

        // Comunicate of disconnecting.

        if (op) {
            op.ws.send(JSON.stringify({ from: 'server', to: op.login, command: 'disconnected', login: client.login }))
        }

        aux.dateLog('AFTER: ' + this.clients.length)

        this.sendOpponentsList()

        this.showPlayers()
    }

    static unsetOpponent(opponent) {

        for (const client of this.clients) {
            if (client.opponent == opponent) {
                client.opponent = ''
                return client
            }
        }

    }

    static newConnection({ ws }) {
        aux.dateLog('Connectou!')
        ws.send('Você conectou no server')
    }

    static send(ws, data) {
        ws.send(JSON.stringify(data))
    }

    static showPlayers(msg) {

        const data = []

        this.clients.forEach(e => data.push({ Player: e.login, Opponent: e.opponent }))
        if (msg) console.log(msg)
        console.table(data)

    }

}