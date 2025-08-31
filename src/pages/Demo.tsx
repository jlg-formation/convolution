import Grid from "../components/Grid";
import KernelEditor from "../components/KernelEditor";
import AnimationDemo from "../components/AnimationDemo";
import ConvolutionVisualization from "../components/ConvolutionVisualization";
import ConvolutionParameters from "../components/ConvolutionParameters";
import EditableMatrix from "../components/EditableMatrix";
import { kernelPresets, inputPresets } from "../logic/presets";
import { useConvolutionStore } from "../state/useStore";

export default function Demo() {
  const { input, kernel, output, config, setInput, setKernel } =
    useConvolutionStore();

  const { padding } = config;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Démo Convolution</h1>

      {/* Paramètres de convolution */}
      <ConvolutionParameters />

      {/* Édition des matrices */}
      <div className="grid grid-cols-2 gap-6">
        <EditableMatrix
          matrix={input}
          setMatrix={setInput}
          title="Matrice d'entrée"
          minSize={3}
          maxSize={15}
          defaultValue={0}
          presets={inputPresets}
        />
        <EditableMatrix
          matrix={kernel}
          setMatrix={setKernel}
          title="Noyau (Kernel)"
          minSize={1}
          maxSize={7}
          defaultValue={0}
          presets={kernelPresets}
        />
      </div>
      {/* Vue conceptuelle de la convolution */}
      <ConvolutionVisualization
        input={input}
        kernel={kernel}
        output={output}
        padding={padding}
        stride={config.stride}
        dilation={config.dilation}
      />

      {/* Note sur le calcul automatique */}
      <div className="rounded border border-green-200 bg-green-50 p-3">
        <p className="text-sm text-green-800">
          ✅ <strong>Calcul automatique</strong> : Le résultat se met à jour
          automatiquement quand vous modifiez les matrices ou paramètres.
        </p>
      </div>

      {padding > 0 && (
        <div className="rounded border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Padding = {padding}</strong> : La matrice d'entrée est
            entourée de <strong>zéros</strong> sur {padding} pixel(s) de chaque
            côté.
          </p>
        </div>
      )}

      {/* Composant d'animation refactorisé */}
      <AnimationDemo />
    </div>
  );
}
