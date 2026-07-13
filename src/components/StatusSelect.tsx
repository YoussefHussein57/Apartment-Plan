import type { Status } from '../types';
import { STATUS_LABELS } from '../types';

const OPTIONS: Status[] = ['not_started', 'in_progress', 'done'];

export function StatusSelect({ value, onChange }: { value: Status; onChange: (v: Status) => void }) {
  return (
    <select className={`status-select status-${value}`} value={value} onChange={(e) => onChange(e.target.value as Status)}>
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {STATUS_LABELS[o]}
        </option>
      ))}
    </select>
  );
}
