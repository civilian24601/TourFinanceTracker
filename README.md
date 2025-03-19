# 🎵 RoadBook - Tour Finance Management

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue)](https://tailwindcss.com/)

RoadBook is a comprehensive financial management platform designed specifically for touring musicians. It streamlines expense tracking, provides AI-powered insights, and helps optimize tour finances.

## ✨ Features

### 💰 Financial Management
- Real-time expense tracking and categorization
- Tour-specific budgeting tools
- Multi-currency support
- Receipt scanning and digital storage

### 📊 Analytics & Insights
- AI-powered financial analysis
- Predictive budget forecasting
- Venue performance metrics
- Revenue trend analysis

### 🎸 Tour Management
- Tour calendar integration
- Venue expense tracking
- Equipment inventory management
- Budget health monitoring

### 📱 Mobile-First Design
- Responsive interface
- Touch-optimized interactions
- Offline capability
- Real-time synchronization

## 🛠️ Tech Stack

- **Frontend**: 
  - React.js + TypeScript
  - Tailwind CSS + ShadcnUI
  - TanStack Query v5
  - Framer Motion animations
  - Wouter for routing

- **State Management**:
  - TanStack Query for server state
  - React Context for local state
  - Zod for schema validation

- **Backend**: 
  - Next.js
  - Express.js
  - PostgreSQL on Neon
  - Drizzle ORM

- **Authentication**: 
  - OAuth (Google & GitHub)
  - Session-based auth
  - Secure password hashing

- **AI Integration**:
  - OpenAI GPT-4 API
  - Financial insights generation
  - Expense categorization

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15.x
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/roadbook.git
cd roadbook
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

## 📖 Usage Guide

### Setting Up Your First Tour
1. Navigate to the Tours section
2. Click "New Tour" to create a tour profile
3. Add expected expenses and budget allocations
4. Set up venue details and dates

### Managing Expenses
1. Use the "+" button to quickly add expenses
2. Categorize expenses for better tracking
3. Attach receipts for record-keeping
4. View expense analytics in the Insights section

### Using AI Insights
1. Visit the Insights page
2. Review AI-generated financial recommendations
3. Explore trend analysis
4. Access predictive budgeting tools

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ShadcnUI](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [OpenAI](https://openai.com/) for AI-powered insights
- [Neon](https://neon.tech/) for serverless PostgreSQL

## 🔒 Security

Please report any security issues to security@roadbook.app

## 📫 Contact

Have questions? Email us at support@roadbook.app