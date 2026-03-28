/**
 * Jira REST API Client
 *
 * Works with both the mock Jira server and real Jira Cloud.
 * Uses Node's built-in fetch API (Node 18+).
 *
 * USAGE:
 *   const JiraClient = require('./jira_client');
 *   const client = new JiraClient({ baseURL: 'http://localhost:3001', projectKey: 'STLC' });
 *   const ticket = await client.createIssue('Bug summary', 'Bug description', 'Bug', 'High');
 */

class JiraClient {
  /**
   * @param {Object} config
   * @param {string} config.baseURL - Jira base URL (e.g., http://localhost:3001 or https://company.atlassian.net)
   * @param {string} config.projectKey - Project key (e.g., 'STLC')
   * @param {string} [config.email] - Jira email (required for real Jira)
   * @param {string} [config.apiToken] - Jira API token (required for real Jira)
   */
  constructor(config) {
    this.baseURL = config.baseURL.replace(/\/$/, '');
    this.projectKey = config.projectKey;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add authentication for real Jira
    if (config.email && config.apiToken) {
      const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64');
      this.headers['Authorization'] = `Basic ${auth}`;
    }
  }

  /**
   * Create a new Jira issue
   * @param {string} summary - Issue title
   * @param {string} description - Issue description
   * @param {string} [type='Bug'] - Issue type
   * @param {string} [priority='Medium'] - Issue priority
   * @param {string[]} [labels=[]] - Issue labels
   * @returns {Promise<Object>} Created issue with id, key, self
   */
  async createIssue(summary, description, type = 'Bug', priority = 'Medium', labels = []) {
    const body = {
      fields: {
        project: { key: this.projectKey },
        summary,
        description,
        issuetype: { name: type },
        priority: { name: priority },
        labels,
      },
    };

    const response = await fetch(`${this.baseURL}/rest/api/3/issue`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create issue: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Get an issue by key
   * @param {string} issueKey - Issue key (e.g., 'STLC-1')
   * @returns {Promise<Object>} Issue details
   */
  async getIssue(issueKey) {
    const response = await fetch(`${this.baseURL}/rest/api/3/issue/${issueKey}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get issue: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  /**
   * Search issues
   * @param {number} [maxResults=50] - Maximum results to return
   * @returns {Promise<Object>} Search results with issues array
   */
  async searchIssues(maxResults = 50) {
    const url = `${this.baseURL}/rest/api/3/search/jql?jql=project=${this.projectKey}&maxResults=${maxResults}&fields=key,summary,description,priority,status,issuetype`;
    console.log(`🔍 Searching Jira issues at: ${url}`);
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jira API Error [${response.status}]: ${errorText}`);
      throw new Error(`Failed to search issues: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Check if the Jira server is reachable
   * @returns {Promise<boolean>}
   */
  async isHealthy() {
    try {
      // If it's the mock server on localhost (using port 3001 typically)
      if (this.baseURL.includes('localhost')) {
        const resp = await fetch(`${this.baseURL}/health`);
        return resp.ok;
      }
      
      // For real Jira Cloud
      const response = await fetch(`${this.baseURL}/rest/api/3/serverInfo`, {
        headers: this.headers,
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default JiraClient;
