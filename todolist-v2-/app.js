//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema=new mongoose.Schema({
  name:String
});

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to your todolist!"
});

const item2=new Item({
  name:"Hit the + button to add a new item."
});

const item3=new Item({
  name:"<-- Hit this button to delete an item."
});

const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);



async function getItems(){
  const Items=await Item.find({});
  return Items;
}

app.get("/", function(req, res) {
  getItems().then(function(foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems).then (function(){
        console.log("Successfully saved");
      }).catch (function(err){
        console.log(err);
      });
      res.redirect("/");
    } else{
       res.render("list",{listTitle:"Today",newListItems:foundItems});
     }

  });
});



app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName;






  getItems().then(function(err,foundList){
      async function getItems(foundList){
      const Lists=await List.findOne({name:customListName});
    if(!err){
      if(!foundList){
        const list=new List({
          name:customListName,
          items:defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }
    } else{
          res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
        }
        return Lists;
      }
  });


});











app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item=new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");

});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId).then(function(err){

      console.log("Successfully deleted checked item.");
      res.redirect("/");
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Today", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
