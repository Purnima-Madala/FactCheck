/**
 * TIER 1: Claim Severity-Based Hallucination Scoring
 * 
 * Instead of simple "flagged vs total", score each claim on a severity scale:
 * - FABRICATED (100): Contradicts consensus + minimal model support
 * - UNVERIFIED (40): Appears in only 1 model, no contradiction
 * - MINORITY (60): Models disagree significantly
 * - CONSENSUS (5): 80%+ models agree
 * - SELF_CONTRADICTION (80): Model contradicts itself
 * 
 * Hallucination Rate = average severity of all claims
 */

export function computeHallucinationBySeverity(
  modelSentences,
  sentenceFrequency,
  consensusSentences,
  modelResponse
) {
  if (!modelSentences.length) {
    return {
      rate: 100,
      flagged: 0,
      total: 0,
      claimScores: [],
      severity: "EMPTY_RESPONSE"
    };
  }

  const claimScores = [];

  for (const sentence of modelSentences) {
    const normalized = normalizeSentence(sentence);
    if (!normalized) continue;

    const frequency = sentenceFrequency.get(normalized) || 0;
    const totalModels = Math.max(Array.from(sentenceFrequency.values()).filter(v => v > 0).length, 1);
    const modelsWithClaim = frequency;
    const modelsWithoutClaim = totalModels - modelsWithClaim;

    let score = 5; // default: CONSENSUS
    let severity = "CONSENSUS";

    // Check for self-contradiction
    if (hasSelfContradiction(modelResponse, sentence)) {
      score = 80;
      severity = "SELF_CONTRADICTION";
    }
    // Check for consensus contradiction
    else if (
      consensusSentences.some((cs) => areContradictory(sentence, cs)) &&
      modelsWithClaim <= 1
    ) {
      score = 100;
      severity = "FABRICATED";
    }
    // Minority opinion (1-2 models out of many)
    else if (modelsWithClaim <= 2 && totalModels >= 3) {
      score = 60;
      severity = "MINORITY";
    }
    // Unverified (unique to this model)
    else if (modelsWithClaim === 1) {
      score = 40;
      severity = "UNVERIFIED";
    }
    // Weak consensus (50-79%)
    else if ((modelsWithClaim / totalModels) * 100 < 80) {
      score = 25;
      severity = "WEAK_CONSENSUS";
    }

    claimScores.push({ sentence, score, severity, frequency });
  }

  const avgScore = claimScores.length
    ? claimScores.reduce((sum, c) => sum + c.score, 0) / claimScores.length
    : 100;

  return {
    rate: avgScore,
    flagged: claimScores.filter((c) => c.score > 50).length,
    total: claimScores.length,
    claimScores,
    severity: classifyOverallSeverity(avgScore)
  };
}

function hasSelfContradiction(response, claim) {
  // Split response into sentences and check if any contradict the given claim
  const sentences = splitSentences(response);
  const contradictingSentences = sentences.filter(
    (s) => s !== claim && areContradictory(s, claim)
  );
  return contradictingSentences.length > 0;
}

function classifyOverallSeverity(avgScore) {
  if (avgScore > 80) return "HIGHLY_FABRICATED";
  if (avgScore > 60) return "LIKELY_HALLUCINATED";
  if (avgScore > 40) return "POSSIBLY_UNVERIFIED";
  if (avgScore > 20) return "MOSTLY_VERIFIED";
  return "VERIFIED";
}

function buildHallucinationBasisV2(stats) {
  const breakdown = stats.claimScores
    .slice(0, 3)
    .map((c) => `"${c.sentence.slice(0, 50)}..." (${c.severity})`)
    .join("; ");

  return `Overall Severity: ${stats.severity}. ${stats.flagged}/${stats.total} claims flagged as potential issues. ` +
         `Sample issues: ${breakdown || "None detected"}`;
}

// Export updated scorer
export function scoreResponsesV2(items, prompt, referenceAnswer) {
  // ... existing code ...
  // But replace: computeHallucinationRate() with computeHallucinationBySeverity()
  // And replace: buildHallucinationBasis() with buildHallucinationBasisV2()
}
