# 🚀 Production Deployment Guide - Vercel

Follow these steps to deploy your Sales Analytics Dashboard to **Vercel** and connect it to your **Supabase** database and **Gemini AI**.

## 1. Prerequisites
- A GitHub repository with your source code.
- A [Vercel](https://vercel.com/) account.
- A [Supabase](https://supabase.com/) project (see `supabase_setup.sql`).
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini.

## 2. Deployment Steps

### Step A: Import to Vercel
1. Log in to Vercel and click **Add New** > **Project**.
2. Select your `vc-dashboard` repository from GitHub.
3. In the **Configure Project** screen, leave the Build and Output settings as default (Next.js).

### Step B: Environment Variables
Crucially, add the following environment variables in the Vercel dashboard:

| Variable Name | Value |
| :--- | :--- |
| `DATA_SOURCE` | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `GEMINI_API_KEY` | Your Gemini 2.5 API Key |

### Step C: Deploy
1. Click **Deploy**.
2. Once the build finishes, Vercel will provide you with a production URL (e.g., `https://vc-dashboard.vercel.app`).

## 3. Post-Deployment Verification
1. Visit your production URL.
2. Check that the KPI cards load data (this confirms the Supabase connection).
3. Try clicking **Generate AI Strategy** to verify the Gemini integration.

## 4. Automatic Updates
Every time you `git push` to your `main` branch, Vercel will automatically trigger a new build and deploy the changes to production.
