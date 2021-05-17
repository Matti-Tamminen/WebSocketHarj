const WebSocket = require('ws')
const http = require('http')
const { readFileSync } = require('fs')

const homePage = readFileSync('./index.html')

const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(homePage)
    res.end()
})

const PORT = 5000

const socket = new WebSocket.Server({ server })

socket.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        if (data == 'note') return // visible or not
        socket.clients.forEach( function each(client) {
            if (client != ws && client.readyState == WebSocket.OPEN) {
                client.send(data)
            }
        })
    })
    ws.on('note', function noting(data, respondWith) {
        respondWith(data)   
    })
})

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
