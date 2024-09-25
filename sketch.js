// The snake moves along a grid, one space at a time
let gridWidth = 30;
let gridHeight = 30;

let gameStarted = false;
let startingSegments = 6; // Inicia com 6 segmentos
let xStart = 0;
let yStart = 15;
let startDirection = 'right';
let direction = startDirection;
let segments = [];
let segmentSize = 1.5; // Aumentar o tamanho do segmento
let imagem; 
let score = 0;
let highScore;
let fruit;

function preload() {
  imagem = loadImage('imagens/foto_khalil.png', img => {
    console.log('Imagem carregada com sucesso!');
  }, err => {
    console.error('Erro ao carregar a imagem:', err);
  });
}

function setup() {
  // Define uma proporção para a grid
  let gridRows = 30; // Número de linhas
  let gridCols = 30; // Número de colunas
  
  // Cria o canvas com base na largura e altura da janela
  createCanvas(windowWidth, windowHeight);
  
  // Define a escala com base na largura e altura do canvas
  scale(width / gridCols, height / gridRows);
  
  frameRate(10);
  textAlign(CENTER, CENTER);
  textSize(2);
  highScore = getItem('Maior recorde');
  describe('Um jeito novo de jogar o jogo da cobrinha');
}

// Para garantir que o canvas seja ajustado ao redimensionar a janela
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Se necessário, redefina a escala aqui
  scale(width / gridCols, height / gridRows);
}


function draw() {
  background(0);
  scale(width / gridWidth, height / gridHeight);
  if (gameStarted === false) {
    showStartScreen();
  } else {
    translate(0.5, 0.5);
    showFruit();
    showSegments();
    updateSegments();
    checkForCollision();
    checkForFruit();
  }
}

function showStartScreen() {
  noStroke();
  fill(32);
  rect(2, gridHeight / 2 - 5, gridWidth - 4, 10, 2);
  fill(255);
  text('Clique para jogar.\nUse as teclas para se mover.', gridWidth / 2, gridHeight / 2);
  noLoop();
}

function mousePressed() {
  if (gameStarted === false) {
    startGame();
  }
}

function startGame() {
  updateFruitCoordinates();
  segments = [];
  for (let x = xStart; x < xStart + startingSegments; x += 1) {
    let segmentPosition = createVector(x, yStart);
    segments.unshift(segmentPosition);
  }
  direction = startDirection;
  score = 0;
  gameStarted = true;
  loop();
}

function showFruit() {
  fill("green"); // Cor da fruta
  noStroke();
  ellipse(fruit.x, fruit.y, segmentSize, segmentSize); // Fruta como círculo
}

function showSegments() {
  // Desenha os segmentos da cobrinha como círculos
  for (let i = 0; i < segments.length; i++) {
    let x = segments[i].x;
    let y = segments[i].y;

    // Define a cor do corpo
    fill(i === 0 ? 'yellow' : 'red'); // Cabeça em aqua, corpo em verde
    noStroke(); // Remove o contorno para um efeito mais suave
    ellipse(x, y, segmentSize, segmentSize); // Segmento como círculo
  }

  // Desenha a imagem da cabeça centralizada
  if (segments.length > 0) {
    let imgSize = segmentSize; // Tamanho da imagem
    let x = segments[0].x;
    let y = segments[0].y;
    image(imagem, x - imgSize / 2, y - imgSize / 2, imgSize, imgSize); // Cabeça centralizada
  }
}


function updateSegments() {
  segments.pop();
  let head = segments[0].copy();
  segments.unshift(head);

  switch (direction) {
    case 'right':
      head.x += 1;
      break;
    case 'up':
      head.y -= 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
  }
}

function checkForCollision() {
  let head = segments[0];
  if (head.x >= gridWidth || head.x < 0 || head.y >= gridHeight || head.y < 0 || selfColliding() === true) {
    gameOver();
  }
}

function gameOver() {
  noStroke();
  fill(32);
  rect(2, gridHeight / 2 - 5, gridWidth - 4, 12, 2);
  fill(255);
  highScore = max(score, highScore);
  storeItem('Maior recorde', highScore);
  text(`Game over! FIM :/\nSua pontuação: ${score}\nMaior recorde: ${highScore}\nClique para tentar de novo.`, gridWidth / 2, gridHeight / 2);
  gameStarted = false;
  noLoop();
}

function selfColliding() {
  let head = segments[0];
  let segmentsAfterHead = segments.slice(1);
  for (let segment of segmentsAfterHead) {
    if (segment.equals(head) === true) {
      return true;
    }
  }
  return false;
}

function checkForFruit() {
  let head = segments[0];
  if (head.equals(fruit) === true) {
    score += 1;
    let tail = segments[segments.length - 1];
    let newSegment = tail.copy();
    segments.push(newSegment);
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  let x = floor(random(gridWidth));
  let y = floor(random(gridHeight));
  fruit = createVector(x, y);
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      if (direction !== 'right') direction = 'left';
      break;
    case RIGHT_ARROW:
      if (direction !== 'left') direction = 'right';
      break;
    case UP_ARROW:
      if (direction !== 'down') direction = 'up';
      break;
    case DOWN_ARROW:
      if (direction !== 'up') direction = 'down';
      break;
  }
}
