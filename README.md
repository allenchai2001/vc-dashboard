# Sales Analytics Dashboard

A modern, clean SaaS dashboard built with React (Next.js), Tailwind CSS, and Recharts.

## Features
- **KPI Overview**: Real-time business metrics (Revenue, Orders, Profit, AOV).
- **Interactive Visualizations**: Revenue trends, channel distribution, and top product performance.
- **Deep Filtering**: Filter by date range, product category, and marketing channel.
- **AI Insights**: Generate automated business suggestions and alerts powered by AI.
- **Hybrid Data Layer**: Seamlessly switch between CSV-based storage and Supabase database.

## Tech Stack
- **Frontend**: Next.js 15+, Tailwind CSS, Recharts, Lucide React.
- **Backend**: Next.js API Routes, PapaParse (for CSV), Supabase JS Client.
- **AI**: OpenAI SDK.

## Getting Started

### 1. Prerequisites
- Node.js 18+ 
- npm or yarn

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Deployment
This project is ready for deployment on **Vercel**. Connect your GitHub repository and ensure all environment variables are configured in the Vercel dashboard.
