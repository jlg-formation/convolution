import { useState } from "react";
import Grid from "./Grid";

interface EditableMatrixProps {
  matrix: number[][];
  setMatrix: (matrix: number[][]) => void;
  title: string;
  minSize?: number;
  maxSize?: number;
  defaultValue?: number;
}

export default function EditableMatrix({
  matrix,
  setMatrix,
  title,
  minSize = 1,
  maxSize = 10,
  defaultValue = 0,
}: EditableMatrixProps) {
  const [rows, setRows] = useState(matrix.length);
  const [cols, setCols] = useState(matrix[0]?.length || 1);

  const handleDimensionChange = (newRows: number, newCols: number) => {
    // Valider les dimensions
    const validRows = Math.max(minSize, Math.min(maxSize, newRows));
    const validCols = Math.max(minSize, Math.min(maxSize, newCols));

    setRows(validRows);
    setCols(validCols);

    // Créer une nouvelle matrice avec les nouvelles dimensions
    const newMatrix = Array.from({ length: validRows }, (_, i) =>
      Array.from({ length: validCols }, (_, j) => {
        // Garder les valeurs existantes si possible, sinon utiliser la valeur par défaut
        if (i < matrix.length && j < matrix[0]?.length) {
          return matrix[i][j];
        }
        return defaultValue;
      }),
    );

    setMatrix(newMatrix);
  };

  const handleRandomize = () => {
    const newMatrix = Array.from(
      { length: rows },
      () =>
        Array.from({ length: cols }, () => Math.floor(Math.random() * 11) - 5), // Valeurs entre -5 et 5
    );
    setMatrix(newMatrix);
  };

  const handleReset = () => {
    const newMatrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => defaultValue),
    );
    setMatrix(newMatrix);
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleRandomize}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            Aléatoire
          </button>
          <button
            onClick={handleReset}
            className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Contrôles des dimensions */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Lignes:</label>
          <input
            type="number"
            min={minSize}
            max={maxSize}
            value={rows}
            onChange={(e) =>
              handleDimensionChange(Number(e.target.value), cols)
            }
            className="w-16 rounded border px-2 py-1 text-center text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Colonnes:</label>
          <input
            type="number"
            min={minSize}
            max={maxSize}
            value={cols}
            onChange={(e) =>
              handleDimensionChange(rows, Number(e.target.value))
            }
            className="w-16 rounded border px-2 py-1 text-center text-sm"
          />
        </div>
        <div className="text-sm text-gray-500">
          Dimensions: {rows}×{cols}
        </div>
      </div>

      {/* Grille éditable */}
      <div className="flex justify-center">
        <Grid matrix={matrix} setMatrix={setMatrix} />
      </div>

      {/* Informations d'aide */}
      <div className="mt-2 text-xs text-gray-500">
        Cliquez sur une cellule pour modifier sa valeur. Dimensions: {minSize}-
        {maxSize}
      </div>
    </div>
  );
}
