const app = new PIXI.Application();
document.body.appendChild(app.view);

const starTexture = PIXI.Texture.from('./star.png');

const starAmount = 300;
let cameraZ = 0;
const fov = 20;
const baseSpeed = 0.3;
let speed = 0;
let warpSpeed = 0;
const starStretch = 0.01;
const starBaseSize = 0.01;

const stars = [];
for (let i = 0; i < starAmount; i++) {
  const star = {
    sprite: new PIXI.Sprite(starTexture),
    z: 0,
    x: 0,
    y: 0,
  };
  star.sprite.anchor.x = 0.5;
  star.sprite.anchor.y = 0.7;
  randomizeStar(star, true);
  app.stage.addChild(star.sprite);
  stars.push(star);
}

function randomizeStar(star, initial) {
  star.z = initial
    ? Math.random() * 2000
    : cameraZ + Math.random() * 1000 + 2000;

  const deg = Math.random() * Math.PI * 2;
  const distance = Math.random() * 50 + 1;
  star.x = Math.cos(deg) * distance;
  star.y = Math.sin(deg) * distance;
}

app.ticker.add((delta) => {
  speed += (warpSpeed - speed) / 20;
  cameraZ += delta * 10 * (speed + baseSpeed);
  for (let i = 0; i < starAmount; i++) {
    const star = stars[i];
    if (star.z < cameraZ) randomizeStar(star);

    const z = star.z - cameraZ;
    star.sprite.x =
      star.x * (fov / z) * app.renderer.screen.width +
      app.renderer.screen.width / 2;
    star.sprite.y =
      star.y * (fov / z) * app.renderer.screen.width +
      app.renderer.screen.height / 2;

    const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
    const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
    const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
    const distanceScale = Math.max(0, (2000 - z) / 2000);
    star.sprite.scale.x = distanceScale * starBaseSize;

    star.sprite.scale.y =
      distanceScale * starBaseSize +
      (distanceScale * speed * starStretch * distanceCenter) /
        app.renderer.screen.width;
    star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
  }

  const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
  });

  const richText = new PIXI.Text('Bob the Space-Jammer', style);
  richText.x = 200;
  richText.y = 50;

  app.stage.addChild(richText);

  const textureButton = PIXI.Texture.from('playbutton.png');

  const button = new PIXI.Sprite(textureButton);

  button.x = 300;
  button.y = 150;
  button.scale.x = 0.5;
  button.scale.y = 0.5;

  app.stage.addChild(button);

  function onButtonDown() {
    this.isdown = true;
    this.texture = textureButtonDown;
    this.alpha = 1;
  }
});
