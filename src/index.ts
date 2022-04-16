import { server } from './server'
import express from 'express'
import http from 'http'
import { genSaltSync, hashSync } from 'bcrypt'
const PORT = process.env.PORT || 3000

const app = express()

server.start().then(() => {
  server.applyMiddleware({
    app,
    path: '/',
    cors: { credentials: true, origin: '*' },
  })

  const httpServer = http.createServer(app)

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ${process.pid} ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  })

  // console.log(hashSync('admin123', genSaltSync()))
})
