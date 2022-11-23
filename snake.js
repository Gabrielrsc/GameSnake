var canvas = document.getElementById('snakeGame')
var context = canvas.getContext('2d')
var pontuacao = document.getElementById('pontuacao')

var play = document.getElementById('play')
var fruta = document.getElementById('fruta')

var frutaX, frutaY

var cauda
var totalCauda
var snakeCabecaX, snakeCabecaY
var direcao, direcaoVar, direcaoAnterior
var velociade = 1,
  xVelociade,
  yVelociade

var jogando, jogoIniciado

const escala = 20
var linhas = canvas.height / escala

var min = escala / 10 // para a coordenada mínima da fruta
var max = linhas - min // Para o maximo

var gameIntervalo //intervalo após o qual a tela será atualizada
var DuracaoIntervalo = 150
var minimaDuracao = 75
var cabecaDir

var cauda0

play.addEventListener('click', startGame)

function reset() {
  clearInterval(gameIntervalo)

  DuracaoIntervalo = 150
  minimaDuracao = 75
  cauda = []
  totalCauda = 0
  direcaoVar = 'Right'
  direcao = 'Right'
  direcaoAnterior = 'Right'
  xVelociade = escala * velociade
  yVelociade = 0
  snakeCabecaX = 0
  snakeCabecaY = 0
  jogando = false
  jogoIniciado = false
}

function startGame() {
  reset()
  jogoIniciado = true
  jogando = true
  posicaoFruta()
  principal()
}

//EventListener para verifivar qual tecla de seta foi pressinada
window.addEventListener('keydown', teclaPressionada)

function teclaPressionada(evento) {
  if (evento.keyCode === 32 && jogoIniciado) {
    if (jogando) {
      pauseGame()
    } else {
      resumeGame()
    }
  } else {
    direcaoAnterior = direcao
    direcaoVar = evento.key.replace('Arrow', '')
    mudeDirecao()
  }
}

// muda a direção da cobra com base na tecla de seta pressionada
function mudeDirecao() {
  switch (direcaoVar) {
    case 'Up':
      //mover "para cima" somente quando a direção anterior não for "para baixo"
      if (direcaoAnterior !== 'Down') {
        direcao = direcaoVar
        xVelociade = 0
        yVelociade = escala * -velociade
      }
      break

    case 'Down':
      //mover "para baixo" somente quando a direção anterior não for "para cima"
      if (direcaoAnterior !== 'Up') {
        direcao = direcaoVar
        xVelociade = 0
        yVelociade = escala * velociade
      }
      break

    case 'Left':
      ////move "esquerda" somente quando a direção anterior não é "direita"
      if (direcaoAnterior !== 'Right') {
        direcao = direcaoVar
        xVelociade = escala * -velociade
        yVelociade = 0
      }
      break

    case 'Right':
      //move "direita" somente quando a direção anterior não é "esquerda"
      if (direcaoAnterior !== 'Left') {
        direcao = direcaoVar
        xVelociade = escala * velociade
        yVelociade = 0
      }
      break
  }
}

//-------------------------------- SNAKE ------------------------------------//

function DesenhandoSnakeCabeca() {
  if (direcao === 'Up') {
    context.drawImage(cabecaUp, snakeCabecaX, snakeCabecaY, escala, escala)
  } else if (direcao === 'Down') {
    context.drawImage(cabecaDown, snakeCabecaX, snakeCabecaY, escala, escala)
  } else if (direcao === 'Left') {
    context.drawImage(cabecaLeft, snakeCabecaX, snakeCabecaY, escala, escala)
  } else {
    context.drawImage(cabecaRight, snakeCabecaX, snakeCabecaY, escala, escala)
  }
}

function desenhandoRabo() {
  //let raiodaCauda = escala / 4
  for (i = 0; i < cauda.length; i++) {
    if (direcao === 'Up' || direcao === 'Down') {
      context.drawImage(rabo, cauda[i].caudaX, cauda[i].caudaY, escala, escala)
    } else {
      context.drawImage(
        raboLateral,
        cauda[i].caudaX,
        cauda[i].caudaY,
        escala,
        escala
      )
    }
  }
}

//Muda a posição anterior da cobra para a proxima
function moverSnakeParaFrente() {
  cauda0 = cauda[0]

  for (let i = 0; i < cauda.length - 1; i++) {
    cauda[i] = cauda[i + 1]
  }
  cauda[totalCauda - 0] = {
    caudaX: snakeCabecaX,
    caudaY: snakeCabecaY
  }
  snakeCabecaX += xVelociade
  snakeCabecaY += yVelociade
}

//somente em caso de colisão de limite
function moverSnakeParaTras() {
  context.clearRect(0, 0, 790, 460)
  for (let i = cauda.length - 1; i >= 1; i--) {
    cauda[i] = cauda[i - 1]
  }
  if (cauda.length >= 1) {
    cauda[0] = { caudaX: cauda0.caudaX, caudaY: cauda0.caudaY }
  }
  snakeCabecaX -= xVelociade
  snakeCabecaY -= yVelociade
  desenhandoRabo()
  DesenhandoFruta()
}

function DenhandoSnake() {
  DesenhandoSnakeCabeca()
  desenhandoRabo()
}

//---------------- Coordenadas Aleatória para fruta ou virus -----------------//

function gerarCoordenadas() {
  let xCoordenada = Math.floor(Math.random() * (max - min) + min) * escala
  let yCoordenada = Math.floor(Math.random() * (max - min) + min) * escala

  return { xCoordenada, yCoordenada }
}

//-------------------------------- FRUTA ------------------------------------//

//Gera um posição de fruta aleatoria dentro dos limites da tela

function posicaoFruta() {
  let fruta = gerarCoordenadas()
  frutaX = fruta.xCoordenada
  frutaY = fruta.yCoordenada
}

//Desenhando a Imagem da Fruta

function DesenhandoFruta() {
  context.drawImage(fruta, frutaX, frutaY, escala, escala)
}

// Função Principal

function verficarmesmaPosicao() {
  if (frutaX && frutaY) {
    for (let i = 0; i < cauda.length; i++) {
      if (frutaX === cauda[i].caudaX && frutaY === cauda[i].caudaY) {
        posicaoFruta()
        break
      }
    }
  }
}

function principal() {
  // Atualizar o estado no intervalo especifico

  gameIntervalo = window.setInterval(() => {
    context.clearRect(0, 0, 790, 460)
    verficarmesmaPosicao()
    DesenhandoFruta()
    moverSnakeParaFrente()
    DenhandoSnake()

    //verifica se a cobra come a fruta - aumenta o tamanho da cauda, atualiza a pontuação e encontra a nova posição da fruta

    if (snakeCabecaX === frutaX && snakeCabecaY === frutaY) {
      totalCauda++

      //aumenta a velocidade do jogo a cada 20 pontos
      if (totalCauda % 20 == 0 && DuracaoIntervalo > minimaDuracao) {
        clearInterval(gameIntervalo)
        DuracaoIntervalo = DuracaoIntervalo - 10
        principal()
      }
      posicaoFruta()
    }
    pontuacao.innerText = totalCauda
  }, DuracaoIntervalo)
}
