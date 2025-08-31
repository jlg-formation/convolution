import { useState } from "react";
import Grid from "../components/Grid";
import KernelEditor from "../components/KernelEditor";
import ControlsPanel from "../components/ControlsPanel";
import { conv2d } from "../logic/convolution";

export default function Demo() {
  const [input, setInput] = useState<number[][]>([
    [1, 2, 3, 0, 1],
    [0, 1, 2, 3, 1],
    [3, 1, 0, 2, 2],
    [2, 0, 1, 1, 0],
    [1, 3, 2, 0, 1],
  ]);
  const [kernel, setKernel] = useState<number[][]>([
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1],
  ]);
  const [padding, setPadding] = useState(0);
  const [stride, setStride] = useState(1);
  const [dilation, setDilation] = useState(1);
  const [output, setOutput] = useState<number[][]>([]);

  const handleCompute = () => {
    const result = conv2d(input, kernel, { padding, stride, dilation });
    setOutput(result);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Démo Convolution</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="mb-2 font-semibold">Matrice d’entrée</h2>
          <Grid matrix={input} setMatrix={setInput} />
        </div>
        <div>
          <h2 className="mb-2 font-semibold">Noyau (Kernel)</h2>
          <KernelEditor kernel={kernel} setKernel={setKernel} />
        </div>
      </div>

      <ControlsPanel
        padding={padding}
        setPadding={setPadding}
        stride={stride}
        setStride={setStride}
        dilation={dilation}
        setDilation={setDilation}
        onCompute={handleCompute}
      />

      {output.length > 0 && (
        <div>
          <h2 className="mb-2 font-semibold">Résultat</h2>
          <Grid matrix={output} readOnly />
        </div>
      )}
    </div>
  );
}
