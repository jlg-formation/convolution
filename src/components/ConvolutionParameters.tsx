interface ConvolutionParametersProps {
  padding: number;
  setPadding: (value: number) => void;
  stride: number;
  setStride: (value: number) => void;
  dilation: number;
  setDilation: (value: number) => void;
  onCompute?: () => void;
}

export default function ConvolutionParameters({
  padding,
  setPadding,
  stride,
  setStride,
  dilation,
  setDilation,
  onCompute,
}: ConvolutionParametersProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Paramètres de convolution</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Padding */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Padding
            </label>
            <p className="text-xs text-gray-500">
              Zéros ajoutés autour de l'image
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={5}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min={0}
              max={10}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-16 rounded border px-2 py-1 text-center text-sm"
            />
          </div>
          <div className="text-xs text-gray-600">
            {padding === 0 && "Pas de padding (valid)"}
            {padding === 1 && "Padding minimal"}
            {padding > 1 && `Padding étendu (+${padding} pixels)`}
          </div>
        </div>

        {/* Stride */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stride
            </label>
            <p className="text-xs text-gray-500">
              Pas de déplacement du kernel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={4}
              value={stride}
              onChange={(e) => setStride(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min={1}
              max={10}
              value={stride}
              onChange={(e) => setStride(Number(e.target.value))}
              className="w-16 rounded border px-2 py-1 text-center text-sm"
            />
          </div>
          <div className="text-xs text-gray-600">
            {stride === 1 && "Déplacement pixel par pixel"}
            {stride === 2 && "Sous-échantillonnage 2x"}
            {stride > 2 && `Sous-échantillonnage ${stride}x`}
          </div>
        </div>

        {/* Dilation */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dilation
            </label>
            <p className="text-xs text-gray-500">
              Espacement entre les éléments du kernel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={3}
              value={dilation}
              onChange={(e) => setDilation(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min={1}
              max={5}
              value={dilation}
              onChange={(e) => setDilation(Number(e.target.value))}
              className="w-16 rounded border px-2 py-1 text-center text-sm"
            />
          </div>
          <div className="text-xs text-gray-600">
            {dilation === 1 && "Kernel standard (contigu)"}
            {dilation === 2 && "Kernel dilaté (champ réceptif élargi)"}
            {dilation > 2 && `Kernel très dilaté (${dilation}x)`}
          </div>
        </div>
      </div>

      {/* Bouton de calcul manuel (optionnel) */}
      {onCompute && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onCompute}
            className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700"
          >
            Recalculer manuellement
          </button>
        </div>
      )}

      {/* Informations complémentaires */}
      <div className="mt-4 rounded bg-gray-50 p-3">
        <h4 className="mb-2 text-sm font-medium text-gray-700">
          Effets sur la sortie :
        </h4>
        <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 md:grid-cols-3">
          <div>
            <strong>Padding ↑</strong> : Taille sortie ↑
          </div>
          <div>
            <strong>Stride ↑</strong> : Taille sortie ↓
          </div>
          <div>
            <strong>Dilation ↑</strong> : Champ réceptif ↑
          </div>
        </div>
      </div>
    </div>
  );
}
