// Heuristic-based fake news analysis engine

export interface AnalysisResult {
  attentionGrabbing: CategoryResult;
  emotionalTone: CategoryResult;
  sourceReliability: CategoryResult;
  contentQuality: CategoryResult;
  overallScore: number;
  verdict: 'likely_real' | 'suspicious' | 'likely_fake';
}

export interface CategoryResult {
  score: number; // 0-100, higher = more trustworthy
  flags: string[];
  summary: string;
}

const CLICKBAIT_WORDS = [
  'shocking', 'unbelievable', 'you won\'t believe', 'breaking', 'exclusive',
  'bombshell', 'devastating', 'miracle', 'secret', 'they don\'t want you to know',
  'jaw-dropping', 'mind-blowing', 'exposed', 'banned', 'censored', 'cover-up',
  'conspiracy', 'hoax', 'scam', 'urgent', 'alert', 'warning'
];

const EMOTIONAL_WORDS = [
  'outrage', 'fury', 'terrifying', 'horrifying', 'disgusting', 'evil',
  'destroy', 'catastrophe', 'panic', 'fear', 'hate', 'love', 'amazing',
  'incredible', 'insane', 'crazy', 'stupid', 'genius', 'perfect', 'worst',
  'best ever', 'nightmare', 'dream come true'
];

const RELIABLE_DOMAINS = [
  'reuters.com', 'apnews.com', 'bbc.com', 'nytimes.com', 'washingtonpost.com',
  'theguardian.com', 'npr.org', 'pbs.org', 'nature.com', 'science.org'
];

const UNRELIABLE_PATTERNS = [
  'infowars', 'naturalnews', 'beforeitsnews', 'worldnewsdailyreport',
  'yournewswire', 'neonnettle', 'theonion'
];

export function analyzeArticle(text: string, sourceUrl?: string): AnalysisResult {
  const lower = text.toLowerCase();

  const attentionGrabbing = analyzeAttentionGrabbing(text, lower);
  const emotionalTone = analyzeEmotionalTone(text, lower);
  const sourceReliability = analyzeSourceReliability(text, lower, sourceUrl);
  const contentQuality = analyzeContentQuality(text, lower);

  const overallScore = Math.round(
    attentionGrabbing.score * 0.2 +
    emotionalTone.score * 0.25 +
    sourceReliability.score * 0.3 +
    contentQuality.score * 0.25
  );

  const verdict: AnalysisResult['verdict'] =
    overallScore >= 65 ? 'likely_real' :
    overallScore >= 35 ? 'suspicious' : 'likely_fake';

  return { attentionGrabbing, emotionalTone, sourceReliability, contentQuality, overallScore, verdict };
}

