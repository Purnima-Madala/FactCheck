import axios from "axios";

const MODEL_ID = "openai:gpt-4o";

export const openAIAdapter = {
  modelId: MODEL_ID,
  name: "OpenAI GPT-4o",
  isConfigured: Boolean(process.env.OPENAI_API_KEY),
  async fetchResponse(prompt) {
    const startedAt = Date.now();
    const response = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: "gpt-4o",
        input: prompt,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60_000
      }
    );

    const text =
      response.data.output_text ||
      response.data.output?.map((item) => item.content?.map((c) => c.text).join(" ")).join(" ") ||
      "";

    return {
      text,
      latencyMs: Date.now() - startedAt,
      tokensUsed: response.data.usage?.total_tokens || 0,
      rawMetadata: response.data
    };
  }
};
