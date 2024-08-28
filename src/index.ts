require('dotenv').config()
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/', (req, res, next) => {
    res.json({ msg: "It's alive!!!!" })
})

app.listen(3000, () => {
    console.log('CORS ativo. Web server rodando na porta 3000.')
})