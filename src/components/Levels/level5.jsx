import Platform from "../Platform";
import Enemy from "../Enemy";
import Coin from "../Coin";
import GenericObject from "../GenericObject";

const Level5 = ({
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

    new Platform(700, 350, platformSmallTallImg, 45, 45),

    new Platform(950, 250, platformSmallTallImg, 45, 45),

    new Platform(1200, 180, platformSmallTallImg, 45, 45),

    new Platform(1500, 250, platformSmallTallImg, 45, 45),

    new Platform(1800, 350, platformSmallTallImg, 45, 45),

    new Platform(2200, 470, platformImg),

    new Platform(3000, 300, platformImg),

    new Platform(3800, 470, platformImg),
  ];

  const coins = [];

  platforms.forEach((platform) => {
    coins.push(
      new Coin({
        x: platform.position.x + 10,
        y: platform.position.y - 35,
      }),
    );
  });

  const enemies = [
    new Enemy({
      x: 3200,
      y: 250,
      image: enemyImg,
      distance: 150,
    }),
  ];

  return {
    genericObjects,
    platforms,
    coins,
    enemies,
    winOffset: 3750,
  };
};

export default Level5;
