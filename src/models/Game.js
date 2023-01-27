class Game {
    constructor() {

        this.logged = false
        this.loginEl = document.getElementById('divAccessLogin')
        this.loggedEl = document.getElementById('divAccessLogged')
        this.infoGameEl = document.getElementById('infoGame')
        this.loggedEl.remove()
        // this.infoGameEl.remove()
        this.paused = false
        this.soundsOn = true
        this.speaker = new p5.Speech();
        this.speaker.setVoice('Google português do Brasil');
        this.loginning = false
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
                from: player.login,
                to: player.opponentLogin,
                command: 'chatmessage',
                login: player.login,
                message: 'Perdeu o foco!'
            })

        });

        document.addEventListener("visibilitychange", (event) => {

            let message = ''
            if (document.visibilityState == 'hidden') message = 'Desfocou do jogo!'
            if (document.visibilityState == 'visible') message = 'Focou do jogo!'

            client.send(JSON.stringify({
                from: player.login,
                to: player.opponentLogin,
                command: 'visibilitychange',
                login: player.login,
                visibilityState: document.visibilityState,
                message
            }))
        });
        document.addEventListener("suspend", (event) => {
            console.log(event)
            chat.clientSend({
                from: player.login,
                to: player.opponentLogin,
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

        if (this.loginning) return
        this.loginning = true

        if (player.length > 0) player.clear()
        if (proxyPlayer.length > 0) proxyPlayer.clear()

        this.pause(false)

        const accessLogin = document.getElementById('accessLogin').value
        client = new Client()
        client.send(JSON.stringify({
            from: accessLogin,
            to: '',
            command: "login",
            login: accessLogin
        }))

        box.clearGame()

    }

    close() {

        client.close()
        document.getElementById('itemOnline').appendChild(this.loginEl)

        this.loggedEl.remove()
        // this.infoGameEl.remove()

        this.cancelGame()
        this.loginning = false

    }

    onServerResponseLogin(server) {

        if (server.error.code == 0) {

            player = new Player({ login: server.login, team: server.team, proxy: false })
            this.logged = true

            document.getElementById('itemOnline').appendChild(this.loggedEl)
            document.getElementById('access-error').innerText = ''
            document.getElementById('accessUserImg').innerText = server.login.trim().toUpperCase()[0]
            document.getElementById('accessUserName').innerText = server.login.trim()

            // document.getElementById('itemOnline').appendChild(this.infoGameEl)
            document.getElementById('team').innerText = toPT(player.team)

            this.loginEl.remove()



            chat.addHtmlChatItem({ login: 'Bocha', unique: true, message: 'Como jogar?<br><br>1o Clique na bola e solte pra pegá-la.<br>2o Clique segure, arraste pra baixo e solte!' })

        } else {
            document.getElementById('access-error').innerText = server.error.reason
        }

        this.loginning = false
    }

    onOpponentConnect(server) {

        // console.log("SHOWW OPP INFO", server)
        // proxyPlayer = new Player({ login: server.login, team: server.team, proxy: true })

        // document.getElementById('opponent').innerText = server.login
        // box.startGame()
        // this.pause(false)

        // console.log("ANFTER OPP")

    }

    onOpponentDisconnect(server) {
        chat.addHtmlChatItem({ login: server.login, message: 'Desconectou!' })
        this.cancelGame()
        this.close()


    }

    onOpponentVisibilityChange(server) {

        console.log(server)

        if (server.visibilityState == 'hidden') {
            this.pause(true)
        } else if (server.visibilityState == 'visible') {
            this.pause(false)
        }

    }
    onOpponentList(server) {

        const combo = document.getElementById('opponentsList')
        combo.innerHTML = ''

        for (const op of server.opponentsList) {

            const option = document.createElement("option")
            option.text = op.login
            combo.add(option)
        }

    }

    onStart(server) {
        console.log("(( servidor mandou iniciar ))", server)

        console.log("SHOWW OPP INFO", server)
        proxyPlayer = new Player({ login: server.login, team: server.team, proxy: true })

        document.getElementById('opponent').innerText = server.opponent
        box.startGame()
        this.pause(false)

        console.log("ANFTER OPP")

    }

    pause(status) {
        if (status) {
            console.log('noLoop()')
            this.paused = true
            noLoop()
        } else {
            console.log('loop()')
            this.paused = false
            loop()
        }

    }

    start() {
        client.send(JSON.stringify({
            from: player.login,
            to: '',
            opponent: document.getElementById('opponentsList').value,
            command: "start",
        }))

    }

    stopGame() {
        player.opponentLogin = ''
        document.getElementById('opponent').innerText = player.opponentLogin
    }

    toggleSound() {
        this.soundsOn = document.getElementById('toggleSound').checked
    }

    speak(what) {
        if (this.soundsOn) {
            this.speaker.speak(what)
        }
    }

    cancelGame() {
        box.clearBalls()
        player.clear()
        if (proxyPlayer.length > 0) proxyPlayer.clear()
        if (document.getElementById('opponent')) {
            document.getElementById('opponent').innerText = player.opponentLogin
        }
        this.pause(false)
    }

}