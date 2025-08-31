interface KernelEditorProps {
  kernel: number[][];
  setKernel: (k: number[][]) => void;
}

export default function KernelEditor({ kernel, setKernel }: KernelEditorProps) {
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
              <td key={j} className="border border-gray-400">
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
