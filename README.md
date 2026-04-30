# 🛡️ Fake News Detector (TruthLens)

A modern web application that helps users detect potentially fake or misleading news articles using an intelligent heuristic-based analysis engine.

This project analyzes article content and checks multiple trust factors such as:

- Clickbait headlines
- Emotional manipulation
- Source reliability
- Content quality
- Overall credibility score

---

## 🚀 Live Features

✅ Detect fake news before it spreads  
✅ Analyze article text instantly  
✅ Clean and responsive UI  
✅ Dashboard with credibility score  
✅ Login page included  
✅ Built with modern React + TypeScript stack

📂 Project Structure
truth-guard-ai-main/
│── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   └── fakeNewsAnalyzer.ts
│   ├── integrations/
│   └── main.tsx
│
│── public/
│── package.json
│── vite.config.ts
│── tailwind.config.ts
⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/your-username/fake-news-detector.git
cd fake-news-detector
2️⃣ Install Dependencies
npm install
3️⃣ Run Project
npm run dev

Now open:

http://localhost:5173
🧠 How It Works

The app uses a custom fake news analyzer that checks:

🔹 Attention Grabbing Content

Detects words like:

Shocking
Breaking
Exclusive
Miracle
🔹 Emotional Tone

Detects emotional trigger words:

Fury
Panic
Hate
Worst Ever
🔹 Source Reliability

Checks trusted domains like:

Reuters
BBC
AP News
Nature
🔹 Content Quality

Measures writing quality and suspicious patterns.

📊 Output Example
Overall Score: 82%

Verdict: Likely Real News

or

Overall Score: 28%

Verdict: Likely Fake News
🧪 Available Scripts
npm run dev       # Start development server
npm run build     # Build production version
npm run preview   # Preview production build
npm run test      # Run tests
🌟 Future Improvements
AI / ML based fake news detection
NLP sentiment analysis
Chrome extension
Real-time fact checking API
Multi-language support
🤝 Contributing

Pull requests are welcome.

If you'd like to improve this project:

Fork repository
Create branch
Commit changes
Open PR
📜 License

MIT License

👨‍💻 Author

Developed by Ravichandran

⭐ Support

If you like this project, give it a ⭐ on GitHub.
