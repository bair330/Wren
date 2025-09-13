# Wren Meditation Assistant

An AI-powered meditation assistant that combines voice interaction, intelligent session management, and progress tracking to create a personalized mindfulness experience.

## Features

- **Voice-First Interaction**: Natural conversation with Wren using Trae AI
- **Adaptive Guidance**: Personalized meditation sessions based on stress level and experience
- **Progress Tracking**: Streak monitoring, stress level trends, and session analytics
- **Multiple Meditation Types**: Breathing exercises, body scans, mindfulness, and loving-kindness
- **Privacy-Focused**: All data stored locally on your device
- **Session State Management**: Seamless pause/resume and interruption handling

## Project Structure

```
wren-meditation-assistant/
├─ prompts/                 # LLM system prompts, intents
│  ├─ wren-system.md       # Core AI personality and capabilities
│  └─ intents.yaml         # Voice command recognition patterns
├─ src/
│  ├─ agent/               # Voice + LLM integration (Trae)
│  ├─ ui/                  # React frontend components
│  ├─ orchestration/       # Session state machine
│  └─ metrics/             # Streak + stress tracking
├─ tests/                  # TestSprite MCP auto-generated tests
├─ spec/                   # Planning and architecture docs
│  ├─ session-state-chart.md
│  ├─ ui-actions-map.md
│  └─ metrics.md
├─ demo/
│  └─ script.md            # Demo presentation script
├─ mcp.json                # TestSprite MCP configuration
├─ README.md
└─ LICENSE
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with microphone access
- Trae AI SDK access

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wren-meditation-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Trae AI configuration
   ```

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Grant microphone permissions when prompted

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Generate new tests with TestSprite MCP
npm run test:generate
```

### Building for Production

```bash
npm run build
npm run start
```

## Usage

### Voice Commands

- "Start meditation" - Begin a new session
- "I'm stressed" - Quick stress assessment
- "Show my progress" - View meditation statistics
- "Pause" / "Resume" - Control active sessions
- "End session" - Complete current meditation

### Session Types

1. **Breathing Exercises**: Guided breath awareness
2. **Body Scan**: Progressive relaxation technique
3. **Mindfulness**: Present-moment awareness practice
4. **Loving-Kindness**: Compassion and goodwill meditation

## Architecture

### Core Components

- **Agent** (`src/agent/`): Trae AI integration for voice processing and response generation
- **UI** (`src/ui/`): React components for the meditation interface
- **Orchestration** (`src/orchestration/`): XState-based session flow management
- **Metrics** (`src/metrics/`): Local data persistence and analytics

### State Management

Wren uses a finite state machine to manage meditation sessions:
- **Idle**: Ready to start new session
- **PreSession**: Setting up meditation parameters
- **Active**: Currently meditating
- **Paused**: Session temporarily stopped
- **PostSession**: Collecting feedback and updating metrics

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

## Privacy & Data

- All meditation data is stored locally using browser storage
- Voice processing happens on-device when possible
- No personal information is sent to external servers without explicit consent
- Users can export or delete their data at any time

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or feature requests, please:
1. Check the [documentation](./spec/)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

## Acknowledgments

- Built with [Trae AI](https://trae.ai) for voice interaction
- Meditation guidance inspired by mindfulness best practices
- UI/UX designed for accessibility and ease of use