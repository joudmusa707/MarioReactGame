import Platform from "../Platform";
import Enemy from "../Enemy";
import Coin from "../Coin";
import GenericObject from "../GenericObject";

const Level4 = ({
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

    new Platform(600, 470, platformImg),

    new Platform(1400, 470, platformImg),

    new Platform(2200, 470, platformImg),

    new Platform(3000, 470, platformImg),

    new Platform(3800, 470, platformImg),

    new Platform(4600, 470, platformImg),
  ];

  const coins = [];

  platforms.forEach((platform) => {
    coins.push(
      new Coin({
        x: platform.position.x + 100,
        y: platform.position.y - 40,
      }),
    );
  });

  const enemies = [
    new Enemy({ x: 700, y: 420, image: enemyImg, distance: 250 }),

    new Enemy({ x: 1600, y: 420, image: enemyImg, distance: 250 }),

    new Enemy({ x: 2400, y: 420, image: enemyImg, distance: 250 }),

    new Enemy({ x: 3200, y: 420, image: enemyImg, distance: 250 }),

    new Enemy({ x: 4000, y: 420, image: enemyImg, distance: 250 }),
  ];

  return {
    genericObjects,
    platforms,
    coins,
    enemies,
    winOffset: 4550,
  };
};

export default Level4;
