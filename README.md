# 📧 Email Reply Generator – Gmail Chrome Extension + Spring Boot Backend

An AI-powered email reply generator that integrates directly into **Gmail** using a **Chrome Extension** and a **Spring Boot backend** powered by **Google Gemini (free tier)**.  
With one click, users can generate a professional email reply based on the received email content.

---

## 🚀 Features

- Gmail-integrated **AI Reply button**
- AI-generated professional email replies
- Chrome Extension (Manifest v3)
- Spring Boot REST API backend
- Google Gemini (1.5 Flash – Free Tier)
- CORS-enabled for extension communication
- Fast response generation
- Modular & extensible architecture

---


---

## 🛠️ Tech Stack

### Frontend (Chrome Extension)
- JavaScript
- Gmail DOM APIs
- Chrome Extension (Manifest v3)

### Backend
- Java 17+
- Spring Boot
- Spring WebFlux (`WebClient`)
- Jackson (JSON parsing)

### AI
- Google Gemini API
- Model: `gemini-1.5-flash` (Free Tier)

---


---

## 🔧 Backend Setup (Spring Boot)

### 1️⃣ Prerequisites
- Java 17+
- Maven
- Google Gemini API Key

---

### 2️⃣ Enable Gemini API
1. Open **Google Cloud Console**
2. Select your project
3. Enable **Generative Language API**
4. Create an **API Key**
   - No restrictions (for development)

---

### 3️⃣ Configure `application.properties`

```properties
spring.application.name=Email-writer

gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
gemini.api.key=YOUR_GEMINI_API_KEY




