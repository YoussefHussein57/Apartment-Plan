import { useMemo } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useItems } from '../hooks/useItems';
import { useLiveRates } from '../hooks/useLiveRates';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { StatCard } from '../components/StatCard';
import { buildMonthlyProjection, estimateCompletions } from '../lib/projection';
import { money } from '../lib/format';
import { SECTION_LABELS, PRIORITY_LABELS } from '../types';

const PROJECTION_MONTHS = 48;

export function MonthlyPlanPage() {
  const { settings, loading: loadingSettings } = useSettings();
  const { items, loading: loadingItems } = useItems();
  const { rates, loading: loadingRates, error: ratesError, refresh: refreshRates } = useLiveRates();

  const monthlyRows = useMemo(() => {
    if (!settings) return [];
    return buildMonthlyProjection(settings, PROJECTION_MONTHS);
  }, [settings]);

  const completions = useMemo(() => {
    if (!monthlyRows.length) return [];
    return estimateCompletions(items, monthlyRows);
  }, [items, monthlyRows]);

  const visibleMonths = useMemo(() => {
    if (!monthlyRows.length) return [];
    const lastFundedIndex = completions.reduce((max, c) => {
      const idx = monthlyRows.findIndex((r) => r.label === c.monthLabel);
      return Math.max(max, idx);
    }, 5);
    return monthlyRows.slice(0, Math.min(monthlyRows.length, lastFundedIndex + 2));
  }, [monthlyRows, completions]);

  const loading = loadingSettings || loadingItems;
  const nextUp = completions[0];

  return (
    <div>
      <h2 className="page-title">الخطة الشهرية</h2>
      <p className="page-subtitle">توقع الدخل الشهري، والترتيب المتوقع لتمويل البنود حسب الأولوية التي حددتها.</p>

      {loading ? (
        <LoadingIndicator />
      ) : !settings ? (
        <p>لا توجد إعدادات بعد.</p>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="صافي الادخار هذا الشهر" value={monthlyRows[0] ? money(monthlyRows[0].netSavings) : '—'} />
            <StatCard
              label="البند التالي للتمويل"
              value={nextUp ? nextUp.item.name : 'كل البنود مموّلة'}
              tone="accent"
            />
            <StatCard label="الشهر المتوقع لتمويله" value={nextUp?.monthLabel ?? '—'} />
          </div>

          <div className="savings-header">
            <h3 className="section-title" style={{ margin: 0 }}>
              المدخرات والأصول الحالية
            </h3>
            <button className="btn-link" onClick={refreshRates} disabled={loadingRates}>
              {loadingRates ? '...جاري تحديث الأسعار' : 'تحديث الأسعار ↻'}
            </button>
          </div>

          {ratesError ? (
            <div className="error-banner">
              {ratesError} — الأسعار الحية غير متاحة الآن، حاول لاحقًا (القيم بالجنيه والدولار واليورو لن تُحسب).
            </div>
          ) : rates ? (
            <p className="page-subtitle" style={{ marginTop: -6 }}>
              آخر تحديث: {rates.fetchedAt.toLocaleTimeString('ar-EG')} — سعر الدولار {money(rates.usdToEgp)} · سعر اليورو{' '}
              {money(rates.eurToEgp)} · جرام الذهب عيار 21: {money(rates.goldEgp21kPerGram)} · عيار 24:{' '}
              {money(rates.goldEgp24kPerGram)}
            </p>
          ) : null}

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الأصل</th>
                  <th>الكمية</th>
                  <th>السعر الحالي</th>
                  <th>القيمة بالجنيه</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const cash = settings.saved_cash ?? 0;
                  const gold21 = settings.gold_grams_21k ?? 0;
                  const gold24 = settings.gold_grams_24k ?? 0;
                  const usd = settings.usd_amount ?? 0;
                  const eur = settings.eur_amount ?? 0;
                  const gold21Value = rates ? gold21 * rates.goldEgp21kPerGram : null;
                  const gold24Value = rates ? gold24 * rates.goldEgp24kPerGram : null;
                  const usdValue = rates ? usd * rates.usdToEgp : null;
                  const eurValue = rates ? eur * rates.eurToEgp : null;
                  const total = cash + (gold21Value ?? 0) + (gold24Value ?? 0) + (usdValue ?? 0) + (eurValue ?? 0);

                  const rows = [
                    { label: 'كاش', qty: `${money(cash)}`, rate: '—', value: cash },
                    { label: 'ذهب (عيار 21)', qty: `${gold21.toLocaleString('en-US')} جم`, rate: rates ? money(rates.goldEgp21kPerGram) + '/جم' : '...', value: gold21Value },
                    { label: 'ذهب (عيار 24)', qty: `${gold24.toLocaleString('en-US')} جم`, rate: rates ? money(rates.goldEgp24kPerGram) + '/جم' : '...', value: gold24Value },
                    { label: 'دولار أمريكي', qty: `${usd.toLocaleString('en-US')} $`, rate: rates ? money(rates.usdToEgp) : '...', value: usdValue },
                    { label: 'يورو', qty: `${eur.toLocaleString('en-US')} €`, rate: rates ? money(rates.eurToEgp) : '...', value: eurValue },
                  ];

                  return (
                    <>
                      {rows.map((r, idx) => (
                        <tr key={r.label} className={idx % 2 === 1 ? 'row-band' : undefined}>
                          <td>{r.label}</td>
                          <td>{r.qty}</td>
                          <td>{r.rate}</td>
                          <td>{r.value === null ? '...' : money(r.value)}</td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td colSpan={3}>الإجمالي</td>
                        <td>{money(total)}</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
          <p className="page-subtitle">
            عدّل الكميات من صفحة الإعدادات. أسعار الدولار واليورو والذهب تُجلب يوميًا تلقائيًا عند فتح الصفحة.
          </p>

          <h3 className="section-title">ما التالي؟ (بالترتيب حسب الأولوية)</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الترتيب</th>
                  <th>البند</th>
                  <th>القسم</th>
                  <th>الأولوية</th>
                  <th>المتبقي</th>
                  <th>الاحتياج التراكمي</th>
                  <th>الشهر المتوقع للتمويل الكامل</th>
                </tr>
              </thead>
              <tbody>
                {completions.map((c, idx) => (
                  <tr key={c.item.id} className={idx % 2 === 1 ? 'row-band' : undefined}>
                    <td>{idx + 1}</td>
                    <td>{c.item.name}</td>
                    <td>{SECTION_LABELS[c.item.section]}</td>
                    <td>{PRIORITY_LABELS[c.item.priority]}</td>
                    <td>{money(c.item.remaining)}</td>
                    <td>{money(c.cumulativeNeeded)}</td>
                    <td>{c.monthLabel ?? `أكثر من ${PROJECTION_MONTHS} شهرًا`}</td>
                  </tr>
                ))}
                {completions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-cell">
                      كل البنود تم تمويلها أو الانتهاء منها 🎉
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h3 className="section-title">الدخل والمصروف الشهري المتوقع</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الشهر</th>
                  <th>المرتب</th>
                  <th>دخل إضافي (جمعية)</th>
                  <th>مصروف المعيشة</th>
                  <th>قسط الجمعية الأولى</th>
                  <th>قسط الجمعية الثانية</th>
                  <th>صافي الادخار</th>
                  <th>الرصيد التراكمي</th>
                </tr>
              </thead>
              <tbody>
                {visibleMonths.map((r, idx) => (
                  <tr key={r.label + idx} className={idx % 2 === 1 ? 'row-band' : undefined}>
                    <td>{r.label}</td>
                    <td>{money(r.salary)}</td>
                    <td>{money(r.extraIncome)}</td>
                    <td>{money(r.livingExpense)}</td>
                    <td>{money(r.gam3eya1)}</td>
                    <td>{money(r.gam3eya2)}</td>
                    <td className={r.netSavings < 0 ? 'text-negative' : undefined}>{money(r.netSavings)}</td>
                    <td>{money(r.cumulativeBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
