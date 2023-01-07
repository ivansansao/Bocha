/*

CLIENT: {request:  "login", alias: "Ivan"} 
SERVER: {response: "ok", clientId: 1, team: "yellow"}
SERVER: {response: "error_team_complete", error: "Team already complete"}
SERVER: {response: "error_alias_exist", error: "Alias alread exist"}

CLIENT: {request:  "threw_little_ball", team: "yellow", mouseData: {x: 135, y: 332}, ballData: {ball}}
SERVER: {reponse: "adv_threw_ball",  }

*/


const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = []

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send("You said: " + message + " me: Haaaa, me achou?")
    });

    clients.push(ws)
    ws.send('Você conectou no server');
    clients.forEach((client) => {
        client.send("Todos receberam isso?   Clients: " + clients.length)
    })
});
