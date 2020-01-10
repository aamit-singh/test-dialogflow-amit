var express = require("express.js");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var WebHooks = require('node-webhooks')
require('dotenv').config()


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase', {useNewUrlParser: true}).then(console.log("connected"));
var schema = mongoose.Schema;
var studentSchema = new schema({
	name : {type: String, required: true},
	email : {type : String, required: true, unique:true},
	contact : {type :Number, required: true},
	course : {type: String, required: true},
	country : {type: Array, required: true},
	dob : {type: String}
});
student = mongoose.model("student",studentSchema);


var webHooks = new WebHooks({
	db: './webHooksDB.json'
})

app.use("/",(req,res)=>{
	res.type('html').status(200)
	res.send("The server is running");
})


const port = process.env.PORT || 3000;
app.listen(port);






