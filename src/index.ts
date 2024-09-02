// TODO: convert to esm import
import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction} from 'express'
import cors from 'cors'
import measureController from './controllers/measure.controller'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Teste técnico Shopper 2024", candidato: "Atauã Pinali Doederlein"})
})

app.post('/upload', measureController.checkImage)
app.patch('/confirm', measureController.confirmMeasure)
app.get('/{id}/list', measureController.listMeasuresByConsumerCode)

app.listen(port, () => {
    console.info(`Servidor web rodando na porta ${port}.`)
})