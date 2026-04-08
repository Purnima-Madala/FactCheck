import axios from "axios";

const MODEL_ID = "google:gemini-1.5-pro";
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export const geminiAdapter = {
  modelId: MODEL_ID,
  name: "Google Gemini 1.5 Pro",
  isConfigured: Boolean(apiKey),
  async fetchResponse(prompt) {
    const startedAt = Date.now();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const response = await axios.post(
      url,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 }
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60_000
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.map((p) => p.text).join(" ") || "";

    return {
      text,
      latencyMs: Date.now() - startedAt,
      tokensUsed: response.data.usageMetadata?.totalTokenCount || 0,
      rawMetadata: response.data
    };
  }
};
