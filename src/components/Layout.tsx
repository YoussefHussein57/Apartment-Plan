import { NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/finishing', label: 'التشطيب' },
  { to: '/furniture', label: 'العفش' },
  { to: '/appliances', label: 'الأجهزة الكهربائية' },
  { to: '/payments', label: 'المدفوعات' },
  { to: '/settings', label: 'الإعدادات' },
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>خطة تجهيز الشقة</h1>
        <nav className="app-nav">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
