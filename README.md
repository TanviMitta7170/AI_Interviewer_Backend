AI Interviewer Backend 🤖

A lightweight Node.js backend service that uses Google's Gemini 1.5 Flash model to screen and rank technical interview candidates automatically. Built for the VantaHire Founding Engineering Intern assignment.

**1. 🚀 Features**
* **POST /evaluate-answer**: Accepts a single answer, evaluates it against a technical standard, and returns a structured JSON score (1-10) with feedback.
* **POST /rank-candidates**: Accepts a batch of candidates, processes them in parallel for high speed, and returns a ranked list from highest to lowest score.
* **Resilient Error Handling**: Gracefully handles API failures or "I don't know" answers without crashing the server.

**2. 🛠️ Tech Stack & Architecture Decisions**
* **Node.js & Express**: 
  * *Why:* Selected for its non-blocking I/O architecture. This is crucial when building an API that relies on external AI services, allowing the server to handle multiple concurrent requests efficiently.
* **Google Gemini 1.5 Flash**: 
  * *Why:* Chosen for its exceptional speed (low latency) and generous free tier. For a real-time application like an interview screener, inference speed is critical.
* **Concurrency (Promise.all)**:
  * *Why:* In the `/rank-candidates` endpoint, I used `Promise.all` to trigger AI evaluations for all candidates simultaneously rather than sequentially. This reduces the total processing time significantly.

**3. ⚙️ Setup Instructions**

**1) Prerequisites**
* Node.js installed
* A Google Gemini API Key

**2) Installation**
Clone the repository and install dependencies:
```bash
git clone [https://github.com/TanviMitta7170/AI_Interviewer_Backend.git](https://github.com/TanviMitta7170/AI_Interviewer_Backend.git)
cd AI_Interviewer_Backend
npm install
