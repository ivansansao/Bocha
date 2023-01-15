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
    sendGeneralMessage(message) {

        this.clientSend({
            command: 'general-message',
            login: player.login,
            message: message.innerText
        })

    }

    onMessageReceived(data) {
        this.addHtmlChatItem({ login: data.login, message: data.message })
    }
    send() {

        this.clientSend({
            command: 'general-message',
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
        let cls = 'chat-item'
        let userSide
        const firstChar = login[0]

        if (login == player.login) {
            cls = 'chat-item'
            userSide = '1'
        } else {
            cls = 'chat-item chat-item-other'
            userSide = '2'
        }

        div = `
            <div class="chat-item-flex${userSide}">
                <div class="${cls}">
                    <div class="chat-item-user">${firstChar}</div>
                    <div class="chat-item-message${userSide}">
                        <div class="chat-item-message-title"><b>${login}</b></div>
                        <div class="chat-item-message-content">${message}</div>
                    </div>
                </div>
            </div>
        `

        return div
    }

}