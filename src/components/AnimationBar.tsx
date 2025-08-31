interface AnimationBarProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (v: number) => void;
}

export default function AnimationBar({
  isPlaying,
  onPlay,
  onPause,
  onStep,
  onReset,
  speed,
  setSpeed,
}: AnimationBarProps) {
  return (
    <div className="flex items-center gap-4">
      {isPlaying ? (
        <button
          onClick={onPause}
          className="rounded bg-red-600 px-3 py-1 text-white"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onPlay}
          className="rounded bg-green-600 px-3 py-1 text-white"
        >
          Play
        </button>
      )}
      <button
        onClick={onStep}
        className="rounded bg-blue-600 px-3 py-1 text-white"
      >
        Step
      </button>
      <button
        onClick={onReset}
        className="rounded bg-gray-600 px-3 py-1 text-white"
      >
        Reset
      </button>
      <div>
        <label className="mr-2">Vitesse:</label>
        <input
          type="range"
          min={200}
          max={2000}
          step={100}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span className="ml-2">{speed} ms</span>
      </div>
    </div>
  );
}
