import express from 'express'
import cors from 'cors'
import { lerTarefas, gravarTarefas } from './tarefas.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => response.send('Olá Tarefas'))

app.get('/tarefas', async (request, response) => {
  try {
    const tarefas = await lerTarefas()
    response.json(tarefas)
  } catch (error) {
    response.status(500).json({ error: 'Erro ao obter tarefas' })
  }
})

app.get('/tarefa/:id', async (request, response) => {
  try {
    const tarefas = await lerTarefas()
    const tarefa = tarefas.find(t => t.id === request.params.id)
    if (!tarefa) {
      return response.status(404).json({ error: 'Tarefa não encontrada' })
    }
    response.json(tarefa)
  } catch (error) {
    response.status(500).json({ error: 'Erro ao obter a tarefa' })
  }
})

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