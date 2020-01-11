var express = require("express");
var app = express();

const { WebhookClient } = require('dialogflow-fulfillment');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
require('dotenv').config()


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://amit-singh:Amitsingh1%40@cluster0-euwxx.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
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


app.post("/getInfo",(req,res)=>{
	const agent = new WebhookClient({request: request, response: response});
	
	var name = agent.parameters['name']
	var emailq = agent.parameters['email']
	
	student.findOne({email : emailq}, (err,result) =>{
		agent.add("Name : "+ result.name)
		agent.add("email : " + result.email )
		if(result.contact){
			agent.add("contact : " + result.contact)
		}
		if(result.course){
			agent.end("course : "+ result.course )
		}
	})
	
})




app.use("/",(req,res)=>{
	res.type('html').status(200)
	res.send("The server is running");
})


const port = process.env.PORT || 3000;
app.listen(port);






