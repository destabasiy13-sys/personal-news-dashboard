import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Personal News Dashboard</Link>
      <div className="navbar-nav ms-auto">
        {user ? (
          <>
            <Link className="nav-link text-white" to="/saved">Saved Articles</Link>
            <span className="navbar-text text-white me-3">Hi, {user.username}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link text-white" to="/login">Login</Link>
            <Link className="nav-link text-white" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
