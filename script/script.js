import { Ball, Platform, Block, GameUtil } from "./util.js";

const BLOCK_COLUMNS = 10,
  BLOCK_ROWS = 4;

const BLOCKS_OFFSET_VERTICAL = 2,
  BLOCKS_OFFSET_HORIZONTAL = 4,
  PADDING_TOP = 16,
  PADDING_WALLS = 10;

const BLOCK_HEIGHT = 32;

let width, height;
let platform, ball;
let direction = 0;

let blocks = [];
export let gameUtil;

function setup() {
  blocks = [];

  rectMode(CENTER);

  width = windowWidth;
  height = windowHeight;

  platform = new Platform(width / 2 - 110, height - 100, 0.75, 140, 15);
  ball = new Ball(width / 2, height / 2, 8, 26, platform, blocks);

  gameUtil = new GameUtil(BLOCK_COLUMNS * BLOCK_ROWS, platform);

  const mainCanvas = createCanvas(window.innerWidth, window.innerHeight);
  mainCanvas.addClass("main");

  for (let x = 0; x < BLOCK_COLUMNS; x++) {
    for (let y = 0; y < BLOCK_ROWS; y++) {
      blocks.push(
        new Block(
          x *
            ((width -
              2 * PADDING_WALLS -
              BLOCK_COLUMNS * BLOCKS_OFFSET_VERTICAL) /
              BLOCK_COLUMNS +
              BLOCKS_OFFSET_VERTICAL) +
            PADDING_WALLS +
            ((width -
              2 * PADDING_WALLS -
              BLOCK_COLUMNS * BLOCKS_OFFSET_VERTICAL) /
              BLOCK_COLUMNS +
              BLOCKS_OFFSET_VERTICAL) /
              2,
          y * (BLOCK_HEIGHT + BLOCKS_OFFSET_HORIZONTAL) +
            PADDING_TOP +
            (BLOCK_HEIGHT + BLOCKS_OFFSET_HORIZONTAL) / 2,
          (width - 2 * PADDING_WALLS - BLOCK_COLUMNS * BLOCKS_OFFSET_VERTICAL) /
            BLOCK_COLUMNS,
          BLOCK_HEIGHT,
          color("#BC13FE")
        )
      );
    }
  }
}

function windowResized() {
  width = windowWidth;
  height = windowHeight;

  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (gameUtil.isPaused()) return;
  // background(10);
  clear();

  gameUtil.timer(deltaTime);

  platform.draw(direction);
  ball.draw();

  blocks.forEach((block) => {
    block.draw();
  });

  if (ball.getY() - ball.size / 2 >= height) gameUtil.gameLost();
}

// controls
window.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key == "ArrowLeft") direction = -1;

  if (key == "ArrowRight") direction = 1;
});

window.addEventListener("keyup", (e) => {
  const key = e.key;

  if (key == "ArrowLeft" && direction == -1) direction = 0;

  if (key == "ArrowRight" && direction == 1) direction = 0;
});

window.setup = setup;
window.windowResized = windowResized;
window.draw = draw;
