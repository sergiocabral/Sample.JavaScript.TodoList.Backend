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

app.post('/tarefa', async (request, response) => {
  try {
    const { descricao, completa } = request.body

    if (typeof descricao !== 'string' || descricao.trim() === "") {
      return response.status(400).json({ error: 'O campo "descricao" é obrigatório e deve ser uma string.' })
    }

    if (typeof completa !== 'boolean' && completa !== undefined) {
      return response.status(400).json({ error: 'O campo "completa" deve ser boolean.' })
    }

    const novaTarefa = {
      id: Date.now().toString(),
      descricao,
      completa: !!completa
    }

    const tarefas = await lerTarefas()
    tarefas.push(novaTarefa)
    await gravarTarefas(tarefas)

    response.status(201).json(novaTarefa)
  } catch (error) {
    response.status(500).json({ error: 'Erro ao criar tarefa' })
  }
})

app.put('/tarefa/:id', async (request, response) => {
  try {
    const { descricao, completa } = request.body
    const tarefas = await lerTarefas()
    const index = tarefas.findIndex(t => t.id === request.params.id)

    if (index === -1) {
      return response.status(404).json({ error: 'Tarefa não encontrada' })
    }

    if (typeof descricao !== 'string' || descricao.trim() === "") {
      return response.status(400).json({ error: 'O campo "descricao" é obrigatório e deve ser uma string.' })
    }

    if (typeof completa !== 'boolean' && completa !== undefined) {
      return response.status(400).json({ error: 'O campo "completa" deve ser boolean.' })
    }

    if (descricao !== undefined) {
      tarefas[index].descricao = descricao
    }

    if (completa !== undefined) {
      tarefas[index].completa = completa
    }

    await gravarTarefas(tarefas)

    response.json(tarefas[index])
  } catch (error) {
    response.status(500).json({ error: 'Erro ao atualizar a tarefa' })
  }
})

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