interface ControlsProps {
  padding: number;
  setPadding: (v: number) => void;
  stride: number;
  setStride: (v: number) => void;
  dilation: number;
  setDilation: (v: number) => void;
  onCompute: () => void;
}

export default function ControlsPanel({
  padding,
  setPadding,
  stride,
  setStride,
  dilation,
  setDilation,
  onCompute,
}: ControlsProps) {
  return (
    <div className="flex items-end gap-4">
      <div>
        <label>Padding</label>
        <input
          type="number"
          value={padding}
          onChange={(e) => setPadding(Number(e.target.value))}
          className="w-16 border p-1 text-center"
        />
      </div>
      <div>
        <label>Stride</label>
        <input
          type="number"
          value={stride}
          onChange={(e) => setStride(Number(e.target.value))}
          className="w-16 border p-1 text-center"
        />
      </div>
      <div>
        <label>Dilation</label>
        <input
          type="number"
          value={dilation}
          onChange={(e) => setDilation(Number(e.target.value))}
          className="w-16 border p-1 text-center"
        />
      </div>
      <button
        onClick={onCompute}
        className="rounded bg-green-600 px-4 py-2 text-white"
      >
        Calculer
      </button>
    </div>
  );
}
