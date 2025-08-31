interface KernelEditorProps {
  kernel: number[][];
  setKernel: (k: number[][]) => void;
  highlight?: [number, number][];
}

export default function KernelEditor({
  kernel,
  setKernel,
  highlight = [],
}: KernelEditorProps) {
  const isHighlighted = (i: number, j: number) =>
    highlight.some(([r, c]) => r === i && c === j);

  const handleChange = (i: number, j: number, value: string) => {
    const newK = kernel.map((row, r) =>
      row.map((cell, c) => (r === i && c === j ? Number(value) || 0 : cell)),
    );
    setKernel(newK);
  };

  return (
    <table className="border-collapse">
      <tbody>
        {kernel.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                key={j}
                className={`border border-gray-400 ${
                  isHighlighted(i, j) ? "bg-blue-200" : ""
                }`}
              >
                <input
                  type="number"
                  value={cell}
                  onChange={(e) => handleChange(i, j, e.target.value)}
                  className="h-10 w-10 border-none text-center outline-none"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
