class Chat {
    constructor() {

    }
    sendGeneralMessage(message) {

        const fullMessage = player.login + ': ' + message.innerText

        const data = {
            command: 'general-message',
            message: fullMessage
        }

        client.send(JSON.stringify(data))

    }
}