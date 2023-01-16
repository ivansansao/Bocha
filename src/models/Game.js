class Game {
    constructor() {
        this.logged = false

    }

    login(arg) {

        const accessLogin = document.getElementById('accessLogin').value

        client = new Client()
        client.send(JSON.stringify({ command: "login", login: accessLogin }))


    }
    close(arg) {

        chat.clientSend({
            command: 'general-message',
            login: player.login,
            message: 'Saiu!'
        })
        client.close()
        const divAccessLogin = document.getElementById('divAccessLogin')
        const divAccessLogged = document.getElementById('divAccessLogged')
        divAccessLogin.style.visibility = 'visible'
        divAccessLogged.style.visibility = 'hidden'

    }

    onServerResponseLogin(server) {

        if (server.error.code == 0) {

            player = new Player({ login: server.login })
            player.team = server.team
            this.logged = true
            box.startGame()
            document.getElementById('access-error').innerText = ''

            const divAccessLogin = document.getElementById('divAccessLogin')
            const divAccessLogged = document.getElementById('divAccessLogged')
            divAccessLogin.style.visibility = 'hidden'
            divAccessLogged.style.visibility = 'visible'

            // chat.clientSend({
            //     command: 'general-message',
            //     login: player.login,
            //     message: 'Entrou!'
            // })



        } else {
            document.getElementById('access-error').innerText = server.error.reason
        }
    }

}