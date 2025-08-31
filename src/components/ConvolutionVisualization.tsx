import Grid from "./Grid";

interface ConvolutionVisualizationProps {
  input: number[][];
  kernel: number[][];
  output?: number[][];
  padding?: number;
  stride?: number;
  dilation?: number;
}

export default function ConvolutionVisualization({
  input,
  kernel,
  output,
  padding = 0,
  stride = 1,
  dilation = 1,
}: ConvolutionVisualizationProps) {
  const inputDims = `${input.length}×${input[0]?.length || 0}`;
  const kernelDims = `${kernel.length}×${kernel[0]?.length || 0}`;
  const outputDims = output
    ? `${output.length}×${output[0]?.length || 0}`
    : "calculé automatiquement";

  return (
    <div className="flex items-center justify-center gap-6 overflow-x-auto rounded-lg border bg-gray-50 p-6">
      {/* Matrice d'entrée */}
      <div className="flex flex-col items-center">
        <div className="mb-2 text-sm font-medium text-gray-600">
          Matrice d'entrée ({inputDims})
        </div>
        <div className="rounded-lg border-2 border-green-400 bg-white p-2 shadow-sm">
          <Grid matrix={input} readOnly />
        </div>
        {padding > 0 && (
          <div className="mt-1 text-xs text-blue-600">padding: {padding}</div>
        )}
      </div>

      {/* Symbole de convolution */}
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-gray-400">⊛</div>
        <div className="mt-1 text-xs text-gray-500">convolution</div>
        {(stride > 1 || dilation > 1) && (
          <div className="mt-1 text-xs text-gray-600">
            {stride > 1 && <div>stride: {stride}</div>}
            {dilation > 1 && <div>dilation: {dilation}</div>}
          </div>
        )}
      </div>

      {/* Kernel */}
      <div className="flex flex-col items-center">
        <div className="mb-2 text-sm font-medium text-gray-600">
          Noyau ({kernelDims})
        </div>
        <div className="rounded-lg border-2 border-blue-400 bg-white p-2 shadow-sm">
          <Grid matrix={kernel} readOnly />
        </div>
      </div>

      {/* Symbole égal */}
      <div className="text-2xl font-bold text-gray-400">=</div>

      {/* Matrice de sortie */}
      <div className="flex flex-col items-center">
        <div className="mb-2 text-sm font-medium text-gray-600">
          Feature Map ({outputDims})
        </div>
        <div className="rounded-lg border-2 border-purple-400 bg-white p-2 shadow-sm">
          {output ? (
            <Grid matrix={output} readOnly />
          ) : (
            <div className="flex min-h-24 min-w-24 items-center justify-center p-4">
              <div className="text-center text-gray-400">
                <div className="mb-1 text-sm">Pas encore calculé</div>
                <div className="text-xs">Cliquez sur "Calculer"</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informations additionnelles */}
      {(padding > 0 || stride > 1 || dilation > 1) && (
        <div className="absolute right-2 bottom-2 text-xs text-gray-500">
          <div className="rounded bg-gray-100 px-2 py-1">
            {padding > 0 && <span>P:{padding} </span>}
            {stride > 1 && <span>S:{stride} </span>}
            {dilation > 1 && <span>D:{dilation}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
