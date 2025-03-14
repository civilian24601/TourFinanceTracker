import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CategoryPrediction {
  category: string;
  confidence: number;
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
