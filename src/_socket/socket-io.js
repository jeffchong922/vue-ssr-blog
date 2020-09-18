import io from 'socket.io-client'

/**
 * @type { SocketIOClient.ConnectOpts }
 */
const connectOptions = {
  autoConnect: false,
  reconnectionAttempts: 25
}

const clientStorage = new Map()

const isDev = process.env.NODE_ENV !== 'production'

export default function makeSocketIOClient ({ socketUrl }) {
  let socketClient
  if (clientStorage.has(socketUrl)) {
    socketClient = clientStorage.get(socketUrl)
  } else {
    socketClient = io(socketUrl, connectOptions)
    isDev && console.log(`创建新的 socket 客户端, socketUrl = ${socketUrl}`)
    clientStorage.set(socketUrl, socketClient)
  }

  return socketClient
}

// // 连接成功后生成，否则 undefined
// socket.id

// // 标志 socket 是否连接服务器
// socket.connected

// // 标志 socket 是否断开服务器
// socket.disconnected

// // 手动连接服务器，autoConnect 选项设置为 true 时自动连接
// socket.open()
// // 与 open() 类似
// socket.connect()

// // 发送 message 事件
// socket.send()

// // 发送指定事件 If the last argument is a function, then it will be called as an 'ack' when the response is received
// socket.emit('event')

// // 监听指定事件 回调函数还可以接收回调函数
// socket.on('event', function callback () {})

// // 手动断开连接
// socket.close()
// socket.disconnect()

// socket.hasListeners('event') // 检查是否监听了该事件
// socket.once('event') // 只调用一次
// socket.off('event') // 移除监听