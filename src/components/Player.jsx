class Player {
  constructor(sprites, canvas, gravity) {
    this.position = { x: 50, y: 100 };
    this.velocity = { x: 0, y: 0 };
    this.width = 66;
    this.height = 150;
    this.speed = 5;
    this.frames = 0;
    this.sprites = sprites;
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  draw(ctx) {
    // FIX: Added safety guard to prevent 'broken' state error
    if (
      this.currentSprite &&
      this.currentSprite.complete &&
      this.currentSprite.naturalWidth !== 0
    ) {
      ctx.drawImage(
        this.currentSprite,
        this.currentCropWidth * this.frames,
        0,
        this.currentCropWidth,
        400,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
      );
    }
  }

  update(ctx, canvas, gravity) {
    this.frames++;
    const isStanding =
      this.currentSprite === this.sprites.stand.right ||
      this.currentSprite === this.sprites.stand.left;
    if (isStanding && this.frames > 59) this.frames = 0;
    else if (!isStanding && this.frames > 29) this.frames = 0;

    this.draw(ctx);
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}
export default Player;
