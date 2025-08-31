# Spécification -- Mini-site pédagogique CNN (Convolution)

## 1) Objectifs & public

-   **Objectif principal** : faire comprendre visuellement la
    convolution 2D (filtre, padding, stride, dilation), la notion de
    feature map et l'impact des hyperparamètres.
-   **Public** : étudiants débutants/intermédiaires en IA/vision.
-   **Périmètre** : démonstrations interactives + rappels théoriques
    concis. Pas d'entraînement de réseau complet.

## 2) Parcours utilisateur (UX)

1.  Arrivée sur la page d'accueil → courts objectifs + bouton « Lancer
    la démo ».
2.  **Demo Convolution** (page centrale) : l'utilisateur manipule
    matrice d'entrée, noyau, padding, stride ; animation du filtre qui «
    glisse » ; sortie calculée en direct.
3.  **Explainers** contextuels (panneau latéral) : définitions,
    formules, schémas.
4.  **Scénarios guidés** : presets (« sans padding », « same padding »,
    « stride 2 », « dilation »).
5.  **Quiz éclair** (3--5 questions) pour valider la compréhension.
6.  Export PNG/SVG du visuel et partage de l'état via l'URL
    (querystring).

## 3) Contenus pédagogiques

-   **Convolution 2D discrète** : Y\[i,j\]=∑ X\[i+u,j+v\]\*K\[u,v\]
    (avec gestion des bornes/padding).
-   **Padding** (valid/same/custom), **stride**, **dilation**, **flip du
    kernel** (option pédagogique pour distinguer convolution vs
    corrélation).
-   **Taille de sortie** :\
    H_out=floor((H_in+2P - D\*(K_h-1)-1)/S +1) (idem en largeur).
-   **Multi-canaux** (option) : sommation sur canaux d'entrée.
-   **Pooling** (option bonus) : max/average (pour situer vs
    convolution).
-   **Bonnes pratiques** : initialisation des filtres, normalisation
    d'entrée, interprétation des motifs (bords, textures).

## 4) Démos & interactions clés

### 4.1 Demo « Convolution simple »

-   **Entrée** : grille éditable (taille 5--15 par 5--15), valeurs
    −9...+9 (clavier, drag pour peindre).
-   **Kernel** : 1--7 par 1--7, presets (Sobel X/Y, Laplacien, gaussien
    3×3).
-   **Paramètres** : padding (0/'same'/valeur), stride (1--4), dilation
    (1--3), « convolution vs corrélation » (toggle).
-   **Affichages** :
    -   Animation du déplacement du kernel (frame-by-frame ou lecture
        auto, vitesse réglable).
    -   Calcul étape par étape pour la cellule active (mini fenêtre
        montrant les produits-sommes).
    -   Heatmap entrée / noyau / sortie, avec tooltips (valeurs).
    -   Formule actualisée + dimensions attendues (avec validation).
-   **Export** : PNG/SVG du trio entrée-kernel-sortie, et **Permalien**
    (état sérialisé en querystring).

### 4.2 Demo « Effet des hyperparamètres »

-   Slider synchronisé pour **padding/stride/dilation** avec sortie
    recalculée en temps réel.
-   Graphique « taille sortie vs paramètre » (petit plot dynamique).
-   Presets comparatifs « avant/après » (split view).

### 4.3 Demo « Multi-canaux » (optionnelle v1.1)

-   Empilement de 3 canaux (RGB synthétique), 3 filtres correspondants →
    1 map de sortie.
-   Visualisation des contributions par canal
    (superposition/mini-cartes).

### 4.4 Mini-Quiz (3--5 QCM)

-   Questions ciblant : tailles de sortie, rôle du padding/stride,
    différence conv/corrélation.
-   Correction immédiate + explication courte.

## 5) Spécifications fonctionnelles

-   **Édition des matrices** : clic pour sélectionner, frappe clavier
    pour valeur ; drag pour remplir.
-   **Validation** : empêcher tailles invalides (kernel \> entrée sans
    padding adéquat), avertir si sortie vide.
-   **Accessibilité** : navigation clavier complète, aria-labels,
    contrastes AA, équivalents textuels des animations.
-   **Internationalisation** : FR par défaut, EN en toggle (clé/val
    JSON).
