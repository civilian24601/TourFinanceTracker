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

            Provide a detailed financial analysis with the following structure:
            {
              "summary": "Brief overview of financial situation",
              "trends": ["Array of identified spending patterns"],
              "recommendations": ["Array of actionable suggestions"],
              "forecast": {
                "nextMonthExpense": number,
                "confidence": number between 0 and 1,
                "breakdown": [
                  {
                    "category": "Category name",
                    "amount": "Predicted amount as number",
                    "trend": "increasing/decreasing/stable"
                  }
                ]
              },
              "riskAnalysis": {
                "level": "low/medium/high",
                "factors": ["Array of risk factors"]
              },
              "seasonalPatterns": [
                {
                  "pattern": "Description of pattern",
                  "confidence": number between 0 and 1,
                  "months": ["Affected months"]
                }
              ],
              "budgetOptimization": {
                "suggestions": ["Array of cost-saving suggestions"],
                "potentialSavings": number
              }
            }`,
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

    // Ensure all required properties exist with safe defaults
    return {
      summary: result.summary || "Financial analysis unavailable",
      trends: Array.isArray(result.trends) ? result.trends : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
      forecast: {
        nextMonthExpense: typeof result.forecast?.nextMonthExpense === 'number' 
          ? Math.max(0, result.forecast.nextMonthExpense)
          : 0,
        confidence: typeof result.forecast?.confidence === 'number'
          ? Math.max(0, Math.min(1, result.forecast.confidence))
          : 0,
        breakdown: Array.isArray(result.forecast?.breakdown)
          ? result.forecast.breakdown.map((item: any) => ({
              category: item.category || 'other',
              amount: typeof item.amount === 'number' ? Math.max(0, item.amount) : 0,
              trend: item.trend || 'stable'
            }))
          : []
      },
      riskAnalysis: {
        level: result.riskAnalysis?.level || "low",
        factors: Array.isArray(result.riskAnalysis?.factors) 
          ? result.riskAnalysis.factors 
          : []
      },
      seasonalPatterns: Array.isArray(result.seasonalPatterns)
        ? result.seasonalPatterns.map((pattern: any) => ({
            pattern: pattern.pattern || '',
            confidence: typeof pattern.confidence === 'number'
              ? Math.max(0, Math.min(1, pattern.confidence))
              : 0,
            months: Array.isArray(pattern.months) ? pattern.months : []
          }))
        : [],
      budgetOptimization: {
        suggestions: Array.isArray(result.budgetOptimization?.suggestions)
          ? result.budgetOptimization.suggestions
          : [],
        potentialSavings: typeof result.budgetOptimization?.potentialSavings === 'number'
          ? Math.max(0, result.budgetOptimization.potentialSavings)
          : 0
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