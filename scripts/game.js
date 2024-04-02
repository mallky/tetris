import {
  GRID_PIXEL,
  HEIGHT_MULTIPLICATOR,
  PIXEL,
  WIDTH_MULTIPLICATOR,
} from "./constants.js";
import collisionsDetector from "./collisionsDetector.js";
import field from "./field.js";
import figure from "./figure.js";

/**
 * 1. Начало игры, конец игры
 * 2. Game loop
 */
class Game {
  #score = 0;

  constructor() {
    this.xCoord = 4;
    this.y = -4 * GRID_PIXEL;
    this.ctx = {};
    this.fOffset = GRID_PIXEL - PIXEL;
    this.forceDownMultiplicator = 1;
    this.velocity = 1;
  }

  init(ctx) {
    this.ctx = ctx;
    figure.init(ctx);
  }

  get score() {
    return this.#score;
  }

  setScore(score) {
    this.#score += score;
  }

  #maxAvailableYCoords() {
    return field.lastAvailablePoints();
  }

  get yCoord() {
    return Math.floor(this.y / GRID_PIXEL);
  }

  tick() {
    const maxAvailableYCoords = this.#maxAvailableYCoords();

    if (maxAvailableYCoords.some((item) => item < 0)) {
      return "finish";
    }

    this.ctx.clearRect(
      0,
      0,
      GRID_PIXEL * WIDTH_MULTIPLICATOR,
      GRID_PIXEL * HEIGHT_MULTIPLICATOR
    );

    figure.drawFigure({
      x: this.xCoord * GRID_PIXEL + this.fOffset,
      y: this.y,
    });

    if (
      collisionsDetector.isToBottomAvailable({
        fieldMap: field.fieldMap,
        figureMap: figure.currentFigureMap,
        xCoord: this.xCoord,
        yCoord: this.yCoord,
      })
    ) {
      this.y += this.velocity * this.forceDownMultiplicator;
    } else {
      const yCoord = this.yCoord;
      this.y = yCoord * GRID_PIXEL;

      const { success, score } = field.fillField(
        {
          currentFigureMap: figure.currentFigureMap,
          xCoord: this.xCoord,
          yCoord,
        },
        figure.currentColor
      );

      this.setScore(score);
      this.checkLevel();
      if (!success) {
        return "finish";
      }

      figure.chooseNewFigure();

      this.y = -4 * GRID_PIXEL;
      this.xCoord = 4;
      this.forceDownMultiplicator = 1;
    }
  }

  #setXCoord(newXCoord) {
    if (
      collisionsDetector.isPositionAvailable({
        fieldMap: field.fieldMap,
        figureMap: figure.currentFigureMap,
        xCoord: newXCoord,
        yCoord: this.yCoord,
      })
    ) {
      this.xCoord = newXCoord;
    }
  }

  changeXPos(toLeft = true) {
    const { x } = figure.figureSquare;

    if (toLeft) {
      const newXCoord = this.xCoord > 0 ? this.xCoord - 1 : this.xCoord;
      this.#setXCoord(newXCoord);
    } else {
      const newXCoord =
        this.xCoord + x < WIDTH_MULTIPLICATOR ? this.xCoord + 1 : this.xCoord;
      this.#setXCoord(newXCoord);
    }
  }

  forceDown() {
    this.forceDownMultiplicator = 25;
  }

  forceDownFinish() {
    this.forceDownMultiplicator = 1;
  }

  changeFigure() {
    const { newMap, length } = figure.rotateFigure();

    for (let i = 0; i < Array(length).length; i++) {
      const isPositionAvailable = collisionsDetector.isPositionAvailable({
        fieldMap: field.fieldMap,
        figureMap: newMap,
        xCoord: this.xCoord - i,
        yCoord: this.yCoord,
      });

      if (isPositionAvailable) {
        this.xCoord = this.xCoord - i;
        figure.newFigureMap = newMap;
        return;
      }
    }
  }

  checkLevel() {
    if ((this.score / 1000) % 8000 > 2 * this.velocity) {
      this.velocity += 1;
    }
  }
}

const game = new Game();

export default game;
