import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = (modelName = "gemini-2.5-flash") => {
  if (!process.env.GEMINI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });
};

export async function POST(req) {
  try {
    const { metrics, model: requestedModel } = await req.json();
    const model = getGeminiClient(requestedModel);

    if (!model) {
      return Response.json({
        alerts: ["Key missing: Set GEMINI_API_KEY in .env.local", "Data visibility restricted to local mocks."],
        opportunities: ["Connect Gemini API for real-time strategy."],
        suggestions: ["Configure your .env.local file."]
      });
    }

    const prompt = `
      You are a strategic business consultant. Analyze these sales metrics:
      Total Revenue: $${metrics.revenue}
      Total Orders: ${metrics.orders}
      Total Profit: $${metrics.profit}
      AOV: $${metrics.aov}
      Top Product: ${metrics.topProduct}
      Top Channel: ${metrics.topChannel}
      
      Generate concise insights for a business executive dashboard:
      1. Alerts (Risks or drop-offs)
      2. Opportunities (Growth or upselling)
      3. Suggestions (Actionable next steps)
      
      Return as a clean JSON object:
      { "alerts": ["string"], "opportunities": ["string"], "suggestions": ["string"] }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    
    return Response.json({
      alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
      opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
    });
  } catch (error) {
    console.error('Gemini Insight Error:', error);
    
    // Check if it's a rate limit error (common in free tier)
    if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
      return Response.json({ 
        alerts: ["Free tier rate limit reached. Please wait a minute."],
        opportunities: [],
        suggestions: ["Try switching to 'Gemini 2.5 Flash' for higher limits."]
      }, { status: 429 });
    }

    return Response.json({ 
      alerts: ["AI service is temporarily unavailable."],
      opportunities: [],
      suggestions: ["Check your API key or try again later."]
    }, { status: 500 });
  }
}

