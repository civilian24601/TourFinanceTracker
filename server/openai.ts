import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CategoryPrediction {
  category: string;
  confidence: number;
}

interface FinancialInsight {
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
  seasonalPatterns: {
    pattern: string;
    confidence: number;
    months: string[];
  }[];
  budgetOptimization: {
    suggestions: string[];
    potentialSavings: number;
  };
}

export async function predictExpenseCategory(
  description: string,
  amount: number
): Promise<CategoryPrediction> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expense categorization expert for touring musicians. 
            Categorize expenses into: travel, lodging, food, gear, merchandise, promotion, other.
            Respond with a JSON object containing the predicted category and confidence score (0-1).`,
        },
        {
          role: "user",
          content: `Expense description: "${description}", Amount: $${amount}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      category: result.category.toLowerCase(),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      category: "other",
      confidence: 0,
    };
  }
}

export async function generateFinancialInsights(
  expenses: Array<{ amount: number; category: string; date: string }>,
  budget: number
): Promise<FinancialInsight> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a financial analyst specializing in tour finance management.
            Analyze expense patterns and provide advanced insights for touring musicians.
            Focus on practical, actionable advice for budget management.
            Consider seasonal patterns, industry trends, and risk factors.
            Respond with a detailed JSON object containing:
            - summary: A brief overview of the financial situation
            - trends: Array of identified spending patterns
            - recommendations: Array of actionable suggestions
            - forecast: Object with detailed expense predictions and category breakdown
            - riskAnalysis: Assessment of financial risks
            - seasonalPatterns: Identified seasonal spending patterns
            - budgetOptimization: Specific suggestions for cost reduction`,
        },
        {
          role: "user",
          content: `Analyze these tour expenses:
            Total Budget: $${budget}
            Expenses: ${JSON.stringify(expenses)}
            Current Date: ${new Date().toISOString()}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      summary: result.summary,
      trends: result.trends,
      recommendations: result.recommendations,
      forecast: {
        nextMonthExpense: Math.max(0, Number(result.forecast.nextMonthExpense)),
        confidence: Math.max(0, Math.min(1, result.forecast.confidence)),
        breakdown: result.forecast.breakdown.map((item: any) => ({
          category: item.category,
          amount: Math.max(0, Number(item.amount)),
          trend: item.trend
        }))
      },
      riskAnalysis: {
        level: result.riskAnalysis.level,
        factors: result.riskAnalysis.factors
      },
      seasonalPatterns: result.seasonalPatterns.map((pattern: any) => ({
        pattern: pattern.pattern,
        confidence: Math.max(0, Math.min(1, pattern.confidence)),
        months: pattern.months
      })),
      budgetOptimization: {
        suggestions: result.budgetOptimization.suggestions,
        potentialSavings: Math.max(0, Number(result.budgetOptimization.potentialSavings))
      }
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      summary: "Unable to generate insights at this time.",
      trends: [],
      recommendations: [],
      forecast: {
        nextMonthExpense: 0,
        confidence: 0,
        breakdown: []
      },
      riskAnalysis: {
        level: "low",
        factors: []
      },
      seasonalPatterns: [],
      budgetOptimization: {
        suggestions: [],
        potentialSavings: 0
      }
    };
  }
}