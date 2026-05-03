class Enemy {
  constructor({ x, y, distance = 200, image }) {
    this.position = { x, y };
    this.velocity = { x: 2, y: 0 };
    this.width = 50;
    this.height = 50;
    this.startX = x;
    this.distance = distance;
    this.image = image;
  }

  draw(ctx) {
    // Canvas will naturally respect PNG transparency
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    );
  }

  update(ctx) {
    this.position.x += this.velocity.x;

    // Patrol logic: startX moves with the world scroll in the animate loop
    if (
      this.position.x > this.startX + this.distance ||
      this.position.x < this.startX
    ) {
      this.velocity.x = -this.velocity.x;
    }
    this.draw(ctx);
  }
}
export default Enemy;
