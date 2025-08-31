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

  const [output, setOutput] = useState<number[][]>([]);

  // Animation states
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null); // cellule sortie active (i,j)
  const [currentCell, setCurrentCell] = useState<[number, number] | null>(null); // cellule noyau active (u,v)
  const [partialSteps, setPartialSteps] = useState<
    { valIn: number; valK: number; prod: number }[]
  >([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  // Timer & re-entrance guards (browser)
  const intervalRef = useRef<number | null>(null);
  const steppingRef = useRef(false);
  const stepOnceRef = useRef<() => void>(() => {});

  // Dimensions sortie (simple, on calcule via conv2d)
  const tempOut = conv2d(input, kernel, { padding, stride, dilation });
  const outH = tempOut.length;
  const outW = tempOut[0]?.length || 0;

  const handleCompute = () => {
    setOutput(conv2d(input, kernel, { padding, stride, dilation }));
  };

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Effect: play/pause
  useEffect(() => {
    const start = () => {
      clearTimer();
      intervalRef.current = window.setInterval(() => {
        if (stepOnceRef.current) stepOnceRef.current();
      }, speed);
    };

    if (isPlaying) start();
    else clearTimer();
    return clearTimer;
  }, [isPlaying, speed]);

  // === Un seul "pas" d'animation ===
  const stepOnce = () => {
    if (steppingRef.current) return;
    steppingRef.current = true;

    setCurrentPos((prevPos) => {
      const [i, j] = prevPos ?? [0, 0];

      setCurrentCell((prevCell) => {
        const [u, v] = prevCell ?? [0, 0];

        // Coordonnées dans l’entrée pour (u,v)
        const ii = i * stride + u * dilation - padding;
        const jj = j * stride + v * dilation - padding;
        const valIn =
          ii >= 0 && jj >= 0 && ii < input.length && jj < input[0].length
            ? input[ii][jj]
            : 0;
        const valK = kernel[u][v];
        const prod = valIn * valK;

        // trace partielle
        setPartialSteps((steps) => [...steps, { valIn, valK, prod }]);

        // avancer d'UNE cellule dans le noyau
        if (v + 1 < kernel[0].length) {
          steppingRef.current = false;
          return [u, v + 1];
        }
        if (u + 1 < kernel.length) {
          steppingRef.current = false;
          return [u + 1, 0];
        }

        // Fin du balayage du noyau -> reset des steps et avancer la cellule de sortie
        setPartialSteps([]);

        if (j + 1 < outW) {
          setCurrentPos([i, j + 1]);
          steppingRef.current = false;
          return [0, 0];
        }
        if (i + 1 < outH) {
          setCurrentPos([i + 1, 0]);
          steppingRef.current = false;
          return [0, 0];
        }

        // Fin totale
        setIsPlaying(false);
        steppingRef.current = false;
        return null;
      });

      return [i, j];
    });
  };

  // Assigner stepOnce à la ref pour l'utiliser dans useEffect
  stepOnceRef.current = stepOnce;

  // Bouton STEP: on PAUSE d'abord, puis on fait un seul pas
  const doStep = () => {
    setIsPlaying(false);
    clearTimer();

    // Initialiser les positions si nécessaire
    if (!currentPos) {
      setCurrentPos([0, 0]);
      setCurrentCell([0, 0]);
      setPartialSteps([]);
      return;
    }
    if (!currentCell) {
      setCurrentCell([0, 0]);
      return;
    }

    stepOnce();
  };

  // Highlights
  const getKernelCoverage = (pos: [number, number] | null) => {
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

  const getCurrentCellHighlight = (): [number, number][] => {
    if (!currentPos || !currentCell) return [];
    const [i, j] = currentPos;
    const [u, v] = currentCell;
    const ii = i * stride + u * dilation - padding;
    const jj = j * stride + v * dilation - padding;
    if (ii >= 0 && jj >= 0 && ii < input.length && jj < input[0].length) {
      return [[ii, jj]];
    }
    return [];
  };

  const getKernelHighlight = (): [number, number][] => {
    if (!currentCell) return [];
    return [currentCell];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Démo Convolution</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="mb-2 font-semibold">Matrice d’entrée</h2>
          {/* grille principale éditable */}
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
        onPlay={() => {
          // init si nécessaire
          if (!currentPos) {
            setCurrentPos([0, 0]);
            setCurrentCell([0, 0]);
            setPartialSteps([]);
          }
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          clearTimer();
        }}
        onStep={doStep}
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
          <div>
            <h2 className="mb-2 font-semibold">Entrée (surbrillance)</h2>
            <Grid
              matrix={input}
              setMatrix={setInput}
              highlightCurrent={getCurrentCellHighlight()}
              highlightKernel={getKernelCoverage(currentPos)}
            />
          </div>
          <div>
            <h2 className="mb-2 font-semibold">Kernel (surbrillance)</h2>
            <KernelEditor
              kernel={kernel}
              setKernel={setKernel}
              highlight={getKernelHighlight()}
            />
          </div>
        </div>
      )}

      {currentPos && currentCell && (
        <StepInspector
          input={input}
          kernel={kernel}
          topLeft={[
            currentPos[0] * stride - padding,
            currentPos[1] * stride - padding,
          ]}
          steps={partialSteps}
        />
      )}
    </div>
  );
}
