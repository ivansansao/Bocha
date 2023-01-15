class Game {
    constructor() {
        this.logged = false

    }

    login(arg) {

        const accessLogin = document.getElementById('accessLogin').value

        client = new Client()
        client.send(JSON.stringify({ command: "login", login: accessLogin }))

    }

    onServerResponseLogin(server) {

        if (server.error.code == 0) {

            player = new Player({ login: server.login })
            player.team = server.team
            this.logged = true
            box.startGame()
            document.getElementById('access-error').innerText = ''

        } else {
            document.getElementById('access-error').innerText = server.error.reason
        }
    }

}