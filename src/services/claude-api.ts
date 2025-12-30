import Anthropic from '@anthropic-ai/sdk';
import { Message } from '../store/useStore';

interface SendMessageOptions {
  agentMode: boolean;
  availableTools: string[];
  conversationHistory: Message[];
}

interface SendMessageResponse {
  content: string;
  toolsUsed?: string[];
}

// Initialize Anthropic client
let anthropic: Anthropic | null = null;

export function initializeClaudeAPI(apiKey: string) {
  anthropic = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // For Electron app
  });
}

export async function sendMessage(
  userMessage: string,
  options: SendMessageOptions
): Promise<SendMessageResponse> {
  if (!anthropic) {
    // Try to get API key from environment or localStorage
    const apiKey = localStorage.getItem('claude_api_key') || process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API key not configured. Please set your API key in settings.');
    }
    initializeClaudeAPI(apiKey);
  }

  try {
    // Convert conversation history to Anthropic format
    const messages = [
      ...options.conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: userMessage,
      },
    ];

    // Build system prompt with available tools
    const systemPrompt = options.agentMode
      ? `You are Cobalt, an advanced AI development assistant with autonomous capabilities.
You have access to the following tools: ${options.availableTools.join(', ')}.

In Agent Mode, you can:
- Autonomously execute multi-step tasks
- Make decisions about which tools to use
- Build and modify code
- Interact with the file system, terminal, and other services

Be proactive and help the user achieve their goals efficiently.`
      : `You are Cobalt, an advanced AI development assistant.
You have access to the following tools: ${options.availableTools.join(', ')}.

Help the user with their development tasks, answering questions and providing guidance.`;

    const response = await anthropic!.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.filter(m => m.content.trim() !== ''),
    });

    const content = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Extract tools that might have been mentioned (simplified)
    const toolsUsed: string[] = [];
    options.availableTools.forEach(tool => {
      if (content.toLowerCase().includes(tool.toLowerCase())) {
        toolsUsed.push(tool);
      }
    });

    return {
      content,
      toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
    };
  } catch (error: any) {
    console.error('Claude API Error:', error);
    throw new Error(error.message || 'Failed to communicate with Claude API');
  }
}

export async function analyzeCanvasForSuggestions(
  elements: any[],
  context: string
): Promise<string[]> {
  if (!anthropic) {
    return [];
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze this UI design and provide 2-3 actionable suggestions for improvement:

Elements: ${JSON.stringify(elements, null, 2)}
Context: ${context}

Provide concise, specific suggestions that would improve UX, accessibility, or functionality.`,
      }],
    });

    const content = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Parse suggestions (simplified - split by newlines)
    return content
      .split('\n')
      .filter(line => line.trim().length > 0 && line.match(/^\d+\.|^-|^•/))
      .map(line => line.replace(/^\d+\.|^-|^•/, '').trim())
      .slice(0, 3);
  } catch (error) {
    console.error('Error analyzing canvas:', error);
    return [];
  }
}
