import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

// Configuration for data source
const DATA_SOURCE = process.env.DATA_SOURCE || 'csv'; // 'csv', 'supabase', or 'google_sheets'
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// Supabase client (initialized only if needed)
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-url')) {
  try {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  } catch (e) {
    console.warn('Supabase initialization skipped: Invalid URL or placeholder detected.');
  }
}

export async function getSalesData() {
  if (DATA_SOURCE === 'google_sheets' && GOOGLE_SCRIPT_URL) {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Google Sheets Error:', error);
      throw new Error('Failed to fetch from Google Sheets');
    }
  }

  if (DATA_SOURCE === 'supabase' && supabase) {
    const { data, error } = await supabase
      .from('sales_data')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch from Supabase');
    }

    // Normalize Supabase results
    return (data || []).map(row => ({
      ...row,
      revenue: Number(row.revenue) || 0,
      cost: Number(row.cost) || 0,
      profit: row.profit !== undefined ? Number(row.profit) : (Number(row.revenue || 0) - Number(row.cost || 0)),
      orders: Number(row.orders) || 1,
      order_id: row.order_id || `ORD-${String(row.id || '???').padStart(3, '0')}`
    }));
  }

  // Fallback to CSV
  const csvFilePath = path.join(process.cwd(), 'data', 'sales_data.csv');
  const csvContent = await fs.readFile(csvFilePath, 'utf8');
  const results = Papa.parse(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });
  
  // Normalize data for the frontend
  const normalized = (results.data || []).map((row, idx) => ({
    ...row,
    id: row.id || idx,
    order_id: row.order_id || `ORD-${String(idx + 1).padStart(3, '0')}`,
    revenue: Number(row.revenue) || 0,
    cost: Number(row.cost) || 0,
    profit: row.profit !== undefined ? Number(row.profit) : (Number(row.revenue || 0) - Number(row.cost || 0)),
    orders: Number(row.orders) || 1,
  }));

  return normalized;
}
