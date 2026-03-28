import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import JiraClient from '../server/services/jiraClient.js';
import aiService from '../server/services/aiService.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Persistent store (ephemeral in serverless but okay for session)
let storiesStore = [
  { id: '1', key: 'TEST-101', summary: 'Implement User Authentication', description: 'User should be able to login with email', priority: 'High', status: 'In Progress' },
  { id: '2', key: 'TEST-102', summary: 'Real-time Data Sync with WebSockets', description: 'Enable bidirectional communication', priority: 'Highest', status: 'Todo' },
];

const jira = new JiraClient({
  baseURL: process.env.JIRA_BASE_URL || 'https://akyanand.atlassian.net/',
  projectKey: process.env.JIRA_PROJECT_KEY || 'SCRUM',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
});

function extractTextFromADF(adf) {
  if (!adf || !adf.content) return '';
  let text = '';
  const traverse = (node) => {
    if (node.text) text += node.text;
    if (node.content) node.content.forEach(traverse);
  };
  adf.content.forEach(traverse);
  return text.trim();
}

// 1. Jira Stories
app.get('/api/jira/stories', async (req, res) => {
  try {
    const isHealthy = await jira.isHealthy();
    if (isHealthy) {
      const results = await jira.searchIssues(20);
      if (results && results.issues && Array.isArray(results.issues)) {
        const stories = results.issues.map(issue => {
          const fields = issue.fields || {};
          return {
            id: issue.id,
            key: issue.key,
            summary: fields.summary || 'No Summary',
            description: typeof fields.description === 'object' 
              ? extractTextFromADF(fields.description) 
              : (fields.description || 'No Description'),
            priority: fields.priority?.name || 'Medium',
            status: fields.status?.name || 'Open',
          };
        });
        storiesStore = stories;
        return res.json(stories);
      }
    }
  } catch (err) {
    console.error('❌ Jira Error:', err.message);
  }
  res.json(storiesStore);
});

// 2. Test Plan Generation (SSE)
app.get('/api/generate/test-plan', async (req, res) => {
  const { storyId, provider } = req.query;
  const story = storiesStore.find(s => s.id === storyId);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  sendEvent({ status: 'analyzing', message: `Analyzing story ${story?.key || 'provided'}...` });
  
  try {
    const plan = await aiService.generateTestPlan(story, provider);
    sendEvent({ status: 'complete', plan });
  } catch (err) {
    sendEvent({ status: 'error', message: 'AI Generation Failed' });
  }
  res.end();
});

// 3. Test Case Generation
app.post('/api/generate/test-cases', async (req, res) => {
  const { storyId, provider, screenshot } = req.body;
  const story = storiesStore.find(s => s.id === storyId);
  
  try {
    const newCases = await aiService.generateTestCases({ story, screenshot }, provider);
    res.json(newCases);
  } catch (err) {
    console.error('Test Case Gen Error:', err.message);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// 4. Code Generation
app.post('/api/generate/code', async (req, res) => {
  const { framework, language, testCase, provider } = req.body;
  
  try {
    const code = await aiService.generateCode(framework, language, testCase, provider);
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: 'AI generation failed' });
  }
});

export default app;
