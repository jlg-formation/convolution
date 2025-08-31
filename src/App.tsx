import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex gap-4 bg-blue-600 p-4 text-white">
        <Link to="/">Accueil</Link>
        <Link to="/demo">Démo</Link>
        <Link to="/learn">Cours</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/about">À propos</Link>
      </nav>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
