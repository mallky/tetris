import {
  GRID_PIXEL,
  HEIGHT_MULTIPLICATOR,
  WIDTH_MULTIPLICATOR,
} from "./constants.js";

class Grid {
  init(ctx) {
    this.ctx = ctx;

    this.#drawGrid();
  }

  #drawGrid() {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";

    for (
      let x = GRID_PIXEL;
      x < GRID_PIXEL * WIDTH_MULTIPLICATOR;
      x += GRID_PIXEL
    ) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, GRID_PIXEL * HEIGHT_MULTIPLICATOR);
      this.ctx.closePath();
      this.ctx.stroke();
    }

    for (
      let y = GRID_PIXEL;
      y < GRID_PIXEL * HEIGHT_MULTIPLICATOR;
      y += GRID_PIXEL
    ) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(GRID_PIXEL * WIDTH_MULTIPLICATOR, y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }
}

const grid = new Grid();

export default grid;
