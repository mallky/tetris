export const PIXEL = 25;
export const GRID_PIXEL = PIXEL + 2;
export const WIDTH_MULTIPLICATOR = 10;
export const HEIGHT_MULTIPLICATOR = 20;

export const EMPTY_ROW = Array(WIDTH_MULTIPLICATOR).fill({ value: 0 });
export const EMPTY_FIELD = Array(HEIGHT_MULTIPLICATOR).fill(EMPTY_ROW);

export const LAST_AVAILABLE_POINTS = Array(WIDTH_MULTIPLICATOR).fill(
  HEIGHT_MULTIPLICATOR - 1
);

export const FIGURES = {
  l: [[1], [1], [1], [1]],
  s: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  z: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  q: [
    [1, 1],
    [1, 1],
  ],
  rp: [
    [1, 1, 1],
    [1, 0, 0],
  ],
  lp: [
    [1, 1, 1],
    [0, 0, 1],
  ],
  t: [
    [1, 1, 1],
    [0, 1, 0],
  ],
};
export const FIGURE_COLORS = {
  l: "navy",
  s: "gold",
  z: "red",
  q: "black",
  rp: "green",
  lp: "purple",
  t: "orange",
};

export const SCORES_MAP = {
  1: 100,
  2: 300,
  3: 700,
  4: 1500,
};
