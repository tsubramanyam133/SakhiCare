<div align="center">
  <img src="https://chatgpt.com/backend-api/estuary/content?id=file_00000000a6d481fbaa8a728a1f7ab2c4&ts=495685&p=fs&cid=1&sig=c81fe9b6cb1a8ead43cd2fa609dcab5521f42bc6d2e7607379434fa8877786d2&v=0" alt="SAKHI Logo" width="120" />
  <h1>SAKHI | Women & Child Welfare Platform</h1>
  <p>Empowering Women Through Accessible Healthcare, AI, and Community</p>
</div>

---

## 📖 Overview
**SAKHI** is a comprehensive, full-stack web ecosystem built to revolutionize women and child healthcare accessibility. It bridges the gap between rural/urban women and vital healthcare resources by offering a unified platform for menstrual tracking, AI-powered health consultations, telemedicine, community support, and easy access to government welfare schemes.

## ✨ Key Features
* **🩸 Smart Menstrual Tracker**: Log cycles, track symptoms, and receive AI-driven predictions for upcoming cycles.
* **🤖 Sakhi AI (Multilingual)**: A 24/7 conversational AI companion powered by Google Gemini, capable of answering health-related queries in multiple languages.
* **🏛️ Govt Schemes Portal**: A curated, easily accessible directory of government welfare schemes with direct application links.
* **👨‍⚕️ Healthcare Directory**: Find and consult with verified gynecologists and pediatricians, featuring both offline and telemedicine capabilities.
* **💬 Community Forum**: A safe space for women to discuss health topics, ask questions, and interact with healthcare professionals.
* **📚 Awareness & Care**: Access curated educational videos and articles on maternal health, hygiene, and nutrition.
* **🛡️ Secure Admin Dashboard**: Comprehensive admin portal for managing doctors, schemes, educational videos, and broadcasting global notifications.

---

## 🏗️ System Architecture
The application follows a modern decoupled **Client-Server Architecture**:
* **Frontend**: Built with Next.js 14 (App Router) for Server-Side Rendering (SSR) and optimized SEO, styled with Tailwind CSS for a fully responsive, modern glassmorphism UI.
* **Backend**: Robust Express.js REST API server handling business logic, authentication, and database operations.
* **Database**: MongoDB (NoSQL) for flexible schema design and fast read/write operations for dynamic data like chat histories and community posts.
* **AI Integration**: Direct integration with Google's Generative AI (Gemini Pro) for natural language processing and chatbot capabilities.

---

## 💻 Tech Stack
### **Frontend**
* **Framework**: Next.js 14, React 18
* **Language**: TypeScript
* **Styling**: Tailwind CSS, PostCSS
* **State Management**: Zustand
* **Components**: Radix UI / Shadcn UI concepts, Lucide React (Icons)
* **API Client**: Axios

### **Backend**
* **Runtime**: Node.js
* **Framework**: Express.js
* **Language**: TypeScript
* **Database**: MongoDB (Mongoose ORM)
* **Authentication**: JWT (JSON Web Tokens), Bcrypt (Password Hashing)
* **AI SDK**: `@google/generative-ai`

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB URI (Local or Atlas)
* Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/tsubramanyam133/SakhiCare.git
cd SakhiCare
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure Environment Variables
# Create a .env file based on .env.example
# Add MONGO_URI, JWT_SECRET, and GEMINI_API_KEY

# Run the Development Server
npm run dev
```
*Backend runs on http://localhost:5000*

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Configure Environment Variables
# Create a .env.local file
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Run the Development Server
npm run dev
```
*Frontend runs on http://localhost:3000*

---

## 🔒 Security & Authorization
* **Role-Based Access Control (RBAC)**: Distinct permissions for `USER` and `ADMIN` roles.
* **JWT Authentication**: Secure HttpOnly token management and request interceptors on the client side.
* **Data Privacy**: Passwords hashed via bcrypt; sensitive AI chat interactions securely managed.

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your enhancements.

## 📄 License
This project is licensed under the MIT License.
