import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Heart, Globe, FileText, Search, LogOut } from 'lucide-react';
import { analyzeArticle, type AnalysisResult } from '@/lib/fakeNewsAnalyzer';
import ScoreGauge from '@/components/ScoreGauge';
import { supabase } from '@/integrations/supabase/client';
import AnalysisCard from '@/components/AnalysisCard';

const SAMPLE_ARTICLES = [
  {
    label: 'Suspicious Article',
    text: `BREAKING!!! You WON'T BELIEVE what the government is HIDING from you!!!

Sources say this SHOCKING cover-up could DESTROY everything you know. Experts agree this is the WORST scandal in history. Everyone knows they've been lying to us for YEARS.

They don't want you to know the TRUTH. Share before they CENSOR this!!!`,
    url: ''
  },
  {
    label: 'Credible Article',
    text: `According to a study published in Nature on March 15, 2024, researchers at MIT have identified a new method for carbon capture that could reduce atmospheric CO2 by 12% over the next decade.

The research team, led by Dr. Sarah Chen, tested the approach across 47 sites in North America. "Our data shows a consistent 34% improvement over existing methods," Dr. Chen said in an interview.

The findings were peer-reviewed and independently verified by the European Climate Research Institute. The technology requires an estimated $2.3 billion in initial investment, according to the report.`,
    url: 'https://nature.com'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    // Simulate processing delay
    setTimeout(() => {
      setResult(analyzeArticle(text, sourceUrl || undefined));
      setIsAnalyzing(false);
    }, 1200);
  };

  const loadSample = (index: number) => {
    setText(SAMPLE_ARTICLES[index].text);
    setSourceUrl(SAMPLE_ARTICLES[index].url);
    setResult(null);
  };

  const getVerdictStyle = (verdict: AnalysisResult['verdict']) => {
    switch (verdict) {
      case 'likely_real': return { text: 'Likely Credible', color: 'text-trust-high', border: 'border-trust-high/30 bg-trust-high/5' };
      case 'suspicious': return { text: 'Suspicious', color: 'text-trust-medium', border: 'border-trust-medium/30 bg-trust-medium/5' };
      case 'likely_fake': return { text: 'Likely Fake', color: 'text-trust-low', border: 'border-trust-low/30 bg-trust-low/5' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Fake News Detector</h1>
            <p className="text-xs text-muted-foreground font-mono">Heuristic Content Analysis Engine</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Paste Article</h2>
            <div className="flex gap-2">
              {SAMPLE_ARTICLES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => loadSample(i)}
                  className="text-xs px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-mono"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste the article text here for analysis..."
            className="w-full h-48 rounded-xl border border-border bg-card text-card-foreground p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder="Source URL (optional)"
                className="w-full rounded-lg border border-border bg-card text-card-foreground pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isAnalyzing}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </section>

        {/* Results */}
        {isAnalyzing && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground font-mono">Running analysis...</p>
            </div>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Verdict Banner */}
            {(() => {
              const v = getVerdictStyle(result.verdict);
              return (
                <div className={`rounded-xl border ${v.border} p-6 flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <ScoreGauge score={result.overallScore} size={100} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-1">Verdict</p>
                      <p className={`text-2xl font-bold ${v.color}`}>{v.text}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Overall credibility score: {result.overallScore}/100
                      </p>
                    </div>
                  </div>
                  <FileText className="w-12 h-12 text-muted-foreground/20" />
                </div>
              );
            })()}

            {/* Category Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <AnalysisCard
                title="Attention-Grabbing Check"
                icon={Zap}
                result={result.attentionGrabbing}
              />
              <AnalysisCard
                title="Emotional Tone"
                icon={Heart}
                result={result.emotionalTone}
              />
              <AnalysisCard
                title="Source Reliability"
                icon={Globe}
                result={result.sourceReliability}
              />
              <AnalysisCard
                title="Content Quality"
                icon={FileText}
                result={result.contentQuality}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
