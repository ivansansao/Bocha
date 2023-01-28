import * as aux from './Auxiliary.js'
import { Game } from './Game.js'
import colors from 'colors'

export class HandleMessages {
    constructor() {
    }
    static getJsonMessage(message) {
        const sMessage = String(message)
        let jMessage = { login: '' }

        try {
            jMessage = JSON.parse(sMessage)
        } catch (error) {
        }
        aux.dateLog(colors.brightMagenta('Received from (' + colors.bold(jMessage.login) + '): ' + sMessage))
        return jMessage
    }
    static incoming(ws, message) {

        const jMessage = this.getJsonMessage(message)

        switch (jMessage.command) {
            case 'login':
                Game.login({ ws, jMessage })
                break;
            case 'start':
                Game.start({ jMessage })
                break;
            case 'threw':
                Game.threw({ jMessage })
                break
            case 'allposition':
                Game.allposition({ jMessage })
                break
            case 'visibilitychange':
                Game.visibilitychange({ jMessage })
                break
            case 'chatmessage':
                Game.chatmessage({ jMessage })
                break
        }

    }

    static close(ws, code, reason) {
        Game.close({ ws, code, reason })
    }
    static newConnection(ws) {
        Game.newConnection({ ws })
    }

}