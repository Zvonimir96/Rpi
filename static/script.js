const WIDTH = 1024;
const HEIGHT = 800;

const SCALE = 3.5;
const CIRCLE_SIZE = 3.5;
const MIDDLE_X = WIDTH / 2;
const MIDDLE_Y = HEIGHT / 2;

const LIGHTNESS = 0.5;

let ctx;

function setContext(context) {
  ctx = context;
}

function drawColorWheel() {
    if (!ctx)
        throw new Error("Context not found, please call setContext().");

    let width = WIDTH;
    let height = HEIGHT;

    if (window.innerWidth <= WIDTH)
        width = window.innerWidth;

    if (window.innerHeight <= HEIGHT)
        height = window.innerHeight;

  for (let h = 0; h <= 360; h++) {
    for (let s = 0; s <= 100; s++) {
      ctx.beginPath();
      ctx.fillStyle = `hsl(${h}, ${s}%, ${LIGHTNESS * 100}%)`;

      const posX = MIDDLE_X + Math.cos(degreeToRadian(h)) * s * CIRCLE_SIZE;
      const posY = MIDDLE_Y - Math.sin(degreeToRadian(h)) * s * CIRCLE_SIZE;

      ctx.arc(posX, posY, (CIRCLE_SIZE * s) / 100 + 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  drawColorWheelBorder();
}

function drawColorWheelBorder() {
    ctx.beginPath();

    let width = WIDTH;
    let height = HEIGHT;

    if (window.innerWidth <= WIDTH)
        width = window.innerWidth;

    if (window.innerHeight <= HEIGHT)
        height = window.innerHeight;

    ctx.strokeStyle = "#fefefe";
    ctx.lineWidth = 10;

    ctx.arc(width/2, height/2, 100 * CIRCLE_SIZE + 5, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawPickedColor(x, y) {
  if (!ctx)
    throw new Error("Context not found, please call setContext().");

  //ctx.clearRect(10, 10, 200, 210);
  //const color = getColorForPoint(x, y);
  //ctx.fillStyle = `hsl(${color.h}, ${color.s * 100}%, ${color.l * 100}%)`;
  //ctx.fillRect(10, 10, 200, 160);
}

function getColorForPoint(x, y) {
  const dist = getDistanceFromCenter(x, y);

  if (dist > 100 * SCALE) return { h: 0, s: 0, l: 1 };

  const s = dist / SCALE;
  let h = radianToDegree(Math.acos((x - screen.width/2) / s / SCALE));
  if (y > screen.height/2) h = 360 - h;
  return { h, s: s / 100, l: LIGHTNESS };
}

function getDistanceFromCenter(x, y) {
    const offsetX = Math.abs(window.innerWidth - x);
    const offsetY = Math.abs(window.innerHeight - y);

    return Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
}

function hslToRgb({ h, s, l }) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  if (h < 60) return { r: (c + m) * 255, g: (x + m) * 255, b: m * 255 };
  if (h < 120) return { r: (x + m) * 255, g: (c + m) * 255, b: m * 255 };
  if (h < 180) return { r: m * 255, g: (c + m) * 255, b: (x + m) * 255 };
  if (h < 240) return { r: m * 255, g: (x + m) * 255, b: (c + m) * 255 };
  if (h < 300) return { r: (x + m) * 255, g: m * 255, b: (c + m) * 255 };
  return { r: (c + m) * 255, g: m * 255, b: (x + m) * 255 };
}

function rgbToHex({ r, g, b }) {
  let hexR = Math.floor(r).toString(16);
  if (r < 16) hexR = `0${hexR}`;
  let hexG = Math.floor(g).toString(16);
  if (g < 16) hexG = `0${hexG}`;
  let hexB = Math.floor(b).toString(16);
  if (b < 16) hexB = `0${hexB}`;
  return `${hexR}${hexG}${hexB}`.toUpperCase();
}

function degreeToRadian(deg) {
  return (deg * Math.PI) / 180;
}

function radianToDegree(rad) {
  return (rad * 180) / Math.PI;
}

function sendData(x, y){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://192.168.86.211:80");

    let pos = window.innerWidth

    xhr.send(pos);
}
