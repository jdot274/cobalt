import { Extension } from '../store/useStore';

export const BUILT_IN_EXTENSIONS: Extension[] = [
  {
    id: 'filesystem',
    name: 'File System',
    description: 'Read, write, and manage files and directories',
    icon: '📁',
    category: 'filesystem',
    enabled: true,
    capabilities: [
      'Read files',
      'Write files',
      'Create directories',
      'List directory contents',
      'Delete files and folders',
      'Move and rename files'
    ],
    useCases: [
      'Reading configuration files',
      'Saving generated code',
      'Managing project structure',
      'File organization'
    ]
  },
  {
    id: 'chrome-control',
    name: 'Browser Control',
    description: 'Control Chrome browser, navigate pages, and interact with web content',
    icon: '🌐',
    category: 'browser',
    enabled: false,
    capabilities: [
      'Navigate to URLs',
      'Click elements',
      'Fill forms',
      'Take screenshots',
      'Extract data from pages',
      'Execute JavaScript'
    ],
    useCases: [
      'Web scraping',
      'Automated testing',
      'Form filling',
      'Data extraction',
      'Website monitoring'
    ]
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Execute shell commands and manage processes',
    icon: '⌨️',
    category: 'custom',
    enabled: true,
    capabilities: [
      'Run shell commands',
      'Manage processes',
      'Environment variables',
      'Process output streaming',
      'Working directory control'
    ],
    useCases: [
      'Running build scripts',
      'Git operations',
      'Package management',
      'Server management',
      'Task automation'
    ]
  },
  {
    id: 'ms-excel',
    name: 'Excel Integration',
    description: 'Read and write Excel spreadsheets',
    icon: '📊',
    category: 'office',
    enabled: false,
    capabilities: [
      'Read spreadsheet data',
      'Write to cells',
      'Create charts',
      'Apply formulas',
      'Format cells',
      'Manage worksheets'
    ],
    useCases: [
      'Data analysis',
      'Report generation',
      'Financial calculations',
      'Data import/export',
      'Automated reporting'
    ]
  },
  {
    id: 'ms-powerpoint',
    name: 'PowerPoint Integration',
    description: 'Create and modify PowerPoint presentations',
    icon: '📽️',
    category: 'office',
    enabled: false,
    capabilities: [
      'Create slides',
      'Add text and images',
      'Apply themes',
      'Insert charts',
      'Add animations',
      'Export presentations'
    ],
    useCases: [
      'Presentation generation',
      'Report slides',
      'Automated deck creation',
      'Template application',
      'Batch processing'
    ]
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Connect to and query databases (SQL, NoSQL)',
    icon: '🗄️',
    category: 'custom',
    enabled: false,
    capabilities: [
      'SQL queries',
      'NoSQL operations',
      'Schema management',
      'Data migration',
      'Connection pooling',
      'Transaction support'
    ],
    useCases: [
      'Data querying',
      'Database migrations',
      'Data analytics',
      'Backup and restore',
      'Schema design'
    ]
  },
  {
    id: 'api-client',
    name: 'API Client',
    description: 'Make HTTP requests and interact with REST APIs',
    icon: '🔌',
    category: 'custom',
    enabled: true,
    capabilities: [
      'HTTP requests (GET, POST, etc.)',
      'Authentication (OAuth, API keys)',
      'Request/response logging',
      'Custom headers',
      'File uploads',
      'WebSocket support'
    ],
    useCases: [
      'API testing',
      'Data fetching',
      'Third-party integrations',
      'Webhook handling',
      'Service communication'
    ]
  },
  {
    id: 'git',
    name: 'Git Integration',
    description: 'Version control operations and repository management',
    icon: '📦',
    category: 'custom',
    enabled: true,
    capabilities: [
      'Commit changes',
      'Create branches',
      'Merge and rebase',
      'Push and pull',
      'View history',
      'Manage remotes'
    ],
    useCases: [
      'Version control',
      'Code collaboration',
      'Change tracking',
      'Branch management',
      'Release management'
    ]
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Manage Docker containers and images',
    icon: '🐳',
    category: 'custom',
    enabled: false,
    capabilities: [
      'Build images',
      'Run containers',
      'Manage volumes',
      'Network configuration',
      'Compose orchestration',
      'Container logs'
    ],
    useCases: [
      'Container deployment',
      'Development environments',
      'Service orchestration',
      'CI/CD pipelines',
      'Microservices management'
    ]
  },
  {
    id: 'code-editor',
    name: 'Code Editor',
    description: 'Built-in Monaco code editor with syntax highlighting',
    icon: '💻',
    category: 'custom',
    enabled: true,
    capabilities: [
      'Syntax highlighting',
      'Code completion',
      'Multi-language support',
      'Find and replace',
      'Code formatting',
      'Linting integration'
    ],
    useCases: [
      'Code editing',
      'Quick fixes',
      'Code review',
      'Configuration editing',
      'Script writing'
    ]
  },
  {
    id: 'mcp-server',
    name: 'MCP Servers',
    description: 'Model Context Protocol server integration',
    icon: '🔧',
    category: 'mcp',
    enabled: true,
    capabilities: [
      'Custom tool integration',
      'Server management',
      'Protocol compliance',
      'Dynamic loading',
      'Context sharing',
      'Multi-server support'
    ],
    useCases: [
      'Custom integrations',
      'Third-party tools',
      'Extended capabilities',
      'Specialized workflows',
      'Enterprise integrations'
    ]
  },
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'Generate images with AI models',
    icon: '🎨',
    category: 'custom',
    enabled: false,
    capabilities: [
      'Text-to-image',
      'Image editing',
      'Style transfer',
      'Upscaling',
      'Background removal',
      'Multiple models'
    ],
    useCases: [
      'Asset creation',
      'Prototyping',
      'Mockup generation',
      'Icon design',
      'Illustration'
    ]
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Manage calendar events and schedules',
    icon: '📅',
    category: 'custom',
    enabled: false,
    capabilities: [
      'Create events',
      'Schedule meetings',
      'Set reminders',
      'View availability',
      'Sync calendars',
      'Recurring events'
    ],
    useCases: [
      'Meeting scheduling',
      'Task planning',
      'Deadline tracking',
      'Team coordination',
      'Time management'
    ]
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send and manage emails',
    icon: '✉️',
    category: 'custom',
    enabled: false,
    capabilities: [
      'Send emails',
      'Read inbox',
      'Attachments',
      'HTML formatting',
      'Templates',
      'SMTP/IMAP support'
    ],
    useCases: [
      'Email automation',
      'Notifications',
      'Report distribution',
      'Communication workflows',
      'Newsletter sending'
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Integrate with Notion workspace',
    icon: '📓',
    category: 'custom',
    enabled: false,
    capabilities: [
      'Create pages',
      'Update databases',
      'Query content',
      'Manage blocks',
      'Add comments',
      'Share pages'
    ],
    useCases: [
      'Documentation',
      'Knowledge management',
      'Project tracking',
      'Team wiki',
      'Note-taking automation'
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages and interact with Slack',
    icon: '💬',
    category: 'custom',
    enabled: false,
    capabilities: [
      'Send messages',
      'Create channels',
      'Manage users',
      'File uploads',
      'Reactions',
      'Thread replies'
    ],
    useCases: [
      'Team notifications',
      'Bot integration',
      'Automated updates',
      'Alert systems',
      'Workflow automation'
    ]
  }
];
