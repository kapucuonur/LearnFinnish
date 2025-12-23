# Google Cloud Translation API Setup

## Quick Start

### 1. Get Google Cloud API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Cloud Translation API**:
   - Visit: https://console.cloud.google.com/apis/library/translate.googleapis.com
   - Click "Enable"
4. Create API Key:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy the generated API key
5. (Recommended) Restrict the key:
   - Click on the key you just created
   - Under "API restrictions", select "Restrict key"
   - Choose "Cloud Translation API"
   - Save

### 2. Add API Key to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `learnfinnish` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name**: `GOOGLE_TRANSLATE_API_KEY`
   - **Value**: Paste your API key from step 1
   - **Environments**: Check all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"

### 3. Local Development (Optional)

For local testing, create a `.env.local` file:

```bash
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

**Note**: `.env.local` is already in `.gitignore` and won't be committed.

## Pricing

**Free Tier**: 500,000 characters per month
- More than enough for most applications
- After free tier: $20 per million characters

## Testing

After deployment, test the translation:
1. Go to your app
2. Generate a story
3. Click on any Finnish word
4. The translation should appear with better quality

## Troubleshooting

**Error: "API anahtarı yapılandırılmamış"**
- The API key is not set in Vercel
- Go to Vercel Settings → Environment Variables
- Make sure `GOOGLE_TRANSLATE_API_KEY` is added
- Redeploy the application

**Error: "Çeviri hatası"**
- Check if Translation API is enabled in Google Cloud
- Verify the API key is correct
- Check API key restrictions (should allow Translation API)

## What Changed

- **Before**: Free Google Translate endpoint (unofficial)
- **After**: Official Google Cloud Translation API
- **Benefits**: Better quality, more reliable, official support
