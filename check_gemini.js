import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function run() {
  try {
    const result = await model.generateContent("Say hello");
    console.log('SUCCESS:', result.response.text());
  } catch (err) {
    console.error('FAILURE:', err.status, err.message);
  }
}
run();
