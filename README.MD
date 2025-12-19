```markdown
# FincaLearn

A Progressive Web App (PWA) for language learning. Generate short, engaging stories in **Turkish** or **English**, then tap any word to instantly see its translation in the other language.

Perfect for immersive language practice – read fun stories and learn vocabulary in context!

## Features

- Bilingual interface (Turkish ↔ English)
- Generate random or topic-based stories using Google Gemini
- Tap any word in the story to see its translation (TR → EN or EN → TR)
- Fully responsive – works great on mobile and desktop
- Progressive Web App – installable on phone home screen (feels like a native app)
- Offline support for cached assets
- No backend required for personal use; secure serverless proxy for public deployment

## Project Structure
```

fincalaarn/
├── src/
│ ├── index.html # Main HTML file
│ ├── manifest.json # PWA manifest
│ ├── css/
│ │ └── style.css # All styles (responsive + mobile-friendly)
│ └── js/
│ ├── main.js # App logic, language switching, UI updates
│ ├── api.js # API calls (story generation + translation)
│ ├── dom.js # DOM manipulation (render story, word clicks, popup)
├── api/
│ └── hikaye.js # Vercel serverless function (secure Gemini proxy)
├── vercel.json # Optional: Vercel configuration (if needed)
├── .gitignore # Protects your API key
└── README.md # This file

```

## Live Demo

(After deployment)
https://your-project-name.vercel.app

You can add it to your phone's home screen for instant access!

## How It Works

1. Choose language (Türkçe / English)
2. (Optional) Enter a story topic
3. Click "Generate New Story"
4. Read the story and tap any word → instant translation appears
5. Switch languages anytime – the story and translations adapt automatically

## Setup & Deployment (Public Online Version)

### Prerequisites
- GitHub account
- Vercel account (free)
- Google Gemini API key (get it free from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Steps

1. **Fork or clone** this repository
2. Get your Gemini API key from Google AI Studio
3. Deploy to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - In Project Settings → Environment Variables:
     - Add key: `GEMINI_API_KEY`
     - Value: your Gemini API key (it will be hidden and secure)
   - Deploy! Vercel will give you a live URL

4. Open the URL on your phone → "Add to Home Screen" → enjoy your personal language learning app!

## Local Development (Personal Use Only)

If you only want to use it yourself (no sharing):

1. Clone the repo
2. In `src/js/api.js`, temporarily replace the proxy call with direct Gemini call (for testing)
3. Use VS Code + Live Server extension or any local server
4. Keep your API key only on your machine (never commit it!)

**Warning**: Never commit your Gemini API key to GitHub if using direct calls.

## Technologies Used

- HTML5, CSS3, JavaScript (Vanilla – no frameworks)
- Google Gemini API (via secure serverless proxy)
- LibreTranslate (free, open-source translation)
- Vercel (hosting & serverless functions)
- Progressive Web App features

## Contributing

Feel free to fork and improve! Ideas:
- Save favorite words
- Text-to-speech for pronunciation
- Difficulty levels
- More languages

## License

MIT License – free to use, modify, and share.

---

Made with ❤️ for language learners everywhere.
```
