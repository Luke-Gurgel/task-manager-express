import './db/mongoose'
import express from 'express'
import rootRouter from './routes'

const app = express()

app.use(express.json())
app.use(rootRouter)

export default app
