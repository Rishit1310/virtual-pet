var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var lastFed,feed,feedtime;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  feed=createButton("Feed")
  feed.position(875,95)
  feed.mousePressed(feedDog)

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedtime=database.ref('feedTime')
  feedtime.on("value",(d)=>{
    lastFed=d.val()
  })
 
  //write code to display text lastFed time here
  if(lastFed>=12){
     text("last Fed"+lastFed%12+"PM",500,500)
  }
  else if(lastFed<12){
    text("last Fed"+lastFed+"AM",700,95)
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var FeedDog =foodObj.getFoodStock();
  if(FeedDog<=0){
    foodObj.updateFoodStock(FeedDog*0)
  }
else{
  foodObj.updateFoodStock(FeedDog-1)
}
database.ref('/').update({
  food:foodObj.getFoodStock(),
  feedTime:hour()

})


}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}
