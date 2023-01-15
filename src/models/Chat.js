class Chat {
    constructor() {

    }
    sendGeneralMessage(message) {

        const fullMessage = player.login + ': ' + message.innerText

        this.clientSend({
            command: 'general-message',
            message: fullMessage
        })

    }

    onMessageReceived(message) {
        this.addHtmlChatItem({ user: '', message: message.message })

    }
    send() {

        const inputMessage = document.getElementById('inputMessage').value
        const fullMessage = player.login + ': ' + inputMessage

        this.clientSend({
            command: 'general-message',
            message: fullMessage
        })


    }
    clientSend(data) {
        client.send(JSON.stringify(data))
    }

    addHtmlChatItem({ user, message }) {

        const messageArea = document.getElementById('messageArea')
        const messageItens = document.getElementById('messageItens')
        messageItens.innerHTML += `<div class="message-item">${message}</div>`
        messageArea.scrollTop = messageArea.scrollHeight

    }

}