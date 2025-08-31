interface PaddedGridProps {
  matrix: number[][];
  setMatrix?: (m: number[][]) => void;
  padding: number;
  highlightCurrent?: [number, number][]; // jaune - coordonnées dans la matrice originale
  highlightKernel?: [number, number][]; // vert - coordonnées dans la matrice originale
}

export default function PaddedGrid({
  matrix,
  setMatrix,
  padding,
  highlightCurrent = [],
  highlightKernel = [],
}: PaddedGridProps) {
  // Créer la matrice paddée pour l'affichage
  const paddedMatrix = createPaddedMatrix(matrix, padding);

  // Convertir les coordonnées de highlight de la matrice originale vers la matrice paddée
  const convertCoords = (coords: [number, number][]): [number, number][] => {
    return coords.map(([i, j]) => [i + padding, j + padding]);
  };

  const paddedHighlightCurrent = convertCoords(highlightCurrent);
  const paddedHighlightKernel = convertCoords(highlightKernel);

  const isPaddingCell = (i: number, j: number) => {
    return (
      i < padding ||
      j < padding ||
      i >= padding + matrix.length ||
      j >= padding + matrix[0].length
    );
  };

  const isCurrent = (i: number, j: number) =>
    paddedHighlightCurrent.some(([r, c]) => r === i && c === j);

  const isKernel = (i: number, j: number) =>
    paddedHighlightKernel.some(([r, c]) => r === i && c === j);

  const handleChange = (i: number, j: number, value: string) => {
    if (!setMatrix || isPaddingCell(i, j)) return;

    // Convertir les coordonnées paddées vers les coordonnées originales
    const originalI = i - padding;
    const originalJ = j - padding;

    const newMatrix = matrix.map((row, r) =>
      row.map((cell, c) =>
        r === originalI && c === originalJ ? Number(value) || 0 : cell,
      ),
    );
    setMatrix(newMatrix);
  };

  return (
    <table className="border-collapse">
      <tbody>
        {paddedMatrix.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => {
              let bg = "";
              const isPadding = isPaddingCell(i, j);

              // Appliquer les couleurs de base
              if (isPadding) {
                bg = "bg-gray-100"; // Couleur de fond pour les cellules de padding
              } else {
                bg = "bg-white"; // Couleur de fond pour les cellules normales
              }

              // Appliquer les highlights par-dessus (priorité aux highlights)
              if (isKernel(i, j)) bg = "bg-green-200";
              if (isCurrent(i, j)) bg = "bg-yellow-300";

              return (
                <td
                  key={j}
                  className={`border border-gray-400 ${
                    isPadding ? "border-dashed" : ""
                  } ${bg}`}
                >
                  {isPadding || !setMatrix ? (
                    <div
                      className={`flex h-10 w-10 items-center justify-center ${
                        isPadding ? "font-light text-gray-500" : ""
                      }`}
                    >
                      {cell}
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={cell}
                      onChange={(e) => handleChange(i, j, e.target.value)}
                      className="h-10 w-10 border-none text-center outline-none"
                    />
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Fonction utilitaire pour créer une matrice avec padding
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
