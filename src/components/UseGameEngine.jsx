import { useEffect, useRef } from "react";
import Player from "./Player";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Coin from "./Coin";
import GenericObject from "./GenericObject";

const useGameEngine = (
  canvasRef,
  { gameState, onCoinCollect, onEnemyKill, onPlayerDeath, onWin, onCoinReset },
) => {
  const gravity = 0.5;
  const scrollOffset = useRef(0);
  const lastKey = useRef("");

  // Object References
  const playerRef = useRef(null);
  const platformsRef = useRef([]);
  const genericObjectsRef = useRef([]);
  const coinsRef = useRef([]);
  const enemiesRef = useRef([]);

  const keys = useRef({
    right: { pressed: false },
    left: { pressed: false },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 576;

    // Assets Reference
    function createImage(imageSrc) {
      const image = new Image();
      image.src = imageSrc;
      return image;
    }
    const platformImg = createImage("./imgs/platform.png");
    const platformSmallTallImg = createImage("./imgs/platformSmallTall.png");
    const spriteRunLeft = createImage("./imgs/spriteRunLeft.png");
    const spriteRunRight = createImage("./imgs/spriteRunRight.png");
    const spriteStandLeft = createImage("./imgs/spriteStandLeft.png");
    const spriteStandRight = createImage("./imgs/spriteStandRight.png");
    const backgroundImg = createImage("./imgs/background.png");
    const hillsImg = createImage("./imgs/hills.png");
    const enemyImg = createImage("./imgs/enemy.png");
    function init() {
      scrollOffset.current = 0;
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
      genericObjectsRef.current = [
        new GenericObject({ x: -1, y: -1, image: backgroundImg }),
        new GenericObject({ x: 0, y: 0, image: hillsImg }),
      ];

      // --- Inside init() ---
      platformsRef.current = [
        // 1. Starting Area
        new Platform(-1, 470, platformImg),
        new Platform(platformImg.width - 3, 470, platformImg),

        // 2. The First Challenge: Tiny Floating Boxes
        new Platform(
          platformImg.width * 2 + 100,
          350,
          platformSmallTallImg,
          60,
          60,
        ),
        new Platform(
          platformImg.width * 2 + 400,
          250,
          platformSmallTallImg,
          60,
          60,
        ),
        new Platform(
          platformImg.width * 2 + 700,
          150,
          platformSmallTallImg,
          60,
          60,
        ),

        // 3. Middle Recovery Ground
        new Platform(platformImg.width * 3 + 200, 470, platformImg),

        // 4. Second Challenge: High Precision Staggered Boxes
        new Platform(
          platformImg.width * 4 + 100,
          300,
          platformSmallTallImg,
          50,
          50,
        ),
        new Platform(
          platformImg.width * 4 + 350,
          300,
          platformSmallTallImg,
          50,
          50,
        ),
        new Platform(
          platformImg.width * 4 + 600,
          200,
          platformSmallTallImg,
          50,
          50,
        ),

        // 5. Final Ground Stretch
        new Platform(platformImg.width * 5 + 300, 470, platformImg),
        new Platform(platformImg.width * 6 + 297, 470, platformImg),
        new Platform(platformImg.width * 7 + 500, 470, platformImg), // Goal is near here
      ];
      // Adjust coins to be on top of the new boxes
      const generatedCoins = [];
      platformsRef.current.forEach((platform) => {
        // 50% chance to put a coin on a platform
        if (Math.random() > 0.3) {
          generatedCoins.push(
            new Coin({
              x: platform.position.x + platform.width / 4,
              y: platform.position.y - 40,
            }),
          );
        }
      });
      coinsRef.current = generatedCoins;
      enemiesRef.current = [
        new Enemy({ x: 600, y: 420, image: enemyImg, distance: 300 }),
        new Enemy({
          x: platformImg.width * 4 + 300,
          y: 420,
          image: enemyImg,
          distance: 200,
        }),
        new Enemy({
          x: platformImg.width * 6,
          y: 420,
          image: enemyImg,
          distance: 400,
        }),
      ];
    }
    let animationId;
    let then = Date.now();
    let interval = 1000 / 60;
    const animate = () => {
      if (gameState !== "playing") return;

      animationId = requestAnimationFrame(animate);
      let now = Date.now();
      let delta = now - then;

      if (delta > interval) {
        then = now - (delta % interval);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear frame

        // 1. Draw World
        genericObjectsRef.current.forEach((obj) => obj.draw(ctx));
        platformsRef.current.forEach((p) => p.draw(ctx));

        const player = playerRef.current;

        // 2. Coin Collection Logic
        coinsRef.current = coinsRef.current.filter((coin) => {
          const isCollected =
            player.position.x < coin.position.x + coin.size &&
            player.position.x + player.width > coin.position.x &&
            player.position.y < coin.position.y + coin.size &&
            player.position.y + player.height > coin.position.y;

          if (isCollected) {
            onCoinCollect(1); // ✅ Use passed function
            return false;
          }
          coin.draw(ctx);
          return true;
        });

        player.update(ctx, canvas, gravity);
        // 3. Player Movement & Scrolling
        player.velocity.x = 0;
        if (keys.current.right.pressed && player.position.x < 400) {
          player.velocity.x = player.speed;
        } else if (
          (keys.current.left.pressed && player.position.x > 100) ||
          (keys.current.left.pressed &&
            scrollOffset.current === 0 &&
            player.position.x > 0)
        ) {
          player.velocity.x = -player.speed;
        } else {
          // Horizontal Scrolling logic
          if (keys.current.right.pressed) {
            scrollOffset.current += player.speed;
            platformsRef.current.forEach((p) => (p.position.x -= player.speed));
            genericObjectsRef.current.forEach(
              (g) => (g.position.x -= player.speed * 0.66),
            );
            coinsRef.current.forEach((c) => (c.position.x -= player.speed));
            enemiesRef.current.forEach((e) => {
              e.position.x -= player.speed;
              e.startX -= player.speed;
            });
          } else if (keys.current.left.pressed && scrollOffset.current > 0) {
            scrollOffset.current -= player.speed;
            platformsRef.current.forEach((p) => (p.position.x += player.speed));
            genericObjectsRef.current.forEach(
              (g) => (g.position.x += player.speed * 0.66),
            );
            coinsRef.current.forEach((c) => (c.position.x += player.speed));
            enemiesRef.current.forEach((e) => {
              e.position.x += player.speed;
              e.startX += player.speed;
            });
          }
        }

        // 4. Platform Collision
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

        // 5. Enemy Interaction Logic
        enemiesRef.current = enemiesRef.current.filter((enemy) => {
          enemy.update(ctx);

          const isColliding =
            player.position.x < enemy.position.x + enemy.width &&
            player.position.x + player.width > enemy.position.x &&
            player.position.y < enemy.position.y + enemy.height &&
            player.position.y + player.height > enemy.position.y;

          if (isColliding) {
            // Stomp Enemy
            if (
              player.position.y + player.height <= enemy.position.y + 10 &&
              player.velocity.y > 0
            ) {
              onEnemyKill(50); // ✅ Use passed function
              player.velocity.y = -10;
              return false;
            } else {
              // Player hit
              onPlayerDeath(); // ✅ Use passed function
              init(); // Reset positions
            }
          }
          return true;
        });

        // 6. Sprite Animation State
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

        // 7. Win/Fall Condition
        if (scrollOffset.current > 4500) onWin(); // ✅ Use passed function

        if (player.position.y > canvas.height) {
          player.position.y = -100; // Prevent the double-heart loss bug

          onPlayerDeath(); // ✅ Use passed function
          init(); // Reset positions
        }
      }
    };
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
          if (playerRef.current.velocity.y === 0)
            playerRef.current.velocity.y = -15;
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

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

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);
};

export default useGameEngine;
