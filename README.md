##📌 Abstract

Phishing websites imitate legitimate platforms to steal sensitive user information such as login credentials and financial data. Traditional phishing detection techniques—such as blacklist checking and basic URL analysis—often fail against newly created or visually deceptive phishing websites.

PhishGuard enhances real-time phishing detection by integrating Machine Learning (ML) for URL-based analysis, Convolutional Neural Networks (CNN) for screenshot-based visual detection, and a user feedback mechanism for continuous improvement. By combining URL analysis, image processing, and adaptive learning, PhishGuard delivers a robust and intelligent phishing detection system capable of addressing evolving cyber threats.
--
##🧠 Introduction
What is Phishing?
Phishing is a cyberattack in which attackers impersonate trusted organizations to deceive users into revealing sensitive information via fake emails, websites, or messages. These attacks can lead to identity theft, financial losses, and major data breaches.
--
##Why is Phishing Detection Important?
Traditional methods fail against visually deceptive phishing websites
Helps prevent identity theft
Reduces financial fraud
Protects sensitive personal and organizational data
---
##📚 Literature Survey (Summary)
Paper	Key Observation	Limitation
ML-Based Phishing Detection (2022)	Uses URL and blacklist analysis	No visual detection
CNN & Bi-LSTM Detection	Uses deep learning	No real-time feedback
Advanced ML & DL Models (2024)	High accuracy reported	Real-world false positives not addressed
--
##🚀 Proposed System
The proposed system improves phishing detection accuracy and adaptability by combining multiple detection techniques.
---
##🔑 Core Features

ML-based URL Detection
CNN-based Screenshot Analysis
User Feedback Mechanism
Real-Time Alerts
--
##✅ Advantages of Proposed System

Real-time phishing alerts
Hybrid detection (URL + visual analysis)
User-friendly interface
Continuous improvement using user feedback
Better resistance to zero-day phishing attacks
--
##🏗️ System Architecture (Overview)

User submits a URL
Backend extracts URL features
Screenshot is captured and analyzed
ML & CNN models classify the website
Result is returned to the user
User feedback is stored for system improvement
--
##🧰 Tools & Technologies
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

MySQL
--
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
--
##▶️ How to Run the Project

📌 Prerequisites

Node.js (v18+)
npm
VS Code

##🟢 Run Backend (Server)
cd server
npm install
npm install --save-dev cross-env
npm run dev
cross-env is used to avoid NODE_ENV issues on Windows.

##🔵 Run Frontend (Client)
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
--
##output screens 
<img width="1364" height="629" alt="Home Page" src="https://github.com/user-attachments/assets/fd48d15b-f36c-4d2e-8388-4ec192a5a413" />
<img width="1206" height="497" alt="SS" src="https://github.com/user-attachments/assets/b5903d35-f116-4f79-a31e-e48e49e2d9ae" />
<img width="1175" height="605" alt="urlresult" src="https://github.com/user-attachments/assets/2c1d764f-9595-4df8-b121-2fac315d7477" />
<img width="1202" height="372" alt="URL" src="https://github.com/user-attachments/assets/3050cce4-2668-467e-be95-2f0f7025c38d" />
<img width="1238" height="572" alt="recently scan" src="https://github.com/user-attachments/assets/bb759315-efe1-4a56-b127-6276bb0391d8" />
<img width="1193" height="355" alt="feedback2" src="https://github.com/user-attachments/assets/70d3fd2f-fa5f-4678-8455-008f10908560" />
<img width="1258" height="396" alt="feedbackWP" src="https://github.com/user-attachments/assets/efc6a6cd-711c-49ad-aebf-d929292e167f" />
<img width="996" height="521" alt="Phish" src="https://github.com/user-attachments/assets/85b78e40-794d-40db-a4f3-1ff8399c556d" />
<img width="1335" height="216" alt="overall" src="https://github.com/user-attachments/assets/5b246c56-9133-43a5-9d14-1e26ce410e8a" />



--
##🧪 Functional Modules

URL Feature Extraction
ML-Based URL Classification
Screenshot Capture
CNN-Based Visual Analysis
User Feedback Collection
Database Management
--
##🧾 Conclusion

PhishGuard presents an intelligent, scalable, and adaptive phishing detection system. By combining URL analysis, visual analysis, and continuous user feedback, the system significantly improves real-world phishing detection accuracy and robustness.
--
##🔮 Future Scope

Browser extension integration
Mobile application support
Improved false-positive reduction
Real-time model retraining
--
##👨‍🎓 Project Details

Project Title: PhishGuard – Intelligent Phishing Detection System
Project Type: B.Tech Major Project
Domain: Cyber Security | Machine Learning | Deep Learning
--
📜 License

This project is developed for academic and educational purposes.
--
