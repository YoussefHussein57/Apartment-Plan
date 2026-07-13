import { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { useItems } from '../hooks/useItems';
import { money, dateAr } from '../lib/format';

const METHODS = ['كاش', 'تحويل بنكي', 'فيزا', 'Instapay', 'محفظة إلكترونية'];

export function PaymentsPage() {
  const { payments, loading, error, addPayment, deletePayment } = usePayments();
  const { items } = useItems();

  const [itemId, setItemId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(METHODS[0]);
  const [notes, setNotes] = useState('');

  function itemName(id: string | null) {
    return items.find((i) => i.id === id)?.name ?? '—';
  }

  async function handleAdd() {
    if (!itemId || !amount) return;
    await addPayment({ item_id: itemId, date, amount: Number(amount), method, notes });
    setAmount('');
    setNotes('');
  }

  return (
    <div>
      <h2 className="page-title">المدفوعات</h2>
      {error && <div className="error-banner">{error}</div>}

      <div className="add-item-form payments-form">
        <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
          <option value="">اختر البند</option>
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="number" placeholder="المبلغ" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input type="text" placeholder="ملاحظات" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button className="btn-primary" onClick={handleAdd}>
          تسجيل دفعة
        </button>
      </div>

      {loading ? (
        <p>...جاري التحميل</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>البند</th>
                <th>المبلغ</th>
                <th>طريقة الدفع</th>
                <th>ملاحظات</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={p.id} className={idx % 2 === 1 ? 'row-band' : undefined}>
                  <td>{dateAr(p.date)}</td>
                  <td>{itemName(p.item_id)}</td>
                  <td>{money(p.amount)}</td>
                  <td>{p.method}</td>
                  <td>{p.notes}</td>
                  <td>
                    <button className="btn-icon-danger" onClick={() => deletePayment(p.id)} title="حذف">
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    لا توجد مدفوعات مسجلة بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
