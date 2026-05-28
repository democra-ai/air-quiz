/**
 * Validate the occupation guess across all 96 BLS occupations.
 *
 *   npx tsx scripts/validate-bls.mjs
 *
 * The guesser library IS the 96 BLS occupations. For each occupation we make
 * realistic perturbed scenarios and check:
 *   - exact:  the occupation itself in top-3
 *   - family: the #1 guess shares the occupation's archetype (same
 *             work-structure family) — the meaningful bar, since the
 *             16-question test groups by structure and can't split, say,
 *             "Secretaries" from "Receptionists".
 */

import { BLS_OCCUPATIONS } from '../lib/occupation_anchors.generated.ts';
import { QUESTION_WEIGHTS } from '../lib/occupation_inference.ts';

// Guess against the BLS library (weighted Euclidean, same metric as prod).
function guess(answers, topK = 3) {
  const scored = BLS_OCCUPATIONS.map((p) => {
    let sq = 0;
    for (let i = 0; i < 16; i++) {
      const diff = answers[i] - p.answers[i];
      sq += QUESTION_WEIGHTS[i] * diff * diff;
    }
    return { id: p.id, archetype: p.archetype, d: Math.sqrt(sq) };
  });
  scored.sort((a, b) => a.d - b.d);
  return scored.slice(0, topK);
}

function rng(seed){return function(){seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const clamp=(n)=>Math.max(1,Math.min(5,Math.round(n)));
const SOFT=[1,3,5,6,9,10,11,13,15];
function scenario(anchor, rand){
  const a=anchor.slice();
  const idxs=[...SOFT].sort(()=>rand()-0.5).slice(0,5);
  for(const i of idxs) a[i]=clamp(a[i]+(rand()<0.5?-1:1));
  if(rand()<0.4){const hard=[0,7,8,14][Math.floor(rand()*4)];a[hard]=clamp(a[hard]+(rand()<0.5?-1:1));}
  return a;
}

const N=4;
const G='\x1b[32m',R='\x1b[31m',Y='\x1b[33m',D='\x1b[2m',X='\x1b[0m';
const pad=(s,n)=>{s=String(s);return s.length>n?s.slice(0,n-1)+'…':s.padEnd(n);};

const rand=rng(99);
let exact3=0, fam1=0, total=0;
const famMiss=[], exactMiss=[];
for(const occ of BLS_OCCUPATIONS){
  for(let s=0;s<N;s++){
    const ans=scenario(occ.answers, rand);
    const g=guess(ans,3);
    const ids=g.map(x=>x.id);
    const okExact=ids.includes(occ.id);
    const okFam=g[0].archetype===occ.archetype;
    if(okExact) exact3++;
    if(okFam) fam1++; else famMiss.push({id:occ.id, arche:occ.archetype, got:`${g[0].id}/${g[0].archetype}`});
    if(!okExact) exactMiss.push({id:occ.id, got:ids.slice(0,3).join(', ')});
    total++;
  }
}

console.log();
console.log(`BLS OCCUPATION GUESS — ${BLS_OCCUPATIONS.length} occupations × ${N} scenarios = ${total} tests`);
console.log('─'.repeat(70));
console.log(`  family-match (#1 same archetype): ${fam1}/${total}  ${(100*fam1/total).toFixed(1)}%`);
console.log(`  exact-in-top3:                    ${exact3}/${total}  ${(100*exact3/total).toFixed(1)}%`);
console.log();
if(famMiss.length){
  console.log(`  ${R}family misses (${famMiss.length}):${X}`);
  const seen=new Set();
  for(const m of famMiss){ if(seen.has(m.id))continue; seen.add(m.id);
    console.log(`    ${pad(m.id,40)} ${m.arche} → got ${m.got}`); }
}
console.log();
