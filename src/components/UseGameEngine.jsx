// ============================================================================
// Imports
// ============================================================================
import { useEffect, useRef } from "react";
import Player from "./Player";

// ============================================================================
// Levels Collection
// ============================================================================
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

// ============================================================================
// Helper: Image Asset Creator
// ============================================================================
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

// ============================================================================
// Pre-load Static Assets (Prevents Re-loading & Garbage Collection Lag)
// ============================================================================
const assets = {
  platformImg: createImage("./imgs/platform.png"),
  platformSmallTallImg: createImage("./imgs/platformSmallTall.png"),
  spriteRunLeft: createImage("./imgs/spriteRunLeft.png"),
  spriteRunRight: createImage("./imgs/spriteRunRight.png"),
  spriteStandLeft: createImage("./imgs/spriteStandLeft.png"),
  spriteStandRight: createImage("./imgs/spriteStandRight.png"),
  backgroundImg: createImage("./imgs/background.png"),
  hillsImg: createImage("./imgs/hills.png"),
  enemyImg: createImage("./imgs/enemy.png"),
};

// ============================================================================
// Game Engine Hook
// ============================================================================
const useGameEngine = (
  canvasRef,
  { gameState, currentLevel, onCoinCollect, onEnemyKill, onPlayerDeath, onWin },
) => {
  // Constants & Physics
  const gravity = 0.5;

  // Tracking Engine References
  const scrollOffset = useRef(0);
  const lastKey = useRef("");
  const playerRef = useRef(null);
  const currentLevelRef = useRef(null);
  const levelIndexRef = useRef(currentLevel);

  // Entities Tracking Collections
  const platformsRef = useRef([]);
  const genericObjectsRef = useRef([]);
  const coinsRef = useRef([]);
  const enemiesRef = useRef([]);

  // Controller Inputs
  const keys = useRef({
    right: { pressed: false },
    left: { pressed: false },
  });

  // Main Orchestrator Effect
  useEffect(() => {
    levelIndexRef.current = currentLevel;

    // Canvas & Render Context Initialization
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 576;

    let animationId;

    // ------------------------------------------------------------------------
    // Engine State Reset / Level Setup Execution
    // ------------------------------------------------------------------------
    function init() {
      scrollOffset.current = 0;

      // Re-instantiate Player Configuration
      playerRef.current = new Player({
        stand: {
          right: assets.spriteStandRight,
          left: assets.spriteStandLeft,
          cropWidth: 177,
          width: 66,
        },
        run: {
          right: assets.spriteRunRight,
          left: assets.spriteRunLeft,
          cropWidth: 341,
          width: 127.875,
        },
      });

      // Build Map Arrays using Pre-loaded Assets
      const createLevelFactory = levels[levelIndexRef.current];
      currentLevelRef.current = createLevelFactory({
        platformImg: assets.platformImg,
        platformSmallTallImg: assets.platformSmallTallImg,
        backgroundImg: assets.backgroundImg,
        hillsImg: assets.hillsImg,
        enemyImg: assets.enemyImg,
      });

      // Distribute Generated Entities to Engine Tracking Registers
      const level = currentLevelRef.current;
      genericObjectsRef.current = level.genericObjects;
      platformsRef.current = level.platforms;
      coinsRef.current = level.coins;
      enemiesRef.current = level.enemies;
    }

    // Initialize the assets inside refs once loop connects
    if (!playerRef.current) {
      init();
    }

    // ------------------------------------------------------------------------
    // Core Frame Animation Loop (ALWAYS RUNS TO PREVENT WHITE SCREEN)
    // ------------------------------------------------------------------------
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Clean viewport before redraw updates
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ALWAYS DRAW: Static / Parallax Layers & Platforms
      genericObjectsRef.current.forEach((obj) => obj.draw(ctx));
      platformsRef.current.forEach((platform) => platform.draw(ctx));

      const player = playerRef.current;

      // ALWAYS DRAW: Coins (Only parse collecting engine rules if playing)
      if (gameState === "playing") {
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
      } else {
        coinsRef.current.forEach((coin) => coin.draw(ctx));
      }

      // ------------------------------------------------------------------------
      // MUTABLE GAMEPLAY LOGIC BLOCK (FROZEN WHEN CARD/MENU SHOWS)
      // ------------------------------------------------------------------------
      if (gameState === "playing") {
        // Engine Physics Tick Update
        player.update(ctx, canvas, gravity);
        player.velocity.x = 0;

        // Local Horizontal Positional Computations
        if (keys.current.right.pressed && player.position.x < 400) {
          player.velocity.x = player.speed;
        } else if (
          (keys.current.left.pressed && player.position.x > 100) ||
          (keys.current.left.pressed &&
            scrollOffset.current === 0 &&
            player.position.x > 0)
        ) {
          player.velocity.x = -player.speed;
        }
        // Camera Platform / Parallax Scroller Interpolations
        else {
          if (keys.current.right.pressed) {
            scrollOffset.current += player.speed;
            platformsRef.current.forEach((p) => {
              p.position.x -= player.speed;
            });
            genericObjectsRef.current.forEach((o) => {
              o.position.x -= player.speed * 0.66;
            });
            coinsRef.current.forEach((c) => {
              c.position.x -= player.speed;
            });
            enemiesRef.current.forEach((e) => {
              e.position.x -= player.speed;
              e.startX -= player.speed;
            });
          } else if (keys.current.left.pressed && scrollOffset.current > 0) {
            scrollOffset.current -= player.speed;
            platformsRef.current.forEach((p) => {
              p.position.x += player.speed;
            });
            genericObjectsRef.current.forEach((o) => {
              o.position.x += player.speed * 0.66;
            });
            coinsRef.current.forEach((c) => {
              c.position.x += player.speed;
            });
            enemiesRef.current.forEach((e) => {
              e.position.x += player.speed;
              e.startX += player.speed;
            });
          }
        }

        // Vertical AABB Solid Collision Checks
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

        // Enemy Logic Processing
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
            if (
              player.position.y + player.height <= enemyHitbox.y + 10 &&
              player.velocity.y > 0
            ) {
              onEnemyKill(50);
              player.velocity.y = -10;
              return false;
            } else {
              onPlayerDeath();
              init();
            }
          }
          return true;
        });

        // Dynamic Sprite Animation Target Selector Updates
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

        // Win Condition Boundary Verification Check
        if (scrollOffset.current > currentLevelRef.current.winOffset) {
          onWin();
          levelIndexRef.current += 1;
          if (levelIndexRef.current >= levels.length) return;
          init();
        }

        // Out of Bounds Pit Death Checks
        if (player.position.y > canvas.height) {
          player.position.y = -100;
          onPlayerDeath();
          init();
        }
      } else {
        // ------------------------------------------------------------------------
        // PAUSED STATE DRAWING (Runs when card menu is visible)
        // ------------------------------------------------------------------------
        player.draw(ctx);
        enemiesRef.current.forEach((enemy) => enemy.draw(ctx));
      }
    };

    // ------------------------------------------------------------------------
    // Peripheral Keyboard Device Listeners
    // ------------------------------------------------------------------------
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
          if (playerRef.current && playerRef.current.velocity.y === 0) {
            playerRef.current.velocity.y = -15;
          }
          break;
        default:
          break;
      }
    };

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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Kicks off the continuous animation loop instantly regardless of state
    animate();

    // Cleanup Events & Animation Flags on Unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, currentLevel]);
};

export default useGameEngine;
