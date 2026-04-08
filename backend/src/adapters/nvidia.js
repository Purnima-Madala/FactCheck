import axios from "axios";

const MODEL_ID = "nvidia:llama-3.1-8b-instruct";
const apiKey = process.env.NVIDIA_API_KEY;
const baseURL = process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1";
const modelId = process.env.NVIDIA_MODEL_ID || "meta/llama-3.1-8b-instruct";

export const nvidiaAdapter = {
  modelId: MODEL_ID,
  name: "NVIDIA Llama 3.1 8B Instruct",
  isConfigured: Boolean(apiKey),
  async fetchResponse(prompt) {
    const startedAt = Date.now();
    const response = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model: modelId,
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
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