-   **Offline-first** : PWA (cache statique, fallback), dernier état
    sauvegardé en localStorage.
-   **Aide intégrée** : tooltip « ? » sur chaque paramètre, mini
    glossaire.

## 6) Non-fonctionnel

-   **Performance** : rendu \<16ms par frame d'animation sur grilles ≤
    15×15 ; calculs en **WebWorker** si nécessaire.
-   **Fiabilité** : tests unitaires des fonctions de convolution (cas
    valid/same, stride\>1, dilation\>1).
-   **Sécurité** : aucune donnée externe, pas de backend.
-   **Compatibilité** : derniers Chrome/Firefox/Edge/Safari, mobile
    responsive (≥ 360px).

## 7) Tech & architecture

-   **Stack** : Vite + **TypeScript** + **React** (SPA) + **Tailwind CSS
    v4** + Bun (dev).
-   **Rendu** : Canvas ou SVG pour grilles (SVG favorise tooltips et
    export), Canvas pour animation fluide (mix possible).
-   **Math** : KaTeX pour formules.
-   **i18n** : simple dictionnaire JSON (FR/EN).
-   **PWA** : manifest + service worker (Vite plugin).
-   **Déploiement** : GitHub Pages (CI GitHub Actions, build
    `bun run build`, base path configuré).

### 7.1 Structure proposée

/src /components Grid.tsx\
KernelEditor.tsx ControlsPanel.tsx\
StepInspector.tsx\
AnimationBar.tsx\
CompareView.tsx Quiz.tsx FormulaBox.tsx /logic convolution.ts\
shapes.ts\
presets.ts\
serialize.ts\
/state useStore.ts\
/pages Home.tsx Demo.tsx Learn.tsx\
/styles tailwind.css

## 8) Composants & comportements (résumé)

-   **Grid** : zoom (±), survol = tooltip valeur, clic = sélection
    cellule, entrée clavier = edit, drag = peindre.
-   **KernelEditor** : tailles dynamiques, verrouillage symétrie
    (option), normalisation rapide (sommes=1).
-   **ControlsPanel** : sliders + inputs numériques ; presets.
-   **AnimationBar** : play/pause, vitesse, « step » ; curseur pour se
    déplacer sur l'index de sortie.
-   **StepInspector** : liste (cellule entrée × coefficient noyau) =
    produit, puis somme → valeur sortie.
-   **CompareView** : avant/après (deux rendus synchronisés).
-   **Quiz** : QCM léger, stockage score localStorage.

## 9) Accessibilité & design

-   Tailwind (grille, cards, contrastes) ; focus rings visibles ;
    tailles de police adaptatives.
-   Mode clair/sombre (toggle).
-   Animation désactivable (respect `prefers-reduced-motion`).

## 10) Tests & qualité

-   **Unit tests** (Vitest) : convolution.ts, shapes.ts.
-   **E2E** (Playwright) : scénarios « preset Sobel », « same padding »,
    « stride=2 ».
-   **Lint/format** : ESLint + Prettier, CI sur PR.
-   **Perf** : budget Lighthouse ≥ 90 (Perf/Access/Best Practices/SEO).

## 11) Mesure & analytics (option)

-   Compteur local de complétion du quiz (sans tracking externe).

## 12) SEO & métadonnées

-   Titre « Comprendre la convolution (CNN) --- Démo interactive ».
-   Meta description, OpenGraph image statique, sitemap simple.

## 13) Roadmap

-   **v1.0** : Demo Convolution simple + padding/stride, animation,
    presets, quiz, export image, permalien, FR/EN, PWA.
-   **v1.1** : Dilation + multi-canaux + CompareView.
-   **v1.2** : Pooling, convolution 1×1, « valid vs same » avancé.
-   **v1.3** : Détection de contours, champs réceptifs.

## 14) Critères d'acceptation

-   Changer **stride** de 1 à 2 met à jour **immédiatement** la taille
    de sortie et l'animation suit le nouveau pas.
-   Le **preset Sobel** produit bien une sortie cohérente.
-   Le **mode "same padding"** conserve H_out=H_in et W_out=W_in pour
    stride=1.
-   Le **StepInspector** affiche correctement les produits-sommes.
-   L'URL de partage restaure intégralement l'état.
