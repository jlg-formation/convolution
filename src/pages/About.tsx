import { Link } from "react-router-dom";

// Composant pour les cartes de contributeurs
function ContributorCard({
  name,
  role,
  description,
  icon,
  link,
}: {
  name: string;
  role: string;
  description: string;
  icon: string;
  link?: string;
}) {
  const content = (
    <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 text-5xl">{icon}</div>
        <h3 className="mb-2 text-xl font-bold text-white">{name}</h3>
        <div className="mb-3 inline-block rounded-full bg-blue-500/30 px-3 py-1">
          <span className="text-sm font-medium text-blue-200">{role}</span>
        </div>
        <p className="leading-relaxed text-white/80">{description}</p>
        {link && (
          <div className="mt-4 flex items-center text-blue-300 transition-colors group-hover:text-blue-200">
            <span className="text-sm">→ Visiter</span>
          </div>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

// Composant pour les statistiques du projet
function ProjectStat({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string;
}) {
  return (
    <div className="text-center">
      <div className="mb-2 text-3xl">{icon}</div>
      <div className="mb-1 text-3xl font-bold text-white">{value}</div>
      <div className="text-white/80">{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* En-tête */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-block rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-2">
            <span className="font-medium text-blue-300">ℹ️ À propos</span>
          </div>
          <h1 className="mb-4 text-5xl font-bold text-white">
            Derrière le
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Projet
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-white/80">
            Une plateforme éducative créée avec passion pour démocratiser
            l'apprentissage des réseaux de neurones convolutionnels.
          </p>
        </div>

        {/* Mission et Vision */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-4 text-4xl">🎯</div>
            <h2 className="mb-4 text-2xl font-bold text-white">
              Notre Mission
            </h2>
            <p className="leading-relaxed text-white/80">
              Rendre l'apprentissage des CNN accessible et interactif. Nous
              croyons que la visualisation et l'expérimentation sont les clés
              pour comprendre les concepts complexes de l'intelligence
              artificielle.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-4 text-4xl">🚀</div>
            <h2 className="mb-4 text-2xl font-bold text-white">Notre Vision</h2>
            <p className="leading-relaxed text-white/80">
              Créer un écosystème d'apprentissage où chaque étudiant peut
              maîtriser les fondamentaux des CNN grâce à des outils modernes,
              intuitifs et scientifiquement rigoureux.
            </p>
          </div>
        </div>

        {/* Équipe */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            🧭 L'Équipe
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ContributorCard
              name="Jean-Louis GUENEGO"
              role="Auteur Principal"
              description="Consultant expert en développement web et formateur passionné. Fondateur de JLG Consulting, spécialisé dans les technologies modernes et l'accompagnement d'équipes."
              icon="👨‍💻"
              link="https://jlg-consulting.com"
            />

            <ContributorCard
              name="ChatGPT OpenAI"
              role="Co-auteur IA"
              description="Assistant d'intelligence artificielle contribuant à la conception pédagogique, la génération de contenu et l'optimisation de l'expérience utilisateur."
              icon="🤖"
            />

            <ContributorCard
              name="GitHub Copilot"
              role="Co-auteur Technique"
              description="Assistant de programmation alimenté par l'IA, contribuant à l'écriture de code efficace et aux bonnes pratiques de développement."
              icon="🔧"
            />
          </div>
        </div>

        {/* Statistiques du projet */}
        <div className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            📊 Le Projet en Chiffres
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <ProjectStat value="2025" label="Année de création" icon="📅" />
            <ProjectStat value="5" label="Questions de quiz" icon="🧠" />
            <ProjectStat value="100%" label="Open Source" icon="🔓" />
            <ProjectStat
              value="∞"
              label="Possibilités d'apprentissage"
              icon="🌟"
            />
          </div>
        </div>

        {/* Technologies utilisées */}
        <div className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            ⚡ Technologies Utilisées
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { name: "React 19", icon: "⚛️" },
              { name: "TypeScript", icon: "🔷" },
              { name: "Tailwind CSS", icon: "🎨" },
              { name: "Vite", icon: "⚡" },
              { name: "KaTeX", icon: "📐" },
              { name: "Zustand", icon: "🐻" },
              { name: "React Router", icon: "🛣️" },
              { name: "Bun", icon: "🥟" },
            ].map((tech, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/5 p-4 text-center transition-colors hover:bg-white/10"
              >
                <div className="mb-2 text-2xl">{tech.icon}</div>
                <div className="text-sm font-medium text-white/80">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Licence et Remerciements */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-teal-500/10 p-8 backdrop-blur-sm">
            <div className="mb-4 text-4xl">📄</div>
            <h2 className="mb-4 text-2xl font-bold text-white">Licence</h2>
            <p className="mb-4 leading-relaxed text-white/80">
              <strong>Aucune licence restrictive !</strong>
            </p>
            <p className="text-white/70">
              Amusez-vous avec ce code si vous voulez. Copiez, modifiez,
              distribuez, apprenez et partagez librement. L'éducation doit être
              accessible à tous.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 backdrop-blur-sm">
            <div className="mb-4 text-4xl">🙏</div>
            <h2 className="mb-4 text-2xl font-bold text-white">
              Remerciements
            </h2>
            <p className="leading-relaxed text-white/80">
              Merci à tous les étudiants, enseignants et développeurs qui
              rendent l'apprentissage des technologies plus accessible. Votre
              curiosité et votre passion inspirent des projets comme celui-ci.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="rounded-3xl border border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold text-white">
              🚀 Prêt à explorer ?
            </h2>
            <p className="mb-6 text-xl text-white/80">
              Découvrez les CNN de manière interactive et amusante !
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/demo"
                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                🎮 Lancer la Démo
              </Link>
              <Link
                to="/learn"
                className="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                📚 Commencer le Cours
              </Link>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 text-center">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-lg font-semibold text-white">
              💼 Besoin d'expertise technique ?
            </h3>
            <p className="mb-4 text-white/80">
              JLG Consulting accompagne vos projets de développement web et de
              formation.
            </p>
            <a
              href="https://jlg-consulting.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-300 transition-colors hover:text-blue-200"
            >
              <span>🌐 jlg-consulting.com</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
