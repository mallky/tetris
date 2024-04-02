import { HEIGHT_MULTIPLICATOR, WIDTH_MULTIPLICATOR } from "./constants.js";

/**
 * 1. Проверка положения фигуры на поле
 */

class CollisionsDetector {
  isPositionAvailable({ fieldMap, figureMap, xCoord, yCoord }) {
    let isAvailable = true;

    for (let y = 0; y < figureMap.length; y++) {
      for (let x = 0; x < figureMap[y].length; x++) {
        if (yCoord + y < 0) {
          continue;
        }
        if (yCoord + y > HEIGHT_MULTIPLICATOR - 1) {
          return false;
        }

        if (xCoord + x < 0) {
          return false;
        }

        if (xCoord + x > WIDTH_MULTIPLICATOR - 1) {
          return false;
        }

        const fieldValue = fieldMap[yCoord + y][xCoord + x].value;
        const value = figureMap[y][x];

        isAvailable = isAvailable && (value !== 1 || fieldValue !== 1);
      }
    }

    return isAvailable;
  }

  isToBottomAvailable({ fieldMap, figureMap, xCoord, yCoord }) {
    return this.isPositionAvailable({
      fieldMap,
      figureMap,
      xCoord,
      yCoord: yCoord + 1,
    });
  }
}

const collisionsDetector = new CollisionsDetector();

export default collisionsDetector;
