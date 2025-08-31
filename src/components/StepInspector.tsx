interface Step {
  valIn: number;
  valK: number;
  prod: number;
  isPadding?: boolean; // Nouvelle propriété pour indiquer si c'est du padding
}

interface StepInspectorProps {
  input: number[][];
  kernel: number[][];
  topLeft: [number, number];
  steps: Step[];
}

export default function StepInspector({ steps, kernel }: StepInspectorProps) {
  const sum = steps.reduce((acc, s) => acc + s.prod, 0);

  // Calculer le nombre maximum de lignes pour éviter le CLS
  const maxSteps = kernel.length * kernel[0].length;

  return (
    <div className="rounded border bg-gray-50 p-4">
      <h3 className="mb-2 font-semibold">Calcul détaillé</h3>

      <div>
        {/* Afficher les calculs réels ou un message si aucun */}
        {steps.length === 0 ? (
          <div>(aucun calcul encore effectué)</div>
        ) : (
          steps.map((s, idx) => (
            <div key={idx} className={s.isPadding ? "text-blue-600" : ""}>
              (
              {s.isPadding ? (
                <span title="Valeur de padding (zéro)">0 (padding)</span>
              ) : (
                s.valIn
              )}
              ×{s.valK}) = {s.prod}
            </div>
          ))
        )}

        {/* Réserver l'espace pour les calculs restants */}
        {Array.from({ length: maxSteps - steps.length }, (_, idx) => (
          <div key={`placeholder-${idx}`} className="invisible">
            (0×0) = 0
          </div>
        ))}

        {/* Afficher la somme seulement s'il y a des calculs */}
        {steps.length > 0 && (
          <div className="mt-2 font-bold">Somme partielle = {sum}</div>
        )}

        {/* Réserver l'espace pour la ligne de somme si pas encore de calculs */}
        {steps.length === 0 && (
          <div className="invisible mt-2 font-bold">Somme partielle = 0</div>
        )}
      </div>
    </div>
  );
}
