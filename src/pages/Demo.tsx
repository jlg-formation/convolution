import { useState, useEffect, useRef } from "react";
import Grid from "../components/Grid";
import KernelEditor from "../components/KernelEditor";
import ControlsPanel from "../components/ControlsPanel";
import AnimationBar from "../components/AnimationBar";
import StepInspector from "../components/StepInspector";
import ConvolutionVisualization from "../components/ConvolutionVisualization";
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
    { valIn: number; valK: number; prod: number; isPadding?: boolean }[]
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
    console.log("stepOnce");
    if (steppingRef.current) return;
    steppingRef.current = true;

    // Récupérer les valeurs actuelles des états
    const currentPosValue = currentPos;
    const currentCellValue = currentCell;

    if (!currentPosValue || !currentCellValue) {
      steppingRef.current = false;
      return;
    }

    const [i, j] = currentPosValue;
    const [u, v] = currentCellValue;

    // 1. Faire le calcul de la cellule courante
    // Utiliser la même logique que conv2d : coordonnées dans la matrice paddée
    const ii = i * stride + u * dilation;
    const jj = j * stride + v * dilation;

    // Convertir les coordonnées paddées vers les coordonnées originales
    const originalI = ii - padding;
    const originalJ = jj - padding;

    const isPadding = !(
      originalI >= 0 &&
      originalJ >= 0 &&
      originalI < input.length &&
      originalJ < input[0].length
    );
    const valIn = isPadding ? 0 : input[originalI][originalJ];
    const valK = kernel[u][v];
    const prod = valIn * valK;

    // 2. Calculer la prochaine position du kernel
    let nextU = u;
    let nextV = v;
    let nextI = i;
    let nextJ = j;
    let shouldResetSteps = false;
    let shouldStop = false;

    // Avancer dans le kernel
    if (v + 1 < kernel[0].length) {
      nextV = v + 1;
    } else if (u + 1 < kernel.length) {
      nextU = u + 1;
      nextV = 0;
    } else {
      // Fin du balayage du noyau
      shouldResetSteps = true;
      nextU = 0;
      nextV = 0;

      // Avancer la cellule de sortie
      if (j + 1 < outW) {
        nextJ = j + 1;
      } else if (i + 1 < outH) {
        nextI = i + 1;
        nextJ = 0;
      } else {
        // Fin totale
        shouldStop = true;
      }
    }

    // 3. Appliquer tous les changements d'état de manière séparée
    console.log("about to set partialSteps");

    // Mettre à jour partialSteps
    if (shouldResetSteps) {
      setPartialSteps([{ valIn, valK, prod, isPadding }]);
    } else {
      setPartialSteps((steps) => {
        console.log("setPartialSteps", { valIn, valK, prod, isPadding });
        // Protection contre les doublons en mode strict
        const alreadyExists = steps.some(
          (step) =>
            step.valIn === valIn &&
            step.valK === valK &&
            step.prod === prod &&
            step.isPadding === isPadding,
        );

        if (alreadyExists) {
          return steps; // Éviter le doublon
        }

        return [...steps, { valIn, valK, prod, isPadding }];
      });
    }

    // Mettre à jour les positions
    if (shouldStop) {
      setIsPlaying(false);
      setCurrentCell(null);
      setCurrentPos(null);
    } else {
      setCurrentCell([nextU, nextV]);
      setCurrentPos([nextI, nextJ]);
    }

    steppingRef.current = false;
  };

  // Assigner stepOnce à la ref pour l'utiliser dans useEffect
  stepOnceRef.current = stepOnce;

  // Bouton STEP: on PAUSE d'abord, puis on fait un seul pas
  const doStep = () => {
    console.log("doStep");
    setIsPlaying(false);
    clearTimer();

    // Initialiser les positions si nécessaire
    if (!currentPos) {
      setCurrentPos([0, 0]);
      setCurrentCell([0, 0]);
      setPartialSteps([]);
      return; // Premier clic = juste initialisation, on s'arrête là
    }
    if (!currentCell) {
      setCurrentCell([0, 0]);
      return; // Deuxième clic = initialisation kernel, on s'arrête là
    }

    // Sinon, on fait un pas normal
    stepOnce();
  };

  // Highlights
  const getKernelCoverage = (pos: [number, number] | null) => {
    if (!pos) return [];
    const [i, j] = pos;
    const coords: [number, number][] = [];
    for (let u = 0; u < kernel.length; u++) {
      for (let v = 0; v < kernel[0].length; v++) {
        // Utiliser la même logique que conv2d et stepOnce
        const ii = i * stride + u * dilation;
        const jj = j * stride + v * dilation;
        const originalI = ii - padding;
        const originalJ = jj - padding;
        if (
          originalI >= 0 &&
          originalJ >= 0 &&
          originalI < input.length &&
          originalJ < input[0].length
        ) {
          coords.push([originalI, originalJ]);
        }
      }
    }
    return coords;
  };

  const getCurrentCellHighlight = (): [number, number][] => {
    if (!currentPos || !currentCell) return [];
    const [i, j] = currentPos;
    const [u, v] = currentCell;

    // Utiliser la même logique que dans stepOnce et conv2d
    const ii = i * stride + u * dilation;
    const jj = j * stride + v * dilation;
    const originalI = ii - padding;
    const originalJ = jj - padding;

    if (
      originalI >= 0 &&
      originalJ >= 0 &&
      originalI < input.length &&
      originalJ < input[0].length
    ) {
      return [[originalI, originalJ]];
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

      {/* Vue conceptuelle de la convolution */}
      <ConvolutionVisualization
        input={input}
        kernel={kernel}
        output={output}
        padding={padding}
        stride={stride}
        dilation={dilation}
      />

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

      {padding > 0 && (
        <div className="rounded border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Padding = {padding}</strong> : La matrice d'entrée est
            entourée de <strong>zéros</strong> sur {padding} pixel(s) de chaque
            côté.
          </p>
        </div>
      )}

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
