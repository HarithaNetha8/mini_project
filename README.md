📌 Abstract

Phishing websites imitate legitimate platforms to steal sensitive user information such as login credentials and financial data. Traditional phishing detection techniques—such as blacklist checking and basic URL analysis—often fail against newly created or visually deceptive phishing websites.

PhishGuard enhances real-time phishing detection by integrating Machine Learning (ML) for URL-based analysis, Convolutional Neural Networks (CNN) for screenshot-based visual detection, and a user feedback mechanism for continuous improvement. By combining URL analysis, image processing, and adaptive learning, PhishGuard delivers a robust and intelligent phishing detection system capable of addressing evolving cyber threats.

🧠 Introduction
What is Phishing?

Phishing is a cyberattack in which attackers impersonate trusted organizations to deceive users into revealing sensitive information via fake emails, websites, or messages. These attacks can lead to identity theft, financial losses, and major data breaches.

Why is Phishing Detection Important?

Traditional methods fail against visually deceptive phishing websites

Helps prevent identity theft

Reduces financial fraud

Protects sensitive personal and organizational data

📚 Literature Survey (Summary)
Paper	Key Observation	Limitation
ML-Based Phishing Detection (2022)	Uses URL and blacklist analysis	No visual detection
CNN & Bi-LSTM Detection	Uses deep learning	No real-time feedback
Advanced ML & DL Models (2024)	High accuracy reported	Real-world false positives not addressed
🚀 Proposed System

The proposed system improves phishing detection accuracy and adaptability by combining multiple detection techniques.

🔑 Core Features

ML-based URL Detection

CNN-based Screenshot Analysis

User Feedback Mechanism

Real-Time Alerts

✅ Advantages of Proposed System

Real-time phishing alerts

Hybrid detection (URL + visual analysis)

User-friendly interface

Continuous improvement using user feedback

Better resistance to zero-day phishing attacks

🏗️ System Architecture (Overview)

User submits a URL

Backend extracts URL features

Screenshot is captured and analyzed

ML & CNN models classify the website

Result is returned to the user

User feedback is stored for system improvement

🧰 Tools & Technologies
🔍 Machine Learning & AI

BERT (NLP-based URL analysis)

Random Forest

XGBoost

CNN (Visual phishing detection)

🖼️ Image Processing

OpenCV

Tesseract OCR

🖥️ Backend

Node.js

Express.js

TypeScript

TSX

REST APIs

🌐 Frontend

React

TypeScript

Vite

🗄️ Database

MySQL / PostgreSQL

📁 Project Structure
phishguard/
├── client/              # Frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── server/              # Backend
│   ├── index.ts
│   ├── routes/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md

▶️ How to Run the Project
📌 Prerequisites

Node.js (v18+)

npm

VS Code

🟢 Run Backend (Server)
cd server
npm install
npm install --save-dev cross-env
npm run dev


cross-env is used to avoid NODE_ENV issues on Windows.

🔵 Run Frontend (Client)
cd client
npm install
npm run dev

🌐 Application URLs

Frontend: http://localhost:5173

Backend: http://localhost:5000

❗ Common Issue & Fix (Windows)
Error
'NODE_ENV' is not recognized as an internal or external command

Solution

Use cross-env to define environment variables:

npm install --save-dev cross-env

🧪 Functional Modules

URL Feature Extraction

ML-Based URL Classification

Screenshot Capture

CNN-Based Visual Analysis

User Feedback Collection

Database Management

🧾 Conclusion

PhishGuard presents an intelligent, scalable, and adaptive phishing detection system. By combining URL analysis, visual analysis, and continuous user feedback, the system significantly improves real-world phishing detection accuracy and robustness.

🔮 Future Scope

Browser extension integration

Mobile application support

Improved false-positive reduction

Real-time model retraining

👨‍🎓 Project Details

Project Title: PhishGuard – Intelligent Phishing Detection System
Project Type: B.Tech Major Project
Domain: Cyber Security | Machine Learning | Deep Learning

📜 License

This project is developed for academic and educational purposes.
