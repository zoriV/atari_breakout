import { gameUtil } from "./script.js";

class DocumentManipulator {
  #winScreen = document.querySelector("#screen-win");
  #winScreen_points = document.querySelector("#screen-win-points");
  #winScreen_timer = document.querySelector("#screen-win-timer");

  #loseScreen = document.querySelector("#screen-lose");
  #loseScreen_points = document.querySelector("#screen-lose-points");
  #loseScreen_timer = document.querySelector("#screen-lose-timer");

  #gameOverlay = document.querySelector("#gameOverlay");
  #gameOverlay_pointsWrapper = document.querySelector("#gameOverlay-points");
  #gameOverlay_points = document.querySelector("#gameOverlay-points-value");
  #gameOverlay_counter = document.querySelector("#gameOverlay-counter");

  #resetButtons = document.querySelectorAll("button[data-resetbutton]");

  constructor() {
    this.#resetButtons.forEach((b) => {
      b.addEventListener("click", () => {
        this.#resetHandler();
      });
    });
  }

  showWinScreen(points, time) {
    this.hideOverlay();

    this.#showElement(this.#winScreen, true);
    this.#winScreen_points.innerText = points;
    this.#winScreen_timer.innerText = time;
  }

  showLoseScreen(points, time) {
    this.hideOverlay();

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
    gameUtil.reset();
  }

  showOverlay() {
    this.#showElement(this.#gameOverlay, true);
  }

  hideOverlay() {
    this.#showElement(this.#gameOverlay, false);
  }

  showPoints() {
    this.showOverlay();
    this.#showElement(this.#gameOverlay_pointsWrapper, true);
    this.#showElement(this.#gameOverlay_counter, false);
  }

  hidePoints() {
    this.hideOverlay();
    this.#showElement(this.#gameOverlay_pointsWrapper, false);
  }

  showCountdown() {
    this.showOverlay();
    this.#showElement(this.#gameOverlay_counter, true);
    this.#showElement(this.#gameOverlay_pointsWrapper, false);
  }

  hideCountdown() {
    this.hideOverlay();
    this.#showElement(this.#gameOverlay_counter, false);
  }

  updateCountdown(newValue, effect) {
    this.#gameOverlay_counter.innerText = newValue;
    if(effect) {
      this.#gameOverlay_counter.classList.add("ripple");
      this.#showElement(this.#gameOverlay_counter, true);
      this.#gameOverlay_counter.addEventListener("animationend", () => {
        this.#gameOverlay_counter.classList.remove("ripple");
        this.#showElement(this.#gameOverlay_counter, false);
      }, {once: true});
    }
  }

  updatePoints(newValue) {
    this.#gameOverlay_points.innerText = newValue;
  }
}

export const manipulator = new DocumentManipulator();
