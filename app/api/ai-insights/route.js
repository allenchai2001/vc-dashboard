import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { metrics } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Mock response if no API key is provided
      return Response.json({
        alerts: ["Low margin on Social channel detected.", "High revenue concentrated in Gadget category."],
        opportunities: ["Expand Email marketing for Tool products.", "Bundle Gadgets with Widgets for AOV boost."],
        suggestions: ["A/B test Direct channel landing page.", "Optimize Gadget inventory for peak days."]
      });
    }

    const prompt = `
      You are a business consultant. Analyze these sales metrics:
      Total Revenue: $${metrics.revenue}
      Total Orders: ${metrics.orders}
      Total Profit: $${metrics.profit}
      AOV: $${metrics.aov}
      Top Product: ${metrics.topProduct}
      Top Channel: ${metrics.topChannel}
      
      Generate concise insights for a dashboard:
      1. Alerts (2-3 items)
      2. Opportunities (2-3 items)
      3. Suggestions (2-3 items)
      
      Return as JSON: { "alerts": [], "opportunities": [], "suggestions": [] }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return Response.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error('AI Insight Error:', error);
    return Response.json({ error: "Failed to generate AI insights" }, { status: 500 });
  }
}
