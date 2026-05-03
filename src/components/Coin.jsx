class Coin {
  constructor({ x, y, size = 30 }) {
    this.position = { x, y };
    this.size = size;
    this.angle = Math.random() * Math.PI;
    this.spinSpeed = 0.1;
  }
  draw(ctx) {
    this.angle += this.spinSpeed;
    const spinWidth = Math.cos(this.angle) * this.size;
    ctx.save();
    ctx.translate(
      this.position.x + this.size / 2,
      this.position.y + this.size / 2,
    );
    ctx.beginPath();
    ctx.ellipse(
      2,
      0,
      Math.abs(spinWidth) / 2,
      this.size / 2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "#b8860b";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      Math.abs(spinWidth) / 2,
      this.size / 2,
      0,
      0,
      Math.PI * 2,
    );
    const gradient = ctx.createLinearGradient(
      -this.size / 2,
      -this.size / 2,
      this.size / 2,
      this.size / 2,
    );
    gradient.addColorStop(0, "#ffd700");
    gradient.addColorStop(0.5, "#ffface");
    gradient.addColorStop(1, "#daa520");
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }
}
export default Coin;
