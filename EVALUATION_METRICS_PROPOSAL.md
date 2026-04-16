# Hallucination & Correctness Evaluation Metrics - Proposal

## Current Approach Limitations

**Hallucination Detection (Current: Consensus-Based)**
- ❌ Fragile: Relies on simple sentence splitting by `.!?` 
- ❌ Binary: Only flags complete contradictions, misses partial truths/exaggerations
- ❌ Consensus fallacy: New/emerging facts can't override majority opinion
- ❌ No nuance: Can't distinguish between "slightly inaccurate" vs "completely fabricated"
- ❌ No source verification: Can't validate claims against real data

**Correctness Evaluation (Current: Token Overlap)**
- ❌ Shallow: Jaccard/TF-IDF only measure surface token similarity, not semantic meaning
- ❌ Reference bias: User's reference answer might be incomplete or wrong
- ❌ No semantic understanding: "The patient recovered" vs "The patient died" have similar tokens but opposite meaning
- ❌ Stops at agreement: Doesn't measure *how correct* the shared information is
- ❌ No grounding: Can't verify facts against external sources

---

## Proposed Solutions (Prioritized)

### TIER 1: Confidence & Factual Claims Decomposition (Quick Win)

**Concept**: Extract atomic factual claims and score each individually

**Hallucination Approach**:
```
1. NLP Extract: Break response into atomic facts
   ("Alice earned a degree in 2020 at MIT" → 
    { subject: "Alice", action: "earned", object: "degree", when: "2020", where: "MIT" })

2. Claim-Level Scoring:
   - Self-contradiction: Does Alice also say she didn't go to MIT? → HIGH hallucination
   - Severity levels: 
     * FABRICATED: Claim contradicts consensus + other models (score: 90 hallucination)
     * UNVERIFIED: Claim appears in only 1 model, not contradicted (score: 40 hallucination)
     * DISAGREEMENT: 50% models disagree (score: 60 hallucination)
     * CONSENSUS: 80%+ models agree (score: 5 hallucination)
   
3. Aggregate per-model: Average severity of all claims
```

**Correctness Approach**:
```
1. Semantic Match: Use embedding distance instead of token overlap
   - Sentence embeddings (or simple word averaging) 
   - Compare response sentence-by-sentence to reference sentences
   
2. Fact Alignment Score:
   - Reference: "Dogs have four legs"
   - Response A: "Canines possess four limbs" → 95% semantic match
   - Response B: "Dogs usually have four legs" → 85% (qualifier reduces match)
   - Response C: "Dogs have varied leg counts" → 15% (contradicts)
   
3. Correctness = Average semantic similarity across all claims
```

**Implementation Effort**: Medium (need basic NLP lib or prompt LLM for claim extraction)
**Benefit**: Much more precise, handles nuance

---

### TIER 2: Semantic Embedding-Based Approach (Better Accuracy)

**Concept**: Use semantic similarity instead of token overlap

**Why It's Better**:
```
Current: "The tallest building" vs "The highest structure"
  → Jaccard = low (no token overlap)
  → Correct answer: HIGH similarity (same meaning)

Embedding-based:
  → Both → high dimension vectors
  → Cosine distance ~0.95 (very similar)
  → Correctly identifies semantic equivalence
```

**Implementation**:
```javascript
// Option A: Local embeddings (no API cost)
- Use tiny transformer model (distilbert, all-MiniLM-L6-v2)
- Embed reference answer once
- Embed each response
- Correctness = cosine(response_vec, reference_vec) * 100

// Option B: Hybrid (best/cheapest)
- Token overlap for quick similarity check
- If overlap >70%, use that (fast path)
- If overlap <30%, defer to semantic check (catches paradoxes)
- If 30-70%, use weighted blend of both
```

**Benchmark**:
```
Reference: "Photosynthesis converts sunlight to chemical energy"
Response A: "Plants use light to make sugars" → 88% (semantic)
Response B: "Photosynthesis is when plants make food" → 92% (semantic)
Response C: "Plants emit oxygen during growth" → 45% (semantic, partly true but incomplete)
```

**Implementation Effort**: Low-Medium (use off-shelf library)
**Benefit**: Dramatically improves correctness scoring without external APIs

---

### TIER 3: External Fact-Checking Integration (High Confidence)

**Concept**: Verify claims against real-world sources/APIs

