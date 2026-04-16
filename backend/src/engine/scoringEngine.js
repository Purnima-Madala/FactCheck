import {
  areContradictory,
  countHedges,
  jaccard,
  normalizeSentence,
  splitSentences,
  tfidfCosine,
  tokenize
} from "./metricUtils.js";

/**
 * Scores all model responses and returns metrics plus composite rankings.
 * @param {Array<{modelId: string, name: string, response: string, latencyMs: number, tokensUsed: number, rawMetadata: unknown}>} items
 * @param {string} prompt
 * @param {string | undefined} referenceAnswer
 * @returns {Array<{modelId: string, name: string, response: string, metrics: {hallucinationRate: number, hallucinationFlaggedClaims: number, hallucinationTotalClaims: number, correctnessScore: number, relevanceScore: number, confidenceScore: number, latencyMs: number, tokensUsed: number}, basis: {hallucination: string, correctness: string}, compositeScore: number}>}
 */
export function scoreResponses(items, prompt, referenceAnswer) {
  const promptTokens = tokenize(prompt);
  const tokenCorpus = [promptTokens, ...items.map((item) => tokenize(item.response))];

  const sentenceMatrix = items.map((item) => splitSentences(item.response));
  const sentenceFrequency = buildSentenceFrequency(sentenceMatrix);
  const consensusSentences = [...sentenceFrequency.entries()]
    .filter(([, count]) => count >= Math.ceil(items.length / 2))
    .map(([sentence]) => sentence);

  return items.map((item, index) => {
    const responseTokens = tokenize(item.response);

    const relevanceScore = clamp(
      tfidfCosine(promptTokens, responseTokens, tokenCorpus) * 100,
      0,
      100
    );

    const hallucinationStats = computeHallucinationRate(
      sentenceMatrix[index],
      sentenceFrequency,
      consensusSentences
    );
    const hallucinationRate = hallucinationStats.rate;

    const correctnessScore = referenceAnswer
      ? clamp(
          jaccard(responseTokens, tokenize(referenceAnswer)) * 100,
          0,
          100
        )
      : computeConsensusCorrectness(index, items);

    const confidenceScore = computeConfidenceScore(item.response);

    const compositeScore = clamp(
      correctnessScore * 0.35 +
        relevanceScore * 0.25 +
        (100 - hallucinationRate) * 0.25 +
        confidenceScore * 0.15,
      0,
      100
    );

    return {
      modelId: item.modelId,
      name: item.name,
      response: item.response,
      metrics: {
        hallucinationRate: round2(hallucinationRate),
        hallucinationFlaggedClaims: hallucinationStats.flagged,
        hallucinationTotalClaims: hallucinationStats.total,
        correctnessScore: round2(correctnessScore),
        relevanceScore: round2(relevanceScore),
        confidenceScore: round2(confidenceScore),
        latencyMs: item.latencyMs,
        tokensUsed: item.tokensUsed
      },
      basis: {
        hallucination: buildHallucinationBasis(hallucinationStats),
        correctness: buildCorrectnessBasis(referenceAnswer, responseTokens)
      },
      compositeScore: round2(compositeScore)
    };
  });
}

/**
 * Computes per-model hallucination by identifying unique claims that contradict consensus claims.
 * @param {string[]} modelSentences
 * @param {Map<string, number>} sentenceFrequency
 * @param {string[]} consensusSentences
 * @returns {{rate: number, flagged: number, total: number, consensusCount: number}}
 */
export function computeHallucinationRate(modelSentences, sentenceFrequency, consensusSentences) {
  if (!modelSentences.length) {
    return {
      rate: 100,
      flagged: 0,
      total: 0,
      consensusCount: consensusSentences.length
    };
  }

  let flagged = 0;

  for (const sentence of modelSentences) {
    const normalized = normalizeSentence(sentence);
    const frequency = sentenceFrequency.get(normalized) || 0;

    if (frequency > 1) {
      continue;
    }

    const contradictory = consensusSentences.some((consensusSentence) =>
      areContradictory(sentence, consensusSentence)
    );

    if (contradictory) {
      flagged += 1;
    }
  }

  return {
    rate: (flagged / modelSentences.length) * 100,
    flagged,
    total: modelSentences.length,
    consensusCount: consensusSentences.length
  };
}

/**
 * Computes correctness without reference text by measuring pairwise agreement among models.
 * @param {number} targetIndex
 * @param {Array<{response: string}>} items
 * @returns {number}
 */
export function computeConsensusCorrectness(targetIndex, items) {
  const target = tokenize(items[targetIndex].response);
  const corpus = items.map((item) => tokenize(item.response));

  if (items.length <= 1) {
    return 50;
  }

  let score = 0;
  for (let i = 0; i < items.length; i += 1) {
    if (i === targetIndex) {
      continue;
    }
    score += tfidfCosine(target, corpus[i], corpus);
  }

  const average = score / (items.length - 1);
  return clamp(average * 100, 0, 100);
}

/**
 * Computes confidence using hedge phrase frequency and response brevity penalties.
 * @param {string} response
 * @returns {number}
 */
export function computeConfidenceScore(response) {
  const tokenCount = tokenize(response).length;
  const hedgeCount = countHedges(response);

  let confidence = 100;
  confidence -= Math.min(hedgeCount * 8, 48);

  if (tokenCount < 20) {
    confidence -= 25;
  } else if (tokenCount < 40) {
    confidence -= 12;
  }

  return clamp(confidence, 0, 100);
}

function buildSentenceFrequency(sentenceMatrix) {
  const frequency = new Map();
  for (const sentences of sentenceMatrix) {
    const seen = new Set();
    for (const sentence of sentences) {
      const normalized = normalizeSentence(sentence);
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      frequency.set(normalized, (frequency.get(normalized) || 0) + 1);
    }
  }
  return frequency;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function buildHallucinationBasis(stats) {
  const summary = `${stats.flagged}/${stats.total || 0} unique claims contradicted consensus statements.`;
  return `${summary} Consensus pool size: ${stats.consensusCount}. Lower contradiction means lower hallucination.`;
}

function buildCorrectnessBasis(referenceAnswer, responseTokens) {
  if (referenceAnswer) {
    return `Correctness is token-overlap similarity against your reference answer (${responseTokens.length} response tokens evaluated).`;
  }

  return "Correctness is consensus similarity against the other model responses when no reference answer is provided.";
}
