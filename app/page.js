import Dashboard from '@/components/Dashboard';

export const metadata = {
  title: 'Clean Dashboard - Sales Analytics',
  description: 'A modern, clean SaaS dashboard for sales data analytics.',
};

export default function Home() {
  return (
    <main>
      <Dashboard />
    </main>
  );
}
