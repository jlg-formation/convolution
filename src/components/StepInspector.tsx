interface Step {
  valIn: number;
  valK: number;
  prod: number;
}

interface StepInspectorProps {
  input: number[][];
  kernel: number[][];
  topLeft: [number, number];
  steps: Step[];
}

export default function StepInspector({ steps }: StepInspectorProps) {
  const sum = steps.reduce((acc, s) => acc + s.prod, 0);

  return (
    <div className="rounded border bg-gray-50 p-4">
      <h3 className="mb-2 font-semibold">Calcul détaillé</h3>
      {steps.length === 0 && <div>(aucun calcul encore effectué)</div>}
      {steps.length > 0 && (
        <div>
          {steps.map((s, idx) => (
            <div key={idx}>
              ({s.valIn}×{s.valK}) = {s.prod}
            </div>
          ))}
          <div className="mt-2 font-bold">Somme partielle = {sum}</div>
        </div>
      )}
    </div>
  );
}
