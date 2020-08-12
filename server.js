var port = 8000;
var express = require('express');
var app = express();
const fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // 

app.use(express.static('static-content', {
    extensions: ['html']
}));

MONGODB_URI = "mongodb+srv://yushey:248nGseVKR3SJY7u@cluster0.zoue0.mongodb.net/Box?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', ()=>{
    console.log("mongoose connected")
})

var Schema = mongoose.Schema;
    
const Box = new Schema({
    "id": "String",
    "password": "String",
    "structure": "String"
})

mongoose.models = {};

const BoxModel = mongoose.model('Box', Box);

function createNewBox(boxid, boxpass, schema){
    const data = {
        id : boxid,
        password : boxpass,
        structure : schema
    }
    
    const newBox = new BoxModel(data);
    newBox.save((error)=>{
        if (error){
            console.log("Error Saving Data for New Box: " + boxid + " " + boxpass)
        } else {
            console.log("Success Saving Data for New Box: " + boxid + " " + boxpass)
        }
    });
}

app.post('/api/createdatabase/', function(req, res) {
    var dbname = req.body.dbname;
    var password = req.body.password;
    var schema = req.body.schema;

    BoxModel.findOne({id: dbname}).then(user => {
        if (user) {
            return res.status(404).json({ status : "Database Name Exists" });
        } else {
            createNewBox(dbname, password, JSON.stringify(schema));

            const NewBox = new Schema(schema);
            const BoxModel = mongoose.model(dbname, NewBox);

            const newBox = new BoxModel();
            newBox.save((error)=>{
                if (error){
                    console.log("Error Saving Data for New Box: " + dbname + " " + password)
                } else {
                    console.log("Success Saving Data for New Box: " + dbname + " " + password)
                }
            });


            return res.status(200).json({ status : "Database Created" });
        }
    });
});


app.post('/api/checkdbname/', function(req, res) {
    var dbname = req.body.dbname;
    BoxModel.findOne({id: dbname}).then(user => {
        if (user) {
            return res.status(404).json({ status : "Database Name Exists" });
        } else {
            return res.status(200).json({ status : "OK" })
        }
    });
});

app.post('/api/drop/*', function(req, res) {
    var params = req.originalUrl.split("/");
    try {
        var dbname = params[3];
        var password = params[4];
        if ( (typeof (password) !== 'undefined' && password) && (typeof (dbname) !== 'undefined' && dbname) ){
            BoxModel.findOne({id: dbname}).then(content => {
                if (content) {
                    if (content.password === password){
                        mongoose.models[dbname].collection.drop();
                        console.log(mongoose.models);
                        delete mongoose.models[dbname];
                        console.log(mongoose.models);
                        //drop document
                        BoxModel.deleteMany({id: dbname}, function (err, _) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                        return res.status(200).json({ status : "OK" })
                    } else {
                        return res.status(400).json({ status : "Incorrect password" })
                    }
                } else {
                    return res.status(400).json({ status : "Could not drop table." })
                }
            });
        } else {
            return res.status(400).json({ status : "Something went wrong with getting database name or password." })
        }
        
    } catch (error) {
        return res.status(400).json({ status : "Something went wrong with getting database name or password." })
    }    
});

//use item variable.
app.post('/api/insert/*', function(req, res) {
    var params = req.originalUrl.split("/");

    try {
        var dbname = params[3];
        var password = params[4];
        var items = req.body.item;

        if ( (typeof (password) !== 'undefined' && password) && (typeof (dbname) !== 'undefined' && dbname) ){
            BoxModel.findOne({id: dbname}).then(content => {
                if (content) {
                    if (content.password === password){

                        var item = new mongoose.models[dbname](items);
                        item.save((error)=>{
                            if (error){
                                return res.status(400).json({ status : "Error Saving Data" })
                            } else {
                                return res.status(200).json({ status : "OK" })
                            }
                        });


                    } else {
                        return res.status(400).json({ status : "Incorrect Password" })
                    }
                } else {
                    return res.status(400).json({ status : "Could not find table" })
                }
            });

        } else {
            return res.status(400).json({ status : "Something went wrong with getting database name or password." })
        }
        
    } catch (error) {
        return res.status(400).json({ status : "Something went wrong." })
    }    
});


app.get('/db/*', function(req, res) {
    var url = req.originalUrl;
    if (url !== "/favicon.ico"){

        var dbname = url.slice(4, url.length)
        BoxModel.findOne({id: dbname}).then(content => {
            if (content) {
                mongoose.models[dbname].find({}).then(contents => {
                    var data = JSON.stringify(contents.slice(1, contents.length));

                    var html = "<pre>"+JSON.stringify(JSON.parse(data), undefined, 4)+"</pre>";
                    return res.status(200).send(html);
                    
                    
                    //return res.status(200).json(contents.slice(1, contents.length));
                });
            } else {
                return res.status(200).send("<script>window.location.href='/'</script>");
            }
        });
    }
});

app.get('/*', function(req, res) {
    var url = req.originalUrl;
    if (url !== "/favicon.ico"){
        return res.status(200).send("<script>window.location.href='/'</script>");
    }
});

app.listen(port, function() {
    console.log('Server has started listening on port ' + port);
});