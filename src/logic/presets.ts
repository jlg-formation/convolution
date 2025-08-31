// Presets de kernels couramment utilisés dans les CNN
export const kernelPresets = [
  {
    name: "Identité",
    description: "Kernel identité - ne modifie pas l'image",
    matrix: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  },
  {
    name: "Sobel X",
    description: "Détection de contours verticaux (gradient horizontal)",
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  },
  {
    name: "Sobel Y",
    description: "Détection de contours horizontaux (gradient vertical)",
    matrix: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
  },
  {
    name: "Laplacien",
    description: "Détection de contours dans toutes les directions",
    matrix: [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ],
  },
  {
    name: "Flou Gaussien",
    description: "Lissage/flou de l'image",
    matrix: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1],
    ],
  },
  {
    name: "Accentuation",
    description: "Renforce les détails et contours",
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
  },
  {
    name: "Emboss",
    description: "Effet de relief/gaufrage",
    matrix: [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2],
    ],
  },
  {
    name: "Prewitt X",
    description: "Détection de contours verticaux (alternative à Sobel)",
    matrix: [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ],
  },
  {
    name: "Prewitt Y",
    description: "Détection de contours horizontaux (alternative à Sobel)",
    matrix: [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    name: "Box Blur",
    description: "Flou uniforme simple",
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
];

// Presets pour les matrices d'entrée (exemples pédagogiques)
export const inputPresets = [
  {
    name: "Gradient",
    description: "Matrice avec gradient simple",
    matrix: [
      [0, 1, 2, 3, 4],
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5, 6],
      [3, 4, 5, 6, 7],
      [4, 5, 6, 7, 8],
    ],
  },
  {
    name: "Carré",
    description: "Forme carrée au centre",
    matrix: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 2, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    name: "Croix",
    description: "Forme en croix",
    matrix: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
  },
  {
    name: "Damier",
    description: "Motif en damier",
    matrix: [
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
    ],
  },
];
