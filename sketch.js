
function preload(){
  boyAnimation=loadAnimation("boy1.png","boy2.png","boy3.png","boy1.png","boy2.png","boy3.png")
  boyStanding = loadAnimation ("boy3.png")
  bg=loadImage ("start image.jpg")
  logoimg = loadImage ("logo.png")
  village = loadImage ("bg.png")
  boulder=loadImage ("boulder.png")
  wood = loadImage ("wood.png")
  coinimg = loadImage ("coin.png")
  ko = loadImage ("gameover.png")
  grassImg = loadImage ("grass.jpg")
  moonstoneImg = loadImage ("moonstone.png")
  stone1Img = loadImage ("bluecrystal.png")
  stone2Img=loadImage ("greencrystal.png")
  winnerImg=loadImage ("winner.png")
}

function setup() {

  createCanvas(windowWidth,windowHeight)

  gamestate = "start"

  bg2=createSprite (width/2,height/2)
  bg2.addImage (village)
  bg2.scale = 1.3


  boy = createSprite(100,height-150)
  boy.addAnimation("boyrunning",boyAnimation)
  boy.addAnimation ("boyStanding",boyStanding)
  boy.scale=0.2

  logo = createSprite (width/2,100)
  logo.addImage (logoimg)

  ground = createSprite (width/2,height-70,width,20)
  ground.visible = false
  
  gameover = createSprite (width/2,height/2)
  gameover.addImage (ko)

  moonstone=createSprite (350,250)
  moonstone.addImage(moonstoneImg)
  moonstone.scale = 0.1

  stone1=createSprite (650,650)
  stone1.addImage (stone1Img)
  stone1.scale = 0.1

  stone2=createSprite (1350,350)
  stone2.addImage (stone2Img)
  stone2.scale = 0.15

  winner = createSprite (width/2,height/2)
  winner.addImage (winnerImg)

  edges = createEdgeSprites ()


  coinsGroup=createGroup ()
  obstaclesGroup = createGroup ()
  grassGroup = createGroup ()

  score = 0
  level1 = "play"
  createGrass()
}

function draw() {
  background(0)
  text (mouseX+","+mouseY,mouseX,mouseY)
  drawSprites ()

  if (gamestate == "start") {
    background (bg)
    
    boy.visible=false
    logo.visible = true
    bg2.visible  = false 
    gameover.visible = false
    winner.visible = false

    textAlign (CENTER)
    textSize (40)
    fill ("black")
    text ("Collect 25 coins to finish level one.",width/2,height/2-100)
    text ("Use space key to jump.",width/2,height/2-50)
    text ("Press `enter` to start on your journey",width/2,height/2)
    textSize (80)
    stroke ("black")
    strokeWeight(5)
    text ("DRAGON HUNTER",width/2,100)

    if (keyDown ("enter")) {
      gamestate = "level1"
    }

  }
  if (gamestate == "level1") {
    background (0)

    drawSprites ()
    textAlign (CENTER)
    textSize (20)
    fill ("white")
    text ("Score:"+score, 50,50)

    boy.visible = true
    gameover.visible = false
    logo.visible=false
    bg2.visible = true
    winner.visible = false
    bg2.velocityX = -7
    
    if (bg2.x<0) {
      bg2.x = bg2.width/2
    }

    boy.collide (ground)
    if (keyDown ("space")&&boy.y>height-200) {
      boy.velocityY = -30
    }
    boy.velocityY +=1.5
    createCoins ()
    createObstacles ()
    
    for (var i=0;i<coinsGroup.length;i++){
      if (boy.isTouching(coinsGroup[i])){
        score +=1
        coinsGroup[i].destroy()
      }
    }
    if (obstaclesGroup.isTouching(boy)) {
      obstaclesGroup.setVelocityXEach(0)
      coinsGroup.setVelocityXEach(0)
      boy.velocityY = 0
      bg2.velocityX=0
      boy.changeAnimation ("boyStanding")
      obstaclesGroup.setLifetimeEach(-1)
      coinsGroup.setLifetimeEach (-1)
      gamestate = "gameOver"
    }
    //change score to test level
    if (score===25) {
      boy.velocityY = 0
      obstaclesGroup.destroyEach ()
      coinsGroup.destroyEach ()
      gamestate = "level2intro"
    }
  }
  if (gamestate == "level2intro") {
    background (bg)
    boy.visible=false
    logo.visible = true
    bg2.visible  = false 
    gameover.visible = false
    winner.visible = false

    textAlign (CENTER)
    textSize (40)
    fill ("black")
    text ("Collect the moonstone to finish level two.",width/2,height/2-100)
    text ("Use arrow keys to move.",width/2,height/2-50)
    text ("Press `enter` to start level two",width/2,height/2)
    textSize (80)
    stroke ("black")
    strokeWeight(5)
    text ("DRAGON HUNTER",width/2,100)

    if (keyDown ("enter")) {
      gamestate = "level2"
    }
  }
  if (gamestate === "level2") {
    background ("#a06d3d")
    drawSprites ()
    boy.visible=true
    logo.visible = false
    bg2.visible  = false 
    gameover.visible = false
    winner.visible = false
    boy.changeAnimation ("boyStanding")
    
    boy.bounceOff (edges)
    if (boy.isTouching (stone1)||boy.isTouching(stone2)) {
      gamestate = "gameOver"
    }

    if (boy.isTouching (moonstone)) {
      gamestate ="winner"
    }
   
    boy.scale = 0.13
    for (var i = 0;i<grassGroup.length;i++) {
      if (grassGroup [i].isTouching(boy)) {
        grassGroup[i].destroy ()
      }
    }
    if (keyDown("right")) {
      boy.x+=5
      boy.changeAnimation ("boyrunning")
    }
    if (keyDown("left")) {
      boy.x-=5
      boy.changeAnimation ("boyrunning")
    }
    if (keyDown("up")) {
      boy.y-=5
      boy.changeAnimation ("boyrunning")
    }if (keyDown("down")) {
      boy.y+=5
      boy.changeAnimation ("boyrunning")
    }
  }
  if (gamestate =="gameOver") {
    boy.destroy ()
    gameover.visible = true
  }
  if (gamestate == "winner") {
    boy.destroy()
    winner.visible = true
  }
 
  
}
function createGrass () {
  for (var i=50;i<width;i+=100) {
    for (var j = 50;j<height;j+=100) {
      grass = createSprite (i,j,100,100)
      grass.addImage (grassImg)
      grass.scale = 0.09
      grassGroup.add(grass)
      boy.depth = grass.depth+1
      gameover.depth = grass.depth+1
      winner.depth = grass.depth+1
      bg2.depth = grass.depth+1
    }
 
  }
}

function createCoins () {
  if (frameCount%80 == 0  ) {
    coin = createSprite (width,random (height/2,height-200))
    coin.addImage(coinimg)
    coin.velocityX=-7
    coin.scale = 0.2
    coin.lifetime = 1000
    coinsGroup.add (coin)
  }
}

function createObstacles () {
  if  (frameCount%100==0) {
    o = createSprite (width,height-100)
    o.velocityX = -7
    r = Math.round (random(1,2))
    switch (r) {
      case 1 :o.addImage (boulder)
      o.scale = 0.3
      break 
      case 2:o.addImage (wood)
      o.scale = 0.2
      break
      default:break
    }
    o.scale = 0.3
    o.lifetime = 1000
    obstaclesGroup.add (o)
    o.debug = false
    o.setCollider ("circle",0,0,100)
  }
}