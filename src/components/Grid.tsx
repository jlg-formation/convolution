interface GridProps {
  matrix: number[][];
  setMatrix?: (m: number[][]) => void;
  readOnly?: boolean;
}

export default function Grid({ matrix, setMatrix, readOnly }: GridProps) {
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
            {row.map((cell, j) => (
              <td key={j} className="border border-gray-400">
                {readOnly ? (
                  <div className="flex h-10 w-10 items-center justify-center">
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
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
