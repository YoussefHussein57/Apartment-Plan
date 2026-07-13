export function StatCard({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'accent' }) {
  return (
    <div className={`stat-card ${tone === 'accent' ? 'stat-card-accent' : ''}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
