class Platform {
  constructor(x, y, image, customWidth, customHeight) {
    this.position = { x, y };
    this.image = image;
    // Use custom dimensions if provided, otherwise use image defaults
    this.width = customWidth || image.width || 580;
    this.height = customHeight || image.height || 125;
  }

  draw(ctx) {
    // We add the width and height arguments to ctx.drawImage
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    );
  }
}
export default Platform;
