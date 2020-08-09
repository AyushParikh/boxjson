var port = 8000;
var express = require('express');
var app = express();
const fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

MONGODB_URI = "mongodb+srv://yushey:248nGseVKR3SJY7u@cluster0.zoue0.mongodb.net/<dbname>?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', ()=>{
    console.log("mongoose connected")
    mongoose.createConnection("testcollection")
})



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // 

app.use(express.static('static-content', {
    extensions: ['html']
}));

function createCollection(colname, colpassword){

}

app.listen(port, function() {
    console.log('Server has started listening on port ' + port);
});