





import axios from 'axios';  // Add to package.json if needed: npm install axios

const API_URL = 'https://api.x.ai/v1/chat/completions';  // xAI Grok API endpoint
const API_KEY = process.env.REACT_APP_XAI_API_KEY;  // Set in .env

export async function generateDynamicQuestion(subject, grade, difficulty) {
  if (!API_KEY) {
    console.warn('xAI API key missing; falling back to static questions');
    return null;  // Or return static fallback
  }

  try {
    const response = await axios.post(API_URL, {
      model: 'grok-beta',
      messages: [{
        role: 'user',
        content: `Generate a ${difficulty}-level educational question for grade ${grade} in ${subject}. Format: { "question": "...", "options": ["A", "B", "C", "D"], "answer": "A" }`
      }]
    }, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('AI question generation failed:', error);
    return null;  // Fallback to static
  }
}





