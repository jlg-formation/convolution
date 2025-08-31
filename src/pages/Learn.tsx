import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import katex from "katex";
import "katex/dist/katex.min.css";

// Composant pour les formules mathématiques
function MathFormula({
  formula,
  className = "",
}: {
  formula: string;
  className?: string;
}) {
  useEffect(() => {
    const elements = document.querySelectorAll(".math-formula");
    elements.forEach((element) => {
      if (element.getAttribute("data-formula") === formula) {
        katex.render(formula, element as HTMLElement, {
          throwOnError: false,
          displayMode: true,
        });
      }
    });
  }, [formula]);

  return <div className={`math-formula ${className}`} data-formula={formula} />;
}

// Composant pour les sections pliables
function CollapsibleSection({
  title,
  children,
  icon,
  isOpen,
  onToggle,
  id,
}: {
  title: string;
  children: React.ReactNode;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div
      id={id}
      className="mb-6 scroll-mt-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-white/5"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div
          className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        className={`transition-all duration-500 ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
      >
        <div className="p-6 pt-0">{children}</div>
      </div>
    </div>
  );
}

// Composant pour les cartes d'explication
function ConceptCard({
  title,
  content,
  example,
  color = "blue",
}: {
  title: string;
  content: string;
  example?: React.ReactNode;
  color?: string;
}) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    green: "from-green-500/20 to-green-600/20 border-green-500/30",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} mb-4 rounded-xl border p-6 backdrop-blur-sm`}
    >
      <h4 className="mb-3 text-lg font-semibold text-white">{title}</h4>
      <p className="mb-4 leading-relaxed text-white/90">{content}</p>
      {example && <div className="rounded-lg bg-black/20 p-4">{example}</div>}
    </div>
  );
}

