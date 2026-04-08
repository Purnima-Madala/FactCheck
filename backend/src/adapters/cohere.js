import axios from "axios";

const MODEL_ID = "cohere:command-r-plus";

export const cohereAdapter = {
  modelId: MODEL_ID,
  name: "Cohere Command R+",
  isConfigured: Boolean(process.env.COHERE_API_KEY),
  async fetchResponse(prompt) {
    const startedAt = Date.now();
    const response = await axios.post(
      "https://api.cohere.com/v2/chat",
      {
        model: "command-r-plus",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60_000
      }
    );

    const text = response.data.message?.content?.map((part) => part.text).join(" ") || "";

    return {
      text,
      latencyMs: Date.now() - startedAt,
      tokensUsed: response.data.usage?.tokens?.output_tokens || 0,
      rawMetadata: response.data
    };
  }
};
