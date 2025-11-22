# Blood Pressure Tracker

A Progressive Web App for tracking blood pressure readings with notifications.

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to the SQL Editor and run the contents of `supabase-schema.sql`
4. Go to Project Settings → API to get your credentials
5. Copy `.env.example` to `.env.local` and add your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Authentication Setup

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Email provider
3. Configure Site URL (use `http://localhost:5173` for development)
4. Add your production URL when deployed

### 3. Create Users

1. Go to Authentication → Users in Supabase Dashboard
2. Click "Add user" → "Create new user"
3. Add email and password for each person (2 users)
4. The app will automatically create user records in the `users` table on first login

### 4. Local Development

```bash
npm install
npm run dev
```

### 5. Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [Vercel](https://vercel.com) and import the repository
3. Add environment variables in Vercel project settings
4. Deploy!

### 6. Apple Shortcut Setup (for notifications)

See `APPLE_SHORTCUT.md` for detailed instructions on setting up the notification shortcut.

## Features

- ✅ Record blood pressure readings (systolic, diastolic, pulse)
- ✅ View reading history
- ✅ Trend visualization with charts
- ✅ Multi-user support (2 people)
- ✅ Apple Shortcut integration for notifications
- ✅ PWA support (works offline, installable)

## Tech Stack

- React + TypeScript + Vite
- Supabase (PostgreSQL, Auth, Real-time)
- Recharts (data visualization)
- Vercel (hosting)
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
