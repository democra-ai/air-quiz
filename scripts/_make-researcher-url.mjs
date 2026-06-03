import { calculateQuizResult } from '../lib/air_quiz_calculator.ts';
import { encodeSharePayload } from '../lib/share_payload.ts';

// A researcher's answers — crafted to land on ESRP "The Pressure Alchemist" (a clean 2-2 split:
// E + P favorable, S + R resistant). Illustrative example for the video.
const ans = [5,4,2,3, 2,2,4,4, 4,2,2,4, 2,4,2,2];
const core = Object.fromEntries(ans.map((a, i) => [`Q${i + 1}`, a]));
const r = calculateQuizResult({ core, snapshot: {}, survey: {} }, null);
const fin = (n, d) => (Number.isFinite(n) ? n : d);
for (const lang of ['zh', 'en']) {
  const enc = encodeSharePayload({
    riskLevel: r.riskLevel,
    replacementProbability: r.replacementProbability,
    predictedReplacementYear: fin(r.predictedReplacementYear, 2100),
    currentReplacementDegree: r.currentReplacementDegree,
    earliestYear: fin(r.confidenceInterval.earliest, 2035),
    latestYear: fin(r.confidenceInterval.latest, 2045),
    lang,
    profileCode: r.profileCode,
    dimAvg: r.dimensions.map((d) => d.rawAverage),
    coreAnswers: ans,
    snapshotMeasured: false,
  });
  console.log(`${lang}\thttps://air.democra.ai/share/${enc}`);
}
console.error(`profile=${r.profileCode} risk=${r.riskLevel} prob=${r.replacementProbability}`);
