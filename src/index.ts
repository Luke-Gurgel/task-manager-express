import './db/mongoose'
import express from 'express'
import rootRouter from './routes'

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(rootRouter)

app.listen(port, () => {
  console.log('server listening on port', port)
})
