import * as aux from './Auxiliary.js'
import colors from 'colors'

class Client {
    constructor({ login, ws }) {
        this.login = login
        this.ws = ws
        this.opponent = ''
        this.team = ''
    }
    send(data) {
        this.ws.send(JSON.stringify(data))
        aux.dateLog(colors.brightYellow('Sent to (' + colors.bold(this.login) + '): ' + JSON.stringify(data)))
    }
}

export { Client }
