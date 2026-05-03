class GenericObject {
  constructor({ x, y, image }) {
    this.position = { x, y };
    this.image = image;
  }
  draw(ctx) {
    if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
      ctx.drawImage(this.image, this.position.x, this.position.y);
    }
  }
}
export default GenericObject;
