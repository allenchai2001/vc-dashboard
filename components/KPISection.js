import { DollarSign, ShoppingCart, TrendingUp, BarChart3 } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

export default function KPISection({ data }) {
  const totals = data.reduce((acc, curr) => {
    acc.revenue += curr.revenue || 0;
    acc.profit += curr.profit || 0;
    acc.orders += (curr.orders || 1);
    return acc;
  }, { revenue: 0, profit: 0, orders: 0 });

  const aov = totals.orders > 0 ? (totals.revenue / totals.orders).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard 
        title="Total Revenue" 
        value={`$${totals.revenue.toLocaleString()}`} 
        icon={DollarSign} 
        color="bg-blue-500 text-blue-600"
      />
      <KPICard 
        title="Orders" 
        value={totals.orders} 
        icon={ShoppingCart} 
        color="bg-green-500 text-green-600"
      />
      <KPICard 
        title="Total Profit" 
        value={`$${totals.profit.toLocaleString()}`} 
        icon={TrendingUp} 
        color="bg-purple-500 text-purple-600"
      />
      <KPICard 
        title="AOV" 
        value={`$${aov}`} 
        icon={BarChart3} 
        color="bg-orange-500 text-orange-600"
      />
    </div>
  );
}
