import type { Settings, ItemTotals } from '../types';

export interface MonthlyRow {
  monthDate: Date;
  label: string;
  salary: number;
  livingExpense: number;
  gam3eya1: number;
  gam3eya2: number;
  extraIncome: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  cumulativeBalance: number;
}

const MONTH_LABELS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

function sameYearMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function buildMonthlyProjection(settings: Settings, months: number): MonthlyRow[] {
  const startRaw = settings.plan_start_date ? new Date(settings.plan_start_date) : new Date();
  const start = new Date(startRaw.getFullYear(), startRaw.getMonth(), 1);
  const gam3eya1End = settings.gam3eya1_end_date ? new Date(settings.gam3eya1_end_date) : null;
  const gam3eya2End = settings.gam3eya2_end_date ? new Date(settings.gam3eya2_end_date) : null;
  const septMonth = settings.sept_month ? new Date(settings.sept_month) : null;
  const novMonth = settings.nov_month ? new Date(settings.nov_month) : null;

  const rows: MonthlyRow[] = [];
  let cumulative = 0;

  for (let i = 0; i < months; i++) {
    const monthDate = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const eom = endOfMonth(monthDate);

    const gam3eya1 = gam3eya1End && eom < gam3eya1End ? settings.gam3eya1_installment : 0;
    const gam3eya2 = gam3eya2End && eom < gam3eya2End ? settings.gam3eya2_installment : 0;
    const extraIncome =
      (septMonth && sameYearMonth(monthDate, septMonth) ? settings.sept_lumpsum : 0) +
      (novMonth && sameYearMonth(monthDate, novMonth) ? settings.nov_lumpsum : 0);

    const totalIncome = settings.salary + extraIncome;
    const totalExpense = settings.living_expense + gam3eya1 + gam3eya2;
    const netSavings = totalIncome - totalExpense;
    cumulative += netSavings;

    rows.push({
      monthDate,
      label: `${MONTH_LABELS[monthDate.getMonth()]} ${monthDate.getFullYear()}`,
      salary: settings.salary,
      livingExpense: settings.living_expense,
      gam3eya1,
      gam3eya2,
      extraIncome,
      totalIncome,
      totalExpense,
      netSavings,
      cumulativeBalance: cumulative,
    });
  }

  return rows;
}

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

export interface CompletionEstimate {
  item: ItemTotals;
  cumulativeNeeded: number;
  monthLabel: string | null;
}

/**
 * Greedily funds pending items in priority order (high first, then cheapest
 * remaining within the same priority), against the running cumulative
 * savings balance, and reports the first month each item's cumulative
 * requirement is covered.
 */
export function estimateCompletions(items: ItemTotals[], monthlyRows: MonthlyRow[]): CompletionEstimate[] {
  const pending = items
    .filter((i) => i.status !== 'done' && i.remaining > 0)
    .sort((a, b) => {
      const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (p !== 0) return p;
      return a.remaining - b.remaining;
    });

  let cumulativeNeeded = 0;
  return pending.map((item) => {
    cumulativeNeeded += item.remaining;
    const row = monthlyRows.find((r) => r.cumulativeBalance >= cumulativeNeeded);
    return { item, cumulativeNeeded, monthLabel: row ? row.label : null };
  });
}
