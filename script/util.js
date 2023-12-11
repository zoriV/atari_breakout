import { gameUtil } from "./script.js";
import { manipulator as documentManipulator } from "./documentManipulator.js";

export class Platform {
  #pos;

  constructor(x, y, speed, sizeX, sizeY) {
    this.#pos = createVector(x, y);

    this.speed = speed;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  draw(direction) {
    this.move(direction);

    fill(255);
    rect(this.#pos.x, this.#pos.y, this.sizeX, this.sizeY);
  }

  move(direction) {
    if (this.getLeft() <= 0 && direction == -1) return;

    if (this.getRight() >= width && direction == 1) return;

    this.#pos.x += direction * this.speed * deltaTime;
  }

  getLeft() {
    return this.#pos.x - this.sizeX / 2;
  }

  getRight() {
    return this.#pos.x + this.sizeX / 2;
  }

  getTop() {
    return this.#pos.y - this.sizeY / 2;
  }

  getBottom() {
    return this.#pos.y + this.sizeY / 2;
  }
}

export class Ball {
  #velocity;
  #pos;
  #platform;
  #blocks;
  #trail = [];

  constructor(x, y, speed, size, platform, blocks) {
    this.speed = speed;
    this.size = size;
    this.#platform = platform;
    this.#blocks = blocks;

    this.#pos = createVector(x, y);
    this.#velocity = createVector(random(3, 8) * random([1, -1]), speed);
  }

  draw() {
    this.#checkCollisions();
    this.#pos.add(this.#velocity);

    this.#trail.push(createVector(this.#pos.x, this.#pos.y));
    if (this.#trail.length > 10) {
      this.#trail.shift();
    }

    noStroke();
    for (let i = 0; i < this.#trail.length; i++) {
      const alpha = map(i, 0, this.#trail.length, 100, 15);
      const trailSize = map(i, 0, this.#trail.length, this.size / 2, this.size);
      fill(255, alpha);
      ellipse(this.#trail[i].x, this.#trail[i].y, trailSize, trailSize);
    }

    fill(255);
    ellipse(this.#pos.x, this.#pos.y, this.size, this.size);
  }

  #checkCollisions() {
    // left and right wall
    if (this.#pos.x <= this.size / 2 || this.#pos.x >= width - this.size / 2)
      this.#velocity.x *= -1;

    // ceiling
    if (this.#pos.y <= this.size / 2) {
      this.#velocity.y *= -1;
      // this.#velocity.x *= Math.random() * 1 + 0.6;
    }

    // platform
    if (
      this.#pos.x >= this.#platform.getLeft() - this.size / 2 &&
      this.#pos.x <= this.#platform.getRight() + this.size / 2 &&
      this.#pos.y >= this.#platform.getTop() - this.size / 2 &&
      this.#pos.y <= this.#platform.getBottom() - this.size / 2
    ) {
      this.#velocity.y *= -1;

      // const multiplier = map(this.#pos.x,this.#platform.getLeft(), this.#platform.getRight(), -1.2, 1.2);
      // console.log( abs(multiplier));
      // this.#velocity.x *= abs(multiplier);
    }

    this.#blocks.forEach((block) => {
      const collision = block.checkCollision(
        this.#pos.x,
        this.#pos.y,
        this.size
      );
      if (collision.x != 0 && collision.y != 0) {
        block.break();
        gameUtil.increasePoints();
        if (collision.x == 1) {
          this.#velocity.x *= -1;
        }
        if (collision.y == 1) {
          this.#velocity.y *= -1;
          this.#velocity.x *= -1;
        }
      }
    });
  }

  getY() {
    return this.#pos.y;
  }

  getX() {
    return this.#pos.x;
  }
}

export class Block {
  #pos;

  constructor(x, y, sizeX, sizeY, color) {
    this.#pos = createVector(x, y);
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.color = color;

    this.alive = true;
    this.id = crypto.randomUUID();
  }

  draw() {
    if (!this.alive) return;

    fill(this.color);
    rect(this.#pos.x, this.#pos.y, this.sizeX, this.sizeY, 2);
  }

  checkCollision(x, y, size) {
    const collision = createVector(0, 0);
    if (!this.alive) return collision;

    if (
      this.#pos.x - this.sizeX / 2 <= x + size / 2 &&
      this.#pos.x + this.sizeX / 2 >= x - size / 2
    )
      collision.x = 1;

    if (
      this.#pos.y + this.sizeY / 2 >= y - size &&
      this.#pos.y - this.sizeY / 2 <= y + size / 2
    )
      collision.y = 1;
    return collision;
  }

  break() {
    this.alive = false;
  }
}

export class GameUtil {
  #points = 0;
  #maxPoints;
  #gamePaused = false;
  #platformReference;
  #time = 0;
  constructor(maxPoints, platform) {
    this.#maxPoints = maxPoints;
    this.#platformReference = platform;
  }

  increasePoints() {
    this.#points++;
    documentManipulator.updatePoints(this.#points);
    if (this.#points == this.#maxPoints / 2)
      this.#platformReference.sizeX -= 20;

    if (this.#points == this.#maxPoints) this.gameWon();
  }

  resetPoints() {
    this.#points = 0;
    documentManipulator.updatePoints(this.#points);
  }

  gameLost() {
    this.pauseGame();
    documentManipulator.showLoseScreen(this.#points, this.getTimer());
    console.log("You lose");
  }

  gameWon() {
    this.pauseGame();
    documentManipulator.showWinScreen(this.#points, this.getTimer());
    console.log("You win");
  }

  pauseGame() {
    this.#gamePaused = true;
  }

  isPaused() {
    return this.#gamePaused;
  }

  timer(timePassed) {
    this.#time += timePassed;
  }

  getTimer() {
    const timeInSecs = this.#time / 1000;
    const minutes = Math.floor(timeInSecs / 60);
    const seconds = timeInSecs % 60;
    return [minutes, seconds.toPrecision(2)].join(":");
  }
}
