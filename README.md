# 🎵 RoadBook - Tour Finance Manager

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3-blue)](https://tailwindcss.com/)

RoadBook is a comprehensive financial management platform designed specifically for touring musicians. It streamlines expense tracking, provides AI-powered insights, and helps optimize tour finances.

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Local Development Setup](#-local-development-setup)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [Development Workflow](#-development-workflow)
- [Roadmap](#-roadmap)

## ✨ Features

- 📱 Mobile-first responsive design
- 💰 Real-time expense tracking
- 🧠 AI-powered financial insights
- 📊 Interactive data visualization
- 🎯 Tour budget management
- 🔒 Secure authentication
- 📈 Trend analysis and forecasting
- 📅 Tour calendar and scheduling

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
  - Express.js
  - PostgreSQL
  - Drizzle ORM
  - Session-based auth

- **AI Integration**:
  - OpenAI GPT-4o API (latest model, released May 13, 2024)
  - Financial insights generation
  - Expense categorization

## 💻 Local Development Setup in Cursor

### Prerequisites

1. Node.js 20.x or later
2. PostgreSQL 15+
3. OpenAI API key
4. Cursor Editor

### Step-by-Step Setup

1. **Clone and Open in Cursor**
   ```bash
   git clone <repository-url>
   cd roadbook
   cursor .
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **PostgreSQL Setup**

   macOS (using Homebrew):
   ```bash
   # Install PostgreSQL
   brew install postgresql@15
   brew services start postgresql@15

   # Create database
   createdb roadbook_local
   ```

   Ubuntu/Debian:
   ```bash
   # Install PostgreSQL
   sudo apt update
   sudo apt install postgresql-15
   sudo systemctl start postgresql

   # Create database
   sudo -u postgres createdb roadbook_local
   ```

4. **Configure TypeScript (tsconfig.json)**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./client/src/*"],
         "@shared/*": ["./shared/*"]
       }
     }
   }
   ```

5. **Environment Setup**
   Create `.env` in project root:
   ```env
   # Database URL format:
   # macOS: postgresql://localhost:5432/roadbook_local
   # Linux: postgresql://postgres:postgres@localhost:5432/roadbook_local
   DATABASE_URL=your_database_url

   # OpenAI API key (required for AI insights)
   OPENAI_API_KEY=your_openai_key

   # Generate a random string (e.g., using `openssl rand -base64 32`)
   SESSION_SECRET=your_session_secret

   # Development settings
   NODE_ENV=development
   PORT=3000
   ```

6. **Database Schema Setup**
   ```bash
   # Push schema to database
   npm run db:push

   # Optional: Open Drizzle Studio for database management
   npm run db:studio
   ```

7. **Cursor Editor Setup**
   - Install Extensions:
     - TypeScript Language Server
     - ESLint
     - Prettier
     - Tailwind CSS IntelliSense

   - Configure Settings:
     ```json
     {
       "editor.formatOnSave": true,
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "typescript.tsdk": "node_modules/typescript/lib"
     }
     ```

8. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access the app at http://localhost:3000

### OpenAI Integration Setup

The project uses OpenAI's latest GPT-4o model (released May 13, 2024) for financial insights. Configure in `server/openai.ts`:

```typescript
// Key OpenAI integration features:
- Expense categorization
- Financial trend analysis
- Budget optimization suggestions
- Risk assessment
```

## 📁 Project Architecture

```
roadbook/
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # Reusable UI components
│   │   │   └── insights/ # AI insight components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript types
├── server/                # Backend code
│   ├── routes/           # API routes
│   ├── db.ts             # Database configuration
│   └── storage.ts        # Data access layer
├── shared/               # Shared code
│   └── schema.ts         # Database schema
```

### Key Configuration Files

- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies and scripts
- `tailwind.config.js`: Tailwind CSS configuration
- `theme.json`: UI theme configuration
- `drizzle.config.ts`: Database ORM configuration


## 🎯 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Follow component-based architecture
- Implement mobile-first design
- Use semantic commit messages

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test

# Watch mode
npm test -- --watch
```

### Common Issues & Solutions

1. **Database Connection**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **OpenAI Integration**
   - Verify API key in .env
   - Check API response format
   - Monitor rate limits

3. **TypeScript Errors**
   - Run `tsc --noEmit` for type checking
   - Check path aliases in tsconfig.json
   - Verify type definitions

## 📱 Mobile-First Development

- Test on mobile devices first
- Use responsive design patterns
- Implement touch-friendly interactions
- Optimize for various screen sizes

## 🔒 Security Considerations

- Implement rate limiting
- Use secure session management
- Validate all user inputs
- Follow OWASP guidelines
- Protect sensitive routes

## 📈 Performance Optimization

- Implement code splitting
- Optimize image loading
- Use proper caching strategies
- Monitor bundle size
- Implement lazy loading

For additional support or questions, please refer to the documentation or open an issue.

## 🗄️ Database Setup

### Database Models

```typescript
// shared/schema.ts

// Users
interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
}

// Tours
interface Tour {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  userId: number;
}

// Expenses
interface Expense {
  id: number;
  tourId: number;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

// Venues
interface Venue {
  id: number;
  tourId: number;
  name: string;
  address: string;
  date: Date;
}
```

### Database Management

- **Migrations**: Use Drizzle's push mechanism
- **Schema Updates**: All changes through Drizzle ORM
- **Data Seeding**: Available via `npm run db:seed`
- **Backup**: Automated daily backups recommended

## 📡 API Documentation

### Authentication Endpoints

```typescript
// POST /api/register
interface RegisterRequest {
  username: string;
  password: string;
}

// POST /api/login
interface LoginRequest {
  username: string;
  password: string;
}

// GET /api/user
// Returns current user or 401
```

### Tour Management

```typescript
// GET /api/tours
// Returns Tour[]

// POST /api/tours
interface CreateTourRequest {
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
}

// GET /api/tours/:id
// Returns Tour

// PATCH /api/tours/:id
interface UpdateTourRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}
```

### Expense Tracking

```typescript
// GET /api/expenses
// Optional query params: tourId, startDate, endDate
interface ExpenseFilters {
  tourId?: number;
  startDate?: string;
  endDate?: string;
}

// POST /api/expenses
interface CreateExpenseRequest {
  tourId: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}
```

### AI Insights

```typescript
// GET /api/insights
interface InsightResponse {
  summary: string;
  trends: string[];
  recommendations: string[];
  forecast: {
    nextMonthExpense: number;
    confidence: number;
    breakdown: {
      category: string;
      amount: number;
      trend: "increasing" | "decreasing" | "stable";
    }[];
  };
  riskAnalysis: {
    level: "low" | "medium" | "high";
    factors: string[];
  };
}
```

## 🔄 Development Workflow

1. **Branch Strategy**
   - `main`: Production-ready code
   - `develop`: Integration branch
   - Feature branches: `feature/feature-name`
   - Bug fixes: `fix/bug-description`

2. **Code Style**
   - ESLint configuration provided
   - Prettier for formatting
   - TypeScript strict mode enabled

3. **Testing**
   - Jest for unit tests
   - React Testing Library for components
   - Run tests: `npm test`

4. **Commit Guidelines**
   - Use conventional commits
   - Include ticket numbers if applicable
   - Run pre-commit hooks

5. **IDE Setup (Cursor)**
   - Enable TypeScript LSP
   - Install recommended extensions
   - Configure auto-formatting
   - Set up debug configurations

## 🚀 Roadmap

### Current Focus
- ✅ Core expense tracking
- ✅ Tour management
- ✅ Basic insights
- ✅ Mobile optimization

### Upcoming Features
- 🎯 Advanced AI insights and forecasting
- 📊 Export functionality for accounting
- 📱 Interactive expense trend visualization
- 🔔 Push notifications
- 📱 Native mobile app
- 🤝 Multi-user collaboration
- 📈 Advanced analytics dashboard
- 🔄 Integration with accounting software

## 🤝 Contributing

We welcome contributions! Please check out our contributing guidelines for detailed information.

## 📝 License

This project is MIT licensed.