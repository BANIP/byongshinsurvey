
const mongoose = require("mongoose");
const db = mongoose.connection;
db.on('error',console.error);
db.once('open',function(){
    console.log("connected to mongod server");
});

var Survey = require("./models/survey")
mongoose.connect("mongodb://localhost/survey");

Survey.find({id:"UCfEINqRuImepT9g9RWymwag"},function(err,result){
    console.log(result);

})