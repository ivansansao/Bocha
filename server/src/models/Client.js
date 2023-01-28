import * as aux from './Auxiliary.js'

class Client {
    constructor({ login, ws }) {
        this.login = login
        this.ws = ws
        this.opponent = ''
        this.team = ''
    }
    send(data) {
        this.ws.send(JSON.stringify(data))
        aux.dateLog('Sent to (' + this.login + '): ' + JSON.stringify(data))
    }
}

export { Client }
