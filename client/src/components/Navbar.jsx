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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Personal News Dashboard</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav ms-auto align-items-lg-center">
          {user ? (
            <>
              <Link className="nav-link text-white" to="/saved">Saved Articles</Link>
              <span className="navbar-text text-white me-lg-3">Hi, {user.username}</span>
              <button className="btn btn-outline-light btn-sm my-2 my-lg-0" onClick={handleLogout}>
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
      </div>
    </nav>
  );
}

export default Navbar;
