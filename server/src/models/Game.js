import * as aux from './Auxiliary.js'
import { Client } from './Client.js'
import { errors } from './Errors.js'

export class Game {

    static clients = []

    static getClientOpponentOf(login) {
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

            const client = new Client({ login: jMessage.login, ws })
            this.clients.push(client)
            client.send({ ...jMessage, error: errors[0], team: '' })
            this.sendOpponentsList()
            this.showPlayers('Logged as: ' + jMessage.login)

        }
    }
    static start({ jMessage }) {

        const client = this.getClientByLogin(jMessage.from)
        const opponent = this.getClientByLogin(jMessage.opponent)

        if (client.opponent != '' || opponent.opponent != '') {
            client.send(
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
        client.send(
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
        opponent.send(
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
            client.send(
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

        const op = this.getClientOpponentOf(jMessage.login)
        op.send(jMessage)

    }
    static allposition({ jMessage }) {

        const op = this.getClientOpponentOf(jMessage.login)
        op.send(jMessage)

    }
    static visibilitychange({ jMessage }) {
        const op = this.getClientOpponentOf(jMessage.login)

        if (op) {
            op.send({ ...jMessage, error: errors[0] })
        }


    }
    static chatmessage({ jMessage }) {

        const client = this.getClientByLogin(jMessage.login)
        const op = this.getClientOpponentOf(jMessage.login)

        client.send({ ...jMessage, error: errors[0] })
        op.send({ ...jMessage, error: errors[0] })

    }
    static close({ ws, code, reason }) {

        const client = this.getClientByWs(ws)
        const op = this.getClientOpponentOf(client.login)

        client.opponent = ''
        this.unsetOpponent(client.opponent)

        this.clients = this.clients.filter((e) => e.login != client.login)

        if (op) {
            op.send({ from: 'server', to: op.login, command: 'disconnected', login: client.login })
        }

        this.sendOpponentsList()

        this.showPlayers(client.login + ' closed!')
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
    static showPlayers(msg) {

        const data = []

        this.clients.forEach(e => data.push({ Player: e.login, Opponent: e.opponent }))
        if (msg) console.log(msg)
        console.table(data)

    }

}