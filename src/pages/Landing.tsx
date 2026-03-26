import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">TruthLens</span>
        </div>
        <Button variant="hero" size="lg" onClick={() => navigate('/login')}>
          Login
        </Button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="container max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
              Detect Fake News<br />
              <span className="text-primary">Before It Spreads</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Analyze articles with our intelligent detection engine. Check emotional tone, source reliability, and content quality in seconds.
            </p>
            <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroBg}
                alt="Scattered newspaper articles on a wooden desk"
                className="w-full h-[400px] md:h-[500px] object-cover"
                width={1280}
                height={960}
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-lg p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-trust-high/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-trust-high" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">94% Credible</p>
                  <p className="text-xs text-muted-foreground">Source verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
