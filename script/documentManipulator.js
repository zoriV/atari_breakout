import { gameUtil } from "./script.js";

class DocumentManipulator {
  #winScreen = document.querySelector("#screen-win");
  #winScreen_points = document.querySelector("#screen-win-points");
  #winScreen_timer = document.querySelector("#screen-win-timer");

  #loseScreen = document.querySelector("#screen-lose");
  #loseScreen_points = document.querySelector("#screen-lose-points");
  #loseScreen_timer = document.querySelector("#screen-lose-timer");

  #gameOverlay = document.querySelector("#gameOverlay");
  #gameOverlay_points = document.querySelector("#gameOverlay-points");

  #resetButtons = document.querySelectorAll("button[data-resetbutton]");

  constructor() {
    this.#resetButtons.forEach((b) => {
      b.addEventListener("click", () => {
        this.#resetHandler();
      });
    });
  }

  showWinScreen(points, time) {
    this.HideOverlay();

    this.#showElement(this.#winScreen, true);
    this.#winScreen_points.innerText = points;
    this.#winScreen_timer.innerText = time;
  }

  showLoseScreen(points, time) {
    this.HideOverlay();

    this.#showElement(this.#loseScreen, true);
    this.#loseScreen_points.innerText = points;
    this.#loseScreen_timer.innerText = time;
  }

  #showElement(elem, shown) {
    if (shown) elem.dataset.enabled = "";
    else delete elem.dataset.enabled;
  }

  #resetHandler() {
    window.setup();
    this.#showElement(this.#loseScreen, false);
    this.#showElement(this.#winScreen, false);
    this.showOverlay();
    gameUtil.resetPoints();
  }

  showOverlay() {
    this.#showElement(this.#gameOverlay, true);
  }

  HideOverlay() {
    this.#showElement(this.#gameOverlay, false);
  }

  updatePoints(newValue) {
    this.#gameOverlay_points.innerText = newValue;
  }
}

export const manipulator = new DocumentManipulator();
