export default function Filters({ filters, setFilters, products, channels }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'start' || name === 'end') {
      setFilters(prev => ({
        ...prev,
        dateRange: { ...prev.dateRange, [name]: value }
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const selectClass = "bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dates</label>
        <input 
          type="date" 
          name="start" 
          value={filters.dateRange.start} 
          onChange={handleChange} 
          className={selectClass}
        />
        <span className="text-slate-400">to</span>
        <input 
          type="date" 
          name="end" 
          value={filters.dateRange.end} 
          onChange={handleChange} 
          className={selectClass}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product</label>
        <select 
          name="product" 
          value={filters.product} 
          onChange={handleChange} 
          className={selectClass}
        >
          {products.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Channel</label>
        <select 
          name="channel" 
          value={filters.channel} 
          onChange={handleChange} 
          className={selectClass}
        >
          {channels.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}
