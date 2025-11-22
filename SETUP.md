# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- A Vercel account (free tier is fine) OR any other hosting platform

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to https://supabase.com and create a new project
2. Wait for the project to be provisioned (takes ~2 minutes)
3. Go to the **SQL Editor** in the Supabase dashboard
4. Copy the entire contents of `supabase-schema.sql` and run it
5. Go to **Project Settings** → **API**
6. Copy your:
   - Project URL
   - `anon` `public` key

### 3. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Create Users in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password for the first person
4. Repeat for the second person
5. Note: You can also enable email confirmation if you want

### 5. Run Locally

```bash
npm run dev
```

Open http://localhost:5173 and sign in with one of the accounts you created!

### 6. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add your environment variables when asked.

#### Option B: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**

### 7. Update Supabase Auth Settings

1. After deploying, copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - Site URL
   - Redirect URLs

### 8. Set Up Apple Shortcuts (Optional)

Follow the detailed instructions in `APPLE_SHORTCUT.md` to enable notifications on iOS devices.

## Testing the App

1. **Sign In**: Use one of the accounts you created in Supabase
2. **Add a Reading**: Fill out the form and submit
3. **View History**: See your reading appear in the list below
4. **Check Trends**: View the chart (add more readings to see trends)
5. **Switch Users**: Sign out and sign in with the other account
6. **View All Readings**: Both users' readings appear in the history

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists and has the correct values
- Restart the dev server after creating/editing `.env.local`

### Cannot sign in
- Check that you created the user in Supabase Auth
- Check browser console for errors
- Verify your Supabase credentials are correct

### API endpoint not working
- Make sure you've deployed to Vercel (API routes only work in production)
- Check that environment variables are set in Vercel project settings
- Verify the API URL in your shortcut is correct

### PWA not installing
- PWA requires HTTPS (works on Vercel, but not on localhost)
- Try accessing from Safari on iOS or Chrome on Android
- Look for the "Add to Home Screen" option in the browser menu

## Next Steps

- Set up the Apple Shortcut for notifications (see APPLE_SHORTCUT.md)
- Customize the app colors/branding in the CSS files
- Add more features (export data, set BP goals, etc.)
- Consider setting up Google Analytics or other tracking

## Support

If you need help:
1. Check the browser console for errors
2. Check the Supabase logs in the dashboard
3. Check the Vercel logs in the deployment dashboard
4. Review the setup steps to ensure nothing was missed

## Security Notes

- Never commit your `.env.local` file to Git (it's in `.gitignore`)
- The `anon` key is safe to use in the frontend (it's public)
- Row Level Security (RLS) is enabled in the database to protect data
- Each user can only insert/update/delete their own readings
- All users can view all readings (since it's a shared app for 2 people)
