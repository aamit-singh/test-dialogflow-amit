var express = require("express");
var app = express();

const { WebhookClient } = require('dialogflow-fulfillment');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
require('dotenv').config()


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://amit-singh:Amitsingh1%40@cluster0-euwxx.gcp.mongodb.net/test?retryWrites=true&w=majority',
		 {useNewUrlParser: true}).then(console.log('connected')).catch((err)=>{console.log(err)});
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

async function doit(agent){
		var name = agent.parameters['name']
		var emailq = agent.parameters['email']
		console.log("retrieved email",name,emailq)
		if(emailq && name ){
			console.log("entered query mongodb")
			await student.findOne({email : emailq}, (err, result) =>{
				console.log('hello')
				agent.add("The results are : /n Name : "+ agent.parameters['name'] + "/n email: "+ result.email)
				
				var mess = ""
				if(result && result.contact){
					mess = mess + "/n contact : " + result.contact;
				}
				if(result && result.course){
					mess = mess+ "/n course : "+ result.course;
				}
				agent.add(mess)
		
			})
			console.log("exitting query")
		}
		else{
			return;
		}
	}

var intentMap = new Map();
intentMap.set('query', doit);

app.use("/getInfo",(req,res)=>{
	console.log(req.body);
	const agent = new WebhookClient({request: req, response: res});
	console.log("going well till agent creation")
	agent.handleRequest(intentMap)
})


app.use("/",(req,res)=>{
	res.type('html').status(200)
	res.send("The server is running");
})


const port = process.env.PORT || 3000;
app.listen(port);






