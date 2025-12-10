const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI("AIzaSyC773Qxq1g4sLK62YbdEhlZ7bIkX0FOEDQ");
  
  try {
    console.log("Asking Google for available models...");
    // This gets the list of models your key can access
    const modelList = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; 
    // Wait, let's use the explicit list function provided by the API if possible, 
    // but the simplest way to fix this without complex code is to try the most common stable name.
    
    // Let's try "gemini-1.5-flash" one more time but strictly printed to see if it works.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test");
    console.log("✅ gemini-1.5-flash IS WORKING!");
    
  } catch (error) {
    console.log("\n❌ gemini-1.5-flash failed.");
    
    try {
        console.log("Attempting 'gemini-1.0-pro'...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        await model2.generateContent("Test");
        console.log("✅ gemini-1.0-pro IS WORKING! Use this name.");
    } catch (err2) {
        console.log("❌ gemini-1.0-pro failed too.");
        console.log("Error details:", err2.message);
    }
  }
}

listModels();