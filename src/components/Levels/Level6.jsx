import Platform from "../Platform";
import Enemy from "../Enemy";
import Coin from "../Coin";
import GenericObject from "../GenericObject";

const Level6 = ({
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

    new Platform(700, 420, platformImg),

    new Platform(1500, 300, platformSmallTallImg, 60, 60),

    new Platform(1800, 220, platformSmallTallImg, 60, 60),

    new Platform(2200, 420, platformImg),

    new Platform(3000, 250, platformImg),

    new Platform(3900, 150, platformSmallTallImg, 60, 60),

    new Platform(4500, 470, platformImg),

    new Platform(5400, 300, platformImg),

    new Platform(6500, 470, platformImg),
  ];

  const coins = [];

  platforms.forEach((platform) => {
    coins.push(
      new Coin({
        x: platform.position.x + platform.width / 3,
        y: platform.position.y - 40,
      }),
    );
  });

  const enemies = [
    new Enemy({ x: 900, y: 370, image: enemyImg, distance: 250 }),

    new Enemy({ x: 2500, y: 370, image: enemyImg, distance: 300 }),

    new Enemy({ x: 4700, y: 420, image: enemyImg, distance: 350 }),
  ];

  return {
    genericObjects,
    platforms,
    coins,
    enemies,
    winOffset: 8500,
  };
};

export default Level6;
