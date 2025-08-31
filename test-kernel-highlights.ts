// Test pour vérifier que les highlights du kernel incluent le padding

function testKernelHighlightsWithPadding() {
  console.log("=== Test Kernel Highlights avec Padding ===");

  // Configuration de test
  const input = [
    [1, 2],
    [3, 4],
  ];
  const kernel = [
    [1, 0],
    [0, 1],
  ];
  const padding = 1;
  const stride = 1;
  const dilation = 1;

  // Position du kernel : [0, 0] (première cellule de sortie)
  const pos: [number, number] = [0, 0];

  console.log("Input:", input);
  console.log("Kernel:", kernel);
  console.log("Padding:", padding);
  console.log("Position:", pos);

  // Simuler getKernelCoverageForPaddedGrid
  const getKernelCoverageForPaddedGrid = (pos: [number, number] | null) => {
    if (!pos) return [];
    const [i, j] = pos;
    const coords: [number, number][] = [];
    for (let u = 0; u < kernel.length; u++) {
      for (let v = 0; v < kernel[0].length; v++) {
        const ii = i * stride + u * dilation;
        const jj = j * stride + v * dilation;
        const originalI = ii - padding;
        const originalJ = jj - padding;
        // Inclure TOUTES les cellules du kernel, même celles dans le padding
        coords.push([originalI, originalJ]);
      }
    }
    return coords;
  };

  const highlights = getKernelCoverageForPaddedGrid(pos);
  console.log("Coordonnées de highlight (matrice originale):", highlights);

  // Convertir vers coordonnées paddées pour vérification
  const paddedHighlights = highlights.map(([i, j]) => [
    i + padding,
    j + padding,
  ]);
  console.log("Coordonnées de highlight (matrice paddée):", paddedHighlights);

  // Vérifier qu'on a bien des coordonnées négatives (padding)
  const hasNegativeCoords = highlights.some(([i, j]) => i < 0 || j < 0);
  console.log(
    "Inclut des coordonnées de padding:",
    hasNegativeCoords ? "✅ OUI" : "❌ NON",
  );

  // Afficher la matrice paddée avec highlights
  console.log(
    "\nMatrice paddée avec highlights (P=padding, H=highlight, N=normal):",
  );
  const paddedSize = input.length + 2 * padding;
  for (let i = 0; i < paddedSize; i++) {
    let row = "";
    for (let j = 0; j < paddedSize; j++) {
      const isPaddingCell =
        i < padding ||
        j < padding ||
        i >= padding + input.length ||
        j >= padding + input[0].length;
      const isHighlighted = paddedHighlights.some(
        ([hi, hj]) => hi === i && hj === j,
      );

      if (isHighlighted) {
        row += "H ";
      } else if (isPaddingCell) {
        row += "P ";
      } else {
        row += "N ";
      }
    }
    console.log(row);
  }
}

testKernelHighlightsWithPadding();
