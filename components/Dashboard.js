"use client";

import { useState, useEffect, useMemo } from 'react';
import KPISection from './KPISection';
import SalesTable from './SalesTable';
import ChartsSection from './ChartsSection';
import Filters from './Filters';
import InsightsPanel from './InsightsPanel';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    product: 'All',
    channel: 'All'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sales');
        const jsonData = await response.json();
        setData(jsonData.filter(row => row.date));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchProduct = filters.product === 'All' || row.product === filters.product;
      const matchChannel = filters.channel === 'All' || row.channel === filters.channel;
      
      let matchDate = true;
      if (filters.dateRange.start) {
        matchDate = matchDate && new Date(row.date) >= new Date(filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        matchDate = matchDate && new Date(row.date) <= new Date(filters.dateRange.end);
      }

      return matchProduct && matchChannel && matchDate;
    });
  }, [data, filters]);

  const products = useMemo(() => ['All', ...new Set(data.map(item => item.product))], [data]);
  const channels = useMemo(() => ['All', ...new Set(data.map(item => item.channel))], [data]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-slate-500">Monitor your business performance at a glance.</p>
        </div>
        <Filters 
          filters={filters} 
          setFilters={setFilters} 
          products={products} 
          channels={channels} 
        />
      </header>

      <KPISection data={filteredData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ChartsSection data={filteredData} />
          <SalesTable data={filteredData} />
        </div>
        <div>
          <InsightsPanel data={filteredData} />
        </div>
      </div>
    </div>
  );
}
