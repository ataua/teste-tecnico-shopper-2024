require('dotenv').config()
import express from 'express'
import cors from 'cors'
import measureController from './controllers/measure.controller'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    res.render('index')
})

app.post('/upload', measureController.checkImage)
app.patch('/confirm', measureController.confirmMeasure)
app.get('/{id}/list', measureController.listMeasuresByConsumerCode)

app.listen(port, () => {
    console.log(`Servidor web rodando na porta ${port}.`)
})