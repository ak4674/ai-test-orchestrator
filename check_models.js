import https from 'https';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('models_list.json', data);
    console.log('DONE');
  });
});
