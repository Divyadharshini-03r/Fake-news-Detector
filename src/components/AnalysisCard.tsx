import type { CategoryResult } from '@/lib/fakeNewsAnalyzer';
import { type LucideIcon } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  icon: LucideIcon;
  result: CategoryResult;
}

const getScoreColor = (score: number) =>
  score >= 65 ? 'text-trust-high' :
  score >= 35 ? 'text-trust-medium' :
  'text-trust-low';

const getBarColor = (score: number) =>
  score >= 65 ? 'bg-trust-high' :
  score >= 35 ? 'bg-trust-medium' :
  'bg-trust-low';

const AnalysisCard = ({ title, icon: Icon, result }: AnalysisCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-card-foreground">{title}</h3>
        </div>
        <span className={`text-2xl font-bold font-mono ${getScoreColor(result.score)}`}>
          {result.score}
        </span>
      </div>

      {/* Score bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${getBarColor(result.score)} transition-all duration-1000 ease-out`}
          style={{ width: `${result.score}%` }}
        />
      </div>

      <p className="text-sm text-muted-foreground">{result.summary}</p>

      {result.flags.length > 0 && (
        <ul className="space-y-1.5">
          {result.flags.map((flag, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-secondary-foreground">
              <span className="mt-1 w-1 h-1 rounded-full bg-primary shrink-0" />
              {flag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnalysisCard;
