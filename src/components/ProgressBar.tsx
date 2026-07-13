import { pct } from '../lib/format';

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-wrap" title={pct(value)}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${Math.min(value, 1) * 100}%` }} />
      </div>
      <span className="progress-label">{pct(value)}</span>
    </div>
  );
}
