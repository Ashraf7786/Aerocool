import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Wind
} from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear tokens here
    navigate('/');
  };

  const navItems = [
    { label: 'Overview',  icon: <LayoutDashboard size={20} />, href: '/admin' },
    { label: 'Bookings',  icon: <CalendarCheck size={20} />,   href: '/admin/bookings' },
    { label: 'Contacts',  icon: <MessageSquare size={20} />,   href: '/admin/contacts' },
    { label: 'Settings',  icon: <Settings size={20} />,        href: '/admin/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFF' }}>
      {/* Sidebar */}
      <aside style={{
        width: isSidebarOpen ? '260px' : '0',
        background: '#fff',
        borderRight: '1px solid #E2E8F0',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ width: 36, height: 36, background: 'var(--blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Wind size={22} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--black)', letterSpacing: '-0.02em' }}>
            Aero<span style={{ color: 'var(--blue)' }}>Admin</span>
          </span>
        </div>

        <nav style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === '/admin'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? 'var(--blue)' : '#64748B',
                background: isActive ? 'var(--blue-light)' : 'transparent',
                transition: 'all 0.2s'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #F1F5F9' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              background: 'transparent',
              color: '#EF4444',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          height: '70px',
          background: '#fff',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
          >
            {isSidebarOpen ? <Menu size={24} /> : <Menu size={24} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--black)' }}>Admin User</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Super Admin</div>
            </div>
            <div style={{ 
              width: 40, height: 40, borderRadius: '50%', background: 'var(--blue-light)', 
              color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
            }}>
              AU
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th {
          text-align: left;
          padding: 16px;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #64748B;
          border-bottom: 1px solid #F1F5F9;
        }
        .admin-table td {
          padding: 16px;
          font-size: 0.9rem;
          color: var(--black);
          border-bottom: 1px solid #F1F5F9;
        }
        .status-badge {
          padding: 4px 12px;
          borderRadius: 50px;
          fontSize: 0.75rem;
          fontWeight: 700;
          textTransform: uppercase;
        }
        .status-pending { background: #FFF7ED; color: #C2410C; }
        .status-completed { background: #F0FDF4; color: #15803D; }
        .status-cancelled { background: #FEF2F2; color: #B91C1C; }
      `}</style>
    </div>
  );
}
