
import { Server } from 'socket.io'
const Socket = {}
Socket.io = null

// инициализация и настройка webSocket
Socket.init = (httpServer) => {
  if (Socket.io) {
    return
  }
  Socket.io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] }  })
  Socket.io.on('connection', (socket) => {
    console.log('a user connected ' + socket.id)
  })
}

//получение сокета 
Socket.getSocket = () => Socket.io
// отправка сообщений
Socket.notify = (event, data) => Socket.io.emit(event, data)

export default Socket
