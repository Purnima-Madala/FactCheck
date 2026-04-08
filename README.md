# NeuralArena

NeuralArena is a production-grade AI hallucination and quality benchmarking dashboard. It sends one prompt to multiple LLM providers in parallel and ranks model responses using computed factual and quality metrics.

## Architecture Diagram

```text
+-----------------------+         HTTP POST /api/arena/evaluate        +---------------------------+
|   Frontend (Vite)     | --------------------------------------------> |   Backend (Express API)   |
|  React + Zustand +    |                                               |                           |
|  Framer + Three.js    | <-------------------------------------------- |  Scored results + winner  |
+-----------+-----------+                                               +-------------+-------------+
            |                                                                       |
            | State + UI render                                                      |
            v                                                                       v
+-------------------------------+                                     +-------------------------------+
| PromptInput / ModelCard /     |                                     | Adapter Layer (parallel)       |
| Radar / Leaderboard / 3D      |                                     | OpenAI | Anthropic | Gemini    |
+-------------------------------+                                     | Mistral | Cohere              |
                                                                       +---------------+---------------+
                                                                                       |
                                                                                       v
                                                                        +-------------------------------+
                                                                        | Scoring Engine                |
                                                                        | TF-IDF relevance              |
                                                                        | Consensus hallucination       |
                                                                        | Correctness + confidence      |
                                                                        +-------------------------------+
```

## Project Tree

```text
neuralArena/
  backend/
    src/
      adapters/
        openai.js
        anthropic.js
        gemini.js
        mistral.js
        cohere.js
      engine/
        metricUtils.js
        scoringEngine.js
      middleware/
        rateLimiter.js
        errorHandler.js
      routes.js
      server.js
  frontend/
    src/
      components/
        3d/
          NeuralOrb.tsx
          ArenaScene.tsx
        ui/
          PromptInput.tsx
          ModelCard.tsx
          MetricsRadar.tsx
          Leaderboard.tsx
          HallucBadge.tsx
      hooks/
        useArenaQuery.ts
      store/
        arenaStore.ts
      utils/
        scoreFormatter.ts
      App.tsx
      main.tsx
      index.css
  package.json
```

## Setup

1. Install dependencies:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. Create environment files:

Backend `.env`:

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
MISTRAL_API_KEY=
COHERE_API_KEY=
PORT=3001
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001
```

3. Run development:

```bash
npm run dev
```

## API Contract

`POST /api/arena/evaluate`

Request body:

```json
{
  "prompt": "Explain photosynthesis simply",
  "referenceAnswer": "Optional ground truth text",
  "models": [
    "openai:gpt-4o",
    "anthropic:claude-sonnet",
    "google:gemini-1.5-pro",
    "mistral:mistral-large",
    "cohere:command-r-plus"
  ]
}
```

Response body:

```json
{
  "results": [
    {
      "modelId": "openai:gpt-4o",
      "name": "OpenAI GPT-4o",
      "response": "...",
      "metrics": {
        "hallucinationRate": 12.3,
        "correctnessScore": 79.4,
        "relevanceScore": 88.1,
        "confidenceScore": 85.0,
        "latencyMs": 1240,
        "tokensUsed": 438
      },
      "compositeScore": 82.7
    }
  ],
  "winner": "openai:gpt-4o",
  "evaluatedAt": "2026-04-08T08:00:00.000Z"
}
```

## Scoring Methodology

1. Relevance Score
- Tokenize prompt and response.
- Build TF-IDF vectors from the local corpus (prompt + all responses).
- Compute cosine similarity and scale to 0-100.

2. Hallucination Rate
- Split each response into sentences.
- Build cross-model sentence frequency map.
- Unique statements that contradict majority-consensus statements are flagged.
- Hallucination rate is flagged sentences divided by total sentences.

3. Correctness Score
- If `referenceAnswer` exists: Jaccard overlap against reference tokens.
- Otherwise: inter-model consensus via TF-IDF similarity against peer responses.

4. Confidence Score
- Penalize hedging phrases (`I think`, `possibly`, etc.).
- Penalize short responses to reduce unsupported terse assertions.

5. Composite Score

$$
\text{Composite} =
(0.35 \cdot \text{Correctness}) +
(0.25 \cdot \text{Relevance}) +
(0.25 \cdot (100 - \text{Hallucination})) +
(0.15 \cdot \text{Confidence})
$$

## Notes

- Provider calls run in parallel with `Promise.allSettled`.
- Partial provider failures are returned with model-level error states.
- Scoring engine is isolated and unit-testable without provider calls.
