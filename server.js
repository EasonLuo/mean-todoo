var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var db_url = 'mongodb://localhost:27017/todos';

app.use(express.static(__dirname+'/public'));
app.use('/flat-ui',express.static(__dirname+'/node_modules/flat-ui'));
app.use('/font-awesome',express.static(__dirname+'/node_modules/font-awesome'));
app.use('/angular',express.static(__dirname+'/node_modules/angular'));
app.use('/angular-ui-router',express.static(__dirname+'/node_modules/angular-ui-router/release'));
app.use(bodyParser.json());

app.get('/todos', function(req, res){
	//var todos = [{'title':'A'},{'title':'B'},{'title':'C'}];
	MongoClient.connect(db_url, function(err, db){
		db.collection('todos').find({}).toArray(function(err, docs){
			if(err) throw err;
			res.json(docs);
			db.close();
		});
	});
});

app.post('/todos', function(req, res){
	//var todos = [{'title':'A'},{'title':'B'},{'title':'C'}];
	MongoClient.connect(db_url, function(err, db){
		db.collection('todos').insert(req.body, function(err, result){
			if(err) throw err;

			res.json(result.ops[0]);
			db.close();
		});
	});
});

app.post('/request/contact/validate', function(req, res){
	res.json(req.param);
});

app.delete('/todos/:id', function(req, res){
	var id = req.params.id;
	console.log(req.params);
	//var todos = [{'title':'A'},{'title':'B'},{'title':'C'}];
	MongoClient.connect(db_url, function(err, db){
		db.collection('todos').deleteOne({'_id':ObjectId(id)}, function(err, result){
			if(err) throw err;
			console.log(result);
			//res.json(true);
			db.close();
		});
	});
});

app.listen(8888);