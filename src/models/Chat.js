class Chat {
    constructor() {

        this.addListener()
    }
    addListener() {

        let el
        el = document.getElementById("inputMessage")
        el.addEventListener("keyup",
            (event) => {
                if (event.key == 'Enter') {
                    this.send()
                    el.value = ''
                }

            })

    }
    sendGeneralMessage(message) {

        this.clientSend({
            command: 'general-message',
            user: player.login,
            message: message.innerText
        })

    }

    onMessageReceived(data) {
        this.addHtmlChatItem({ user: data.user, message: data.message })
    }
    send() {

        this.clientSend({
            command: 'general-message',
            user: player.login,
            message: document.getElementById('inputMessage').value
        })

    }
    clientSend(data) {
        client.send(JSON.stringify(data))
    }

    addHtmlChatItem({ user, message }) {

        const chatItens = document.getElementById('chatItens')
        chatItens.innerHTML += `<div class="chat-item"><b>${user}</b>: <span>${message}</span></div>`
        chatItens.scrollTop = chatItens.scrollHeight

    }

}