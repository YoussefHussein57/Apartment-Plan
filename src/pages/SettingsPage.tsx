import { useEffect, useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { LoadingIndicator } from '../components/LoadingIndicator';
import type { Settings } from '../types';

const CORE_FIELDS: Array<{ key: keyof Settings; label: string; type: 'number' | 'date' }> = [
  { key: 'salary', label: 'المرتب الصافي', type: 'number' },
  { key: 'living_expense', label: 'مصروف المعيشة', type: 'number' },
  { key: 'gam3eya1_installment', label: 'الجمعية الأولى', type: 'number' },
  { key: 'gam3eya1_end_date', label: 'تاريخ انتهاء الجمعية الأولى', type: 'date' },
  { key: 'gam3eya2_installment', label: 'الجمعية الثانية', type: 'number' },
  { key: 'gam3eya2_end_date', label: 'تاريخ انتهاء الجمعية الثانية', type: 'date' },
  { key: 'sept_lumpsum', label: 'جمعية مقبوضة في سبتمبر', type: 'number' },
  { key: 'sept_month', label: 'شهر قبض جمعية سبتمبر', type: 'date' },
  { key: 'nov_lumpsum', label: 'جمعية مقبوضة في نوفمبر', type: 'number' },
  { key: 'nov_month', label: 'شهر قبض جمعية نوفمبر', type: 'date' },
  { key: 'furniture_share_pct', label: 'نسبة مساهمة أهل العروسة في العفش', type: 'number' },
  { key: 'plan_start_date', label: 'تاريخ بداية الخطة', type: 'date' },
];

const SAVINGS_FIELDS: Array<{ key: keyof Settings; label: string; type: 'number' }> = [
  { key: 'saved_cash', label: 'الكاش المدّخر (ج.م)', type: 'number' },
  { key: 'gold_grams', label: 'الذهب المملوك (جرام)', type: 'number' },
  { key: 'usd_amount', label: 'الدولار المملوك (USD)', type: 'number' },
  { key: 'eur_amount', label: 'اليورو المملوك (EUR)', type: 'number' },
];

export function SettingsPage() {
  const { settings, loading, error, updateSettings } = useSettings();
  const [form, setForm] = useState<Partial<Settings>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  async function handleSave() {
    await updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function renderField(f: { key: keyof Settings; label: string; type: 'number' | 'date' }) {
    return (
      <label key={f.key} className="settings-field">
        <span>{f.label}</span>
        <input
          type={f.type}
          step={f.type === 'number' ? '0.01' : undefined}
          value={(form[f.key] as string | number | null) ?? ''}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value,
            }))
          }
        />
      </label>
    );
  }

  return (
    <div>
      <h2 className="page-title">الإعدادات المركزية</h2>
      <p className="page-subtitle">عدّل القيم هنا، وستنعكس تلقائيًا على كل الصفحات.</p>
      {error && <div className="error-banner">{error}</div>}
      {loading || !form ? (
        <LoadingIndicator />
      ) : (
        <>
          <div className="settings-grid">{CORE_FIELDS.map(renderField)}</div>

          <h3 className="section-title">المدخرات والأصول</h3>
          <div className="settings-grid">
            {SAVINGS_FIELDS.map(renderField)}
            <label className="settings-field">
              <span>عيار الذهب</span>
              <select
                value={form.gold_karat ?? 21}
                onChange={(e) => setForm((prev) => ({ ...prev, gold_karat: Number(e.target.value) as 21 | 24 }))}
              >
                <option value={21}>عيار 21</option>
                <option value={24}>عيار 24</option>
              </select>
            </label>
          </div>
        </>
      )}
      <button className="btn-primary" onClick={handleSave}>
        حفظ الإعدادات
      </button>
      {saved && <span className="saved-badge">تم الحفظ ✓</span>}
    </div>
  );
}
