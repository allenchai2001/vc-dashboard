import { getSalesData } from '@/lib/data-layer';

export async function GET() {
  try {
    const data = await getSalesData();
    return Response.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to load sales data' }, { status: 500 });
  }
}
