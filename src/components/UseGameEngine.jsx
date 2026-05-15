// ========================================
// Imports
// ========================================

import { useEffect, useRef } from "react";
import Player from "./Player";
// ========================================
// Importing & creating levels
// ========================================
import createLevel1 from "./Levels/Level1";
import createLevel2 from "./Levels/Level2";
import createLevel3 from "./Levels/Level3";
import createLevel4 from "./Levels/Level4";
import createLevel5 from "./Levels/Level5";
import createLevel6 from "./Levels/Level6";

const levels = [
  createLevel1,
  createLevel2,
  createLevel3,
  createLevel4,
  createLevel5,
  createLevel6,
];
// ========================================
// Game Engine Hook
// ========================================

const useGameEngine = (
  canvasRef,
  { gameState, currentLevel, onCoinCollect, onEnemyKill, onPlayerDeath, onWin },
) => {
  // ========================================
  // Game Constants
  // ========================================

  const gravity = 0.5;

  // ========================================
  // Game State Refs
  // ========================================

  const scrollOffset = useRef(0);
  const lastKey = useRef("");

  // ========================================
  // Entity Refs
  // ========================================

  const playerRef = useRef(null);

  const platformsRef = useRef([]);
  const genericObjectsRef = useRef([]);
  const coinsRef = useRef([]);
  const enemiesRef = useRef([]);

  const currentLevelRef = useRef(null);

  // ========================================
  // Keyboard State
  // ========================================

  const keys = useRef({
    right: { pressed: false },
    left: { pressed: false },
  });

  // ========================================
  // Main Effect
  // ========================================

  useEffect(() => {
    // ========================================
    // Canvas Setup
    // ========================================

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 1024;
    canvas.height = 576;

    // ========================================
    // Asset Loader Helper
    // ========================================

    function createImage(imageSrc) {
      const image = new Image();
      image.src = imageSrc;
      return image;
    }

    // ========================================
    // Game Assets
    // ========================================

    const platformImg = createImage("./imgs/platform.png");

    const platformSmallTallImg = createImage("./imgs/platformSmallTall.png");

    const spriteRunLeft = createImage("./imgs/spriteRunLeft.png");

    const spriteRunRight = createImage("./imgs/spriteRunRight.png");

    const spriteStandLeft = createImage("./imgs/spriteStandLeft.png");

    const spriteStandRight = createImage("./imgs/spriteStandRight.png");

    const backgroundImg = createImage("./imgs/background.png");

    const hillsImg = createImage("./imgs/hills.png");

    const enemyImg = createImage("./imgs/enemy.png");

    // ========================================
    // Initialize Game / Level
    // ========================================

    function init() {
      // Reset Scroll
      scrollOffset.current = 0;

      // ========================================
      // Create Player
      // ========================================

      playerRef.current = new Player({
        stand: {
          right: spriteStandRight,
          left: spriteStandLeft,
          cropWidth: 177,
          width: 66,
        },

        run: {
          right: spriteRunRight,
          left: spriteRunLeft,
          cropWidth: 341,
          width: 127.875,
        },
      });

      // ========================================
      // Load Current Level
      // ========================================

      const createLevel = levels[currentLevel];
      currentLevelRef.current = createLevel({
        platformImg,
        platformSmallTallImg,
        backgroundImg,
        hillsImg,
        enemyImg,
      });
      const level = currentLevelRef.current;

      // ========================================
      // Store Level Data
      // ========================================

      genericObjectsRef.current = level.genericObjects;

      platformsRef.current = level.platforms;

      coinsRef.current = level.coins;

      enemiesRef.current = level.enemies;
    }

    // ========================================
    // Animation Variables
    // ========================================

    let animationId;

    let then = Date.now();

    let interval = 1000 / 60;

    // ========================================
    // Main Game Loop
    // ========================================

    const animate = () => {
      if (gameState !== "playing") return;

      animationId = requestAnimationFrame(animate);

      let now = Date.now();

      let delta = now - then;

      if (delta > interval) {
        then = now - (delta % interval);

        // ========================================
        // Clear Canvas
        // ========================================

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ========================================
        // Draw Background Objects
        // ========================================

        genericObjectsRef.current.forEach((obj) => obj.draw(ctx));

        // ========================================
        // Draw Platforms
        // ========================================

        platformsRef.current.forEach((platform) => platform.draw(ctx));

        // ========================================
        // Player Reference
        // ========================================

        const player = playerRef.current;

        // ========================================
        // Coin Collection Logic
        // ========================================

        coinsRef.current = coinsRef.current.filter((coin) => {
          const isCollected =
            player.position.x < coin.position.x + coin.size &&
            player.position.x + player.width > coin.position.x &&
            player.position.y < coin.position.y + coin.size &&
            player.position.y + player.height > coin.position.y;

          if (isCollected) {
            onCoinCollect(1);

            return false;
          }

          coin.draw(ctx);

          return true;
        });

        // ========================================
        // Update Player Physics
        // ========================================

        player.update(ctx, canvas, gravity);

        // ========================================
        // Player Movement
        // ========================================

        player.velocity.x = 0;

        // Move Right
        if (keys.current.right.pressed && player.position.x < 400) {
          player.velocity.x = player.speed;
        }

        // Move Left
        else if (
          (keys.current.left.pressed && player.position.x > 100) ||
          (keys.current.left.pressed &&
            scrollOffset.current === 0 &&
            player.position.x > 0)
        ) {
          player.velocity.x = -player.speed;
        }

        // ========================================
        // World Scrolling
        // ========================================
        else {
          // Scroll Right
          if (keys.current.right.pressed) {
            scrollOffset.current += player.speed;

            platformsRef.current.forEach((platform) => {
              platform.position.x -= player.speed;
            });

            genericObjectsRef.current.forEach((object) => {
              object.position.x -= player.speed * 0.66;
            });

            coinsRef.current.forEach((coin) => {
              coin.position.x -= player.speed;
            });

            enemiesRef.current.forEach((enemy) => {
              enemy.position.x -= player.speed;
              enemy.startX -= player.speed;
            });
          }

          // Scroll Left
          else if (keys.current.left.pressed && scrollOffset.current > 0) {
            scrollOffset.current -= player.speed;

            platformsRef.current.forEach((platform) => {
              platform.position.x += player.speed;
            });

            genericObjectsRef.current.forEach((object) => {
              object.position.x += player.speed * 0.66;
            });

            coinsRef.current.forEach((coin) => {
              coin.position.x += player.speed;
            });

            enemiesRef.current.forEach((enemy) => {
              enemy.position.x += player.speed;
              enemy.startX += player.speed;
            });
          }
        }

        // ========================================
        // Platform Collision Logic
        // ========================================

        platformsRef.current.forEach((platform) => {
          if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >=
              platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
          ) {
            player.velocity.y = 0;
          }
        });

        // ========================================
        // Enemy Logic
        // ========================================

        enemiesRef.current = enemiesRef.current.filter((enemy) => {
          enemy.update(ctx);

          const enemyHitbox = {
            x: enemy.position.x + 10,
            y: enemy.position.y + 10,
            width: enemy.width - 20,
            height: enemy.height - 15,
          };

          const isColliding =
            player.position.x < enemyHitbox.x + enemyHitbox.width &&
            player.position.x + player.width > enemyHitbox.x &&
            player.position.y < enemyHitbox.y + enemyHitbox.height &&
            player.position.y + player.height > enemyHitbox.y;

          if (isColliding) {
            // ========================================
            // Stomp Enemy
            // ========================================

            if (
              player.position.y + player.height <= enemyHitbox.y + 10 &&
              player.velocity.y > 0
            ) {
              onEnemyKill(50);

              player.velocity.y = -10;

              return false;
            }

            // ========================================
            // Player Hit By Enemy
            // ========================================
            else {
              onPlayerDeath();

              init();
            }
          }

          return true;
        });

        // ========================================
        // Sprite Animation Logic
        // ========================================

        if (keys.current.right.pressed) {
          player.currentSprite = player.sprites.run.right;

          player.currentCropWidth = player.sprites.run.cropWidth;

          player.width = player.sprites.run.width;

          lastKey.current = "right";
        } else if (keys.current.left.pressed) {
          player.currentSprite = player.sprites.run.left;

          player.currentCropWidth = player.sprites.run.cropWidth;

          player.width = player.sprites.run.width;

          lastKey.current = "left";
        } else {
          player.currentSprite =
            lastKey.current === "left"
              ? player.sprites.stand.left
              : player.sprites.stand.right;

          player.currentCropWidth = player.sprites.stand.cropWidth;

          player.width = player.sprites.stand.width;
        }

        // ========================================
        // Win Condition
        // ========================================

        if (scrollOffset.current > currentLevelRef.current.winOffset) {
          onWin();
        }

        // ========================================
        // Fall Death Logic
        // ========================================

        if (player.position.y > canvas.height) {
          // Prevent Double Death Trigger
          player.position.y = -100;

          onPlayerDeath();

          init();
        }
      }
    };

    // ========================================
    // Keyboard Down Events
    // ========================================

    const handleKeyDown = ({ key }) => {
      if (gameState !== "playing") return;

      switch (key) {
        case "ArrowLeft":
          keys.current.left.pressed = true;
          lastKey.current = "left";
          break;

        case "ArrowRight":
          keys.current.right.pressed = true;
          lastKey.current = "right";
          break;

        case "ArrowUp":
          if (playerRef.current.velocity.y === 0) {
            playerRef.current.velocity.y = -15;
          }
          break;

        default:
          break;
      }
    };

    // ========================================
    // Keyboard Up Events
    // ========================================

    const handleKeyUp = ({ key }) => {
      switch (key) {
        case "ArrowLeft":
          keys.current.left.pressed = false;
          break;

        case "ArrowRight":
          keys.current.right.pressed = false;
          break;

        default:
          break;
      }
    };

    // ========================================
    // Event Listeners
    // ========================================

    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("keyup", handleKeyUp);

    // ========================================
    // Load Assets Then Start Game
    // ========================================

    const allImages = [
      platformImg,
      platformSmallTallImg,
      spriteRunLeft,
      spriteRunRight,
      spriteStandLeft,
      spriteStandRight,
      backgroundImg,
      hillsImg,
      enemyImg,
    ];

    let loadedCount = 0;

    allImages.forEach((img) => {
      img.onload = () => {
        loadedCount++;

        if (loadedCount === allImages.length) {
          init();

          animate();
        }
      };
    });

    // ========================================
    // Cleanup
    // ========================================

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener("keydown", handleKeyDown);

      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // ========================================
  // Hook Export
  // ========================================
};

export default useGameEngine;
