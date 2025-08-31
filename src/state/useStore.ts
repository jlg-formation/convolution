import { create } from "zustand";
import { conv2d } from "../logic/convolution";

// Interface pour les paramètres de convolution
export interface ConvolutionConfig {
  padding: number;
  stride: number;
  dilation: number;
}

// Interface pour l'état de l'animation
export interface AnimationState {
  currentPos: [number, number] | null;
  currentCell: [number, number] | null;
  partialSteps: Array<{
    valIn: number;
    valK: number;
    prod: number;
    isPadding?: boolean;
  }>;
  isPlaying: boolean;
  speed: number;
}

// Interface principale du store
interface ConvolutionStore {
  // Matrices
  input: number[][];
  kernel: number[][];
  output: number[][];

  // Configuration de convolution
  config: ConvolutionConfig;

  // État de l'animation
  animation: AnimationState;

  // Actions pour les matrices
  setInput: (input: number[][]) => void;
  setKernel: (kernel: number[][]) => void;

  // Actions pour la configuration
  updateConfig: (config: Partial<ConvolutionConfig>) => void;
  setPadding: (padding: number) => void;
  setStride: (stride: number) => void;
  setDilation: (dilation: number) => void;

  // Actions pour l'animation
  updateAnimation: (animation: Partial<AnimationState>) => void;
  setCurrentPos: (pos: [number, number] | null) => void;
  setCurrentCell: (cell: [number, number] | null) => void;
  setPartialSteps: (steps: AnimationState["partialSteps"]) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;

  // Action pour recalculer la convolution
  computeConvolution: () => void;

  // Action pour réinitialiser l'animation
  resetAnimation: () => void;
}

// Store Zustand
export const useConvolutionStore = create<ConvolutionStore>((set, get) => ({
  // État initial des matrices
  input: [
    [1, 2, 3, 0, 1],
    [0, 1, 2, 3, 1],
    [3, 1, 0, 2, 2],
    [2, 0, 1, 1, 0],
    [1, 3, 2, 0, 1],
  ],
  kernel: [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1],
  ],
  output: [],

  // Configuration initiale
  config: {
    padding: 0,
    stride: 1,
    dilation: 1,
  },

  // État initial de l'animation
  animation: {
    currentPos: null,
    currentCell: null,
    partialSteps: [],
    isPlaying: false,
    speed: 800,
  },

  // Actions pour les matrices
  setInput: (input) => {
    set({ input });
    // Recalcul automatique
    get().computeConvolution();
  },

  setKernel: (kernel) => {
    set({ kernel });
    // Recalcul automatique
    get().computeConvolution();
  },

  // Actions pour la configuration
  updateConfig: (newConfig) => {
    const currentConfig = get().config;
    const updatedConfig = { ...currentConfig, ...newConfig };
    set({ config: updatedConfig });
    // Recalcul automatique
    get().computeConvolution();
  },

  setPadding: (padding) => {
    get().updateConfig({ padding });
  },

  setStride: (stride) => {
    get().updateConfig({ stride });
  },

  setDilation: (dilation) => {
    get().updateConfig({ dilation });
  },

  // Actions pour l'animation
  updateAnimation: (newAnimation) => {
    const currentAnimation = get().animation;
    set({ animation: { ...currentAnimation, ...newAnimation } });
  },

  setCurrentPos: (currentPos) => {
    get().updateAnimation({ currentPos });
  },

  setCurrentCell: (currentCell) => {
    get().updateAnimation({ currentCell });
  },

  setPartialSteps: (partialSteps) => {
    get().updateAnimation({ partialSteps });
  },

  setIsPlaying: (isPlaying) => {
    get().updateAnimation({ isPlaying });
  },

  setSpeed: (speed) => {
    get().updateAnimation({ speed });
  },

  // Calcul de la convolution
  computeConvolution: () => {
    const { input, kernel, config } = get();
    const output = conv2d(input, kernel, config);
    set({ output });
  },

  // Réinitialisation de l'animation
  resetAnimation: () => {
    set({
      animation: {
        currentPos: null,
        currentCell: null,
        partialSteps: [],
        isPlaying: false,
        speed: 800,
      },
    });
  },
}));
