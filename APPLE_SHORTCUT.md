# Apple Shortcut Setup for Notifications

This guide will help you set up an Apple Shortcut to send notifications when blood pressure readings haven't been recorded.

## Overview

The shortcut will:
1. Check if a reading has been recorded today (after noon)
2. Send a notification if no reading exists
3. Run every 2 hours automatically using iOS Automation

## Step 1: Get Your API URL

1. Open the Blood Pressure Tracker app
2. Sign in with your account
3. Click **"📱 Set Up Apple Shortcut Notifications"**
4. Click **"Copy Your API URL"**
5. The URL is copied to your clipboard!

**Note:** Both users/caregivers can use the SAME API URL and shortcut! The system checks if ANY reading has been recorded today for the patient, so once one person records it, both stop getting notifications.

## Step 2: Create the Shortcut

### On iPhone:

1. Open the **Shortcuts** app
2. Tap the **+** button to create a new shortcut
3. Name it "Check BP Reading"

### Add Actions:

#### Action 1: Get URL Contents
1. Search for "Get Contents of URL" and add it
2. Configure:
   - **URL**: `https://your-app.vercel.app/api/check-reading`
   - Replace `your-app.vercel.app` with your actual deployment URL
   - Or just paste the URL you copied from the app
   - **Method**: GET

#### Action 2: Get Dictionary Value
1. Search for "Get Dictionary Value" and add it
2. Configure:
   - **Key**: `hasReadingToday`
   - **Dictionary**: Contents of URL (from previous action)

#### Action 3: If Statement
1. Search for "If" and add it
2. Configure:
   - **If**: Dictionary Value (from previous action)
   - **is**: false (boolean, not text)

#### Action 4: Show Notification (inside the If block)
1. Search for "Show Notification" and add it
2. Configure:
   - **Title**: "Blood Pressure Reminder"
   - **Body**: "Don't forget to record your blood pressure reading today! 🩺"
   - **Sound**: Choose a sound

#### Action 5: Otherwise (optional - for debugging)
1. The "Otherwise" block is automatically created
2. You can add a notification here too:
   - **Title**: "BP Reading Complete"
   - **Body**: "You've already recorded your reading today ✓"

3. Tap "Done" to save the shortcut

## Step 3: Set Up Automation

### Create Automation for Noon Check:

1. Open the **Shortcuts** app
2. Go to the **Automation** tab
3. Tap **+** to create a new automation
4. Choose **Time of Day**
5. Configure:
   - **Time**: 12:00 PM (noon)
   - **Repeat**: Daily
   - **Run Immediately**: ON
6. Tap "Next"
7. Search for "Run Shortcut" and add it
8. Select "Check BP Reading"
9. Tap "Done"
10. **Important**: Toggle OFF "Ask Before Running" (so it runs automatically)

### Create Automation for Every 2 Hours (1 PM onwards):

Since iOS doesn't support "every 2 hours", you'll need to create multiple automations:

1. Repeat the steps above for these times:
   - 1:00 PM
   - 3:00 PM
   - 5:00 PM
   - 7:00 PM
   - 9:00 PM (optional, last check of the day)

Each automation should:
- Use the same "Check BP Reading" shortcut
- Have "Ask Before Running" toggled OFF
- Have "Run Immediately" toggled ON

## Step 4: Test the Shortcut

1. Open the **Shortcuts** app
2. Find your "Check BP Reading" shortcut
3. Tap it to run manually
4. You should see a notification if you haven't recorded a reading today

## Troubleshooting

### "Invalid URL" error:
- Make sure you replaced `YOUR_USER_ID` with your actual user ID
- Make sure you replaced the domain with your actual Vercel deployment URL
- Check that the URL format is correct (no spaces)

### No notification appears:
- Check that notifications are enabled for the Shortcuts app in Settings
- Make sure "Ask Before Running" is OFF in the automation
- Try running the shortcut manually first to test

### API returns error:
- Verify your user ID is correct in the Supabase users table
- Check that your app is deployed and the API endpoint is accessible
- Try opening the URL in Safari to see the JSON response

## Alternative: Manual Shortcut Widget

If automations aren't working, you can:
1. Add the shortcut to your Home Screen
2. Run it manually throughout the day
3. Add a widget for quick access

## Example API Response

When you open the URL manually in Safari, you should see:

```json
{
  "hasReadingToday": true
}
```

or

```json
{
  "hasReadingToday": false
}
```

The API returns proper JSON with `Content-Type: application/json` header, so Shortcuts will automatically treat it as a Dictionary (not a file).

## Privacy Note

The shortcut only checks if a reading exists for today. It doesn't expose any actual blood pressure values through the API endpoint.

## Need Help?

If you run into issues:
1. Check the Shortcuts app logs
2. Verify the API endpoint works in Safari first
3. Make sure your environment variables are set correctly in Vercel
4. Check the Supabase logs for any database errors
