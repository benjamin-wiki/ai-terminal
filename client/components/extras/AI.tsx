import axios from 'axios'

export async function callAI(input: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:3000/api/openai', {
      prompt: input,
    })

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text.trim()
    } else {
      return 'Sorry, I was unable to generate a response.'
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    return 'Sorry, I was unable to process your request.'
  }
}
