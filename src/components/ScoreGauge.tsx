import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

const ScoreGauge = ({ score, size = 120, label }: ScoreGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) =>
    s >= 65 ? 'hsl(var(--trust-high))' :
    s >= 35 ? 'hsl(var(--trust-medium))' :
    'hsl(var(--trust-low))';

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="hsl(var(--muted))" strokeWidth={strokeWidth} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={getColor(score)} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-2xl font-bold" style={{ color: getColor(score) }}>{animatedScore}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>
      </div>
      {label && <span className="text-xs text-muted-foreground font-mono">{label}</span>}
    </div>
  );
};

export default ScoreGauge;
