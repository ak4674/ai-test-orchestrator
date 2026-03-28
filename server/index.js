import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import JiraClient from './services/jiraClient.js';
import aiService from './services/aiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080; // Cloud Run expects 8080

app.use(cors());
app.use(express.json());

// Serve Static Files from Vite build
// We assume 'dist' will be in the project root relative to the server folder
const rootDir = path.join(__dirname, '..');
app.use(express.static(path.join(rootDir, 'dist')));

// Mock local store if Jira is not connected
let storiesStore = [
  { id: '1', key: 'TEST-101', summary: 'Implement User Authentication', description: 'User should be able to login with email', priority: 'High', status: 'In Progress' },
  { id: '2', key: 'TEST-102', summary: 'Real-time Data Sync with WebSockets', description: 'Enable bidirectional communication', priority: 'Highest', status: 'Todo' },
];

const jira = new JiraClient({
  baseURL: process.env.JIRA_BASE_URL || 'http://localhost:3001',
  projectKey: process.env.JIRA_PROJECT_KEY || 'STLC',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
});

// 1. Jira Stories
app.get('/api/jira/stories', async (req, res) => {
  try {
    const healthy = await jira.isHealthy();
    if (healthy) {
      const results = await jira.searchIssues(20);
      const stories = results.issues.map(issue => ({
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        priority: issue.fields.priority?.name || 'Medium',
        status: issue.fields.status?.name || 'Open',
      }));
      // Keep local sync for generation
      storiesStore = stories;
      return res.json(stories);
    }
    res.json(storiesStore);
  } catch (err) {
    res.json(storiesStore);
  }
});

// 2. Test Plan Generation (SSE)
app.get('/api/generate/test-plan', async (req, res) => {
  const { storyId } = req.query;
  const story = storiesStore.find(s => s.id === storyId);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  sendEvent({ status: 'analyzing', message: `Analyzing story ${story?.key}...` });
  
  // Real AI Call
  try {
    const plan = await aiService.generateTestPlan(story);
    sendEvent({ status: 'complete', plan });
  } catch (err) {
    sendEvent({ status: 'error', message: 'AI Generation Failed' });
  }
  res.end();
});

// 3. Test Case Generation
app.post('/api/generate/test-cases', async (req, res) => {
  const { storyId } = req.body;
  const story = storiesStore.find(s => s.id === storyId);
  
  try {
    const newCases = await aiService.generateTestCases(story);
    res.json(newCases);
  } catch (err) {
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// 4. Code Generation
app.post('/api/generate/code', async (req, res) => {
  const { framework, language, testCase } = req.body;
  
  try {
    const code = await aiService.generateCode(framework, language, testCase);
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// Catch-all route to serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Orchestrator Live (Production Ready) on port ${PORT}`));


