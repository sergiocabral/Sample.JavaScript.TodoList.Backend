import process from 'node:process'
import { promises as fs } from 'node:fs'

const arquivo = 'api/env.json'

async function lerConfiguracao(nome) {
  if (process.env[nome] !== undefined) {
    return process.env[nome]
  }

  try {
    const data = await fs.readFile(arquivo)
    const configuracao = JSON.parse(data)
    return configuracao[nome]
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${arquivo}:`, error)
    return undefined
  }
}

export default {
  authRedirect: await lerConfiguracao('authRedirect'),
  sessionSecret: await lerConfiguracao('sessionSecret'),
  corsOrigin: await lerConfiguracao('corsOrigin'),
  githubClientID: await lerConfiguracao('githubClientID'),
  githubClientSecret: await lerConfiguracao('githubClientSecret'),
  githubCallbackURL: await lerConfiguracao('githubCallbackURL'),
}
