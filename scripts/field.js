import {
  EMPTY_FIELD,
  EMPTY_ROW,
  GRID_PIXEL,
  HEIGHT_MULTIPLICATOR,
  LAST_AVAILABLE_POINTS,
  PIXEL,
  WIDTH_MULTIPLICATOR,
  SCORES_MAP,
} from "./constants.js";

/**
 * 1. Создание обьекта поля
 * 2. Заполнение/clean клеток
 * 3. Выбор типа фигуры
 */

class Field {
  #fieldMap = EMPTY_FIELD;
  #lastAvailablePoints = LAST_AVAILABLE_POINTS;
  #fOffset = GRID_PIXEL - PIXEL;

  constructor() {
    this.ctx = {};
  }

  init(ctx) {
    this.ctx = ctx;
  }

  getPointsToFill({ currentFigureMap, xCoord, yCoord }) {
    const points = [];

    for (let y = currentFigureMap.length - 1; y >= 0; y--) {
      for (let x = 0; x < currentFigureMap[y].length; x++) {
        if (currentFigureMap[y][x] === 1) {
          points.push({ x: x + xCoord, y: y + yCoord });
        }
      }
    }

    return points;
  }
  // Get maps of points; Point = {x :number, y: number}
  fillField({ currentFigureMap, xCoord, yCoord }, color) {
    try {
      const points = this.getPointsToFill({ currentFigureMap, xCoord, yCoord });

      points.forEach((point) => {
        const { x: xCoord, y: yCoord } = point;
        const row = [...this.#fieldMap[yCoord]];
        row.splice(xCoord, 1, { value: 1, color });

        this.#fieldMap[yCoord] = row;
      });

      const score = this.cleanFullRows();
      this.drawField();
      return { success: true, score };
    } catch (error) {
      return { success: false, score: 0 };
    }
  }

  cleanFullRows() {
    const fullRows = this.#fieldMap.reduce((acc, row, index) => {
      if (row.some((item) => item.value === 0)) {
        return acc;
      }

      return [...acc, index];
    }, []);

    if (fullRows.length) {
      fullRows.forEach((rowIndex) => {
        this.#fieldMap.splice(rowIndex, 1);
        this.#fieldMap = [EMPTY_ROW, ...this.#fieldMap];

        this.#lastAvailablePoints = this.#lastAvailablePoints.map((y) => {
          if (y >= HEIGHT_MULTIPLICATOR) {
            return HEIGHT_MULTIPLICATOR;
          }

          return y + 1;
        });
      });

      return SCORES_MAP[fullRows.length];
    }

    return 0;
  }

  drawField() {
    this.ctx.clearRect(
      0,
      0,
      GRID_PIXEL * WIDTH_MULTIPLICATOR,
      GRID_PIXEL * HEIGHT_MULTIPLICATOR
    );

    for (let y = 0; y < this.#fieldMap.length; y++) {
      for (let x = 0; x < this.#fieldMap[y].length; x++) {
        if (this.#fieldMap[y][x].value) {
          this.ctx.fillStyle = this.#fieldMap[y][x].color;
          this.ctx.fillRect(
            x * GRID_PIXEL + this.#fOffset,
            y * GRID_PIXEL + this.#fOffset,
            PIXEL,
            PIXEL
          );
        }
      }
    }
  }

  get fieldMap() {
    return this.#fieldMap;
  }

  lastAvailablePoints() {
    return this.#fieldMap.reduce((acc, row, y) => {
      row.forEach((item, index) => {
        const currState = acc[index] ?? HEIGHT_MULTIPLICATOR - 1;
        if (currState > y - 1 && item === 1) {
          acc[index] = y - 1;
        } else {
          acc[index] = currState;
        }
      });
      return acc;
    }, []);
  }
}

const field = new Field();

export default field;
