import * as aux from './src/models/Auxiliary.js'
import { WebSocketServer } from 'ws';
import { HandleMessages } from './src/models/HandleMessages.js';
import colors from 'colors'

const port = 8945
const wss = new WebSocketServer({ port, clientTracking: true });

aux.dateLog(colors.rainbow('Bocha server is listenning...            (Port: ' + port + ')'))

wss.on('connection', function connection(ws, req) {

    ws.on('message', (message) => HandleMessages.incoming(ws, message))
    ws.on('close', (code, reason) => HandleMessages.close(ws, code, reason))

    HandleMessages.newConnection(ws)

});


