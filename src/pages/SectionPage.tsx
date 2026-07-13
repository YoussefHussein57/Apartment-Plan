import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { StatusSelect } from '../components/StatusSelect';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { money } from '../lib/format';
import type { Section } from '../types';
import { SECTION_LABELS, PRIORITY_LABELS } from '../types';

export function SectionPage({ section }: { section: Section }) {
  const { items, loading, error, updateItem, addItem, deleteItem } = useItems(section);
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const totals = items.reduce(
    (acc, i) => {
      acc.budget += i.budget;
      acc.paid += i.paid;
      acc.remaining += i.remaining;
      return acc;
    },
    { budget: 0, paid: 0, remaining: 0 }
  );

  async function handleAdd() {
    if (!newName.trim()) return;
    await addItem({ section, name: newName.trim(), budget: Number(newBudget) || 0 });
    setNewName('');
    setNewBudget('');
  }

  return (
    <div>
      <h2 className="page-title">{SECTION_LABELS[section]}</h2>
      {error && <div className="error-banner">{error}</div>}
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>البند</th>
                <th>الميزانية</th>
                <th>المدفوع</th>
                <th>المتبقي</th>
                <th>نسبة الإنجاز</th>
                <th>الحالة</th>
                <th>الأولوية</th>
                <th>ملاحظات</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 1 ? 'row-band' : undefined}>
                  <td>{item.name}</td>
                  <td>
                    <input
                      type="number"
                      className="cell-input"
                      defaultValue={item.budget}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== item.budget) updateItem(item.id, { budget: v });
                      }}
                    />
                  </td>
                  <td>{money(item.paid)}</td>
                  <td>{money(item.remaining)}</td>
                  <td>
                    <ProgressBar value={item.progress} />
                  </td>
                  <td>
                    <StatusSelect value={item.status} onChange={(v) => updateItem(item.id, { status: v })} />
                  </td>
                  <td>
                    <select
                      className="cell-select"
                      value={item.priority}
                      onChange={(e) => updateItem(item.id, { priority: e.target.value as any })}
                    >
                      {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="cell-input notes-input"
                      defaultValue={item.notes ?? ''}
                      onBlur={(e) => {
                        if (e.target.value !== (item.notes ?? '')) updateItem(item.id, { notes: e.target.value });
                      }}
                    />
                  </td>
                  <td>
                    <button className="btn-icon-danger" onClick={() => deleteItem(item.id)} title="حذف">
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td>الإجمالي</td>
                <td>{money(totals.budget)}</td>
                <td>{money(totals.paid)}</td>
                <td>{money(totals.remaining)}</td>
                <td colSpan={4}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="add-item-form">
        <input type="text" placeholder="اسم البند الجديد" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <input type="number" placeholder="الميزانية" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} />
        <button className="btn-primary" onClick={handleAdd}>
          إضافة بند
        </button>
      </div>
    </div>
  );
}
