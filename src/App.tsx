import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function App() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  const navigationLinks = [
    { to: "/", label: "Accueil", icon: "🏠" },
    { to: "/demo", label: "Démo", icon: "🚀" },
    { to: "/learn", label: "Cours", icon: "📚" },
    { to: "/quiz", label: "Quiz", icon: "🧠" },
    { to: "/about", label: "À propos", icon: "ℹ️" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation moderne avec glassmorphism */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage
            ? "border-b border-white/10 bg-slate-900/90 shadow-lg backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="group flex items-center space-x-2 transition-all duration-300 hover:scale-105"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                C
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                Convolution
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden items-center space-x-1 md:flex">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    location.pathname === link.to
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-base">{link.icon}</span>
                    <span>{link.label}</span>
                  </span>

                  {/* Indicateur actif */}
                  {location.pathname === link.to && (
                    <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30" />
                  )}

                  {/* Effet hover */}
                  <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            {/* Menu mobile */}
            <div className="md:hidden">
              <MobileMenu
                navigationLinks={navigationLinks}
                currentPath={location.pathname}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal avec padding-top pour compenser la navbar fixe */}
      <main className={`flex-1 ${isHomePage ? "" : "pt-16"}`}>
        <Outlet />
      </main>
    </div>
  );
}

// Composant Menu Mobile
function MobileMenu({
  navigationLinks,
  currentPath,
}: {
  navigationLinks: Array<{ to: string; label: string; icon: string }>;
  currentPath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-2 text-white transition-colors duration-200 hover:bg-white/10"
        aria-label="Menu"
      >
        <div className="flex h-6 w-6 flex-col items-center justify-center space-y-1">
          <span
            className={`block h-0.5 w-5 transform bg-white transition-all duration-300 ${
              isOpen ? "translate-y-1 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 transform bg-white transition-all duration-300 ${
              isOpen ? "-translate-y-1 -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Menu mobile overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 right-4 z-50 min-w-[200px] rounded-2xl border border-white/20 bg-slate-900/95 shadow-2xl backdrop-blur-md">
            <div className="space-y-2 p-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    currentPath === link.to
                      ? "border border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
