var trex, trex_running;
var edges;
var ground;
var clouds;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var cloudsGroup;
var obstaclesGroup;
var gameState = "play";
var trex_collide;
var gameOver;
var restart;
var G;
var R;
var Jump;
var Die;
var Checkpoint;

function preload() {
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  ground = loadImage("ground2.png")
  cloud = loadImage("cloud.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  trex_collide = loadAnimation("trex_collided.png")
  G = loadImage("gameOver.png")
  R = loadImage("restart.png")
  Jump = loadSound("jump.mp3")
  Die = loadSound("die.mp3")
  Checkpoint = loadSound("checkPoint.mp3")
}

function setup() {
  
  createCanvas(600,200); 
  trex = createSprite(50,160,10,30);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("colliding",trex_collide);
  trex.scale = 0.6;
  
  ground1 = createSprite(300,170,600,10);
  ground1.addImage(ground);
  
  ground2 = createSprite(300,185,600,10);
  ground2.visible = false
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(300,80);
  gameOver.addImage(G);
  
  restart = createSprite(300,120);
  restart.addImage(R);
  restart.scale = 0.6;
  
  //trex.debug = true
  trex.setCollider("circle",0,0,35)
  
  edges = createEdgeSprites();
  
}

function draw() {
  background("white");
  
  trex.collide(ground2);
  
  text("Score "+score,530,20)
  
  
  if (gameState === "play") {
    if(score%100 === 0 && score > 0) {
      Checkpoint.play();
    }
    if(keyDown("space") && trex.y > 151 || keyDown("up") && trex.y > 151) {
    trex.velocityY = -10;
      Jump.play();
    }
    trex.velocityY = trex.velocityY + 0.5;
    if(ground1.x < 0){
    ground1.x = ground1.width/2
  }
    ground1.velocityX = -6-score/100;
    
    score = score+Math.round(getFrameRate()/60)
  
    spawnClouds();
  
    Obstacles();
    
    gameOver.visible = false;
    restart.visible = false;
    
    if (obstaclesGroup.isTouching(trex)) {
      Die.play();
      gameState = "end";
    }
  }
  
  else if (gameState === "end") {
    ground1.velocityX = 0
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("colliding",trex_collide);
    gameOver.visible = true
    restart.visible = true
    if (mousePressedOver(restart)|| keyDown("space")) {
      Reset();
    }
    trex.velocityY = 0;
  }
  
  drawSprites();
}

function spawnClouds() {
  if(frameCount%70 === 0) {
  clouds = createSprite(600,50);
  clouds.velocityX = -6-score/100;
  clouds.addImage(cloud);
  clouds.y = Math.round(random(30,120));
  //console.log("trex"+trex.depth);
  //console.log("clouds"+clouds.depth)
  clouds.depth = trex.depth;
  trex.depth = trex.depth+1
  clouds.lifetime = 100
  cloudsGroup.add(clouds);
  }
}

function Obstacles() {
  if(frameCount%85 === 0) {
    obstacles = createSprite(600,160)
    obstacles.velocityX = -6-score/100;
    r = Math.round(random(1,6));
    switch(r) {
      case 1: obstacles.addImage(obstacle1)
      break
      case 2: obstacles.addImage(obstacle2)
      obstacles.scale = 0.9
      break
      case 3: obstacles.addImage(obstacle3)
      obstacles.scale = 0.9
      break
      case 4: obstacles.addImage(obstacle4)
      obstacles.scale = 0.6
      break
      case 5: obstacles.addImage(obstacle5)
      obstacles.scale = 0.6
      break
      case 6: obstacles.addImage(obstacle6)
      obstacles.scale = 0.6
      break
      default: break
    }
    obstacles.lifetime = 100
    obstaclesGroup.add(obstacles);
  }
}

  function Reset() {
    score = 0
    trex.changeAnimation("running",trex_running);
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    gameState = "play"
  }
