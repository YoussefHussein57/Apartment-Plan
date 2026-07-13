import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useSectionTotals } from '../hooks/useSectionTotals';
import { useItems } from '../hooks/useItems';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { money } from '../lib/format';
import { SECTION_LABELS } from '../types';

export function Dashboard() {
  const { totals, loading: loadingTotals } = useSectionTotals();
  const { items, loading: loadingItems } = useItems();

  const grandBudget = totals.reduce((s, t) => s + t.budget, 0);
  const grandPaid = totals.reduce((s, t) => s + t.paid, 0);
  const grandRemaining = totals.reduce((s, t) => s + t.remaining, 0);
  const progress = grandBudget === 0 ? 0 : grandPaid / grandBudget;

  const doneCount = items.filter((i) => i.status === 'done').length;
  const remainingCount = items.length - doneCount;

  const chartData = totals.map((t) => ({
    name: SECTION_LABELS[t.section],
    الميزانية: t.budget,
    المدفوع: t.paid,
  }));

  return (
    <div>
      <h2 className="page-title">لوحة التحكم المالية</h2>
      <p className="page-subtitle">ملخص حي مرتبط بكل الأقسام: الميزانية، المدفوع، المتبقي، والإنجاز.</p>

      <div className="stat-grid">
        <StatCard label="إجمالي الميزانية" value={money(grandBudget)} />
        <StatCard label="إجمالي المدفوع" value={money(grandPaid)} />
        <StatCard label="إجمالي المتبقي" value={money(grandRemaining)} />
        <StatCard label="نسبة الإنجاز" value={`${Math.round(progress * 100)}%`} tone="accent" />
        <StatCard label="عدد البنود التي انتهت" value={String(doneCount)} />
        <StatCard label="عدد البنود المتبقية" value={String(remainingCount)} />
      </div>

      <h3 className="section-title">ملخص الأقسام: المتوقع مقابل المدفوع والمتبقي</h3>
      {loadingTotals ? (
        <p>...جاري التحميل</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>القسم</th>
                <th>الميزانية المتوقعة</th>
                <th>المدفوع</th>
                <th>المتبقي</th>
                <th>نسبة الإنجاز</th>
              </tr>
            </thead>
            <tbody>
              {totals.map((t, idx) => (
                <tr key={t.section} className={idx % 2 === 1 ? 'row-band' : undefined}>
                  <td>{SECTION_LABELS[t.section]}</td>
                  <td>{money(t.budget)}</td>
                  <td>{money(t.paid)}</td>
                  <td>{money(t.remaining)}</td>
                  <td>
                    <ProgressBar value={t.budget === 0 ? 0 : t.paid / t.budget} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td>الإجمالي</td>
                <td>{money(grandBudget)}</td>
                <td>{money(grandPaid)}</td>
                <td>{money(grandRemaining)}</td>
                <td>{Math.round(progress * 100)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {!loadingItems && chartData.length > 0 && (
        <div className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={((v: unknown) => money(Number(v))) as any} />
              <Legend />
              <Bar dataKey="الميزانية" fill="#5B8C85" />
              <Bar dataKey="المدفوع" fill="#1F4E5F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
