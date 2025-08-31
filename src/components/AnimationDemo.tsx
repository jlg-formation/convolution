import { useEffect, useRef } from "react";
import Grid from "./Grid";
import KernelEditor from "./KernelEditor";
import AnimationBar from "./AnimationBar";
import StepInspector from "./StepInspector";
import { conv2d } from "../logic/convolution";
import { useConvolutionStore } from "../state/useStore";

export default function AnimationDemo() {
  const {
    input,
    kernel,
    output,
    config,
    animation,
    setInput,
    setKernel,
    setCurrentPos,
    setCurrentCell,
    setPartialSteps,
    setIsPlaying,
    setSpeed,
  } = useConvolutionStore();

  const { padding, stride, dilation } = config;
  const { currentPos, currentCell, partialSteps, isPlaying, speed } = animation;

  // Timer & re-entrance guards (browser)
  const intervalRef = useRef<number | null>(null);
  const steppingRef = useRef(false);
  const stepOnceRef = useRef<() => void>(() => {});

  // Dimensions sortie (simple, on calcule via conv2d)
  const tempOut = conv2d(input, kernel, { padding, stride, dilation });
  const outH = tempOut.length;
  const outW = tempOut[0]?.length || 0;

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

  // Effect: reset animation when input parameters change
  useEffect(() => {
    // Reset animation state when matrices or config change
    setIsPlaying(false);
    setCurrentPos(null);
    setCurrentCell(null);
    setPartialSteps([]);
    clearTimer();
  }, [
    input,
    kernel,
    padding,
    stride,
    dilation,
    setIsPlaying,
    setCurrentPos,
    setCurrentCell,
    setPartialSteps,
  ]);

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
      // Fin du balayage du noyau - la cellule actuelle est maintenant complète
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

    // Mettre à jour partialSteps - TOUJOURS ajouter le calcul actuel
    if (shouldResetSteps) {
      // Nouvelle cellule de sortie : commencer avec le calcul actuel
      setPartialSteps([{ valIn, valK, prod, isPadding }]);
    } else {
      // Continuer le calcul de la cellule actuelle : ajouter le calcul actuel
      const currentSteps = partialSteps;
      console.log("setPartialSteps", { valIn, valK, prod, isPadding });

      // Ajouter le calcul actuel (sans vérification de doublon car on avance séquentiellement)
      setPartialSteps([...currentSteps, { valIn, valK, prod, isPadding }]);
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

    // Initialiser les positions si nécessaire ET faire le premier calcul
    if (!currentPos || !currentCell) {
      console.log("Initializing and calculating first step...");
      const initialPos: [number, number] = [0, 0];
      const initialCell: [number, number] = [0, 0];

      // Faire le premier calcul directement avec les valeurs initiales
      const [i, j] = initialPos;
      const [u, v] = initialCell;

      const ii = i * stride + u * dilation;
      const jj = j * stride + v * dilation;
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

      // Calculer la prochaine position après le premier calcul
      let nextU = u;
      let nextV = v;

      // Avancer dans le kernel
      if (v + 1 < kernel[0].length) {
        nextV = v + 1;
      } else if (u + 1 < kernel.length) {
        nextU = u + 1;
        nextV = 0;
      }

      // Mettre à jour tous les états en même temps avec la position suivante
      setCurrentPos(initialPos);
      setCurrentCell([nextU, nextV]); // Position suivante pour le prochain step
      setPartialSteps([{ valIn, valK, prod, isPadding }]);

      return;
    }

    // Sinon, on fait un pas normal
    stepOnce();
  };

  // Bouton RESET: remettre l'animation à zéro
  const doReset = () => {
    console.log("doReset");
    setIsPlaying(false);
    setCurrentPos(null);
    setCurrentCell(null);
    setPartialSteps([]);
    clearTimer();
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
    if (!currentPos || partialSteps.length === 0) return [];

    const [i, j] = currentPos;

    // Calculer quelle cellule du kernel correspond au dernier calcul
    // En fonction du nombre d'étapes déjà effectuées
    const kernelSize = kernel.length * kernel[0].length;
    const stepIndex = (partialSteps.length - 1) % kernelSize;
    const u = Math.floor(stepIndex / kernel[0].length);
    const v = stepIndex % kernel[0].length;

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
    if (partialSteps.length === 0) return [];

    // Surligner la cellule du kernel correspondant au dernier calcul
    const kernelSize = kernel.length * kernel[0].length;
    const stepIndex = (partialSteps.length - 1) % kernelSize;
    const u = Math.floor(stepIndex / kernel[0].length);
    const v = stepIndex % kernel[0].length;

    return [[u, v]];
  };

  const getOutputAnimationState = () => {
    if (!currentPos || outH === 0 || outW === 0) return undefined;

    const [currentI, currentJ] = currentPos;

    // Cellules déjà calculées (toutes les cellules avant la position actuelle)
    const completedCells: [number, number][] = [];
    for (let i = 0; i < outH; i++) {
      for (let j = 0; j < outW; j++) {
        if (i < currentI || (i === currentI && j < currentJ)) {
          completedCells.push([i, j]);
        }
      }
    }

    // Cellules pas encore calculées (toutes les cellules après la position actuelle)
    const pendingCells: [number, number][] = [];
    for (let i = 0; i < outH; i++) {
      for (let j = 0; j < outW; j++) {
        if (i > currentI || (i === currentI && j > currentJ)) {
          pendingCells.push([i, j]);
        }
      }
    }

    // La cellule actuelle (currentPos) est TOUJOURS en cours de calcul
    // tant qu'on a des partialSteps, même si le kernel est à la fin
    // Elle correspond à la cellule dont on voit les calculs détaillés
    const hasPartialSteps = partialSteps.length > 0;

    // Calculer la somme partielle pour l'afficher dans la cellule jaune
    const partialSum = partialSteps.reduce((acc, step) => acc + step.prod, 0);

    return {
      currentCell: hasPartialSteps ? currentPos : null,
      completedCells,
      pendingCells,
      partialSum: hasPartialSteps ? partialSum : undefined,
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Animation Step-by-Step</h2>

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
        onReset={doReset}
        speed={speed}
        setSpeed={setSpeed}
      />

      {currentPos && (
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="mb-2 font-semibold">Entrée (surbrillance)</h3>
            <Grid
              matrix={input}
              setMatrix={setInput}
              highlightCurrent={getCurrentCellHighlight()}
              highlightKernel={getKernelCoverage(currentPos)}
            />
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Kernel (surbrillance)</h3>
            <KernelEditor
              kernel={kernel}
              setKernel={setKernel}
              highlight={getKernelHighlight()}
            />
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Sortie (construction)</h3>
            <Grid
              matrix={output}
              readOnly
              animationState={getOutputAnimationState()}
            />
          </div>
        </div>
      )}

      {!currentPos && output.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold">Résultat (instantané)</h3>
          <Grid matrix={output} readOnly />
        </div>
      )}

      {currentPos && (
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
