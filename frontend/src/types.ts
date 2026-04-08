export type ArenaModelId =
  | "openai:gpt-4o"
  | "anthropic:claude-sonnet"
  | "google:gemini-1.5-pro"
  | "nvidia:llama-3.1-8b-instruct"
  | "mistral:mistral-large"
  | "cohere:command-r-plus";

export interface ModelMetrics {
  hallucinationRate: number;
  correctnessScore: number;
  relevanceScore: number;
  confidenceScore: number;
  latencyMs: number;
  tokensUsed: number;
}

export interface SourceCitation {
  title: string;
  publisher: string;
  url: string;
  excerpt: string;
}

export interface ModelResult {
  modelId: ArenaModelId;
  name: string;
  response: string;
  sources: SourceCitation[];
  metrics: ModelMetrics;
  compositeScore: number;
  error?: string;
}

export interface ArenaResponse {
  results: ModelResult[];
  winner: string;
  evaluatedAt: string;
  recommendedAnswer: string;
  recommendedSources: SourceCitation[];
}
