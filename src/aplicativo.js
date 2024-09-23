import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => response.send('Olá Tarefas'))
app.get('/tarefas', (request, response) => response.send('Não implementado'))
app.get('/tarefa/:id', (request, response) => response.send('Não implementado'))
app.post('/tarefa', (request, response) => response.send('Não implementado'))
app.put('/tarefa/:id', (request, response) => response.send('Não implementado'))
app.delete('/tarefa/:id', (request, response) => response.send('Não implementado'))
app.path('/tarefa/:id/completa', (request, response) => response.send('Não implementado'))
app.path('/tarefa/:id/incompleta', (request, response) => response.send('Não implementado'))

function iniciar(port) {
  app.listen(port, () => console.log(`Aplicação executando em http://localhost:${port}/`))
}

export default {
  iniciar,
  express: app,
}