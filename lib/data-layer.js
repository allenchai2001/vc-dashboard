import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

// Configuration for data source
const DATA_SOURCE = process.env.DATA_SOURCE || 'csv'; // 'csv' or 'supabase'

// Supabase client (initialized only if needed)
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getSalesData() {
  if (DATA_SOURCE === 'supabase' && supabase) {
    const { data, error } = await supabase
      .from('sales_data')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      throw new Error('Failed to fetch from Supabase');
    }
    return data;
  }

  // Fallback to CSV
  const csvFilePath = path.join(process.cwd(), 'data', 'sales_data.csv');
  const csvContent = await fs.readFile(csvFilePath, 'utf8');
  const results = Papa.parse(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });
  return results.data;
}
