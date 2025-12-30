# Cobalt - Quick Start Guide

Get up and running with Cobalt in 5 minutes!

## Step 1: Install Dependencies

```bash
cd /Users/joey/Desktop/Cobalt
npm install
```

This will install all required packages (may take 2-3 minutes).

## Step 2: Get Your Claude API Key

1. Visit https://console.anthropic.com
2. Sign in or create an account
3. Go to "API Keys"
4. Create a new key
5. Copy the key (starts with `sk-ant-...`)

## Step 3: Configure API Key

Create a file named `.env` in the Cobalt directory:

```bash
echo "CLAUDE_API_KEY=your_key_here" > .env
```

Replace `your_key_here` with your actual API key.

## Step 4: Launch Cobalt

```bash
npm run dev
```

The app will open automatically!

## First Steps in Cobalt

### 1. Explore Extensions
- Look at the extension toolbar at the top
- Hover over any icon to see what it does
- Right-click an extension to chat about it in a side window

### 2. Try the Chat
- Type a question like "Help me build a React component"
- Watch which extensions get suggested
- See the AI response with tool usage highlighted

### 3. Build in Canvas Mode
- Click "Canvas Builder" tab
- Add components from the sidebar
- Watch for green AI suggestions
- Click "Get AI Suggestions" for smart recommendations

### 4. Use the IDE
- Click "Dev Environment" tab
- Browse files in the explorer
- Edit code in the Monaco editor
- Run commands in the terminal

### 5. Enable Agent Mode
- Toggle "Agent Mode" in the top right
- Ask the AI to "Build a todo app"
- Watch it autonomously create files and code

## Tips

- **Keyboard Shortcuts**: Press `Cmd+K` to focus chat input
- **Extension Help**: Right-click any extension for dedicated help
- **AI Suggestions**: The more you build, the smarter the suggestions
- **Agent Mode**: Best for complex multi-step tasks

## Troubleshooting

**Can't find my API key?**
- Check the `.env` file exists
- Make sure the key starts with `sk-ant-`
- Try pasting it directly in app settings

**App won't start?**
- Run `npm install` again
- Check that port 5173 is not in use
- Look for errors in the terminal

**Extensions not working?**
- Click the extension icon to enable it
- Look for the green dot indicator
- Check console for errors

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Customize extensions in `src/data/extensions.ts`
3. Build something cool and share it!

## Support

- Right-click any extension for contextual help
- Check the README for detailed guides
- Review console logs for debugging

---

**You're all set! Start building with Cobalt!** 🚀
