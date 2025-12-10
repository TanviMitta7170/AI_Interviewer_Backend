require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json()); // Allows the server to read JSON from the request body

// Check for API Key
if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is missing in .env file");
    process.exit(1);
}

// Setup Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// We use 'gemini-flash-latest' as it worked on your machine
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// --- ENDPOINT 1: Evaluate a Single Answer ---
app.post('/evaluate-answer', async (req, res) => {
    try {
        const { answer } = req.body;

        if (!answer) {
            return res.status(400).json({ error: "Please provide an answer to evaluate." });
        }

        const prompt = `
            You are an expert technical interviewer. Evaluate the following answer to a coding question.
            Answer: "${answer}"
            
            Return a STRICT JSON object (no markdown, no backticks) with this exact format:
            {
                "score": (integer between 1 and 10),
                "summary": "A one-sentence summary of the answer",
                "improvement": "One specific tip to make the answer better"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Clean up the text (remove markdown like \`\`\`json)
        const text = response.text().replace(/```json|```/g, "").trim();
        
        const jsonResponse = JSON.parse(text);
        res.json(jsonResponse);

    } catch (error) {
        console.error("Evaluation Error:", error);
        res.status(500).json({ error: "Failed to process the AI response." });
    }
});

// --- ENDPOINT 2: Rank Multiple Candidates (Assignment Requirement) ---
app.post('/rank-candidates', async (req, res) => {
    try {
        const { candidates } = req.body; 
        // Expected Input: { "candidates": [{ "name": "Tanvi", "answer": "..." }, { "name": "Bob", "answer": "..." }] }

        if (!candidates || !Array.isArray(candidates)) {
            return res.status(400).json({ error: "Invalid input. Please provide an array of candidates." });
        }

        console.log(`Processing ${candidates.length} candidates...`);

        // Process all candidates in parallel (Faster)
        const results = await Promise.all(candidates.map(async (candidate) => {
            const prompt = `
                Evaluate this technical interview answer.
                Answer: "${candidate.answer}"
                
                Return a STRICT JSON object (no markdown) with:
                {
                    "score": (integer 1-10),
                    "summary": "Short summary",
                    "improvement": "Short tip"
                }
            `;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().replace(/```json|```/g, "").trim();
                const data = JSON.parse(text);

                return {
                    name: candidate.name,
                    score: data.score,
                    summary: data.summary,
                    improvement: data.improvement
                };
            } catch (err) {
                // If one candidate fails, return a default object so the server doesn't crash
                return { name: candidate.name, score: 0, error: "Failed to evaluate" };
            }
        }));

        // Sort candidates by score (Highest first)
        results.sort((a, b) => b.score - a.score);

        res.json({ results });

    } catch (error) {
        console.error("Ranking Error:", error);
        res.status(500).json({ error: "Ranking failed" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});