import Platform from "../Platform";
import Enemy from "../Enemy";
import Coin from "../Coin";
import GenericObject from "../GenericObject";

const Level1 = ({
  platformImg,
  platformSmallTallImg,
  backgroundImg,
  hillsImg,
  enemyImg,
}) => {
  // Backgrounds
  const genericObjects = [
    new GenericObject({ x: -1, y: -1, image: backgroundImg }),
    new GenericObject({ x: 0, y: 0, image: hillsImg }),
  ];

  // Platforms
  const platforms = [
    new Platform(-1, 470, platformImg),
    new Platform(platformImg.width - 3, 470, platformImg),

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

    new Platform(platformImg.width * 3 + 200, 470, platformImg),

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

    new Platform(platformImg.width * 5 + 300, 470, platformImg),
    new Platform(platformImg.width * 6 + 297, 470, platformImg),
    new Platform(platformImg.width * 7 + 500, 470, platformImg),
  ];

  // Coins
  const coins = [];

  platforms.forEach((platform) => {
    if (Math.random() > 0.3) {
      coins.push(
        new Coin({
          x: platform.position.x + platform.width / 4,
          y: platform.position.y - 40,
        }),
      );
    }
  });

  // Enemies
  const enemies = [
    // Enemy on first ground platform
    new Enemy({
      x: 600,
      y: 470 - 50,
      image: enemyImg,
      distance: 300,
    }),

    // Enemy on middle ground platform
    new Enemy({
      x: platformImg.width * 5 + 450,
      y: 470 - 50,
      image: enemyImg,
      distance: 200,
    }),

    // Enemy on final ground platform
    new Enemy({
      x: platformImg.width * 7 + 650,
      y: 470 - 50,
      image: enemyImg,
      distance: 250,
    }),
  ];
  return {
    genericObjects,
    platforms,
    coins,
    enemies,
    winOffset: 4500,
  };
};

export default Level1;
