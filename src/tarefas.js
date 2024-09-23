import { promises as fs } from 'fs'

const arquivo = 'src/lista-de-tarefas.json'

export async function lerTarefas() {
  try {
    const data = await fs.readFile(arquivo)
    return JSON.parse(data)
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${arquivo}:`, error)
    return []
  }
}

export async function gravarTarefas(tarefas) {
  try {
    await fs.writeFile(arquivo, JSON.stringify(tarefas, null, 2))
  } catch (error) {
    console.error(`Erro ao gravar no arquivo ${arquivo}:`, error)
  }
}
