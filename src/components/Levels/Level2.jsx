import Platform from "../Platform";
import Enemy from "../Enemy";
import Coin from "../Coin";
import GenericObject from "../GenericObject";

const Level2 = ({
  platformImg,
  platformSmallTallImg,
  backgroundImg,
  hillsImg,
  enemyImg,
}) => {
  const genericObjects = [
    new GenericObject({ x: -1, y: -1, image: backgroundImg }),
    new GenericObject({ x: 0, y: 0, image: hillsImg }),
  ];

  const platforms = [
    new Platform(-1, 470, platformImg),

    new Platform(platformImg.width + 100, 470, platformImg),

    new Platform(platformImg.width * 2 + 350, 420, platformImg),

    new Platform(platformImg.width * 3 + 700, 350, platformImg),

    new Platform(platformImg.width * 4 + 1000, 470, platformImg),

    new Platform(
      platformImg.width * 5 + 1200,
      300,
      platformSmallTallImg,
      80,
      80,
    ),

    new Platform(
      platformImg.width * 5 + 1450,
      250,
      platformSmallTallImg,
      80,
      80,
    ),

    new Platform(platformImg.width * 6 + 1400, 350, platformImg),
  ];

  const coins = [];

  platforms.forEach((platform) => {
    coins.push(
      new Coin({
        x: platform.position.x + platform.width / 3,
        y: platform.position.y - 50,
      }),
    );
  });

  const enemies = [
    new Enemy({
      x: 1800,
      y: 420,
      image: enemyImg,
      distance: 300,
    }),
  ];

  return {
    genericObjects,
    platforms,
    coins,
    enemies,
    winOffset: 5000,
  };
};

export default Level2;
