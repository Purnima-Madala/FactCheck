import axios from "axios";

const MODEL_ID = "anthropic:claude-sonnet";

export const anthropicAdapter = {
  modelId: MODEL_ID,
  name: "Anthropic Claude Sonnet",
  isConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
  async fetchResponse(prompt) {
    const startedAt = Date.now();
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-5-sonnet-latest",
        max_tokens: 1024,
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        },
        timeout: 60_000
      }
    );

    const text = response.data.content?.map((item) => item.text).join(" ") || "";

    return {
      text,
      latencyMs: Date.now() - startedAt,
      tokensUsed:
        (response.data.usage?.input_tokens || 0) +
        (response.data.usage?.output_tokens || 0),
      rawMetadata: response.data
    };
  }
};
