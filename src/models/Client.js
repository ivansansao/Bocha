class Client {
    constructor() {
        this.ws = null
        this.connect()
        this.isConnected = false

    }
    connect() {

        this.ws = new WebSocket('ws://localhost:8080')
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
        console.log("Recebido: ", data.data)

    }

    send = (data) => {

        if (this.isConnected) {
            this.ws.send(data)
        } else {
            setTimeout(() => {
                this.ws.send(data)
            }, 100);
        }
    }

}