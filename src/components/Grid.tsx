interface GridProps {
  matrix: number[][];
  setMatrix?: (m: number[][]) => void;
  readOnly?: boolean;
  highlightCurrent?: [number, number][]; // jaune
  highlightKernel?: [number, number][]; // vert
  // Pour l'animation de la matrice de sortie
  animationState?: {
    currentCell?: [number, number] | null; // cellule en cours de calcul (jaune)
    completedCells?: [number, number][]; // cellules déjà calculées
    pendingCells?: [number, number][]; // cellules pas encore calculées (gris avec X)
  };
}

export default function Grid({
  matrix,
  setMatrix,
  readOnly,
  highlightCurrent = [],
  highlightKernel = [],
  animationState,
}: GridProps) {
  const isCurrent = (i: number, j: number) =>
    highlightCurrent.some(([r, c]) => r === i && c === j);

  const isKernel = (i: number, j: number) =>
    highlightKernel.some(([r, c]) => r === i && c === j);

  // Pour l'animation de la matrice de sortie
  const isCurrentOutputCell = (i: number, j: number) =>
    animationState?.currentCell &&
    animationState.currentCell[0] === i &&
    animationState.currentCell[1] === j;

  const isCompletedOutputCell = (i: number, j: number) =>
    animationState?.completedCells?.some(([r, c]) => r === i && c === j);

  const isPendingOutputCell = (i: number, j: number) =>
    animationState?.pendingCells?.some(([r, c]) => r === i && c === j);

  const handleChange = (i: number, j: number, value: string) => {
    if (!setMatrix) return;
    const newMatrix = matrix.map((row, r) =>
      row.map((cell, c) => (r === i && c === j ? Number(value) || 0 : cell)),
    );
    setMatrix(newMatrix);
  };

  return (
    <table className="border-collapse">
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => {
              let bg = "";
              let content: React.ReactNode = cell;

              // Animation states have priority over normal highlights
              if (animationState) {
                if (isCurrentOutputCell(i, j)) {
                  bg = "bg-yellow-300"; // Cellule en cours de calcul
                } else if (isCompletedOutputCell(i, j)) {
                  bg = "bg-white"; // Cellule calculée
                } else if (isPendingOutputCell(i, j)) {
                  bg = "bg-gray-200"; // Cellule pas encore calculée
                  content = "×"; // X pour indiquer pas encore calculé
                }
              } else {
                // Normal highlights (pour les autres grilles)
                if (isKernel(i, j)) bg = "bg-green-200";
                if (isCurrent(i, j)) bg = "bg-yellow-300";
              }

              return (
                <td key={j} className={`border border-gray-400 ${bg}`}>
                  {readOnly ? (
                    <div className="flex h-10 w-10 items-center justify-center">
                      {content}
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