function analyzeAttentionGrabbing(text: string, lower: string): CategoryResult {
  const flags: string[] = [];
  let penalty = 0;

  // Check clickbait words
  const clickbaitFound = CLICKBAIT_WORDS.filter(w => lower.includes(w));
  if (clickbaitFound.length > 0) {
    penalty += clickbaitFound.length * 8;
    flags.push(`Clickbait phrases detected: ${clickbaitFound.slice(0, 3).join(', ')}`);
  }

  // Excessive caps
  const capsRatio = (text.match(/[A-Z]/g)?.length || 0) / Math.max(text.length, 1);
  if (capsRatio > 0.3) {
    penalty += 25;
    flags.push('Excessive use of capital letters');
  }

  // Excessive exclamation/question marks
  const exclCount = (text.match(/[!?]{2,}/g) || []).length;
  if (exclCount > 0) {
    penalty += exclCount * 10;
    flags.push('Multiple exclamation/question marks used');
  }

  // ALL CAPS words
  const allCapsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
  if (allCapsWords.length > 2) {
    penalty += 15;
    flags.push(`${allCapsWords.length} ALL-CAPS words found`);
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  const summary = score >= 70 ? 'Headline style appears measured and professional' :
    score >= 40 ? 'Some attention-grabbing tactics detected' :
    'Heavy use of clickbait and sensationalism';

  return { score, flags, summary };
}

function analyzeEmotionalTone(text: string, lower: string): CategoryResult {
  const flags: string[] = [];
  let penalty = 0;

  const emotionalFound = EMOTIONAL_WORDS.filter(w => lower.includes(w));
  if (emotionalFound.length > 0) {
    penalty += emotionalFound.length * 12;
    flags.push(`Emotionally charged language: ${emotionalFound.slice(0, 3).join(', ')}`);
  }

  // Superlatives
  const superlatives = lower.match(/\b(best|worst|greatest|most dangerous|most important|never before)\b/g) || [];
  if (superlatives.length >= 1) {
    penalty += superlatives.length * 10;
    flags.push(`Superlative language: ${superlatives.slice(0, 3).join(', ')}`);
  }

  // Us vs them language
  const divisive = lower.match(/\b(they want|they don't want|them vs|enemies|traitors|patriots|lying to us|wake up)\b/g) || [];
  if (divisive.length > 0) {
    penalty += divisive.length * 15;
    flags.push('Divisive "us vs. them" framing detected');
  }

  // Imperative/urgency commands
  const urgency = lower.match(/\b(share now|share before|act now|spread the word|wake up|open your eyes)\b/g) || [];
  if (urgency.length > 0) {
    penalty += urgency.length * 12;
    flags.push('Urgency/call-to-action manipulation detected');
  }

  // Rhetorical questions
  const questions = (text.match(/\?/g) || []).length;
  const sentences = text.split(/[.!?]+/).length;
  if (questions / Math.max(sentences, 1) > 0.3) {
    penalty += 10;
    flags.push('High ratio of rhetorical questions');
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  const summary = score >= 70 ? 'Tone is balanced and factual' :
    score >= 40 ? 'Moderate emotional manipulation detected' :
    'Highly emotionally manipulative content';

  return { score, flags, summary };
}

function analyzeSourceReliability(text: string, lower: string, sourceUrl?: string): CategoryResult {
  const flags: string[] = [];
  let score = 50; // neutral start

  if (sourceUrl) {
    const urlLower = sourceUrl.toLowerCase();
    if (RELIABLE_DOMAINS.some(d => urlLower.includes(d))) {
      score += 40;
      flags.push('Source is a recognized reliable news outlet');
    } else if (UNRELIABLE_PATTERNS.some(d => urlLower.includes(d))) {
      score -= 40;
      flags.push('Source is flagged as unreliable');
    }
  } else {
    flags.push('No source URL provided for verification');
  }

  // Check for citations
  const hasCitations = /\b(according to|study shows|research from|data from|report by|published in)\b/i.test(text);
  if (hasCitations) {
    score += 15;
    flags.push('Contains attribution to sources');
  } else {
    score -= 10;
    flags.push('No source citations or attributions found');
  }

  // Check for quotes
  const hasQuotes = (text.match(/[""].*?[""]|".*?"/g) || []).length;
  if (hasQuotes > 0) {
    score += 10;
    flags.push('Contains direct quotes');
  }

  // Anonymous sources
  if (/anonymous source|unnamed official|insider says/i.test(text)) {
    score -= 10;
    flags.push('Relies on anonymous sources');
  }

  score = Math.max(0, Math.min(100, score));
  const summary = score >= 70 ? 'Sources appear credible and well-cited' :
    score >= 40 ? 'Source credibility is mixed or unverifiable' :
    'Poor source credibility — claims are unsubstantiated';

  return { score, flags, summary };
}

function analyzeContentQuality(text: string, lower: string): CategoryResult {
  const flags: string[] = [];
  let score = 50;

  // Word count
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 200) {
    score += 15;
    flags.push(`Article length: ${wordCount} words (substantive)`);
  } else if (wordCount < 50) {
    score -= 15;
    flags.push(`Very short article: only ${wordCount} words`);
  }

  // Paragraph structure
  const paragraphs = text.split(/\n\n+/).length;
  if (paragraphs > 2) {
    score += 10;
    flags.push('Good paragraph structure');
  }

  // Grammar indicators (simple heuristics)
  const typoPatterns = /\b(teh|becuase|recieve|definately|seperate|occured|goverment)\b/i;
  if (typoPatterns.test(text)) {
    score -= 15;
    flags.push('Potential spelling/grammar errors detected');
  }

  // Numbers and data
  const hasNumbers = /\d+%|\d+,\d+|\$\d+/g.test(text);
  if (hasNumbers) {
    score += 10;
    flags.push('Contains specific data points and statistics');
  }

  // Date references
  if (/\b(january|february|march|april|may|june|july|august|september|october|november|december|\d{4})\b/i.test(text)) {
    score += 5;
    flags.push('Contains date references for context');
  }

  // Vague generalizations
  if (/\b(everyone knows|it is well known|many people say|experts agree|studies show)\b/i.test(lower) && !hasCitations(text)) {
    score -= 15;
    flags.push('Vague generalizations without specific citations');
  }

  score = Math.max(0, Math.min(100, score));
  const summary = score >= 70 ? 'Content is well-structured with supporting evidence' :
    score >= 40 ? 'Content quality is average — some gaps in evidence' :
    'Low quality content lacking substance and evidence';

  return { score, flags, summary };
}

function hasCitations(text: string): boolean {
  return /\b(according to|study by|published in|researchers at)\b/i.test(text);
}
