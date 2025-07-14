# 🌌 Nebula Talk – Voice-Controlled Crypto Wallet

![Nebula Talk](https://img.shields.io/badge/Powered%20By-Voice%20%26%20Blockchain-blueviolet?style=for-the-badge)

Nebula Talk is a modern voice-activated smart wallet interface built using React, Web Speech API, and MetaMask. It allows users to **connect, disconnect, check wallet balance, and send ETH** — all through **natural voice commands** in **English and Hindi**.
This project is build by me as a part of blockdag hackathon .I have tried something new in this project.
---

## 🤖 How Nebula Talk Uses AI

Nebula Talk leverages AI-driven technology to make crypto wallet interactions natural and accessible:

- 🎙️ **Speech Recognition (AI-powered NLP):** Uses the Web Speech API to continuously listen, transcribe, and understand user commands in English and Hindi.
- 🗣️ **Natural Language Interface:** Maps loosely spoken phrases to structured wallet actions like sending ETH, fetching balance, or connecting accounts.
- 🌐 **Multilingual Understanding:** Supports both English and Hindi voice inputs using native AI models inside the browser.
- 🧠 **Intent Recognition:** Parses natural voice phrases into wallet functions using AI-enhanced pattern matching and intelligent regex mapping.
- 🚀 **Future Extension:** Can be extended with LLMs or AI voice SDKs (e.g., OpenAI Whisper, Google STT, or Alan AI) for richer conversations and multilingual command understanding.

By merging AI with decentralized tech (Web3), Nebula Talk redefines how users interact with crypto wallets — making it **hands-free, intuitive, and voice-first**.

🚀 **Live Demo**: [https://nebula-talk.vercel.app/](https://nebula-talk.vercel.app/)  
📦 **GitHub Repo**: [github.com/TanmaySingh007/NebulaTalk](https://github.com/TanmaySingh007/NebulaTalk)

---

## 📌 Features

- 🎙️ Voice-activated wallet actions (Web Speech API)
- 🗣️ Multilingual command support – English & Hindi
- 🔐 MetaMask Wallet Integration (Ethereum / Polygon)
- 💸 Send ETH by saying the amount and wallet address
- 📈 Real-time wallet balance fetch
- 🧠 Natural speech parsing (Regex-based)
- 💻 Responsive UI for mobile & desktop (Tailwind CSS)
- ♻️ Auto restarts voice listening after inactivity

---

## 💡 Example Voice Commands

| Command (English)                     | Command (Hindi)                        | Action                          |
|--------------------------------------|----------------------------------------|---------------------------------|
| "Connect wallet"                     | "वॉलेट कनेक्ट"                          | Connect to MetaMask             |
| "Disconnect wallet"                  | "वॉलेट डिस्कनेक्ट"                     | Disconnect wallet               |
| "Check my balance" / "Show balance"  | "मेरा बैलेंस दिखाओ" / "बैलेंस चेक करो" | Fetch ETH/MATIC balance         |
| "Send 0.01 ETH to 0x..."             | "0.01 ईटीएच भेजो 0x..."                 | Send ETH to wallet address      |
| "Show my account"                    | "मेरा अकाउंट दिखाओ"                    | Show connected wallet address   |

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Wallet Integration:** MetaMask + ethers.js
- **Voice Engine:** Web Speech API (browser-native)
- **Deployment:** Vercel

---

## ⚙️ Setup Instructions

``bash
# 1. Clone the repo
git clone https://github.com/TanmaySingh007/NebulaTalk.git
cd NebulaTalk

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

💡 Make sure MetaMask is installed and connected to Polygon Mumbai Testnet for testing with free MATIC.

📤 Deployment
Deployed using Vercel:
# Build for production
npm run build

# Preview build locally
npm run preview

You can fork this and deploy your own version in seconds using Vercel or Netlify.

🧠 How It Works
Uses the Web Speech API to listen for commands continuously

Parses the transcript for keywords and matches via includes() and regex

Executes commands like connectWallet(), fetchBalance(), or sendEth() with ethers.js

Voice commands are recognized in both English and Hindi

Feedback is shown in a real-time status panel on the UI.

🤝 Acknowledgements
MetaMask

ethers.js

Vercel

Tailwind CSS

Web Speech API

👨‍💻 Author
Tanmay Singh
📧 tanmaysingh08580@gmail.com
🔗 LinkedIn • GitHub

📃 License
This project is open-source and free to use under the MIT License.

