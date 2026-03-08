const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  const envPath = path.join(__dirname, '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const env = {};
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      env[key.trim()] = value.join('=').trim();
    }
  });

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const source = env.DATA_SOURCE;

  console.log('Testing connection to:', url);
  console.log('Using DATA_SOURCE:', source);

  if (source !== 'supabase') {
    console.warn('DATA_SOURCE is not set to supabase! It is currently:', source);
  }

  const supabase = createClient(url, key);

  try {
    const { data, error } = await supabase
      .from('sales_data')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Connection Failed:', error);
      process.exit(1);
    }

    console.log('Connection Successful!');
    console.log('Found record:', data);
    process.exit(0);
  } catch (err) {
    console.error('An error occurred:', err);
    process.exit(1);
  }
}

testConnection();
