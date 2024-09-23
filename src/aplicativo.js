import express from 'express'
import cors from 'cors'
import { lerTarefas, gravarTarefas } from './tarefas.js'
import { promises as fs } from 'fs'

const app = express()

app.use(cors())
app.use(express.json())

async function validarAutenticacao(request, response, next) {
  const token = request.headers['authorization']?.split(' ')[1]

  if (!token) {
    return response.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const data = await fs.readFile('src/autenticacao.json')
    const { tokens } = JSON.parse(data)

    if (tokens.includes(token)) {
      next()
    } else {
      response.status(403).json({ error: 'Token inválido' })
    }
  } catch (error) {
    response.status(500).json({ error: 'Erro ao validar o token' + error})
  }
}

app.get('/', (request, response) => response.send('Olá Tarefas'))

app.get('/tarefas', validarAutenticacao, async (request, response) => {
  try {
    const tarefas = await lerTarefas()
    response.json(tarefas)
  } catch (error) {
    response.status(500).json({ error: 'Erro ao obter tarefas' })
  }
})

app.get('/tarefa/:id', validarAutenticacao, async (request, response) => {
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

app.post('/tarefa', validarAutenticacao, async (request, response) => {
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

app.put('/tarefa/:id', validarAutenticacao, async (request, response) => {
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

app.delete('/tarefa/:id', validarAutenticacao, async (request, response) => {
  try {
    const tarefas = await lerTarefas()
    const index = tarefas.findIndex(t => t.id === request.params.id)

    if (index === -1) {
      return response.status(404).json({ error: 'Tarefa não encontrada' })
    }

    tarefas.splice(index, 1)

    await gravarTarefas(tarefas)

    response.status(204).send()
  } catch (error) {
    response.status(500).json({ error: 'Erro ao deletar a tarefa' })
  }
})

app.patch('/tarefa/:id/completa', validarAutenticacao, async (request, response) => {
  try {
    const tarefas = await lerTarefas()
    const index = tarefas.findIndex(t => t.id === request.params.id)

    if (index === -1) {
      return response.status(404).json({ error: 'Tarefa não encontrada' })
    }

    tarefas[index].completa = true

    await gravarTarefas(tarefas)

    response.json(tarefas[index])
  } catch (error) {
    response.status(500).json({ error: 'Erro ao marcar a tarefa como completa' })
  }
})

app.patch('/tarefa/:id/incompleta', validarAutenticacao, async (request, response) => {
  try {
    const tarefas = await lerTarefas()
    const index = tarefas.findIndex(t => t.id === request.params.id)

    if (index === -1) {
      return response.status(404).json({ error: 'Tarefa não encontrada' })
    }

    tarefas[index].completa = false

    await gravarTarefas(tarefas)

    response.json(tarefas[index])
  } catch (error) {
    response.status(500).json({ error: 'Erro ao marcar a tarefa como incompleta' })
  }
})

function iniciar(port) {
  app.listen(port, () => console.log(`Aplicação executando em http://localhost:${port}/`))
}

export default {
  iniciar,
  express: app,
}