import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Provider Clients
const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) 
  : null;

console.log('--- AI Env Debug ---');
console.log('ANTHROPIC:', !!process.env.ANTHROPIC_API_KEY);
console.log('GEMINI:', !!process.env.GEMINI_API_KEY);
console.log('AI_PROVIDER:', process.env.AI_PROVIDER);
console.log('--------------------');

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

if (genAI) {
  console.log('✅ Gemini AI Client initialized.');
} else {
  console.warn('⚠️ Gemini AI Client: Missing GEMINI_API_KEY.');
}

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'anthropic'; // 'anthropic' | 'gemini' | 'local'
  }

  async generateTestPlan(story, preferredProvider = null) {
    const provider = preferredProvider || this.provider;

    if (provider === 'gemini' && genAI) {
      return this.generateWithGemini(story, 'plan');
    } else if (provider === 'local' && process.env.LOCAL_LLM_URL) {
      return this.generateWithLocal(story, 'plan');
    } else if (anthropic) {
      return this.generateWithAnthropic(story, 'plan');
    }

    return this.generateMockPlan(story);
  }

  async generateTestCases(data, preferredProvider = null) {
    const provider = preferredProvider || this.provider;

    if (provider === 'gemini') {
      return this.generateWithGemini(data, 'cases');
    } else if (provider === 'local' && process.env.LOCAL_LLM_URL) {
      return this.generateWithLocal(data, 'cases');
    } else if (anthropic) {
      return this.generateWithWithAnthropic(data, 'cases');
    }

    return this.generateMockCases();
  }

  async generateCode(framework, language, testCase, preferredProvider = null) {
    const provider = preferredProvider || this.provider;

    if (provider === 'gemini' && genAI) {
      return this.generateWithGemini({ framework, language, testCase }, 'code');
    } else if (provider === 'local' && process.env.LOCAL_LLM_URL) {
      return this.generateWithLocal({ framework, language, testCase }, 'code');
    } else if (anthropic) {
      return this.generateWithWithAnthropic({ framework, language, testCase }, 'code');
    }

    return this.generateMockCode(framework, language, testCase);
  }

  // --- Provider Implementations ---

  async generateWithAnthropic(data, type) {
    try {
      let prompt = '';
      if (type === 'plan') {
         prompt = `You are a Senior QA Architect. Create a structured test plan for this Jira story:
          Key: ${data.key}
          Summary: ${data.summary}
          Description: ${data.description}
          Return raw JSON only with keys: objective, entryCriteria, riskAssessment, planContent.`;
      } else if (type === 'cases') {
         prompt = `Generate 4-6 test cases for story: ${data.summary}. JSON array only with keys: id, title, priority, category, status.`;
      } else if (type === 'code') {
         prompt = `Generate ${data.framework} code in ${data.language} for: ${data.testCase.title}. Code block only.`;
      }

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      
      const text = response.content[0].text;
      return type === 'code' ? text : JSON.parse(text);
    } catch (err) {
      console.error('Anthropic Error:', err.message);
      throw err;
    }
  }

  async generateWithGemini(data, type) {
    try {
      const model = "gemini-1.5-flash"; // Switched for stability (Gemini 3 Flash is experiencing high demand)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      let prompt = '';
      let inlineData = null;

      if (type === 'plan') {
         prompt = `Create a structured test plan for Jira story: ${data.story?.summary || 'New System'}. Return ONLY raw JSON (no markdown blocks, no intro/outro). 
         JSON Keys: objectives (array), risks (array), entryCriteria (array), dataRequirements (array).
         Story Context: ${data.story?.description || 'No detailed description'}`;
      } else if (type === 'cases') {
         prompt = `Generate 5 test cases for: ${data.story?.summary || 'System based on screenshot'}. Return ONLY a raw JSON array of objects with keys: id, title, priority, category, status. No markdown.`;
         if (data.screenshot) {
            prompt += " Analyze the attached screenshot for UI patterns and edge cases.";
            const base64Data = data.screenshot.split(',')[1];
            inlineData = {
              mimeType: "image/png",
              data: base64Data
            };
         }
      } else if (type === 'code') {
         prompt = `Generate ${data.framework} ${data.language} code for: ${data.testCase.title}. Return raw code only. No markdown.`;
      }

      const requestPayload = {
        contents: [{ 
          parts: [
            { text: prompt },
            ...(inlineData ? [{ inlineData }] : [])
          ] 
        }],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.1,
        }
      };

      const response = await axios.post(url, requestPayload);

      if (!response.data.candidates || response.data.candidates.length === 0) {
        throw new Error('Gemini returned no candidates.');
      }

      let text = response.data.candidates[0].content.parts[0].text;
      // Sanitize JSON output from LLM
      text = text.replace(/```json|```/g, '').trim();
      
      try {
        return type === 'code' ? text : JSON.parse(text);
      } catch (e) {
        console.log('--- RAW GEMINI OUTPUT ---');
        console.log(text);
        console.log('--------------------------');
        throw e;
      }
    } catch (err) {
      console.error('Gemini Error:', err.response?.data || err.message);
      throw err;
    }
  }

  async generateWithLocal(data, type) {
    try {
      const url = process.env.LOCAL_LLM_URL; // e.g. http://localhost:11434/api/generate
      let prompt = '';
      if (type === 'plan') prompt = `Test plan JSON for: ${data.summary}`;
      else if (type === 'cases') prompt = `Test cases JSON for: ${data.summary}`;
      else prompt = `Code for: ${data.testCase.title}`;

      const response = await axios.post(url, {
        model: process.env.LOCAL_LLM_MODEL || 'llama3',
        prompt: prompt,
        stream: false
      });
      
      // Handle Ollama response structure
      const text = response.data.response || response.data.content || '';
      return type === 'code' ? text : JSON.parse(text);
    } catch (err) {
      console.error('Local LLM Error:', err.message);
      throw err;
    }
  }


  // --- Mock Fallbacks ---
  generateMockPlan(story) {
    return {
      id: `TP-MOCK-${Date.now()}`,
      objective: `Validate ${story.summary} (MOCK MODE)`,
      entryCriteria: 'Build deployed.',
      riskAssessment: 'Low.',
      planContent: 'Test basic functionality.'
    };
  }

  generateMockCases() {
    return [
      { id: 'TC-1', title: 'Verify execution (MOCK)', priority: 'High', category: 'Functional', status: 'Ready' }
    ];
  }

  generateMockCode(framework, language, testCase) {
    return `// Mock Code for ${framework}\n// Case: ${testCase.title}`;
  }
}

export default new AIService();
