import {
  GRID_PIXEL,
  HEIGHT_MULTIPLICATOR,
  WIDTH_MULTIPLICATOR,
} from "./scripts/constants.js";
import field from "./scripts/field.js";
import game from "./scripts/game.js";
import grid from "./scripts/grid.js";

class App {
  constructor() {
    this.buttonStart = document.getElementById("buttonStart");
    this.buttonPause = document.getElementById("buttonPause");
    this.buttonStop = document.getElementById("buttonStop");
    this.mainContainer = document.getElementById("mainContainer");
    this.fieldCanvas = document.getElementById("field");
    this.gameCanvas = document.getElementById("game");
    this.staticCanvas = document.getElementById("static");
    this.gameIsFinished = document.getElementById("gameIsFinished");
    this.gameIsPaused = document.getElementById("gameIsPaused");
    this.scoreBlock = document.getElementById("score");
    this.velocityBlock = document.getElementById("velocity");

    // @ts-ignore
    this.fieldCtx = this.fieldCanvas?.getContext("2d");
    // @ts-ignore
    this.gameCtx = this.gameCanvas?.getContext("2d");
    // @ts-ignore
    this.staticCtx = this.staticCanvas?.getContext("2d");

    this.loopRef = null;
    this.isPaused = false;

    this.startGameFn = this.startGame.bind(this);
    this.handleKeydownEventFn = this.handleKeydownEvent.bind(this);
    this.handleKeyupEventFn = this.handleKeyupEvent.bind(this);
  }

  #setCanvasHeight(canvas) {
    canvas.width = GRID_PIXEL * WIDTH_MULTIPLICATOR;
    canvas.height = GRID_PIXEL * HEIGHT_MULTIPLICATOR;
  }

  #setFieldSizes() {
    this.#setCanvasHeight(this.fieldCanvas);
    this.#setCanvasHeight(this.staticCanvas);
    this.#setCanvasHeight(this.gameCanvas);

    if (this.mainContainer) {
      this.mainContainer.style.height = `${
        GRID_PIXEL * HEIGHT_MULTIPLICATOR
      }px`;
      this.mainContainer.style.width = `${GRID_PIXEL * WIDTH_MULTIPLICATOR}px`;
    }
  }

  init() {
    this.#setFieldSizes();
    this.buttonStart?.addEventListener("click", this.startGameFn);
    this.buttonStop?.addEventListener("click", () => this.stopGame());
    this.buttonPause?.addEventListener("click", () => this.pauseGame());

    field.init(this.fieldCtx);
    grid.init(this.staticCtx);
  }

  startGame() {
    this.buttonStart?.removeEventListener("click", this.startGameFn);

    document?.addEventListener("keydown", this.handleKeydownEventFn);
    document?.addEventListener("keyup", this.handleKeyupEventFn);

    game.init(this.gameCtx);

    this.mainThread();
  }

  pauseGame() {
    if (!this.buttonPause) {
      return;
    }

    if (this.isPaused) {
      this.startGame();
      this.isPaused = false;
      this.gameIsPaused?.classList.add("hidden");
      this.buttonPause.innerHTML = "Пауза";
    } else {
      this.stopGame();
      this.isPaused = true;
      this.gameIsPaused?.classList.remove("hidden");
      this.buttonPause.innerHTML = "Продолжить";
    }
  }

  mainThread() {
    this.loopRef = requestAnimationFrame(() => this.mainThread());

    this.#tick();

    if (this.scoreBlock) {
      this.scoreBlock.innerHTML = `${game.score}`;
    }
    if (this.velocityBlock) {
      this.velocityBlock.innerHTML = `${game.velocity}`;
    }
  }

  #tick() {
    const message = game.tick();

    if (message === "finish") {
      this.stopGame();

      if (this.gameIsFinished) {
        this.gameIsFinished.classList.remove("hidden");
      }
    }
  }

  stopGame() {
    if (this.loopRef) {
      cancelAnimationFrame(this.loopRef);
    }
  }

  handleKeydownEvent(e) {
    if (e.keyCode === 37 || e.keyCode === 39) {
      game.changeXPos(e.keyCode === 37);
    }

    if (e.keyCode === 38) {
      game.changeFigure();
    }

    if (e.keyCode === 40) {
      game.forceDown();
    }
  }

  handleKeyupEvent(e) {
    if (e.keyCode === 40) {
      game.forceDownFinish();
    }
  }
}

const app = new App();

app.init();
