import express from "express";
import bodyParser from "body-parser";
const app = express();
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyArCUThZWgz0T1qASHvj-SG8DjnfNYlTyQ");

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:5173" }));

// parse application/json
app.use(bodyParser.json());

async function run(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

app.post("/", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await run(prompt);
    res.json({ response,prompt });
  } catch (error) {
    console.error("Error generating content", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.listen(3000, (req, res) => {
  console.log("Server running on port 3000");
});
