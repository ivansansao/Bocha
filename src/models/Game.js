class Game {
    constructor() {

        this.logged = false
        this.loginEl = document.getElementById('divAccessLogin')
        this.loggedEl = document.getElementById('divAccessLogged')
        this.infoGameEl = document.getElementById('infoGame')
        this.loggedEl.remove()
        this.infoGameEl.remove()
        this.soundsOn = true
        this.addListener()

    }

    addListener() {

        let el
        el = document.getElementById("accessLogin")
        el.addEventListener("keyup",
            (event) => {
                if (event.key == 'Enter') {
                    game.login()
                    el.value = ''
                }

            })

    }

    playSound(what) {

        // https://freesound.org/
        // https://mixkit.co/free-sound-effects/

        if (this.soundsOn) {
            new Audio(`src/assets/sound/${what}.wav`).play()
        }
    }
    login() {

        const accessLogin = document.getElementById('accessLogin').value

        client = new Client()
        client.send(JSON.stringify({ command: "login", login: accessLogin }))

        box.clearGame()

        chat.addHtmlChatItem({ login: 'Bocha', message: 'Como jogar?<br><br>1o Clique na bola e solte pra pegá-la.<br>2o Clique segure, arraste pra baixo e solte!' })


    }


    close(arg) {

        // chat.clientSend({
        //     command: 'chatmessage',
        //     login: player.login,
        //     message: 'Saiu!'
        // })
        client.close()
        document.getElementById('itemOnline').appendChild(this.loginEl)

        this.loggedEl.remove()
        this.infoGameEl.remove()

    }

    onServerResponseLogin(server) {

        if (server.error.code == 0) {

            player = new Player({ login: server.login })
            player.team = server.team
            this.logged = true

            document.getElementById('itemOnline').appendChild(this.loggedEl)
            document.getElementById('access-error').innerText = ''
            document.getElementById('accessUserImg').innerText = server.login.trim().toUpperCase()[0]
            document.getElementById('accessUserName').innerText = server.login.trim()

            document.getElementById('itemOnline').appendChild(this.infoGameEl)
            document.getElementById('team').innerText = toPT(player.team)

            this.loginEl.remove()

            // const divAccessLogin = document.getElementById('divAccessLogin')
            // const divAccessLogged = document.getElementById('divAccessLogged')
            // divAccessLogin.style.visibility = 'hidden'
            // divAccessLogged.style.visibility = 'visible'


            // chat.clientSend({
            //     command: 'chatmessage',
            //     login: player.login,
            //     message: 'Entrou!'
            // })


        } else {
            document.getElementById('access-error').innerText = server.error.reason
        }
    }

    onOpponentConnect(server) {

        console.log("SHOWW OPP INFO", server)

        document.getElementById('opponent').innerText = server.opponentLogin
        box.startGame()

        console.log("ANFTER OPP")

    }

    onOpponentDisconnect(server) {
        chat.addHtmlChatItem({ login: server.login, message: 'Desconectou!' })
        this.stopGame()
    }

    stopGame() {
        player.opponentLogin = ''
        document.getElementById('opponent').innerText = player.opponentLogin
    }

}