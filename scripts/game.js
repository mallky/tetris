import {
  GRID_PIXEL,
  HEIGHT_MULTIPLICATOR,
  INIT_VELOCITY,
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
    this.forceDownMultiplicator = 0;
    this.velocity = INIT_VELOCITY;
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

  get yCoord() {
    return Math.floor(this.y / GRID_PIXEL);
  }

  tick() {
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
      this.y += this.forceDownMultiplicator || this.velocity;
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
      this.forceDownMultiplicator = 0;
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
    this.forceDownMultiplicator = 0;
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
    if (this.score / 1000 > 8 * this.velocity) {
      this.velocity += INIT_VELOCITY;
    }
  }

  reset() {
    this.velocity = INIT_VELOCITY;
    this.xCoord = 4;
    this.y = -4 * GRID_PIXEL;
    this.#score = 0;

    this.ctx.clearRect(
      0,
      0,
      GRID_PIXEL * WIDTH_MULTIPLICATOR,
      GRID_PIXEL * HEIGHT_MULTIPLICATOR
    );

    field.reset();
  }

  get level() {
    return this.velocity * 4;
  }
}

const game = new Game();

export default game;
