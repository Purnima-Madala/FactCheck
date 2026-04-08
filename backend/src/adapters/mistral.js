import axios from "axios";

const MODEL_ID = "mistral:mistral-large";

export const mistralAdapter = {
  modelId: MODEL_ID,
  name: "Mistral Large",
  async fetchResponse(prompt) {
    const startedAt = Date.now();
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-large-latest",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60_000
      }
    );

    const text = response.data.choices?.[0]?.message?.content || "";

    return {
      text,
      latencyMs: Date.now() - startedAt,
      tokensUsed: response.data.usage?.total_tokens || 0,
      rawMetadata: response.data
    };
  }
};
