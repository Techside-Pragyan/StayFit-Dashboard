import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, PlusCircle } from 'lucide-react';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Activity color="var(--accent-color)" />
        <span>StayFit</span>
      </Link>
      <div className="nav-links">
        <span style={{ color: 'var(--text-secondary)' }}>Hi, {user.name}</span>
        <Link to="/log" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          <PlusCircle size={18} /> Log Data
        </Link>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
