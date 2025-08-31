interface StepInspectorProps {
  input: number[][];
  kernel: number[][];
  topLeft: [number, number]; // coin supérieur gauche du kernel dans la matrice d’entrée (après padding)
}

export default function StepInspector({
  input,
  kernel,
  topLeft,
}: StepInspectorProps) {
  const [i0, j0] = topLeft;
  const steps: string[] = [];
  let sum = 0;

  for (let u = 0; u < kernel.length; u++) {
    for (let v = 0; v < kernel[0].length; v++) {
      const ii = i0 + u;
      const jj = j0 + v;
      const valIn = input[ii]?.[jj] ?? 0;
      const valK = kernel[u][v];
      const prod = valIn * valK;
      sum += prod;
      steps.push(`(${valIn}×${valK})`);
    }
  }

  return (
    <div className="rounded border bg-gray-50 p-4">
      <h3 className="mb-2 font-semibold">Calcul détaillé</h3>
      <div>
        {steps.join(" + ")} = <b>{sum}</b>
      </div>
    </div>
  );
}
