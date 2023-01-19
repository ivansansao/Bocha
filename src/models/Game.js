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

        document.addEventListener('focus', (event) => {
            chat.clientSend({
                command: 'chatmessage',
                login: player.login,
                message: 'Perdeu o foco!'
            })

        });

        document.addEventListener("visibilitychange", (event) => {
            console.log('event: ', event)
            client.send(JSON.stringify({
                command: 'visibilitychange',
                login: player.login,
                visibilityState: document.visibilityState,
                message: 'Alterou a visiblidade da página! ' + document.visibilityState
            }))
        });
        document.addEventListener("suspend", (event) => {
            console.log(event)
            chat.clientSend({
                command: 'chatmessage',
                login: player.login,
                message: 'suspend'
            })
        });



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

            player = new Player({ login: server.login, team: server.team, proxy: false })
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
        proxyPlayer = new Player({ login: server.login, team: server.team, proxy: true })

        document.getElementById('opponent').innerText = server.login
        box.startGame()

        console.log("ANFTER OPP")

    }

    onOpponentDisconnect(server) {
        chat.addHtmlChatItem({ login: server.login, message: 'Desconectou!' })
        this.stopGame()
    }

    onOpponentVisibilityChange(server) {

        console.log(server)

        if (server.visibilityState == 'hidden') {
            console.log('noLoop()')
            noLoop()
        } else if (server.visibilityState == 'visible') {
            console.log('loop()')
            loop()

        }

    }

    stopGame() {
        player.opponentLogin = ''
        document.getElementById('opponent').innerText = player.opponentLogin
    }

}