import { Server } from 'socket.io'
import { registerHandlers } from './handlers.js'

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    registerHandlers(io, socket)
  })

  console.log('Socket.io initialized')
}

export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  initSocket(io)
  return io
}
