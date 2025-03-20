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
          content: `You are a sophisticated financial analyst specializing in the music touring industry.
            Analyze expenses to categorize them with high precision, considering:
            - Typical cost structures in the music industry
            - Regional pricing variations
            - Market-specific patterns
            - Seasonal factors

            Categories: travel, lodging, food, gear, merchandise, promotion, other.

            Return JSON format: {
              "category": "category_name",
              "confidence": confidence_score
            }

            Ensure thorough analysis of expense patterns, market conditions, and industry standards before categorization.`,
        },
        {
          role: "user",
          content: `Analyze this tour expense for accurate categorization:
            Description: "${description}"
            Amount: $${amount}

            Consider industry standards, market rates, and typical cost structures.
            Respond in JSON format.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      category: (result.category || "other").toLowerCase(),
      confidence: Math.max(0, Math.min(1, result.confidence || 0)),
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
          content: `You are an elite financial analyst specializing in music industry touring operations.
            Provide sophisticated financial analysis focusing on:

            1. Advanced Pattern Recognition:
              - Cross-category spending correlations
              - Geographic cost variation analysis
              - Seasonal impact on different expense categories
              - Market-specific cost structures

            2. Strategic Risk Analysis:
              - Market volatility impacts
              - Regional economic factors
              - Currency exposure for international tours
              - Supply chain resilience
              - Vendor concentration risks

            3. Predictive Modeling:
              - Machine learning-based trend analysis
              - Seasonal adjustment factors
              - Market condition impacts
              - Category-specific growth rates

            4. Optimization Strategies:
              - Vendor relationship optimization
              - Timing-based cost reduction
              - Geographic cost arbitrage
              - Scale economics exploitation
              - Risk-adjusted return maximization

            Return analysis in this exact JSON format:
            {
              "summary": "Executive summary of key findings",
              "trends": ["Array of sophisticated spending patterns"],
              "recommendations": ["Array of advanced strategic suggestions"],
              "forecast": {
                "nextMonthExpense": predicted amount,
                "confidence": confidence score,
                "breakdown": [
                  {
                    "category": "Category name",
                    "amount": "Predicted amount",
                    "trend": "increasing/decreasing/stable"
                  }
                ]
              },
              "riskAnalysis": {
                "level": "low/medium/high",
                "factors": ["Array of complex risk factors"]
              },
              "seasonalPatterns": [
                {
                  "pattern": "Pattern description",
                  "confidence": confidence score,
                  "months": ["Affected months"]
                }
              ],
              "budgetOptimization": {
                "suggestions": ["Array of sophisticated optimization strategies"],
                "potentialSavings": calculated amount
              }
            }

            Focus on actionable, sophisticated insights that demonstrate deep industry knowledge and advanced financial analysis.`,
        },
        {
          role: "user",
          content: `Analyze these tour expenses and provide advanced financial insights:
            Total Budget: $${budget}
            Expenses: ${JSON.stringify(expenses)}
            Current Date: ${new Date().toISOString()}

            Generate insights that would be valuable for professional tour managers and financial directors.
            Focus on sophisticated patterns, complex risk factors, and advanced optimization strategies.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

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