import { join } from 'node:path'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch' // Import fetch from node-fetch

const server = express()
server.use(cors())
server.use(express.json())
server.use(express.static(join(__dirname, './public')))

const OPEN_AI_KEY = 'PUT_YOUR_API_KEY_HERE'

server.post('/api/openai', async (req, res) => {
  const { prompt } = req.body
  const response = await fetch(
    'https://api.openai.com/v1/engines/davinci/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPEN_AI_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 64,
      }),
    }
  )
  const data = await response.json()
  res.json(data)
})

export default server
