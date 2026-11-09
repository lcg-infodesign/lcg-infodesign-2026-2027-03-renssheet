let xMax = 1000;
let yMax = 850;

let table;
let bckgcolor = "#f0ccef"; 
const STATS = ['PWR', 'SPD', 'RNG', 'PER', 'PRC', 'DEV'];
const RANKS = { 'E': 1, 'D': 2, 'C': 3, 'B': 4, 'A': 5 };

const glyphSize = 70;
const cols = 6;

let dataset = [];
let totalStands = 0;

function isValidStand(row) {
  let power = row.get('PWR');
  return power && power !== '';
}

// Caricamento con preload come nel primo codice
function preload() {
  table = loadTable('jojo-stands.csv', 'csv', 'header');
}

function setup() {
  createCanvas(xMax, yMax);
  angleMode(DEGREES);
  frameRate(30);

  if (table) {
    let rows = table.getRows();
    for (let i = 0; i < rows.length; i++) {
      let rowObj = rows[i].obj;
      if (isValidStand(rows[i])) {
        dataset.push(rowObj);
      }
    }
  }

  totalStands = dataset.length;
}

function draw() {
  background(bckgcolor);

  // Titolo
  textAlign(CENTER, TOP);
  fill("#6b0968");
  noStroke();
  textSize(18);
  textStyle(BOLD);
  text("Statistiche stand di Jojo's Bizzare Adventures Stardust Crusaders", width / 2, 15);

  // Griglia
  let spacingX = 140;
  let spacingY = 95;
  let startX = (width - (cols - 1) * spacingX) / 2;
  let startY = 85;

  let hoveredStand = null;

  for (let i = 0; i < dataset.length; i++) {
    let x = startX + (i % cols) * spacingX;
    let y = startY + floor(i / cols) * spacingY;
    let isHovered = dist(mouseX, mouseY, x, y) < glyphSize / 2;

    if (isHovered) hoveredStand = dataset[i];

    push();
    translate(x, y);
    if (isHovered) {
      fill("#e796f4");
      noStroke();
      ellipse(0, 0, glyphSize + 10);
    }
    drawGlyph(dataset[i], glyphSize / 2, isHovered);
    pop();
  }
 if (hoveredStand) {
    drawTooltip(mouseX, mouseY, hoveredStand);
  }

  // Legenda
  drawLegend(width / 2, 695);


}
function drawGlyph(data, rMax, isHovered) {
  drawBaseCircle(rMax, color("#b659c4"));

  beginShape();
  if (isHovered) {
    fill("#ca4f4f");
    stroke("#ba1010");
    strokeWeight(2);
  } else {
    fill("#99c4f6");
    stroke("#3862b6");
    strokeWeight(1.5);
  }

  let points = STATS.map((stat, i) => {
    let rank = data[stat];
    let val = (rank && RANKS[rank]) ? RANKS[rank] : 0;
    let r = map(val, 0, 5, 0, rMax);
    let angle = i * 60 - 90;
    let p = { x: cos(angle) * r, y: sin(angle) * r };
    vertex(p.x, p.y);
    return p;
  });
  endShape(CLOSE);

  fill(40);
  noStroke();
  points.forEach(p => ellipse(p.x, p.y, 4));

  textAlign(CENTER, TOP);
  textSize(9);
  textStyle(BOLD);
  text(data.Stand, 0, rMax + 5);
}

function drawLegend(x, y) {
  push();
  translate(x, y);
  let rMax = 50;

  textAlign(CENTER, TOP);
  textSize(11);
  textStyle(BOLD);
  fill("#6b0968");
  noStroke();
  text("Legenda delle Statistiche (Gradi da E ad A)", 0, -rMax - 38);

  drawBaseCircle(rMax, color(0), 1.5);

  stroke(0);
  strokeWeight(1);
  for (let step = 1; step <= 5; step++) {
    let ty = -map(step, 0, 5, 0, rMax);
    line(-3, ty, 3, ty);
  }

  noStroke();
  fill(0);
  textSize(5.5);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  ['E', 'D', 'C', 'B', 'A'].forEach((rank, idx) => {
    let ty = -map(idx + 1, 0, 5, 0, rMax + 2) + 3.5;
    text(rank, 7, ty);
  });

  textSize(9);
  let labels = [
    { name: 'POWER', x: 0, y: -rMax - 18 },
    { name: 'SPEED', x: 75, y: -30 },
    { name: 'RANGE', x: 75, y: 30 },
    { name: 'DEVELOPMENT', x: 0, y: rMax + 18 },
    { name: 'PRECISION', x: -80, y: 30 },
    { name: 'PERSISTENCE', x: -80, y: -30 }
  ];

  labels.forEach(l => text(l.name, l.x, l.y));
  pop();
}

function drawBaseCircle(rMax, strokeColor, weight = 1) {
  stroke(strokeColor);
  strokeWeight(weight);
  fill(255);
  ellipse(0, 0, rMax * 2);

  strokeWeight(1);
  for (let i = 0; i < 6; i++) {
    let angle = i * 60 - 90;
    line(0, 0, cos(angle) * rMax, sin(angle) * rMax);
  }
}

function drawInfoPanel() {
  fill("#000000");
  noStroke();
  textSize(14);
  textStyle(NORMAL);
  text(
    "Total Loaded Stands: " + totalStands, 
    30, 
    yMax - 50
  );
}

function drawTooltip(x, y, data) {
  push();
  let w = 150, h = 135;
  let tx = constrain(x + 10, 10, width - w - 10);
  let ty = constrain(y + 10, 10, height - h - 10);

  fill(20, 25, 35, 230);
  noStroke();
  rect(tx, ty, w, h, 6);

  textAlign(CENTER, TOP);
  fill(255);
  textSize(12);
  textStyle(BOLD);
  text(data.Stand, tx + w / 2, ty + 10);

  textSize(10);
  STATS.forEach((stat, i) => {
    let val = data[stat];
    let isRankValid = val && RANKS[val];
    fill(isRankValid ? 220 : 120);
    textStyle(isRankValid ? BOLD : NORMAL);
    text(`${stat} : ${isRankValid ? val : '-'}`, tx + w / 2, ty + 32 + i * 16);
  });
  pop();
}