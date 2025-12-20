Tamam, sorun şu: README.md içindeki yapı eski haliyle yazılmış (`src/` klasörü var), ama biz az önce tüm dosyaları köke taşıdık. Bu yüzden GitHub’da README’deki yapı artık gerçek proje yapısıyla uyuşmuyor ve “messy” görünüyor.

Hemen düzeltiyoruz! Aşağıdaki **yeni README.md** içeriğini tamamen kopyala ve projenin kökündeki `README.md` dosyasını bununla değiştir.

### Yeni README.md (Güncel, Temiz Yapıya Uygun – İngilizce)

```markdown
# FinceLearn

A Progressive Web App (PWA) for language learning. Generate short, engaging stories in **Turkish** or **English**, then tap any word to instantly see its translation in the other language.

Perfect for immersive language practice – read fun stories and learn vocabulary in context!

## Features

- Bilingual interface (Türkçe ↔ English)
- Generate random or topic-based stories using Google Gemini
- Tap any word in the story to see its translation (TR → EN or EN → TR)
- Fully responsive – works great on mobile and desktop
- Progressive Web App – installable on phone home screen (feels like a native app)
- Offline support for cached assets
- Secure: API key never exposed (uses Vercel serverless proxy)

## Project Structure
```

Fincelaarn/ ← Project root (clean & Vercel-ready)
│
├── index.html ← Main HTML page
├── manifest.json ← PWA manifest (for "Add to Home Screen")
│
├── css/
│ └── style.css ← All styles (responsive design)
│
├── js/
│ ├── main.js ← App logic & language switching
│ ├── api.js ← Frontend API calls (proxy + translation)
│ └── dom.js ← Story rendering, word clicks, popup
│
├── api/
│ └── hikaye.js ← Vercel serverless function (secure Gemini proxy)
│
├── .gitignore
└── README.md ← This file

```

## Live Demo

After deployment: https://your-project-name.vercel.app

Open on your phone → Menu → "Add to Home Screen" → Use it like a real app!

## How It Works

1. Choose language (Türkçe / English)
2. (Optional) Enter a story topic
3. Click "Generate New Story"
4. Read the story and tap any word → instant translation popup
5. Switch languages anytime – everything adapts automatically

## Deployment (Vercel – Free & Easy)

1. Fork or push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. In Project Settings → Environment Variables:
   - Add:
     **Name:** `GEMINI_API_KEY`
     **Value:** Your key from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. Deploy! Vercel handles everything automatically.

## Local Development

- No npm, no build tools needed (pure HTML/CSS/JS)
- Open with VS Code + Live Server extension, or any local server
- For local testing only: you can temporarily modify `api/hikaye.js` to use a local key (never commit it)

## Technologies

- Vanilla JavaScript, HTML5, CSS3
- Google Gemini API (via secure serverless proxy)
- LibreTranslate (free translation API)
- Vercel (hosting + serverless)
- Progressive Web App standards

## Contributing

Feel free to fork and add features:
- Favorite words list
- Text-to-speech
- More languages
- Difficulty levels

## License

MIT License – free to use, modify, and share.

---

Made with ❤️ for language learners.
```
