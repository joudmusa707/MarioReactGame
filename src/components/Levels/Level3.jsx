//
import Platform from "../Platform";
import Enemy from "../Enemy";
import Coin from "../Coin";
import GenericObject from "../GenericObject";

const Level3 = ({
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

    new Platform(600, 400, platformSmallTallImg, 70, 70),

    new Platform(850, 300, platformSmallTallImg, 70, 70),

    new Platform(1100, 200, platformSmallTallImg, 70, 70),

    new Platform(1400, 300, platformSmallTallImg, 70, 70),

    new Platform(1700, 420, platformImg),
    new Platform(2300, 350, platformImg),

    new Platform(3000, 250, platformImg),

    new Platform(3800, 470, platformImg),

    new Platform(4100, 470, platformImg),

    new Platform(4700, 470, platformImg),
  ];

  const coins = [];

  platforms.forEach((platform) => {
    coins.push(
      new Coin({
        x: platform.position.x + 40,
        y: platform.position.y - 40,
      }),
    );
  });

  const enemies = [
    new Enemy({
      x: 2400,
      y: 350 - 50,
      image: enemyImg,
      distance: 200,
    }),
  ];

  return {
    genericObjects,
    platforms,
    coins,
    enemies,
    winOffset: 4600,
  };
};

export default Level3;
