class Client {
    constructor() {
        this.ws = null
        this.connect()
        this.isConnected = false

    }
    connect() {

        this.ws = new WebSocket('ws://54.147.8.210:8950')
        const ws = this.ws

        ws.onopen = this.onOpen
        ws.onmessage = this.onMessage

    }

    onOpen = (data) => {

        this.isConnected = true
        this.send(Date.now() + ": Conectei no server")
    }

    onMessage = (data) => {

        const ws = this.ws
        let parseData = data.data
        if (data.data[0] == '{') {
            parseData = JSON.parse(data.data)
            if (parseData.team) {
                player.team = parseData.team
            }
            box.nextPlayer = parseData.team

            const command = parseData.command

            switch (command) {
                case 'threw':

                    // Capture bocce
                    const bocce = balls.find((e) => e.id == parseData.bocce.id)
                    bocce.captured = DEF_BALL_CAPTURED
                    bocce.p.x = parseData.bocce.px
                    bocce.p.y = parseData.bocce.py


                    box.throwBall(parseData.bocce.mx, parseData.bocce.my)
                    releaseBall()

                    break;

                case 'allposition':

                    console.log("Positione suass bolas em")
                    for (const remoteBocce of parseData.bocces) {
                        console.log(remoteBocce.p)
                        for (const bocce of balls) {
                            if (remoteBocce.id == bocce.id) {
                                bocce.p.x = remoteBocce.p.x
                                bocce.p.y = remoteBocce.p.y
                                break
                            }
                        }
                    }

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