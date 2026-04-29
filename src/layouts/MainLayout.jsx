import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <header className="container py-3">
        <nav className="d-flex gap-3">
          <Link to="/">Home</Link>
          <Link to="/venues">Venues</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <main className="container py-4">
        <Outlet />
      </main>

      <footer className="container py-4">
        <p>© Luma Stays</p>
      </footer>
    </>
  );
}
