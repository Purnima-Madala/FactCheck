const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "by",
  "is",
  "are",
  "was",
  "were",
  "be",
  "it",
  "that",
  "this",
  "as",
  "at",
  "from",
  "about"
]);

export const HEDGE_PATTERNS = [
  /\bi think\b/gi,
  /\bmight be\b/gi,
  /\bi'm not sure\b/gi,
  /\bpossibly\b/gi,
  /\bperhaps\b/gi,
  /\bmay be\b/gi,
  /\bcould be\b/gi,
  /\blikely\b/gi,
  /\buncertain\b/gi
];

export const NEGATION_TOKENS = new Set(["not", "never", "no", "none", "without"]);

/**
 * Splits text into lowercase normalized tokens while removing punctuation and stop words.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Splits a response into candidate factual statements.
 * @param {string} text
 * @returns {string[]}
 */
export function splitSentences(text) {
  return (text || "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * Produces a canonical form for robust sentence matching.
 * @param {string} sentence
 * @returns {string}
 */
export function normalizeSentence(sentence) {
  return (sentence || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Computes cosine similarity between two token-frequency vectors.
 * @param {Map<string, number>} v1
 * @param {Map<string, number>} v2
 * @returns {number}
 */
export function cosineMapSimilarity(v1, v2) {
  const keys = new Set([...v1.keys(), ...v2.keys()]);
  let dot = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (const key of keys) {
    const a = v1.get(key) || 0;
    const b = v2.get(key) || 0;
    dot += a * b;
    mag1 += a * a;
    mag2 += b * b;
  }

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

/**
 * Converts token arrays into weighted TF-IDF vectors and computes cosine similarity.
 * @param {string[]} docA
 * @param {string[]} docB
 * @param {string[][]} corpus
 * @returns {number}
 */
export function tfidfCosine(docA, docB, corpus) {
  const vocabulary = new Set([...docA, ...docB]);
  const docCount = Math.max(corpus.length, 1);

  const idf = new Map();
  for (const term of vocabulary) {
    let docsContaining = 0;
    for (const doc of corpus) {
      if (doc.includes(term)) {
        docsContaining += 1;
      }
    }
    const value = Math.log((docCount + 1) / (docsContaining + 1)) + 1;
    idf.set(term, value);
  }

  const tfA = termFrequency(docA);
  const tfB = termFrequency(docB);

  const vecA = new Map();
  const vecB = new Map();

  for (const term of vocabulary) {
    vecA.set(term, (tfA.get(term) || 0) * (idf.get(term) || 0));
    vecB.set(term, (tfB.get(term) || 0) * (idf.get(term) || 0));
  }

  return cosineMapSimilarity(vecA, vecB);
}

/**
 * Computes set overlap similarity (Jaccard) for correctness checks against reference text.
 * @param {string[]} tokensA
 * @param {string[]} tokensB
 * @returns {number}
 */
export function jaccard(tokensA, tokensB) {
  const a = new Set(tokensA);
  const b = new Set(tokensB);
  const union = new Set([...a, ...b]);

  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) {
      intersection += 1;
    }
  }

  if (!union.size) {
    return 0;
  }

  return intersection / union.size;
}

/**
 * Detects contradiction by checking high token overlap plus mismatched negation polarity.
 * @param {string} sentenceA
 * @param {string} sentenceB
 * @returns {boolean}
 */
export function areContradictory(sentenceA, sentenceB) {
  const tokensA = tokenize(sentenceA);
  const tokensB = tokenize(sentenceB);

  if (!tokensA.length || !tokensB.length) {
    return false;
  }

  const overlap = jaccard(tokensA, tokensB);
  if (overlap < 0.35) {
    return false;
  }

  const hasNegA = tokensA.some((token) => NEGATION_TOKENS.has(token));
  const hasNegB = tokensB.some((token) => NEGATION_TOKENS.has(token));

  if (hasNegA !== hasNegB) {
    return true;
  }

  const polarityOpposites = [
    ["always", "never"],
    ["increase", "decrease"],
    ["higher", "lower"],
    ["true", "false"]
  ];

  return polarityOpposites.some(([left, right]) => {
    const leftInA = tokensA.includes(left);
    const rightInA = tokensA.includes(right);
    const leftInB = tokensB.includes(left);
    const rightInB = tokensB.includes(right);
    return (leftInA && rightInB) || (rightInA && leftInB);
  });
}

/**
 * Counts occurrences of hedge phrases to estimate uncertainty.
 * @param {string} text
 * @returns {number}
 */
export function countHedges(text) {
  let total = 0;
  for (const pattern of HEDGE_PATTERNS) {
    const matches = text.match(pattern);
    total += matches ? matches.length : 0;
  }
  return total;
}

function termFrequency(tokens) {
  const frequency = new Map();
  if (!tokens.length) {
    return frequency;
  }

  for (const token of tokens) {
    frequency.set(token, (frequency.get(token) || 0) + 1);
  }

  for (const [term, count] of frequency.entries()) {
    frequency.set(term, count / tokens.length);
  }

  return frequency;
}
