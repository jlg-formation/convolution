// Test simple pour vérifier le bon fonctionnement du PaddedGrid

// Fonction de test pour createPaddedMatrix
function testCreatePaddedMatrix() {
  console.log("=== Test createPaddedMatrix ===");

  // Test avec une matrice 2x2 et padding de 1
  const matrix = [
    [1, 2],
    [3, 4],
  ];

  const expectedWithPadding1 = [
    [0, 0, 0, 0],
    [0, 1, 2, 0],
    [0, 3, 4, 0],
    [0, 0, 0, 0],
  ];

  const actualWithPadding1 = createPaddedMatrix(matrix, 1);

  console.log("Matrice originale:", matrix);
  console.log("Matrice avec padding 1:", actualWithPadding1);
  console.log("Attendu:", expectedWithPadding1);

  // Vérification
  const isCorrect =
    JSON.stringify(actualWithPadding1) === JSON.stringify(expectedWithPadding1);
  console.log("Test padding 1:", isCorrect ? "✅ PASS" : "❌ FAIL");

  // Test avec padding 0 (doit retourner la matrice originale)
  const actualWithPadding0 = createPaddedMatrix(matrix, 0);
  const isCorrect0 =
    JSON.stringify(actualWithPadding0) === JSON.stringify(matrix);
  console.log("Test padding 0:", isCorrect0 ? "✅ PASS" : "❌ FAIL");

  // Test avec padding 2
  const actualWithPadding2 = createPaddedMatrix(matrix, 2);
  console.log("Matrice avec padding 2:", actualWithPadding2);
  console.log(
    "Dimensions:",
    actualWithPadding2.length,
    "x",
    actualWithPadding2[0].length,
  );
  const expectedDimensions = matrix.length + 4; // 2*2 pour le padding des deux côtés
  const isCorrectDim =
    actualWithPadding2.length === expectedDimensions &&
    actualWithPadding2[0].length === expectedDimensions;
  console.log(
    "Test dimensions padding 2:",
    isCorrectDim ? "✅ PASS" : "❌ FAIL",
  );
}

// Fonction utilitaire pour créer une matrice avec padding (copie de PaddedGrid.tsx)
function createPaddedMatrix(matrix: number[][], padding: number): number[][] {
  if (padding === 0) return matrix;

  const originalRows = matrix.length;
  const originalCols = matrix[0]?.length || 0;
  const paddedRows = originalRows + 2 * padding;
  const paddedCols = originalCols + 2 * padding;

  const paddedMatrix: number[][] = [];

  for (let i = 0; i < paddedRows; i++) {
    const row: number[] = [];
    for (let j = 0; j < paddedCols; j++) {
      // Vérifier si on est dans la zone de padding
      if (
        i < padding ||
        j < padding ||
        i >= padding + originalRows ||
        j >= padding + originalCols
      ) {
        row.push(0); // Cellule de padding
      } else {
        // Cellule de la matrice originale
        const originalI = i - padding;
        const originalJ = j - padding;
        row.push(matrix[originalI][originalJ]);
      }
    }
    paddedMatrix.push(row);
  }

  return paddedMatrix;
}

// Lancer le test
testCreatePaddedMatrix();
