export default function SalesTable({ data }) {
  return (
    <div className="card !p-0">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold">Order Details</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Channel</th>
              <th className="px-6 py-4 text-right">Revenue</th>
              <th className="px-6 py-4 text-right">Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                <td className="px-6 py-4 font-medium text-blue-600">{row.order_id}</td>
                <td className="px-6 py-4">{row.product}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium">
                    {row.channel}
                  </span>
                </td>
                <td className="px-6 py-4 text-right tabular-nums font-semibold">
                  ${row.revenue?.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right tabular-nums text-green-600">
                  ${row.profit?.toLocaleString()}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No records found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
