import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

function iniciar(port) {
  app.listen(port, () => console.log(`Aplicação executando em http://localhost:${port}/`))
}

export default {
  iniciar,
  express: app,
}