// Composant pour la grille visuelle
function VisualGrid({
  title,
  matrix,
  highlight = [],
}: {
  title: string;
  matrix: number[][];
  highlight?: number[];
}) {
  return (
    <div className="text-center">
      <h5 className="mb-2 text-sm font-medium text-white/80">{title}</h5>
      <div className="inline-block rounded-lg bg-black/30 p-3">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 1fr)`,
          }}
        >
          {matrix.flat().map((value, index) => (
            <div
              key={index}
              className={`flex h-8 w-8 items-center justify-center rounded text-xs font-medium transition-all duration-300 ${
                highlight.includes(index)
                  ? "scale-110 bg-yellow-400 text-black shadow-lg"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Learn() {
  const [activeSection, setActiveSection] = useState(0);
  const [openSections, setOpenSections] = useState([true, false, false, false]);

  // Fonction pour naviguer vers une section
  const navigateToSection = (sectionIndex: number) => {
    setActiveSection(sectionIndex);

    // Ouvrir la section correspondante
    const newOpenSections = [...openSections];
    newOpenSections[sectionIndex] = true;
    setOpenSections(newOpenSections);

    // Scroll vers la section
    const sectionIds = [
      "section-intro",
      "section-convolution",
      "section-hyperparameters",
      "section-applications",
    ];
    const targetElement = document.getElementById(sectionIds[sectionIndex]);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Fonction pour toggler une section
  const toggleSection = (sectionIndex: number) => {
    const newOpenSections = [...openSections];
    newOpenSections[sectionIndex] = !newOpenSections[sectionIndex];
    setOpenSections(newOpenSections);
  };

  // Exemples de matrices pour la démonstration
  const inputMatrix = [
    [1, 2, 3, 0],
    [0, 1, 2, 3],
    [3, 0, 1, 2],
    [2, 3, 0, 1],
  ];

  const kernel = [
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1],
  ];

  const outputMatrix = [
    [-4, -6],
    [4, 6],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* En-tête de la page */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-block rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-2">
            <span className="font-medium text-blue-300">📚 Cours Complet</span>
          </div>
          <h1 className="mb-4 text-5xl font-bold text-white">
            Réseaux de Neurones
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Convolutionnels
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-white/80">
            Maîtrisez les concepts fondamentaux des CNN et comprenez en
            profondeur le fonctionnement des couches de convolution.
          </p>
        </div>

        {/* Navigation rapide */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-bold text-white">
            🗺️ Plan du cours
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "🧠 Introduction aux CNN",
              "🔍 Couche de Convolution",
              "⚙️ Hyperparamètres",
              "🎯 Applications Pratiques",
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => navigateToSection(index)}
                className={`rounded-lg p-3 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  activeSection === index
                    ? "border border-blue-400/50 bg-blue-500/30 text-white shadow-lg"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Introduction aux CNN */}
        <CollapsibleSection
          title="Introduction aux Réseaux de Neurones Convolutionnels"
          icon="🧠"
          isOpen={openSections[0]}
          onToggle={() => toggleSection(0)}
          id="section-intro"
        >
          <div className="space-y-6">
            <ConceptCard
              title="Qu'est-ce qu'un CNN ?"
              content="Les Réseaux de Neurones Convolutionnels (CNN) sont une architecture de deep learning spécialement conçue pour traiter des données qui ont une structure de grille, comme les images. Ils utilisent l'opération de convolution pour détecter des caractéristiques locales."
              color="blue"
            />

            <ConceptCard
              title="Pourquoi les CNN pour les images ?"
              content="Les images ont des propriétés spatiales importantes : les pixels voisins sont corrélés. Les CNN exploitent cette structure grâce à la convolution, qui permet de détecter des motifs locaux (contours, textures) tout en partageant les paramètres."
              color="purple"
            />

            <div className="rounded-xl bg-white/5 p-6">
              <h4 className="mb-4 text-lg font-semibold text-white">
                🏗️ Architecture typique d'un CNN
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-4 text-center">
                {[
                  { name: "Image d'entrée", color: "bg-green-500/30" },
                  { name: "Conv + ReLU", color: "bg-blue-500/30" },
                  { name: "Pooling", color: "bg-purple-500/30" },
                  { name: "Conv + ReLU", color: "bg-blue-500/30" },
                  { name: "Pooling", color: "bg-purple-500/30" },
                  { name: "Dense", color: "bg-orange-500/30" },
                  { name: "Sortie", color: "bg-red-500/30" },
                ].map((layer, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`${layer.color} rounded-lg px-4 py-2 text-sm font-medium text-white`}
                    >
                      {layer.name}
                    </div>
                    {index < 6 && <span className="mx-2 text-white/60">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 2: Couche de Convolution */}
        <CollapsibleSection
          title="La Couche de Convolution en Détail"
          icon="🔍"
          isOpen={openSections[1]}
          onToggle={() => toggleSection(1)}
          id="section-convolution"
        >
          <div className="space-y-6">
            <ConceptCard
              title="Principe de la Convolution 2D"
              content="La convolution 2D consiste à faire glisser un petit filtre (kernel) sur l'image d'entrée. À chaque position, on calcule le produit scalaire entre le filtre et la région correspondante de l'image."
              color="blue"
            />

            {/* Formule mathématique principale */}
            <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
              <h4 className="mb-4 text-lg font-semibold text-white">
                📐 Formule de la Convolution 2D
              </h4>
              <div className="text-center">
                <MathFormula
                  formula="Y[i,j] = \sum_{u=0}^{K_h-1} \sum_{v=0}^{K_w-1} X[i+u, j+v] \times K[u,v]"
                  className="text-lg text-white"
                />
              </div>
              <div className="mt-4 text-sm text-white/80">
                <p>
                  <strong>Où :</strong>
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>
                    <code>Y[i,j]</code> : valeur de sortie à la position (i,j)
                  </li>
                  <li>
                    <code>X[i+u, j+v]</code> : valeur d'entrée à la position
                    (i+u, j+v)
                  </li>
                  <li>
                    <code>K[u,v]</code> : valeur du kernel à la position (u,v)
                  </li>
                  <li>
                    <code>K_h, K_w</code> : hauteur et largeur du kernel
                  </li>
                </ul>
              </div>
            </div>

            {/* Exemple visuel */}
            <div className="rounded-xl bg-white/5 p-6">
              <h4 className="mb-6 text-center text-lg font-semibold text-white">
                🎯 Exemple Pratique : Détection de Contours Verticaux
              </h4>

              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
                <VisualGrid title="Image d'entrée (4×4)" matrix={inputMatrix} />
                <VisualGrid title="Kernel Sobel (3×3)" matrix={kernel} />
                <VisualGrid title="Sortie (2×2)" matrix={outputMatrix} />
              </div>

              <div className="mt-6 rounded-lg bg-black/20 p-4">
                <h5 className="mb-2 font-medium text-white">
                  💡 Calcul détaillé pour Y[0,0] :
                </h5>
                <MathFormula
                  formula="Y[0,0] = 1×1 + 2×0 + 3×(-1) + 0×2 + 1×0 + 2×(-2) + 3×1 + 0×0 + 1×(-1) = -4"
                  className="text-white/90"
                />
              </div>
            </div>

            <ConceptCard
              title="Intuition : Que fait la convolution ?"
              content="La convolution permet de détecter des caractéristiques spécifiques dans l'image. Chaque kernel est spécialisé dans la détection d'un type de motif : contours, textures, formes, etc. Plus le produit scalaire est élevé, plus la caractéristique est présente."
              color="green"
            />
          </div>
        </CollapsibleSection>

        {/* Section 3: Hyperparamètres */}
        <CollapsibleSection
          title="Hyperparamètres de la Convolution"
          icon="⚙️"
          isOpen={openSections[2]}
          onToggle={() => toggleSection(2)}
          id="section-hyperparameters"
        >
          <div className="space-y-6">
            {/* Padding */}
            <ConceptCard
              title="🔲 Padding (Rembourrage)"
              content="Le padding consiste à ajouter des zéros (ou d'autres valeurs) autour de l'image d'entrée pour contrôler la taille de sortie et préserver l'information des bords."
              color="blue"
              example={
                <div>
                  <p className="mb-2 text-white/90">
                    <strong>Types de padding :</strong>
                  </p>
                  <ul className="space-y-1 text-sm text-white/80">
                    <li>
                      • <strong>Valid</strong> : Aucun padding (sortie plus
                      petite)
                    </li>
                    <li>
                      • <strong>Same</strong> : Padding pour garder la même
                      taille
                    </li>
                    <li>
                      • <strong>Custom</strong> : Valeur de padding
                      personnalisée
                    </li>
                  </ul>
                </div>
              }
            />

            {/* Stride */}
            <ConceptCard
              title="👟 Stride (Pas)"
              content="Le stride définit de combien de pixels le kernel se déplace à chaque étape. Un stride de 1 signifie qu'on se déplace d'un pixel, un stride de 2 qu'on saute un pixel sur deux."
              color="purple"
              example={
                <div>
                  <p className="mb-2 text-white/90">
                    <strong>Impact du stride :</strong>
                  </p>
                  <ul className="space-y-1 text-sm text-white/80">
                    <li>• Stride = 1 : Convolution standard</li>
                    <li>• Stride {">"}1 : Réduction de la taille de sortie</li>
                    <li>
                      • Plus le stride est grand, plus la sortie est petite
                    </li>
                  </ul>
                </div>
              }
            />

            {/* Taille de sortie */}
            <div className="rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6">
              <h4 className="mb-4 text-lg font-semibold text-white">
                📏 Calcul de la Taille de Sortie
              </h4>
              <div className="mb-4 text-center">
                <MathFormula
                  formula="H_{out} = \lfloor \frac{H_{in} + 2P - K_h}{S} \rfloor + 1"
                  className="text-white"
                />
                <MathFormula
                  formula="W_{out} = \lfloor \frac{W_{in} + 2P - K_w}{S} \rfloor + 1"
                  className="text-white"
                />
              </div>
              <div className="text-sm text-white/80">
                <p>
                  <strong>Où :</strong>
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>
                    <code>H_in, W_in</code> : dimensions d'entrée
                  </li>
                  <li>
                    <code>P</code> : padding
                  </li>
                  <li>
                    <code>K_h, K_w</code> : taille du kernel
                  </li>
                  <li>
                    <code>S</code> : stride
                  </li>
                </ul>
              </div>
            </div>

            {/* Dilation */}
            <ConceptCard
              title="🕳️ Dilation"
              content="La dilation permet d'élargir le champ réceptif du kernel en insérant des espaces entre ses éléments. Cela permet de capturer des informations sur une zone plus large sans augmenter le nombre de paramètres."
              color="green"
              example={
                <div>
                  <p className="mb-2 text-white/90">
                    <strong>Avantages de la dilation :</strong>
                  </p>
                  <ul className="space-y-1 text-sm text-white/80">
                    <li>• Champ réceptif plus large</li>
                    <li>• Pas d'augmentation des paramètres</li>
                    <li>• Utile pour la segmentation</li>
                  </ul>
                </div>
              }
            />
          </div>
        </CollapsibleSection>

        {/* Section 4: Applications */}
        <CollapsibleSection
          title="Applications Pratiques et Bonnes Pratiques"
          icon="🎯"
          isOpen={openSections[3]}
          onToggle={() => toggleSection(3)}
          id="section-applications"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ConceptCard
                title="🎨 Types de Filtres Courants"
                content="Différents types de kernels permettent de détecter différentes caractéristiques dans les images."
                color="blue"
                example={
                  <div className="space-y-2">
                    <p className="text-sm text-white/90">
                      <strong>Sobel :</strong> Détection de contours
                    </p>
                    <p className="text-sm text-white/90">
                      <strong>Gaussien :</strong> Lissage/flou
                    </p>
                    <p className="text-sm text-white/90">
                      <strong>Laplacien :</strong> Détection de bords
                    </p>
                    <p className="text-sm text-white/90">
                      <strong>Prewitt :</strong> Détection de contours
                    </p>
                  </div>
                }
              />

              <ConceptCard
                title="🚀 Optimisations"
                content="Techniques pour améliorer les performances et la précision des CNN."
                color="purple"
                example={
                  <div className="space-y-2">
                    <p className="text-sm text-white/90">
                      <strong>Batch Normalization :</strong> Stabilité
                    </p>
                    <p className="text-sm text-white/90">
                      <strong>Dropout :</strong> Régularisation
                    </p>
                    <p className="text-sm text-white/90">
                      <strong>Data Augmentation :</strong> Diversité
                    </p>
                    <p className="text-sm text-white/90">
                      <strong>Transfer Learning :</strong> Réutilisation
                    </p>
                  </div>
                }
              />
            </div>

            <ConceptCard
              title="💡 Conseils Pratiques"
              content="Pour bien utiliser les couches de convolution dans vos projets."
              color="orange"
              example={
                <div className="space-y-2 text-sm text-white/90">
                  <p>
                    • <strong>Commencez simple :</strong> Kernels 3×3, stride 1
                  </p>
                  <p>
                    • <strong>Augmentez progressivement :</strong> Nombre de
                    filtres
                  </p>
                  <p>
                    • <strong>Utilisez le padding "same" :</strong> Pour garder
                    les dimensions
                  </p>
                  <p>
                    • <strong>Alternez conv et pooling :</strong> Pour réduire
                    la dimensionnalité
                  </p>
                  <p>
                    • <strong>Visualisez les feature maps :</strong> Pour
                    comprendre ce qui est appris
                  </p>
                </div>
              }
            />
          </div>
        </CollapsibleSection>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="rounded-3xl border border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-3xl font-bold text-white">
              🎮 Prêt à expérimenter ?
            </h2>
            <p className="mb-6 text-xl text-white/80">
              Maintenant que vous comprenez la théorie, passez à la pratique !
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/demo"
                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                🚀 Essayer la Démo Interactive
              </Link>
              <Link
                to="/quiz"
                className="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                🧠 Tester mes Connaissances
              </Link>
            </div>
          </div>
        </div>

        {/* Glossaire rapide */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-6 text-2xl font-bold text-white">
            📖 Glossaire Rapide
          </h2>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {[
              {
                term: "Feature Map",
                def: "Résultat de l'application d'un filtre sur l'entrée",
              },
              {
                term: "Kernel/Filtre",
                def: "Petite matrice de poids qui glisse sur l'image",
              },
              {
                term: "Champ Réceptif",
                def: "Zone de l'entrée qui influence une sortie",
              },
              {
                term: "Paramètres Partagés",
                def: "Même kernel utilisé sur toute l'image",
              },
              {
                term: "Invariance Translation",
                def: "Même réponse peu importe la position",
              },
              {
                term: "Backpropagation",
                def: "Algorithme d'entraînement des réseaux",
              },
            ].map((item, index) => (
              <div key={index} className="rounded-lg bg-white/5 p-3">
                <div className="font-semibold text-blue-300">{item.term}</div>
                <div className="text-white/80">{item.def}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
