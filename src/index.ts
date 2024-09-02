import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'
import measureController from './controllers/measure.controller'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/:customer_code/list', measureController.listMeasuresByConsumerCode)
app.post('/upload', measureController.checkImage)
app.patch('/confirm', measureController.confirmMeasure)

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ message: "Teste técnico Shopper 2024", candidato: "Atauã Pinali Doederlein" })
})

app.listen(port, () => {
    console.info(`Servidor web rodando na porta ${port}.`)
})