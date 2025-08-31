export function conv2d(
  input: number[][],
  kernel: number[][],
  opts: { padding: number; stride: number; dilation: number },
): number[][] {
  const { padding, stride, dilation } = opts;
  const H = input.length;
  const W = input[0].length;
  const kH = kernel.length;
  const kW = kernel[0].length;

  // Ajout de padding
  const padded = Array.from({ length: H + 2 * padding }, (_, i) =>
    Array.from({ length: W + 2 * padding }, (_, j) => {
      const ii = i - padding;
      const jj = j - padding;
      return ii >= 0 && ii < H && jj >= 0 && jj < W ? input[ii][jj] : 0;
    }),
  );

  const outH = Math.floor(
    (H + 2 * padding - dilation * (kH - 1) - 1) / stride + 1,
  );
  const outW = Math.floor(
    (W + 2 * padding - dilation * (kW - 1) - 1) / stride + 1,
  );

  const output = Array.from({ length: outH }, () => Array(outW).fill(0));

  for (let i = 0; i < outH; i++) {
    for (let j = 0; j < outW; j++) {
      let sum = 0;
      for (let u = 0; u < kH; u++) {
        for (let v = 0; v < kW; v++) {
          const ii = i * stride + u * dilation;
          const jj = j * stride + v * dilation;
          sum += padded[ii][jj] * kernel[u][v];
        }
      }
      output[i][j] = sum;
    }
  }

  return output;
}