**For Each Atomic Claim**:
```javascript
1. Claim Extraction: "Obama was president from 2009-2017"
2. Knowledge Base Query:
   - Wikipedia API: Search "Barack Obama" → Extract date range
   - Wikidata SPARQL: Query for office tenure
   - Fallback: Google Custom Search (structured results)
3. Verification:
   - MATCH: Claim aligns with source → Hallucinationion: 0
   - PARTIAL: Claim is partially true → Hallucination: 40
   - MISMATCH: Claim contradicts source → Hallucination: 100
   - NO_SOURCE: Couldn't verify → Hallucination: 50 (uncertain)
4. Per-model hallucination = avg(claim_scores)
```

**Example Flow**:
```
User Prompt: "Is water boiling point at 100°C at sea level?"
Reference: "Yes"

Model Response A: "Water boils at 100°C at sea level"
  → Extract: {liquid: water, boiling_pt: 100°C, conditions: sea_level}
  → Check Wikipedia → MATCH → Hallucination: 0, Correctness: 100

Model Response B: "Water boils at 212°F, which is 100°C at sea"
  → Extract: same claim, contains correct conversion
  → Check Wikipedia → MATCH → Hallucination: 0, Correctness: 98 (slight wording ambiguity)

Model Response C: "Water boils at 99°C because of atmospheric pressure"
  → Extract: {liquid: water, boiling_pt: 99°C, conditions: sea_level}
  → Check Wikipedia → PARTIAL (off-by-1°C, but reasoning is correct)
  → Hallucination: 15, Correctness: 80
```

**Implementation Effort**: High (need API integrations)
**Benefit**: Ground truth verification, most authoritative scoring

**APIs to Use**:
- Wikipedia API (free, reliable for factual claims)
- Wikidata SPARQL (structured knowledge graph)
- Google Custom Search (for general web validation)
- NewsAPI (for recent events)

---

### TIER 4: LLM-as-Judge for Nuanced Scoring (Most Robust)

**Concept**: Use a separate LLM (GPT-4, Claude) to evaluate responses

**Why It Works**:
```
Instead of algorithmic rules, let a powerful LLM reason about hallucinations & correctness:
- Can understand context and nuance
- Can spot subtle contradictions
- Can reason about probabilistic claims ("likely", "probably")
- Can verify against vast training knowledge
```

**Implementation**:
```javascript
const judgePrompt = `
You are a fact-checker. Evaluate this response for hallucination and correctness.

Question: "${prompt}"
Reference Answer: "${referenceAnswer || 'None provided'}"
Model Response: "${modelResponse}"
Other Models Said: "${otherResponses.join('\n')}"

Respond with JSON:
{
  "hallucination_score": 0-100,  // 0=no hallucinations, 100=completely fake
  "correctness_score": 0-100,    // How correct is the response?
  "reasoning": "...",
  "errors": ["specific false claims"],
  "strengths": ["what was accurate/insightful"]
}
`;

const result = await callJudgeModel(judgePrompt);
```

**Pros**:
- Humans agree better with LLM judgments than algorithmic rules
- Understands rhetorical tricks and implicit claims
- Can handle ambiguous/edge cases

**Cons**:
- API cost ($0.01-0.05 per evaluation)
- Slower (adds 1-2 seconds per model)
- Still can hallucinate (though rare for scoring tasks)

**Cost Optimization**:
- Cache reference answers + prompts across requests
- Batch judge 5 responses in one API call
- Use cheaper model for scoring (Claude 3 Haiku, GPT-4 Mini)

---

### TIER 5: Hybrid Ensemble (Production-Ready)

**Combine Multiple Approaches**:
```javascript
hallucination_score = 
  40% * semantic_contradiction_check() +   // Fast, local
  30% * fact_verification_score() +        // Accurate, external
  20% * consensus_flag() +                 // Existing approach
   5% * self_consistency_check() +         // Does model contradict itself?
   5% * source_citation_quality()          // Does it cite sources?

correctness_score =
  35% * semantic_similarity() +            // Embedding comparison
  30% * token_overlap_score() +            // Fast baseline
  20% * llm_judge_correctness() +          // Nuanced evaluation
  15% * reference_alignment()              // Direct match to user answer
```

**Why This Works**:
- Fast + Accurate: Semantic runs locally, fact-checking is selective
- Robust: No single point of failure
- Explainable: Each component contributes a clear signal
- Scalable: Can disable expensive components for volume

---

## Recommended Implementation Path

