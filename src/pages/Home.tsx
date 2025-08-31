import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Composant pour la grille animée en arrière-plan
function AnimatedGrid() {
  const [activeCell, setActiveCell] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCell((prev) => (prev + 1) % 25);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-5 gap-1 opacity-20">
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={i}
          className={`h-4 w-4 rounded transition-all duration-300 ${
            activeCell === i
              ? "scale-125 bg-blue-500 shadow-lg"
              : Math.abs(activeCell - i) <= 1 || Math.abs(activeCell - i) === 5
                ? "bg-blue-300"
                : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// Composant pour les cartes d'objectifs
function ObjectiveCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 text-4xl">{icon}</div>
        <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
        <p className="text-white/80">{description}</p>
      </div>
    </div>
  );
}

// Composant pour les statistiques animées
function AnimatedStat({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <div className="mb-2 text-4xl font-bold text-white">
        {count}
        {suffix}
      </div>
      <div className="text-white/80">{label}</div>
    </div>
  );
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Grilles animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10">
          <AnimatedGrid />
        </div>
        <div className="absolute top-20 right-20">
          <AnimatedGrid />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <AnimatedGrid />
        </div>
        <div className="absolute right-10 bottom-10">
          <AnimatedGrid />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="mx-auto max-w-6xl text-center">
            <div
              className={`transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="mb-6 text-6xl leading-tight font-bold text-white md:text-8xl">
                Comprendre la
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Convolution
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-white/80 md:text-2xl">
                Découvrez visuellement les réseaux de neurones convolutionnels à
                travers des démonstrations interactives et des animations
                captivantes.
              </p>

              <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/demo"
                  className="group relative rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50"
                >
                  <span className="relative z-10">🚀 Lancer la Démo</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>

                <Link
                  to="/learn"
                  className="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                >
                  📚 Apprendre d'abord
                </Link>
              </div>

              {/* Statistiques animées */}
              <div className="mx-auto mb-16 grid max-w-2xl grid-cols-1 gap-8 md:grid-cols-3">
                <AnimatedStat value={2} label="Dimensions" suffix="D" />
                <AnimatedStat value={5} label="Types de filtres" />
                <AnimatedStat value={100} label="Interactivité" suffix="%" />
              </div>
            </div>
          </div>
        </section>

        {/* Section Objectifs */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Pourquoi cette plateforme ?
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-white/80">
                Une approche révolutionnaire pour comprendre les concepts
                fondamentaux des réseaux de neurones convolutionnels.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <ObjectiveCard
                icon="🎯"
                title="Visualisation Interactive"
                description="Manipulez matrices, kernels et paramètres en temps réel pour voir l'impact immédiat de chaque modification."
                delay={0}
              />

              <ObjectiveCard
                icon="🧠"
                title="Compréhension Intuitive"
                description="Transformez les concepts abstraits en expériences visuelles concrètes et mémorables."
                delay={200}
              />

              <ObjectiveCard
                icon="⚡"
                title="Apprentissage Rapide"
                description="Maîtrisez padding, stride, dilation et feature maps en quelques minutes seulement."
                delay={400}
              />

              <ObjectiveCard
                icon="🎮"
                title="Expérience Ludique"
                description="Apprenez en vous amusant grâce à des animations fluides et des interactions engageantes."
                delay={600}
              />

              <ObjectiveCard
                icon="📊"
                title="Validation Immédiate"
                description="Testez vos connaissances avec des quiz interactifs et obtenez un feedback instantané."
                delay={800}
              />

              <ObjectiveCard
                icon="🔬"
                title="Exploration Libre"
                description="Expérimentez avec différents presets et découvrez les effets de chaque paramètre."
                delay={1000}
              />
            </div>
          </div>
        </section>

        {/* Section Call-to-Action */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-12 backdrop-blur-sm">
              <h2 className="mb-6 text-4xl font-bold text-white">
                Prêt à explorer ?
              </h2>
              <p className="mb-8 text-xl text-white/80">
                Plongez dans l'univers fascinant de la convolution 2D et
                découvrez comment les CNN transforment l'intelligence
                artificielle.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/demo"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Commencer maintenant
                </Link>
                <Link
                  to="/quiz"
                  className="rounded-full border-2 border-white/30 px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  Tester mes connaissances
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
