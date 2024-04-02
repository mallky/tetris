import { FIGURES, FIGURE_COLORS, GRID_PIXEL, PIXEL } from "./constants.js";

/**
 * 1. Создание фигуры
 * 2. Повороты фигуры
 */
class Figure {
  #figureNames = Object.keys(FIGURES);
  currentFigure;
  currentFigureMap;
  currentColor = "black";

  constructor() {
    this.ctx = {};
  }

  init(ctx) {
    this.ctx = ctx;
  }

  drawFigure({ x, y }, ctx = this.ctx) {
    if (!this.currentFigure) {
      this.chooseNewFigure();
    }

    ctx.fillStyle = this.currentColor;

    for (let i = 0; i < this.currentFigureMap.length; i++) {
      for (let j = 0; j < this.currentFigureMap[i].length; j++) {
        if (this.currentFigureMap[i][j]) {
          ctx.fillRect(x + j * GRID_PIXEL, y + i * GRID_PIXEL, PIXEL, PIXEL);
        }
      }
    }
  }

  chooseNewFigure() {
    const randomNumber = Math.floor(Math.random() * this.#figureNames.length);

    this.currentFigure = this.#figureNames[randomNumber];
    this.currentColor = FIGURE_COLORS[this.currentFigure];
    this.currentFigureMap = FIGURES[this.currentFigure];
  }

  #rotateArray(arr) {
    let newArr = [];
    let newRowsLength = arr[0].length;
    let newColsLength = arr.length;

    for (let i = 0; i < newRowsLength; i++) {
      let row = [];

      for (let j = newColsLength - 1, k = 0; j >= 0; j--) {
        row[k] = arr[j][i];
        k++;
      }

      newArr[i] = row;
    }

    return newArr;
  }

  get figureSquare() {
    return {
      x: this.currentFigureMap[0].length,
      y: this.currentFigureMap.length,
    };
  }

  rotateFigure() {
    return {
      newMap: this.#rotateArray(this.currentFigureMap),
      length: this.currentFigureMap.length,
    };
  }

  set newFigureMap(newFigureMap) {
    this.currentFigureMap = newFigureMap;
  }
}

const figure = new Figure();

export default figure;
