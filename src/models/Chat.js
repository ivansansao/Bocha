class Chat {
    constructor() {

        this.addListener()


        // this.addHtmlChatItem({ login: 'Renata', message: 'Oiii' })
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
    sendChatMessage(message) {

        this.clientSend({
            command: 'chatmessage',
            login: player.login,
            message: message.innerText
        })

    }

    onOpponentConnect(data) {

        this.clientSend({
            command: 'chatmessage',
            login: data.login,
            message: 'Entrei!'
        })

    }


    onMessageReceived(data) {

        if (data.error.code == 0) {
            this.addHtmlChatItem({ login: data.login, message: data.message })

            // If message is not mime and I am not focced
            if (data.login != player.login) {

                if (document.visibilityState == 'hidden') {
                    console.log('Falando....' + data.message)
                    game.speak(data.message)
                }
            }
        } else {
            this.addHtmlChatItem({ login: data.login, message: data.error.reason })
        }
    }
    send() {

        this.clientSend({
            command: 'chatmessage',
            login: player.login,
            message: document.getElementById('inputMessage').value
        })

    }
    clientSend(data) {
        client.send(JSON.stringify(data))
    }

    addHtmlChatItem({ login, message }) {

        const chatItens = document.getElementById('chatItens')
        chatItens.innerHTML += this.getDivChatItem({ login, message })
        chatItens.scrollTop = chatItens.scrollHeight

    }
    getDivChatItem({ login, message }) {

        let div

        if (login == player.login) {

            div = `
                <div class="chat-item-flex1">
                    <div class="chat-item">
                        <div class="chat-item-message1">
                            <div class="chat-item-message-content">${message}</div>
                        </div>
                    </div>
                </div>
            `
        } else {

            const firstChar = login[0].toUpperCase()

            div = `
                <div class="chat-item-flex2">
                    <div class="chat-item chat-item-other">
                        <div class="chat-item-user">${firstChar}</div>
                        <div class="chat-item-message2">
                            <div class="chat-item-message-title"><b>${login}</b></div>
                            <div class="chat-item-message-content">${message}</div>
                        </div>
                    </div>
                </div>
            `
        }

        return div
    }

}