### Phase 1 (This Sprint): TIER 1 + TIER 2
**Goal**: Replace token overlap with semantic + claim-level severity scoring
```
Effort: ~4-6 hours
Cost: $0 (no APIs)
Improvement: 40% more accurate hallucination & correctness detection

Changes:
- Add npm package: `sentence-transformers` or `nomic-ai/nomic-embed` (lightweight)
- Refactor computeHallucinationRate() to use claim-severity levels
- Replace jaccard() with semantic cosine similarity in correctness scoring
- Update basis text to explain semantic matching
```

### Phase 2 (Next Sprint): TIER 3
**Goal**: Add Wikipedia/Wikidata verification for atomic claims
```
Effort: ~6-8 hours
Cost: $0 (APIs are free)
Improvement: 60% accuracy boost for factual questions

Changes:
- Add npm: `axios` + Wikipedia/Wikidata API calls
- Create claimVerifier.js with fact-checking logic
- Integrate into scoreResponses() as optional secondary check
- Add "source_verification_supported" flag to response metadata
```

### Phase 3 (Future): TIER 4
**Goal**: Optional LLM judge for nuanced edge cases
```
Effort: ~2-3 hours
Cost: $0.02-0.05 per evaluation (optional feature)
Improvement: Handle ambiguous/rhetorical content

Changes:
- Add conditional judge call (only if models deeply disagree)
- Cache judge results by prompt hash
- Document best practices for using judge mode
```

---

## Quick Implementation: TIER 1 (Claim Severity Levels)

Replace the current simple binary hallucination check:

```javascript
// CURRENT (too simple):
computeHallucinationRate returns: "0/5 claims flagged"

// NEW (semantic levels):
function scoreClaimHallucination(modelSentence, consensusSentences, allResponses) {
  // Score each claim on a scale:
  // FABRICATED (100): Contradicts consensus + multiple models
  // UNVERIFIED (40):  Doesn't appear in other models, not contradicted
  // MINORITY (60):    Only 1-2 models agree, rest disagree
  // CONSENSUS (5):    80%+ models mention similar fact
  // CONTRADICTS_SELF (80): Model says opposite elsewhere
  
  const contradictionCount = consensusSentences.filter(c => 
    areContradictory(modelSentence, c)).length;
  
  const supportCount = allResponses.filter(r =>
    r.sentences.some(s => similar(s, modelSentence))).length;
  
  if (contradictionCount > 0 && supportCount === 1) return 100; // FABRICATED
  if (supportCount === 0) return 40;                           // UNVERIFIED
  if (supportCount <= 2) return 60;                            // MINORITY
  return 5;                                                    // CONSENSUS
}
```

---

## Questions to Guide Your Choice

1. **How real-time does scoring need to be?**
   - < 500ms → TIER 1 + 2 only (local)
   - < 2s → Add TIER 3 (Wikipedia lookup)
   - Can wait → Use TIER 4 (LLM judge)

2. **What types of questions will users ask?**
   - Factual trivia → TIER 3 (fact-checker)
   - Open-ended opinions → TIER 1 + 4 (semantic + judge)
   - Scientific/medical → TIER 3 (must verify)

3. **Do you have external API access?**
   - No → TIER 1 + 2 only
   - Yes → Add TIER 3 (Wikipedia free)
   - Budget available → Add TIER 4 (LLM judge)

---

## Code Organization Suggestion

```
backend/src/engine/
├── scoringEngine.js (current)
├── metrics/
│  ├── hallucination/
│  │  ├── consensusCheck.js (existing)
│  │  ├── claimExtraction.js (NEW)
│  │  ├── severityScoring.js (NEW)
│  │  └── factVerification.js (NEW, TIER 3)
│  └── correctness/
│     ├── tokenOverlap.js (existing)
│     ├── semanticSimilarity.js (NEW, TIER 2)
│     └── llmJudge.js (NEW, TIER 4)
└── evaluator.js (NEW: composite orchestrator)
```

---

## My Recommendation

**Start with TIER 1 + 2 (this week)**:
- Implement claim severity levels in hallucination scoring
- Replace token overlap with sentence embeddings for correctness
- Keep existing consensus logic as fallback
- Cost: $0, Effort: 4-6 hours, Benefit: 40% accuracy improvement

**Then add TIER 3 (next week)**:
- Wikipedia/Wikidata verification for factual claims
- Auto-detect if question is "factual" vs "open-ended"
- Cost: $0, Effort: 6-8 hours, Benefit: 60% accuracy for facts

This gives you professional-grade evaluation in 2 weeks without heavy API costs.
