
const IRREGULAR_MAP = {
  into: 'introduction',
};

const STOP_WORDS = new Set(['and', 'to', 'of', 'the', 'for', 'in', 'a', 'an']);

// Section type only -- "merge" is now tracked separately (see below).
const SECTION_PATTERNS = [
  { type: 'lab',  regex: /\blab(?:oratory|s)?\b/i },
  { type: 'lec',  regex: /\blec(?:ture)?\b/i },
  { type: 'prac', regex: /\bpractical\b/i },
];
const MERGE_PATTERN = /\bmerged?\b/i;

// "practices" → "practice"
// "systems"   → "system"  
// "boxes"     → "box"
// "buses"     → "bus"
// "dishes"    → "dish"
// "matches"   → "match"

function stem(word) {
  if (word.length <= 4) return word; 
  if (/ies$/.test(word)) {
    // If word ends with "ies" and preceded by 'c' (like practic-es)
    if (/cies$/.test(word)) {
        return word.slice(0, -3) + 'ce';  // "practice"
    }
    return word.slice(0, -3) + 'y';       // "factory" → "factory"
}
  if (/(ses|xes|zes|ches|shes)$/.test(word)) return word.slice(0, -2);
  if (/s$/.test(word) && !/ss$/.test(word)) return word.slice(0, -1);
  return word;
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function isPrefixMatch(a, b, minLen = 4) {
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short.length < minLen) return false;
  return long.startsWith(short);
}

function editSimilar(a, b, maxRatio = 0.25) {
  const longer = Math.max(a.length, b.length);
  if (longer < 4) return false;
  return levenshtein(a, b) / longer <= maxRatio;
}

function wordsEqual(a, b) {
  if (a === b) return true;
  const sa = IRREGULAR_MAP[a] || stem(a);
  const sb = IRREGULAR_MAP[b] || stem(b);
  if (sa === sb) return true;
  if (isPrefixMatch(sa, sb)) return true;
  if (editSimilar(sa, sb)) return true;
  return false;
}

function acronymSpanLength(token, words, startIdx) {
  const maxLen = Math.min(token.length, words.length - startIdx);
  for (let len = maxLen; len >= 2; len--) {
    const span = words.slice(startIdx, startIdx + len);
    const initials = span.map(w => w[0]).join('');
    if (initials === token) return len;
  }
  return 0;
}

function getProgramCode(str) {
  if (!str) return '';
  const text = str.toString().toLowerCase().trim();
  const m = text.match(/^([a-z]{2,3})[\s-]*(\d+)/);
  if (!m) return '';
  const prefix = m[1];
  const digits = m[2];
  const semester = (digits.length > 1 && digits[0] >= '1' && digits[0] <= '8')
    ? digits[0]
    : digits;
  return `${prefix}${semester}`;
}

function normalizeCourseTokens(raw) {
  if (!raw) return { tokens: [], type: '', isMerge: false, programCode: '' };

  let text = raw.toString().toLowerCase().trim();
  const programCode = getProgramCode(text);

  text = text
    .replace(/^[a-z]{2,3}[\s-]*\d+[\s-]*\d*\s*/i, '')
    .replace(/^[a-z]{2,3}\d+[\s-]*\d*\s*/i, '')
    .replace(/^\d+[\s-]*\d*\s*/, '');

  // BUG A fix: detect merge independently, don't let it steal the slot
  // that lab/lec/prac needs.
  const isMerge = MERGE_PATTERN.test(text);
  text = text.replace(MERGE_PATTERN, ' ');

  let type = '';
  for (const { type: t, regex } of SECTION_PATTERNS) {
    if (regex.test(text)) {
      type = t;
      text = text.replace(regex, ' ');
      break;
    }
  }

  text = text.replace(/&/g, ' and ');

  const tokens = text
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .filter(tok => !STOP_WORDS.has(tok))
    .map(t => stem(t));

  return { tokens, type, isMerge, programCode };
}

function tokenSimilarity(tokensA, tokensB) {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const usedA = new Array(tokensA.length).fill(false);
  const usedB = new Array(tokensB.length).fill(false);

  const acronymPass = (short, long, usedShort, usedLong) => {
    for (let i = 0; i < short.length; i++) {
      if (usedShort[i]) continue;
      const tok = short[i];
      if (tok.length < 2 || tok.length > 6) continue;
      for (let j = 0; j < long.length; j++) {
        if (usedLong[j]) continue;
        const runLen = acronymSpanLength(tok, long, j);
        if (runLen >= 2) {
          let free = true;
          for (let k = 0; k < runLen; k++) if (usedLong[j + k]) { free = false; break; }
          if (!free) continue;
          usedShort[i] = true;
          for (let k = 0; k < runLen; k++) usedLong[j + k] = true;
          break;
        }
      }
    }
  };
  acronymPass(tokensA, tokensB, usedA, usedB);
  acronymPass(tokensB, tokensA, usedB, usedA);

  for (let i = 0; i < tokensA.length; i++) {
    if (usedA[i]) continue;
    for (let j = 0; j < tokensB.length; j++) {
      if (usedB[j]) continue;
      if (wordsEqual(tokensA[i], tokensB[j])) {
        usedA[i] = true; usedB[j] = true;
        break;
      }
    }
  }

  const coveredA = usedA.filter(Boolean).length;
  const coveredB = usedB.filter(Boolean).length;
  return (coveredA + coveredB) / (tokensA.length + tokensB.length);
}
function normalizeCourseVariants(raw) {
  if (!raw) return [normalizeCourseTokens(raw)];
  const variants = [normalizeCourseTokens(raw)];
  if (raw.includes('/')) {
    for (const part of raw.split('/')) {
      variants.push(normalizeCourseTokens(part.trim()));
    }
  }
  return variants;
}

function findBestMatch(timetableTitle, offerings, autoThreshold = 0.75, reviewFloor = 0.55) {
  const target = normalizeCourseTokens(timetableTitle);

  let best = null, bestScore = 0;

  for (const offering of offerings) {
    const variants = normalizeCourseVariants(offering.courseName);
    for (const cand of variants) {
      if (target.programCode && cand.programCode && target.programCode !== cand.programCode) continue;
      if (target.type && cand.type && target.type !== cand.type) continue;

      const score = tokenSimilarity(target.tokens, cand.tokens);
      if (score > bestScore) { bestScore = score; best = offering; }
    }
  }

  if (!best) return null;
  if (bestScore >= 0.999) return { offering: best, score: bestScore, fuzzy: false, needsReview: false };
  if (bestScore >= autoThreshold) return { offering: best, score: bestScore, fuzzy: true, needsReview: false };
  if (bestScore >= reviewFloor) return { offering: best, score: bestScore, fuzzy: true, needsReview: true };
  return null;
}

export default {
  normalizeCourseTokens,
  normalizeCourseVariants,
  tokenSimilarity,
  findBestMatch,
  getProgramCode,
  stem,
};