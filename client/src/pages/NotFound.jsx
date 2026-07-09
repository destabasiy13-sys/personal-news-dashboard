import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container mt-4 text-center">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}

export default NotFound;
