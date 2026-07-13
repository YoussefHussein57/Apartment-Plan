const FLOORS = 4;
const WINDOWS_PER_FLOOR = 3;

export function LoadingIndicator({ label = 'جاري التحميل' }: { label?: string }) {
  const windows = [];
  let i = 0;
  for (let floor = 0; floor < FLOORS; floor++) {
    for (let w = 0; w < WINDOWS_PER_FLOOR; w++) {
      windows.push(
        <rect
          key={`${floor}-${w}`}
          x={14 + w * 20}
          y={98 - floor * 22}
          width="12"
          height="12"
          rx="1.5"
          className="loading-window"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      );
      i++;
    }
  }

  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <svg width="90" height="120" viewBox="0 0 90 120" className="loading-building">
        <rect x="4" y="14" width="72" height="98" rx="3" className="loading-facade" />
        <rect x="0" y="108" width="90" height="8" rx="2" className="loading-ground" />
        {windows}
        <rect x="30" y="98" width="20" height="14" rx="1" className="loading-door" />
        <g className="loading-crane">
          <line x1="70" y1="14" x2="70" y2="-10" className="loading-crane-line" />
          <line x1="70" y1="-10" x2="20" y2="-10" className="loading-crane-line" />
          <line x1="70" y1="-10" x2="88" y2="-2" className="loading-crane-line" />
          <line x1="20" y1="-10" x2="20" y2="2" className="loading-crane-cable" />
        </g>
      </svg>
      <span className="loading-label">{label}</span>
    </div>
  );
}
