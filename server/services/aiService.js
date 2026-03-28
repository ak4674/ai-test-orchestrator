import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'MISSING_KEY',
});

class AIService {
  /**
   * Generates a structural test plan from a user story
   */
  async generateTestPlan(story) {
    if (!process.env.ANTHROPIC_API_KEY) {
      return this.generateMockPlan(story);
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [{ role: "user", content: `You are a Senior QA Architect. Create a structured test plan for this Jira story:
          Key: ${story.key}
          Summary: ${story.summary}
          Description: ${story.description}
          
          Return JSON with keys: objective, entryCriteria, riskAssessment, planContent.` 
        }],
      });
      return JSON.parse(response.content[0].text);
    } catch (err) {
      console.error('AI Plan Error:', err);
      return this.generateMockPlan(story);
    }
  }

  /**
   * Generates a set of test cases for a story
   */
  async generateTestCases(story) {
    if (!process.env.ANTHROPIC_API_KEY) {
       return this.generateMockCases();
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 2048,
        messages: [{ role: "user", content: `You are a QA Engineer. Generate 4-6 test cases for the story: ${story.summary}. 
          Include Happy Path, Negative, and Edge Cases.
          Return a JSON array of objects with keys: id, title, priority (Critical|High|Medium|Low), category (Functional|Negative|Security|Edge Case), status ('Ready').` 
        }],
      });
      return JSON.parse(response.content[0].text);
    } catch (err) {
      console.error('AI Case Error:', err);
      return this.generateMockCases();
    }
  }

  /**
   * Generates automation code for a specific test case
   */
  async generateCode(framework, language, testCase) {
    if (!process.env.ANTHROPIC_API_KEY) {
      return this.generateMockCode(framework, language, testCase);
    }

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 2048,
        messages: [{ role: "user", content: `Generate ${framework} automation code in ${language} for this test case:
          Title: ${testCase.title}
          Category: ${testCase.category}
          Priority: ${testCase.priority}
          
          Use best practices (POM if applicable). Only return the code block.`
        }],
      });
      return response.content[0].text;
    } catch (err) {
      return this.generateMockCode(framework, language, testCase);
    }
  }

  // --- Mock Fallbacks (used if no API Key) ---

  generateMockPlan(story) {
    return {
      id: `TP-MOCK-${Date.now()}`,
      objective: `Validate ${story.summary} functionality against requirements.`,
      entryCriteria: 'Build deployed to QA environment. Test data initialized.',
      riskAssessment: 'High risk of API lag impacting UI stability.',
      planContent: 'Initial focus on positive functional flows and error boundary checks.'
    };
  }

  generateMockCases() {
    return [
      { id: 'TC-1', title: 'Verify successful execution', priority: 'High', category: 'Functional', status: 'Ready' },
      { id: 'TC-2', title: 'Handle empty payload error', priority: 'Medium', category: 'Negative', status: 'Ready' }
    ];
  }

  generateMockCode(framework, language, testCase) {
    return `// [Mock Code] ${framework} ${language}\n// Case: ${testCase.title}\n\n// Add ANTHROPIC_API_KEY to .env for real AI code generation.`;
  }
}

export default new AIService();
