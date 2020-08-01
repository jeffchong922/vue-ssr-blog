const socket = require('socket.io')

class SocketController {
  constructor (server) {
    this.io = socket(server, {
      perMessageDeflate: false,
      maxHttpBufferSize: 1e5
    })
    this.clients = {}
    this.init()
  }

  init () {
    this.listening(this.io, 'connection', client => {
      console.log(`id: ${client.id} , connected`);
      this.clients[client.id] = client

      this.listening(client, 'disconnect', () => {
        console.log(`id: ${client.id} , left`);
        delete this.clients[client.id]
      })
    })
  }

  listening (instance, event, callback) {
    instance.on(event, callback)
  }
  listen (instance, event, callback) {
    instance.once(event, callback)
  }

  dispatch (event, data, id) {
    if (!data) data = ''
    console.log('io has ids :', Object.keys(this.clients))
    return id
      ? this.io.to(id).emit(event, data)
      : this.io.sockets.emit(event, data)
  }
}

let socketController
function GetSCInstance (server) {
  if (!socketController) {
    socketController = new SocketController(server)
    Object.freeze(socketController)
  }

  GetSCInstance = () => socketController

  return GetSCInstance()
}

module.exports = GetSCInstance