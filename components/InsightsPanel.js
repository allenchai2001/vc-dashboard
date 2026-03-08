import { Lightbulb, Info, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { useState } from 'react';


export default function InsightsPanel({ data }) {
  if (data.length === 0) return null;

  // Calculate best product
  const productRevenue = data.reduce((acc, curr) => {
    acc[curr.product] = (acc[curr.product] || 0) + curr.revenue;
    return acc;
  }, {});
  const bestProduct = Object.entries(productRevenue).sort((a, b) => b[1] - a[1])[0];

  // Calculate best channel
  const channelRevenue = data.reduce((acc, curr) => {
    acc[curr.channel] = (acc[curr.channel] || 0) + curr.revenue;
    return acc;
  }, {});
  const bestChannel = Object.entries(channelRevenue).sort((a, b) => b[1] - a[1])[0];

  // Highest revenue day
  const dailyRevenue = data.reduce((acc, curr) => {
    acc[curr.date] = (acc[curr.date] || 0) + curr.revenue;
    return acc;
  }, {});
  const bestDay = Object.entries(dailyRevenue).sort((a, b) => b[1] - a[1])[0];

  // Highest profit margin channel (proxy for conversion rate)
  const channelProfit = data.reduce((acc, curr) => {
    if (!acc[curr.channel]) acc[curr.channel] = { revenue: 0, profit: 0 };
    acc[curr.channel].revenue += curr.revenue;
    acc[curr.channel].profit += curr.profit;
    return acc;
  }, {});
  const bestMarginChannel = Object.entries(channelProfit)
    .map(([name, stats]) => ({ name, margin: stats.profit / stats.revenue }))
    .sort((a, b) => b.margin - a.margin)[0];

  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const metrics = {
        revenue: data.reduce((acc, curr) => acc + curr.revenue, 0),
        profit: data.reduce((acc, curr) => acc + curr.profit, 0),
        orders: data.length,
        aov: (data.reduce((acc, curr) => acc + curr.revenue, 0) / data.length).toFixed(2),
        topProduct: bestProduct?.[0],
        topChannel: bestChannel?.[0]
      };

      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics })
      });
      const result = await response.json();
      setAiInsights(result);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const InsightCard = ({ title, value, detail, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
      <div className={`mt-1 p-2 rounded-lg bg-opacity-10 ${color}`}>
        <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{title}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{detail}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-bold">Insights</h2>
      </div>

      <div className="space-y-3">
        <InsightCard 
          title="Best Product" 
          value={bestProduct?.[0]} 
          detail={`Generated $${bestProduct?.[1].toLocaleString()} in revenue`}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <InsightCard 
          title="Top Channel" 
          value={bestChannel?.[0]} 
          detail={`Strongest performance through ${bestChannel?.[0]}`}
          icon={Info}
          color="bg-green-500"
        />
        <InsightCard 
          title="Peak Performance" 
          value={bestDay?.[0]} 
          detail={`Highest revenue day with $${bestDay?.[1].toLocaleString()}`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <InsightCard 
          title="Efficiency Leader" 
          value={bestMarginChannel?.[0]} 
          detail={`${(bestMarginChannel?.margin * 100).toFixed(1)}% profit margin achieved`}
          icon={AlertCircle}
          color="bg-orange-500"
        />
      </div>

      <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 mt-8">
        <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
          AI Strategy Engine
        </h3>
        {!aiInsights ? (
          <>
            <p className="text-xs text-blue-700 leading-relaxed mb-4">
              Receive personalized alerts, opportunities, and smart suggestions for your business.
            </p>
            <button 
              onClick={fetchAIInsights}
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Generate AI Insights'}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-red-600 uppercase mb-2">Alerts</p>
              <ul className="space-y-1">
                {aiInsights.alerts.map((a, i) => (
                  <li key={i} className="text-xs text-blue-900 flex gap-2">
                    <span className="shrink-0">•</span> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-600 uppercase mb-2">Opportunities</p>
              <ul className="space-y-1">
                {aiInsights.opportunities.map((o, i) => (
                  <li key={i} className="text-xs text-blue-900 flex gap-2">
                    <span className="shrink-0">•</span> {o}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase mb-2">Suggestions</p>
              <ul className="space-y-1">
                {aiInsights.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-blue-900 flex gap-2">
                    <span className="shrink-0">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => setAiInsights(null)}
              className="w-full py-2 text-blue-600 text-[10px] font-bold hover:underline"
            >
              Recalculate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
