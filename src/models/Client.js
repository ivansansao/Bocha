class Client {
    constructor() {
        this.ws = null
        this.connect()
        this.isConnected = false

    }
    connect() {

        // Return ex. localhost from url page localhost:8950
        let ip = window.location.host.split(':')[0]
        const url = `ws://${ip}:8945`

        console.log('Daddy is on: ', url)

        this.ws = new WebSocket(url)
        const ws = this.ws

        ws.onopen = this.onOpen
        ws.onmessage = this.onMessage

    }

    onOpen = (data) => {

        this.isConnected = true
        this.send(JSON.stringify({
            from: player.login,
            to: player.opponentLogin,
            message: Date.now() + ": Conectei no server"
        }))
    }

    close = (data) => {
        this.ws.close()
    }

    onMessage = (data) => {

        const ws = this.ws
        let parseData = data.data
        if (data.data[0] == '{') {
            parseData = JSON.parse(data.data)
            if (false && parseData.team && !player.team) {
                player.team = parseData.team
                box.startGame()
            }
            //  box.nextPlayer = parseData.nextPlayer

            const command = parseData.command

            switch (command) {
                case 'login':
                    console.log('Cliente recebeu o login: ', parseData)
                    game.onServerResponseLogin(parseData)
                    break
                case 'threw':

                    proxyPlayer.throwBocce(parseData.bocce.mx, parseData.bocce.my, parseData.bocce.id, parseData.bocce.px, parseData.bocce.py)
                    break;

                case 'allposition':

                    console.log("Positione suas bolas em")

                    for (const remoteBocce of parseData.bocces) {
                        for (const bocce of balls) {
                            if (remoteBocce.id == bocce.id) {

                                bocce.active = bocce.active ? true : remoteBocce.active
                                bocce.v.x = 0
                                bocce.v.y = 0
                                bocce.p.x = remoteBocce.p.x
                                bocce.p.y = remoteBocce.p.y

                                break
                            }
                        }
                    }

                    box.scoreboard.x = parseData.scoreboard.x
                    box.scoreboard.y = parseData.scoreboard.y
                    box.scoreboard.roundWinner = parseData.scoreboard.roundWinner
                    // box.scoreboard.yellow = parseData.scoreboard.yellow
                    // box.scoreboard.blue = parseData.scoreboard.blue
                    box.scoreboard.runningWinner = parseData.scoreboard.runningWinner
                    box.scoreboard.runningYellow = parseData.scoreboard.runningYellow
                    box.scoreboard.runningBlue = parseData.scoreboard.runningBlue
                    box.scoreboard.msg = parseData.scoreboard.msg
                    box.scoreboard.timeToPlay = parseData.scoreboard.timeToPlay
                    box.scoreboard.loginPlayedLastBall = parseData.scoreboard.loginPlayedLastBall

                    break

                case 'opponentData':

                    // player.opponentLogin = parseData.login
                    // chat.onOpponentConnect(parseData)
                    // game.onOpponentConnect(parseData)

                    break
                case 'start':

                    player.opponentLogin = parseData.opponent
                    chat.onOpponentConnect(parseData)
                    game.onStart(parseData)

                    break
                case 'disconnected':

                    game.onOpponentDisconnect(parseData)
                    break

                case 'chatmessage':

                    chat.onMessageReceived(parseData)
                    break

                case 'visibilitychange':

                    chat.onMessageReceived(parseData)
                    game.onOpponentVisibilityChange(parseData)
                    break
                case 'opponentsList':

                    game.onOpponentList(parseData)
                    break

                default:
                    break;
            }

        }
        console.log("Recebido: ", parseData)

    }

    send = (data) => {

        if (this.isConnected) {
            this.ws.send(data)
        } else {
            setTimeout(() => {
                this.ws.send(data)
            }, 1000);
        }
    }

}