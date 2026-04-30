import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <>
      <Header />

      <main className="container py-4">
        <Outlet />
      </main>

      <footer className="container py-4">
        <p>© Luma Stays</p>
      </footer>
    </>
  );
}
