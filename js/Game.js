class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      image(bg,0,0,displayWidth,displayHeight)
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car2 = createSprite(300,200);
    car3 = createSprite(500,200);
    car4 = createSprite(700,200);
    cars = [car1, car2, car3, car4];
    car1.addImage("car1",c1);
    car2.addImage("car2",c2);
    car3.addImage("car3",c3);
    car4.addImage("car4",c4);
    past=false;
  }

  play(){
    form.hide();

    Player.getPlayerInfo();
    player.getFinishedPlayers();
    if(allPlayers !== undefined){
      //var display_position = 100;
      background("#8F7D6F");
      image (track,0,-displayHeight*4,displayWidth,displayHeight*5);

      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 180;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        if (index === player.index){
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
          fill("yellow");
          ellipse(x,y,60,60);
        }
       
        textSize(15);
        textAlign(CENTER);
        text(allPlayers[plr].name,cars[index-1].x,cars[index-1].y+75)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null && past ===false){
      player.distance +=10
      player.update();
    }
     if(player.distance>3410 && past===false){
       Player.updateFinishedPlayers();
       player.rank=finishedPlayers
       player.update();
       past=true
     }
    drawSprites();
  }
  end(){
  camera.position.x=0;
  camera.position.y=0;
  imageMode(CENTER);
  Player.getPlayerInfo();
  image(gold,0,-200,250,300);
  image(silver,-400,0,250,300);
  image(bronze,400,0,250,300);
  textAlign(CENTER)
  textSize(50);
  fill("blue");
  for (var i in allPlayers){
    if (allPlayers[i].rank ===1){
      text("1st: "+allPlayers [i].name,0,-50)
    }
    else if(allPlayers[i].rank===2){
      text("2nd: "+allPlayers[i].name,-400,150)
    }
    else if(allPlayers[i].rank===3){
      text("3rd: "+allPlayers[i].name,+400,150)
    }
    else {
      text("hounerable Mention: "+allPlayers[i].name,0,300)
    }

  }
  }
}
