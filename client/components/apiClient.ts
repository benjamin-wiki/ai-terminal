import request from 'superagent'

export async function GPT() {
  const response = await request.get('/api/openai')
  console.log('Here! ', response)
  return response
}
