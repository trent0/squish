let bgImage,
  bugImages = [],
  bug,
  allBugs,
  rotationAngles = [0, 90, 180, -90],
  topWall,
  bottomWall,
  leftWall,
  rightWall,
  alive,
  squished,
  score,
  gameTime,
  gameState,
  timerIsDone,
  playTime;

function preload() {
  bgImage = loadImage("images/background.jpg");

  for (let i = 0; i < 4; i++) {
    bugImages[i] = loadImage("images/BugSprite" + i + ".png");
  }
}

function setup() {
  createCanvas(800, 800);
  allBugs = new Group();
  score = 0;
  gameTime = 30;
  gameState = "start";
  timerIsDone = false;
  walls();
}

function draw() {
  background(bgImage);

  if (gameState == "start") {
    startScreen();
    if (mouseIsPressed) {
      moreBugs(20);
      playTime = millis();
      gameState = "play";
    }
  } else if (gameState == "play") {
    timer();
    push();
    textSize(15);
    text(`Time Remaining: ${gameTime} / 30`, 30, 50);
    text(`Bugs Squished: ${score}`, 30, 70);
    pop();
    
    allBugs.overlap(allBugs)
    
    allBugs.collides(topWall, teleBot);
    allBugs.collides(bottomWall, teleTop);
    allBugs.collides(leftWall, teleRight);
    allBugs.collides(rightWall, teleLeft);

    allBugs.forEach(function (e) {
      if (e.mouse.pressing()) {
       squish(e);
      }
    });

    if (timerIsDone == true) {
      allBugs.remove();
      gameState = "end";
    }
  } else if (gameState == "end") {
    endScreen();

    if (keyIsPressed) {
      if (keyCode == 13) {
        setup();
      }
    }
  }
}

function moreBugs(num) {
  for (let i = 0; i < num; i++) {
    // sprite template start
    bug = new Sprite(random(50, 750), random(50, 750), 50, 50);
    bug.isDead = false;
    alive = bug.addAni(
      "alive",
      bugImages[0],
      bugImages[1],
      bugImages[0],
      bugImages[2]
    );

    dead = bug.addAni("dead", bugImages[3]);

    bug.ani = "alive";
    bug.scale = 0.5;
    bug.overlap(allBugs);

    bug.rotation = floor(random(rotationAngles));

    switch (bug.rotation) {
      case 0:
        bug.move("up", 3, 80000);
        break;
      case 90:
        bug.move("right", 3, 80000);
        break;
      case 180:
        bug.move("down", 3, 80000);
        break;
      case -90:
        bug.move("left", 3, 80000);
        break;
      default:
        bug.rotation = 0;
        bug.move("up", 3, 80000);
        break;
    }
allBugs.add(bug);
    // sprite template end
  }
}

function startScreen() {
  push();
  fill("gray");
  stroke(0);
  strokeWeight(5);
  rect(width / 2 - 300, height / 2 - 100, 600, 200);

  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(25);
  text(
    `Click the bugs to WIN!\nYou Have 30 seconds!\nPress Anywhere to Begin`,
    width / 2,
    height / 2 - 30
  );
  pop();
}

function endScreen() {
  push();
  fill("gray");
  stroke(0);
  strokeWeight(5);
  rect(width / 2 - 300, height / 2 - 100, 600, 200);

  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(25);
  text(
    `TIME'S UP!\nYou score is: ${score} bugs!\nPress RETURN to play again!`,
    width / 2,
    height / 2 - 30
  );
  pop();
}

function timer() {
  gameTime = int((millis() - playTime) / 1000);
  if (gameTime > 30) {
    timerIsDone = true;
  }
  return gameTime;
}

function walls() {
  topWall = new Sprite(width / 2, -150, width, 30);
  bottomWall = new Sprite(width / 2, height + 150, width, 30);
  leftWall = new Sprite(-150, height / 2, 30, height);
  rightWall = new Sprite(width + 150, height / 2, 30, height);
  
  topWall.collider = "static";
  bottomWall.collider = "static";
  leftWall.collider = "static";
  rightWall.collider = "static";
}

function teleTop(item){
  item.y = -100;
  item.rotation = 180;
  item.move("down", 3, 80000);
}
function teleBot(item){
  item.y = height +100;
  item.rotation = 0;
  item.move("up", 3, 80000);
}
function teleLeft(item){
  item.x = -100;
  item.rotation = 0;
  item.move("right", 3, 80000);
}
function teleRight(item){
  item.x = height +100;
  item.rotation = -90;
  item.move("left", 3, 80000);
}
function squish(item) {
  if (item.isDead === false) {
    item.isDead = true;
    item.ani = "dead";
    item.vel.x = 0;
    item.vel.y = 0;
    item.life = 60;
    score++;
  }
  if (allBugs.size() < 1) {
    moreBugs(random(5, 50));
  }
}
