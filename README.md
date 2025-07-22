# 🌌 NebulaTalk — Real-Time Chat with Web3 & Voice

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Click%20Here-green)](https://nebula-talk.vercel.app/)
[![Web3 Enabled](https://img.shields.io/badge/Web3-MetaMask-orange)](https://metamask.io/)
[![Voice Input](https://img.shields.io/badge/Speech-Web%20Speech%20API-blue)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ✨ What is NebulaTalk?

**NebulaTalk** is a futuristic, real-time chat app that combines WebSockets, Web3, and voice-to-text to offer a sleek and intuitive communication experience.

Built with:
- **Socket.IO** for real-time messaging
- **MetaMask + Ethers.js** for Ethereum wallet connection
- **Web Speech API** for voice input support

NebulaTalk lets you:
- Chat instantly across dynamic rooms
- Connect your Ethereum wallet (MetaMask)
- Speak your messages instead of typing

> It's not just a chatroom — it's a glimpse into the future of communication.

---

## 🚀 Live Demo

👉 [nebula-talk.vercel.app](https://nebula-talk.vercel.app/)

Try it live — join a room, connect your wallet, and chat using your voice!

---

## 🧰 Tech Stack

**Frontend:**  
- React.js  
- Vite  
- Tailwind CSS  
- Web Speech API  
- MetaMask Integration  
- Ethers.js  

**Backend:**  
- Node.js  
- Express.js  
- Socket.IO  

**Hosting:**  
- Vercel (Frontend + API)

---

## ⚡ Key Features

- 🔄 Real-time messaging with Socket.IO
- 🧠 Voice-to-text via Web Speech API
- 🦊 Ethereum wallet connection via MetaMask
- 🧪 Ethereum address display using Ethers.js
- 🏠 Room-based system — create or join any room
- 🎨 Clean, responsive Tailwind UI
- 💬 Instant, frictionless experience (no auth needed)

---

## 📂 Project Structure

```
NebulaTalk/
├── client/         → React + Vite + Tailwind + Web3 + Voice
│   ├── src/
│   │   ├── components/
│   │   └── hooks/ (MetaMask, speech recognition)
│   └── public/
│
├── server/         → Express + Socket.IO
│   └── index.js
```

---

## 💻 Run Locally

1. **Clone the repository:**

```bash
git clone https://github.com/TanmaySingh007/NebulaTalk.git
cd NebulaTalk
```

2. **Install dependencies:**

```bash
cd client
npm install

cd ../server
npm install
```

3. **Start the servers:**

```bash
cd server
npm run dev  # Starts backend on http://localhost:5000

cd ../client
npm run dev  # Starts frontend on http://localhost:5173
```

4. **Open in browser:**  
   Visit `http://localhost:5173`

---

## 🦊 Web3 Integration (MetaMask + Ethers.js)

- Users can **connect MetaMask** in one click.
- Ethereum address appears in the chatroom.
- Internally powered by `ethers.js` for wallet management.

```js
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const address = await signer.getAddress();
```

---

## 🎙️ Voice Chat (Web Speech API)

- Use your **microphone to speak messages**
- Converts voice → text in real time
- Powered by `window.SpeechRecognition` API

```js
const recognition = new window.SpeechRecognition();
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  sendMessage(transcript);
};
```

---

## 🌐 Deployment

Deployed on **Vercel**  
Auto-updates when you push to GitHub.  
Backend is bundled or proxied based on deployment config.

---

## 💡 Future Features (Optional Ideas)

- ✅ Typing indicators
- ✅ Message persistence (Firebase/MongoDB)
- ✅ Ethereum message signing
- ✅ Audio/video chat with WebRTC
- ✅ NFT-based room access

---

## 🤝 Contributing

Pull requests and ideas are welcome!  
Fork the repo, suggest a feature, or open an issue.

---

## 👨‍🚀 Author

**Tanmay Singh**  
💼 [LinkedIn](https://linkedin.com/in/tanmaysingh007)  
🐦 [Twitter](https://twitter.com/tanmaysingh007)

---

## 📄 License

This project is licensed under the **MIT License**  
Free to use, remix, deploy — just give credit.

---

> _“NebulaTalk isn’t just real-time. It’s real-future.”_ 🚀

