import { useState, useEffect, useRef } from "react";
import Grid from "../components/Grid";
import KernelEditor from "../components/KernelEditor";
import ControlsPanel from "../components/ControlsPanel";
import AnimationBar from "../components/AnimationBar";
import StepInspector from "../components/StepInspector";
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

  // Résultat complet (calcul instantané)
  const [output, setOutput] = useState<number[][]>([]);

  // Animation state
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-calc output dimensions
  const tempOut = conv2d(input, kernel, { padding, stride, dilation });
  const outH = tempOut.length;
  const outW = tempOut[0]?.length || 0;

  const handleCompute = () => {
    setOutput(conv2d(input, kernel, { padding, stride, dilation }));
  };

  // Animation stepping
  const step = () => {
    setCurrentPos((prev) => {
      if (!prev) return [0, 0];
      const [i, j] = prev;
      if (j + 1 < outW) return [i, j + 1];
      if (i + 1 < outH) return [i + 1, 0];
      setIsPlaying(false);
      return null;
    });
  };

  // Gestion lecture automatique
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(step, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed]);

  // Fonction pour trouver les coordonnées couvertes par le kernel
  const getHighlight = (pos: [number, number] | null) => {
    if (!pos) return [];
    const [i, j] = pos;
    const coords: [number, number][] = [];
    for (let u = 0; u < kernel.length; u++) {
      for (let v = 0; v < kernel[0].length; v++) {
        const ii = i * stride + u * dilation - padding;
        const jj = j * stride + v * dilation - padding;
        if (ii >= 0 && jj >= 0 && ii < input.length && jj < input[0].length) {
          coords.push([ii, jj]);
        }
      }
    }
    return coords;
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

      <AnimationBar
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStep={step}
        speed={speed}
        setSpeed={setSpeed}
      />

      {output.length > 0 && (
        <div>
          <h2 className="mb-2 font-semibold">Résultat (instantané)</h2>
          <Grid matrix={output} readOnly />
        </div>
      )}

      {currentPos && (
        <div className="grid grid-cols-2 gap-6">
          <Grid
            matrix={input}
            setMatrix={setInput}
            highlight={getHighlight(currentPos)}
          />
          <StepInspector
            input={input}
            kernel={kernel}
            topLeft={[
              currentPos[0] * stride - padding,
              currentPos[1] * stride - padding,
            ]}
          />
        </div>
      )}
    </div>
  );
}
