import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  try {
     const models = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("List your models"); // Dummy call
     // Actually use fetch directly to check the key validity for models list
     const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
     const data = await resp.json();
     console.log('MODELS:', JSON.stringify(data, null, 2).slice(0, 500));
  } catch (err) {
    console.error('FAILURE:', err.message);
  }
}
list();
