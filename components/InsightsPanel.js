import { Lightbulb, Info, AlertCircle, TrendingUp, Loader2, Award, Zap, Calendar, Target } from 'lucide-react';
import { useState } from 'react';

export default function InsightsPanel({ data }) {
  if (data.length === 0) return null;

  // 1. Best Product
  const productRevenue = data.reduce((acc, curr) => {
    acc[curr.product] = (acc[curr.product] || 0) + curr.revenue;
    return acc;
  }, {});
  const bestProduct = Object.entries(productRevenue).sort((a, b) => b[1] - a[1])[0];

  // 2. Best Channel
  const channelRevenue = data.reduce((acc, curr) => {
    acc[curr.channel] = (acc[curr.channel] || 0) + curr.revenue;
    return acc;
  }, {});
  const bestChannel = Object.entries(channelRevenue).sort((a, b) => b[1] - a[1])[0];

  // 3. Highest Revenue Day
  const dailyRevenue = data.reduce((acc, curr) => {
    acc[curr.date] = (acc[curr.date] || 0) + curr.revenue;
    return acc;
  }, {});
  const bestDay = Object.entries(dailyRevenue).sort((a, b) => b[1] - a[1])[0];

  // 4. Highest Conversion Rate Channel (using profit margin as proxy)
  const channelProfit = data.reduce((acc, curr) => {
    if (!acc[curr.channel]) acc[curr.channel] = { revenue: 0, profit: 0 };
    acc[curr.channel].revenue += curr.revenue;
    acc[curr.channel].profit += curr.profit;
    return acc;
  }, {});
  const bestConvChannel = Object.entries(channelProfit)
    .map(([name, stats]) => ({ name, rate: stats.profit / stats.revenue }))
    .sort((a, b) => b.rate - a.rate)[0];

  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const totals = data.reduce((acc, curr) => {
        acc.revenue += curr.revenue || 0;
        acc.profit += curr.profit || 0;
        acc.orders += (curr.orders || 1);
        return acc;
      }, { revenue: 0, profit: 0, orders: 0 });

      const metrics = {
        revenue: totals.revenue,
        profit: totals.profit,
        orders: totals.orders,
        aov: (totals.revenue / totals.orders).toFixed(2),
        topProduct: bestProduct?.[0],
        topChannel: bestChannel?.[0]
      };

      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, model: selectedModel })
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
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3 transition-all hover:shadow-md">
      <div className={`mt-1 p-2 rounded-lg bg-opacity-10 ${color}`}>
        <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-base font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-[11px] text-slate-500 mt-1">{detail}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-extrabold tracking-tight">Business Insights</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <InsightCard 
          title="Best Product" 
          value={bestProduct?.[0]} 
          detail={`Your lead performer with $${bestProduct?.[1].toLocaleString()} revenue.`}
          icon={Award}
          color="bg-blue-500"
        />
        <InsightCard 
          title="Best Channel" 
          value={bestChannel?.[0]} 
          detail={`Highest volume of sales coming through ${bestChannel?.[0]}.`}
          icon={Zap}
          color="bg-purple-500"
        />
        <InsightCard 
          title="Highest Revenue Day" 
          value={bestDay?.[0]} 
          detail={`Peak sales reached $${bestDay?.[1].toLocaleString()} on this day.`}
          icon={Calendar}
          color="bg-emerald-500"
        />
        <InsightCard 
          title="Top Efficiency" 
          value={bestConvChannel?.[0]} 
          detail={`${(bestConvChannel?.rate * 100).toFixed(1)}% profit efficiency achieved here.`}
          icon={Target}
          color="bg-orange-500"
        />
      </div>

      <div className="p-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Zap className="h-12 w-12 text-indigo-600" />
        </div>
        
        <h3 className="text-sm font-black text-indigo-900 mb-4 flex items-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-indigo-500" />}
          AI STRATEGY ENGINE
        </h3>

        {!aiInsights ? (
          <div className="space-y-4">
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              Get deep strategic analysis using Google's latest Gemini models.
            </p>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Select Model (Free Tier Friendly)</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-white border border-indigo-100 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Newest Stable)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Adaptive Thinking)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Core Capability)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Classic Intelligence)</option>
              </select>
            </div>


            <button 
              onClick={fetchAIInsights}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? 'Consulting Gemini...' : 'Generate AI Strategy'}
            </button>
            
            <p className="text-[9px] text-indigo-300 text-center italic mt-2">
              Note: Ensure <b>GEMINI_API_KEY</b> is set in your <b>.env.local</b> file.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-rose-500 uppercase mb-2 tracking-widest">⚠️ Alerts</p>
              <ul className="space-y-1.5">
                {aiInsights?.alerts?.map((a, i) => (
                  <li key={i} className="text-xs text-indigo-900 flex gap-2 font-medium">
                    <span className="shrink-0 text-rose-400">•</span> {a}
                  </li>
                ))}
                {(!aiInsights?.alerts || aiInsights.alerts.length === 0) && (
                  <li className="text-xs text-slate-400 italic">No alerts found.</li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase mb-2 tracking-widest">🚀 Opportunities</p>
              <ul className="space-y-1.5">
                {aiInsights?.opportunities?.map((o, i) => (
                  <li key={i} className="text-xs text-indigo-900 flex gap-2 font-medium">
                    <span className="shrink-0 text-emerald-400">•</span> {o}
                  </li>
                ))}
                {(!aiInsights?.opportunities || aiInsights.opportunities.length === 0) && (
                  <li className="text-xs text-slate-400 italic">No opportunities identified.</li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase mb-2 tracking-widest">💡 Suggestions</p>
              <ul className="space-y-1.5">
                {aiInsights?.suggestions?.map((s, i) => (
                  <li key={i} className="text-xs text-indigo-900 flex gap-2 font-medium">
                    <span className="shrink-0 text-indigo-400">•</span> {s}
                  </li>
                ))}
                {(!aiInsights?.suggestions || aiInsights.suggestions.length === 0) && (
                  <li className="text-xs text-slate-400 italic">No suggestions available.</li>
                )}
              </ul>
            </div>
            <button 
              onClick={() => setAiInsights(null)}
              className="w-full py-2 text-indigo-500 text-[10px] font-black hover:underline tracking-widest"
            >
              REFRESH ANALYSIS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
