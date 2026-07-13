import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SectionPage } from './pages/SectionPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { isSupabaseConfigured } from './lib/supabase';
import './App.css';

function SetupNotice() {
  return (
    <div className="setup-notice">
      <h1>إعداد الاتصال بقاعدة البيانات مطلوب</h1>
      <p>
        أنشئ ملف <code>.env</code> في جذر المشروع (انسخ من <code>.env.example</code>) وأضف بيانات مشروع Supabase الخاص بك:
      </p>
      <pre>{`VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co\nVITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY`}</pre>
      <p>ثم شغّل ملف supabase/schema.sql مرة واحدة في محرر SQL الخاص بمشروعك، وأعد تشغيل السيرفر.</p>
    </div>
  );
}

function App() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finishing" element={<SectionPage section="finishing" />} />
          <Route path="/furniture" element={<SectionPage section="furniture" />} />
          <Route path="/appliances" element={<SectionPage section="appliances" />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
